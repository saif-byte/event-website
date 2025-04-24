const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();
const { check, validationResult } = require("express-validator");
const Event = require("../models/Event");
const {
  protect,
  optionalProtect,
  adminProtect,
} = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Configure Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY; // Store API

// @route   GET /api/events
// @desc    Get all events (public), if authenticated, include `isAlreadyRegistered`
// @access  Public (with optional authentication)
router.get("/", optionalProtect, async (req, res) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      search = "",
      eventStatus = "UPCOMING",
    } = req.query;
    const skip = (page - 1) * pageSize;
    const now = new Date();
    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};
    // Adjust the filter based on eventStatus
    let dateFilter;
    if (eventStatus === "UPCOMING") {
      dateFilter = { startDate: { $gte: now } }; // Future events only
    } else if (eventStatus === "PAST") {
      dateFilter = { startDate: { $lt: now } }; // Past events only
    } else {
      return res.status(400).json({
        message: "Invalid eventStatus parameter. Use 'PAST' or 'UPCOMING'.",
      });
    }
    const events = await Event.find({
      ...searchFilter,
      ...dateFilter, // Add the date filter based on eventStatus
    })
      .skip(skip)
      .limit(Number(pageSize))
      .sort({ startDate: 1 });

    const totalRecords = await Event.countDocuments({
      ...searchFilter,
      ...dateFilter, // Add the date filter based on eventStatus
    });

    if (req.user) {
      const userId = req.user.id;
      const userGender = req.user.gender;

      // Attach `isAlreadyRegistered` and `paymentPending` for each event
      events.forEach((event) => {
        const registeredUser = event.registeredUsers.find(
          (user) => user.userId.toString() === userId
        );

        if (registeredUser) {
          event._doc.isAlreadyRegistered = true;
          event._doc.paymentPending = registeredUser.paymentPending;
        } else {
          event._doc.isAlreadyRegistered = false;
          event._doc.paymentPending = null; // or false if you prefer
        }
        // Count how many seats are already taken for the user's gender
        const registeredCount = event.registeredUsers.filter((user) => {
          if (userGender === "OTHER") {
            return user.gender === "MALE" || user.gender === "OTHER";
          } else {
            return user.gender === userGender;
          }
        }).length;

        let totalSeatsForGender = 0;
        if (userGender === "MALE" || userGender === "OTHER")
          totalSeatsForGender = event.maleSeats;
        else if (userGender === "FEMALE")
          totalSeatsForGender = event.femaleSeats;
        event._doc.remainingSeatsForUserGender = Math.max(
          totalSeatsForGender - registeredCount,
          0
        );
        event._doc.totalSeatsForGender = totalSeatsForGender;
        // Optionally: remove registeredUsers from response
        delete event._doc.registeredUsers;
      });
    } else {
      // If user not authenticated, remove registeredUsers for public response
      events.forEach((event) => {
        delete event._doc.registeredUsers;
      });
    }

    res.status(200).json({
      events,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize),
      currentPage: Number(page),
      pageSize: Number(pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;

// @route   POST /api/events
// @desc    Create a new event (Admin Only)
// @access  Private (Admin)
router.post(
  "/",
  [
    protect,
    adminProtect,
    [
      check("name", "Event name is required").not().isEmpty(),
      check("description", "Description is required").not().isEmpty(),
      check("startDate", "Start date is required").isISO8601(),
      check("endDate", "End date is required").isISO8601(),
      check("location", "Location is required").not().isEmpty(),
      check("rsvpStartDate", "RSVP start date is required").isISO8601(),
      check("maleSeats", "Number of male seats is required").isInt({ min: 0 }),
      check("femaleSeats", "Number of female seats is required").isInt({
        min: 0,
      }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const {
      name,
      description,
      startDate,
      endDate,
      rsvpStartDate,
      location,
      maleSeats,
      femaleSeats,
      price,
    } = req.body;

    const event = new Event({
      name,
      description,
      startDate,
      endDate,
      rsvpStartDate,
      rsvpEndDate: startDate, // auto-assign RSVP end date to event start date
      location,
      maleSeats,
      femaleSeats,
      price,
      createdBy: req.user.id,
    });

    try {
      const event = new Event({
        name,
        description,
        startDate,
        endDate,
        rsvpStartDate,
        rsvpEndDate: startDate, // auto-assign RSVP end date to event start date
        location,
        maleSeats,
        femaleSeats,
        price,
        createdBy: req.user.id,
      });
      await event.save();
      res.status(201).json({ message: "Event created successfully", event });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
);
// @route   POST /api/events/:eventId/register
// @desc    Register a user for an event (Users Only)
// @access  Private
router.post("/:eventId/register", protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user; // User details from middleware

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const currentDate = new Date();

    // RSVP period validation
    if (event.rsvpStartDate && currentDate < new Date(event.rsvpStartDate)) {
      return res
        .status(400)
        .json({ message: "Registration has not started yet." });
    }

    if (event.rsvpEndDate && currentDate > new Date(event.rsvpEndDate)) {
      return res
        .status(400)
        .json({ message: "RSVP period has ended. Registration closed." });
    }

    // Check if the event has already ended
    if (new Date(event.endDate) < currentDate) {
      return res.status(400).json({
        message: "Event registration closed. The event has already ended.",
      });
    }

    // Check if user is already registered
    const alreadyRegistered = event.registeredUsers.some(
      (u) => u.userId.toString() === user.id
    );
    if (alreadyRegistered)
      return res
        .status(400)
        .json({ message: "User already registered for this event" });

    // Check seat availability based on gender
    const maleCount = event.registeredUsers.filter(
      (u) => u.gender === "MALE" || u.gender === "OTHER"
    ).length;
    const femaleCount = event.registeredUsers.filter(
      (u) => u.gender === "FEMALE"
    ).length;

    if (
      (user.gender === "MALE" || user.gender === "OTHER") &&
      maleCount >= event.maleSeats
    ) {
      return res.status(400).json({ message: "No more seats available" });
    }
    if (user.gender === "FEMALE" && femaleCount >= event.femaleSeats) {
      return res.status(400).json({ message: "No more seats available" });
    }

    // Register the user
    event.registeredUsers.push({
      userId: user.id,
      gender: user.gender,
      paymentPending: event.price > 0 ? true : false,
    });
    await event.save();

    // Send confirmation email
    await sendRegistrationEmail(user, event);

    res.status(200).json({
      message:
        event.price > 0
          ? "Your registration will be confirmed after the payment"
          : "Successfully registered for the event",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// @route   DELETE /api/events/:eventId/unregister
// @desc    Unregister a user from an event
// @access  Private
router.delete("/:eventId/unregister", protect, async (req, res) => {
  try {
    const { eventId } = req.params;
    const user = req.user; // Authenticated user

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if user is registered
    const isRegistered = event.registeredUsers.some(
      (u) => u.userId.toString() === user.id
    );
    if (!isRegistered)
      return res
        .status(400)
        .json({ message: "You are not registered for this event" });

    // Remove user from registeredUsers array
    event.registeredUsers = event.registeredUsers.filter(
      (u) => u.userId.toString() !== user.id
    );
    await event.save();

    res
      .status(200)
      .json({ message: "Successfully unregistered for the event", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// @route   GET /api/events/:eventId/registered-users
// @desc    Get list of users registered for an event (Admin Only)
// @access  Private (Admin)
router.get(
  "/:eventId/registered-users",
  protect,
  adminProtect,
  async (req, res) => {
    try {
      const { eventId } = req.params;

      // Find the event
      const event = await Event.findById(eventId).populate(
        "registeredUsers.userId",
        "-password" // Exclude password field
      );

      if (!event) return res.status(404).json({ message: "Event not found" });

      res.status(200).json({ registeredUsers: event.registeredUsers });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// @route   DELETE /api/events/:eventId
// @desc    Delete an event (Admin Only)
// @access  Private (Admin)
router.delete("/:eventId", protect, adminProtect, async (req, res) => {
  try {
    const { eventId } = req.params;

    // Validate event ID format
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete the event
    await Event.findByIdAndDelete(eventId);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// @route   PUT /api/events/:eventId
// @desc    Update an event (Admin Only)
// @access  Private (Admin)
router.put(
  "/:eventId",
  [
    protect, // Protect the route for authentication
    adminProtect, // Ensure the user is an admin
    [
      check("name", "Event name is required").optional().not().isEmpty(),
      check("description", "Description is required")
        .optional()
        .not()
        .isEmpty(),
      check("startDate", "Start date is required").optional().isISO8601(),
      check("endDate", "End date is required").optional().isISO8601(),
      check("location", "Location is required").optional().not().isEmpty(),
      check("maleSeats", "Number of male seats is required")
        .optional()
        .isInt({ min: 0 }),
      check("femaleSeats", "Number of female seats is required")
        .optional()
        .isInt({ min: 0 }),
      check("price", "Price is required").optional().isFloat({ min: 0 }),
    ],
  ],
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const {
        name,
        description,
        startDate,
        endDate,
        location,
        maleSeats,
        femaleSeats,
        price,
      } = req.body;

      // Find the event by ID
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });

      // Update event fields (only updating allowed fields)
      event.name = name || event.name;
      event.description = description || event.description;
      event.startDate = startDate || event.startDate;
      event.endDate = endDate || event.endDate;
      event.location = location || event.location;
      event.maleSeats = maleSeats || event.maleSeats;
      event.femaleSeats = femaleSeats || event.femaleSeats;
      event.price = price || event.price;

      // Save the updated event
      await event.save();

      // Return the updated event details
      res.status(200).json({ message: "Event updated successfully", event });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Server error", error });
    }
  }
);
// @route   POST /api/events/mark-payment
// @desc    Mark paymentPending as false for a registered user
// @access  Private/Admin (add auth middleware if needed)

router.post("/mark-payment", protect, adminProtect, async (req, res) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ message: "eventId and userId are required" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the index of the registered user
    const userIndex = event.registeredUsers.findIndex(
      (u) => u.userId.toString() === userId
    );

    if (userIndex === -1) {
      return res
        .status(404)
        .json({ message: "User not registered for this event" });
    }

    // Check if paymentPending is true and update it
    if (event.registeredUsers[userIndex].paymentPending) {
      event.registeredUsers[userIndex].paymentPending = false;
      await event.save();
      return res.status(200).json({ message: "Payment marked as complete." });
    } else {
      return res
        .status(200)
        .json({ message: "Payment was already completed." });
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ message: "Server error", error });
  }
});
// Helper function to send registration confirmation email
const sendRegistrationEmail = async (user, event) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = {
      to: [{ email: user.email, name: user.name }],
      sender: { email: process.env.SENDER_EMAIL, name: "Event Team" },
      subject: `Successfully Registered for ${event.name}`,
      htmlContent: `
       <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Registration Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <h1 style="color: #333;">Registration Successful!</h1>
    <p style="font-size: 16px; color: #555;">Dear ${user.name},</p>
    <p style="font-size: 16px; color: #555;">Congratulations! You have successfully registered for the event <strong>${
      event.name
    }</strong>.</p>
    <p style="font-size: 16px; color: #555;">The event will take place on <strong>${new Date(
      event.startDate
    ).toLocaleDateString()}</strong> at <strong>${event.location}</strong>.</p>
    <p style="font-size: 16px; color: #555;">We are excited to see you there!</p>
    <p style="font-size: 16px; color: #555;">Best regards, <br/> The Event Team</p>
    <div style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
      <p>&copy; 2025 Event Website. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Registration email sent via Brevo!");
  } catch (error) {
    console.error("Error sending email with Brevo:", error);
  }
};

module.exports = router;

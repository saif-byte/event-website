const express = require("express");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();
const { check, validationResult } = require("express-validator");
const Event = require("../models/Event");
const { protect, optionalProtect, adminProtect } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');


// @route   GET /api/events
// @desc    Get all events (public), if authenticated, include `isAlreadyRegistered`
// @access  Public (with optional authentication)
router.get("/", optionalProtect, async (req, res) => {
  try {
    // Get query parameters for pagination, search, and page size
    const { page = 1, pageSize = 10, search = "" } = req.query;

    // Calculate skip (offset) for pagination
    const skip = (page - 1) * pageSize;

    // Define the search filter (event name search)
    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } } // case-insensitive search
      : {};

    // Fetch events with pagination and search filter
    const events = await Event.find(searchFilter)
      .select("-registeredUsers") // Exclude registeredUsers from the result
      .skip(skip) // Skip the records for pagination
      .limit(Number(pageSize)) // Limit to pageSize
      .sort({ createdAt: -1 }); // Optional: Sort by created date, you can adjust as needed

    // Get the total count of events (for pagination)
    const totalRecords = await Event.countDocuments(searchFilter);

    // If user is authenticated, check if they are registered for each event
    if (req.user) {
      const userId = req.user.id;
      // Get all events' registrations to check if the user is registered
      const eventRegistrations = await Event.find({}, "registeredUsers");

      // Create a Set of event IDs where the user is registered
      const registeredEventIds = new Set(
        eventRegistrations
          .filter((event) =>
            event.registeredUsers.some(
              (user) => user.userId.toString() === userId
            )
          )
          .map((event) => event._id.toString())
      );
      // Add isAlreadyRegistered to each event
      events.forEach((event) => {
        event.isAlreadyRegistered = registeredEventIds.has(event._id.toString());
      });
    }

    // Return the paginated events and the total record count
    res.status(200).json({
      events,
      totalRecords,
      totalPages: Math.ceil(totalRecords / pageSize), // Calculate total pages
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
      check("maleSeats", "Number of male seats is required").isInt({ min: 0 }),
      check("femaleSeats", "Number of female seats is required").isInt({ min: 0 }),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, description, startDate, endDate, location, maleSeats, femaleSeats , price } = req.body;

    try {
      const event = new Event({
        name,
        description,
        startDate,
        endDate,
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
    const user = req.user; // User details from the middleware

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if the event has already ended
    const currentDate = new Date();
    if (new Date(event.endDate) < currentDate) {
      return res.status(400).json({ message: "Event registration closed. The event has already ended." });
    }

    // Check if user is already registered
    const alreadyRegistered = event.registeredUsers.some((u) => u.userId.toString() === user.id);
    if (alreadyRegistered) return res.status(400).json({ message: "User already registered for this event" });

    // Check seat availability based on gender
    const maleCount = event.registeredUsers.filter((u) => u.gender === "MALE").length;
    const femaleCount = event.registeredUsers.filter((u) => u.gender === "FEMALE").length;

    if (user.gender === "MALE" && maleCount >= event.maleSeats) {
      return res.status(400).json({ message: "No more MALE seats available" });
    }
    if (user.gender === "FEMALE" && femaleCount >= event.femaleSeats) {
      return res.status(400).json({ message: "No more FEMALE seats available" });
    }

    // Register the user
    event.registeredUsers.push({ userId: user.id, gender: user.gender });
    await event.save();

    // Send confirmation email
    await sendRegistrationEmail(user, event);

    res.status(200).json({ message: "Successfully registered for the event", event });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Helper function to send registration confirmation email
const sendRegistrationEmail = async (user, event) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
      auth: {
        user: process.env.EMAIL_USER,  // Use environment variable for email
        pass: process.env.EMAIL_PASS,  // Use environment variable for email password or App Password
      },
    });

    // HTML content for the email
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Registration Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
          }
          p {
            font-size: 16px;
            color: #555;
          }
          .btn {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            text-decoration: none;
            text-align: center;
            display: inline-block;
          }
          .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Registration Successful!</h1>
          <p>Dear ${user.name},</p>
          <p>Congratulations! You have successfully registered for the event <strong>${event.name}</strong>.</p>
          <p>The event will take place on <strong>${new Date(event.startDate).toLocaleDateString()}</strong> at <strong>${event.location}</strong>.</p>
          <p>We are excited to see you there!</p>
          <p>Best regards, <br/> The Event Team</p>
          <div class="footer">
            <p>&copy; 2025 Event Website. All Rights Reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Your email (use environment variable)
      to: user.email, // User's email
      subject: `Successfully Registered for ${event.name}`,
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Registration email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


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
      const isRegistered = event.registeredUsers.some((u) => u.userId.toString() === user.id);
      if (!isRegistered) return res.status(400).json({ message: "You are not registered for this event" });
  
      // Remove user from registeredUsers array
      event.registeredUsers = event.registeredUsers.filter((u) => u.userId.toString() !== user.id);
      await event.save();
  
      res.status(200).json({ message: "Successfully unregistered for the event", event });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  });

  // @route   GET /api/events/:eventId/registered-users
// @desc    Get list of users registered for an event (Admin Only)
// @access  Private (Admin)
router.get("/:eventId/registered-users", protect, adminProtect, async (req, res) => {
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
  });

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
    protect,          // Protect the route for authentication
    adminProtect,     // Ensure the user is an admin
    [
      check("name", "Event name is required").optional().not().isEmpty(),
      check("description", "Description is required").optional().not().isEmpty(),
      check("startDate", "Start date is required").optional().isISO8601(),
      check("endDate", "End date is required").optional().isISO8601(),
      check("location", "Location is required").optional().not().isEmpty(),
      check("maleSeats", "Number of male seats is required").optional().isInt({ min: 0 }),
      check("femaleSeats", "Number of female seats is required").optional().isInt({ min: 0 }),
      check("price", "Price is required").optional().isFloat({ min: 0 }),
    ],
  ],
  async (req, res) => {
    try {
      const { eventId } = req.params;
      const { name, description, startDate, endDate, location, maleSeats, femaleSeats, price } = req.body;

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

module.exports = router;

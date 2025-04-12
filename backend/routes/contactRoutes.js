const express = require("express");
const { check, validationResult } = require("express-validator");
const Contact = require("../models/Contact");

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit a contact form
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty().trim(),
    check("lastName", "Last name is required").not().isEmpty().trim(),
    check("phoneNo", "Please enter a valid phone number")
      .not().isEmpty()
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/),
    check("email", "Please include a valid email").isEmail().normalizeEmail(),
    check("message", "Message is required").not().isEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, lastName, phoneNo, email, message } = req.body;

    try {
      const newContact = new Contact({
        name,
        lastName,
        phoneNo,
        email,
        message,
        createdAt: new Date()
      });

      const contact = await newContact.save();

      res.status(201).json({ 
        success: true, 
        message: "Your message has been submitted successfully",
        data: contact 
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

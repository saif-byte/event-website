// models/Contact.js
const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phoneNo: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isSeen: { type: Boolean, default: false }, // New field for admin tracking

});

module.exports = mongoose.model("Contact", ContactSchema);

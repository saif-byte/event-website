const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    instagramHandle: { type: String },
    gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
    role: { type: String, enum: ["USER", "ADMIN", "MODERATOR"], default: "USER" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

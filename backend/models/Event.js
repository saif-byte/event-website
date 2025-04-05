const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    maleSeats: { type: Number, required: true },
    femaleSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    isAlreadyRegistered : {type : Boolean},
    registeredUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        gender: { type: String, enum: ["MALE", "FEMALE", "OTHER"], required: true },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);

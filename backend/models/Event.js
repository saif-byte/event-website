const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rsvpStartDate: { type: Date, required: true },
    rsvpEndDate: { type: Date, required: true },
    location: { type: String, required: true },
    seatType: {
      type: String,
      enum: ["TOTAL", "GENDER_BASED"],
      default: "TOTAL",
      required: true,
    },
    totalSeats: { type: Number }, // Only used if seatType is "TOTAL"
    maleSeats: { type: Number },  // Only used if seatType is "GENDER_BASED"
    femaleSeats: { type: Number },// Only used if seatType is "GENDER_BASED"
    price: { type: Number, required: true },
    isAlreadyRegistered: { type: Boolean },
    registeredUsers: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        gender: {
          type: String,
          enum: ["MALE", "FEMALE", "OTHER"],
          required: true,
        },
        paymentPending: { type: Boolean, default: false },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Custom validation to enforce seat fields based on seatType
eventSchema.pre("validate", function (next) {
  if (this.seatType === "TOTAL") {
    if (typeof this.totalSeats !== "number" || this.totalSeats < 1) {
      return next(new Error("totalSeats is required and must be a positive number when seatType is TOTAL"));
    }
    this.maleSeats = undefined;
    this.femaleSeats = undefined;
  } else if (this.seatType === "GENDER_BASED") {
    if (
      typeof this.maleSeats !== "number" ||
      this.maleSeats < 0 ||
      typeof this.femaleSeats !== "number" ||
      this.femaleSeats < 0
    ) {
      return next(new Error("maleSeats and femaleSeats are required and must be non-negative numbers when seatType is GENDER_BASED"));
    }
    this.totalSeats = undefined;
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);

require('dotenv').config();

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI ;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

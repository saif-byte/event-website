const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017" ;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

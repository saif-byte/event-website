const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const contactRoutes = require("./routes/contactRoutes");
require('dotenv').config();


// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1); // Stop the server if MongoDB URI is missing
}


const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/events", eventRoutes);
app.use('/api/contact', contactRoutes); // Contact form routes


// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

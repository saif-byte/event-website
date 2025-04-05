const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    token = token.split(" ")[1]; // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found, authorization denied" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// Middleware to allow optional authentication
const optionalProtect = async (req, res, next) => {
  let token = req.header("Authorization");

  if (token && token.startsWith("Bearer ")) {
    try {
      token = token.split(" ")[1]; // Remove 'Bearer ' prefix
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Token invalid but still allow access as a guest
      req.user = null;
    }
  }

  next(); // Continue with or without user
};

// Middleware to check if user is an Admin
const adminProtect = async (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { protect, optionalProtect, adminProtect };

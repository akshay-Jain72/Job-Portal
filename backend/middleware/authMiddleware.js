
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    // JWT Secret check
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables");

      return res.status(500).json({
        message: "Server configuration error.",
      });
    }

    // Authorization header check
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Login required.",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token payload check
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload.",
      });
    }

    // Find current user in database
    const user = await User.findById(decoded.id).select("-password");

    // User deleted check
    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    // Blocked user check
    if (user.status === "Blocked") {
      return res.status(403).json({
        message: "Your account has been blocked. Contact Admin.",
      });
    }

    // Attach verified user information
    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

module.exports = authMiddleware;

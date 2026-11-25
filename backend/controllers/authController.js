
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { notifyAdmins } = require("../services/notificationService");

// ================= REGISTER CONTROLLER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    // Required fields check
    if (
      !name ||
      !email ||
      !mobile ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Input type validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof mobile !== "string" ||
      typeof password !== "string" ||
      typeof role !== "string"
    ) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const trimmedName = name.trim();
    const trimmedMobile = mobile.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedMobile || !normalizedEmail) {
      return res.status(400).json({
        message: "Name, email and mobile cannot be empty",
      });
    }

    // Role validation
    if (!["Candidate", "Recruiter"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered. Please login.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: trimmedName,
      email: normalizedEmail,
      mobile: trimmedMobile,
      password: hashedPassword,
      role,
      status: "Active",
      recruiterStatus: role === "Recruiter" ? "Pending" : undefined,
    });

    // Notify Admins
    try {
      await notifyAdmins({
        title: "New User Registered",
        message: `${user.name} registered as ${user.role}.`,
        type: "info",
      });
    } catch (notificationError) {
      console.error(
        "Registration notification error:",
        notificationError.message
      );
    }

    return res.status(201).json({
      message: "Registration successful",
      role: user.role,
    });
  } catch (error) {
    console.error("Register error:", error);

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered. Please login.",
      });
    }

    return res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// ================= LOGIN CONTROLLER =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Required fields check
    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    // JWT configuration check
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    // Find user
    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Blocked account check
    if (user.status === "Blocked") {
      return res.status(403).json({
        message: "Your account has been blocked. Contact Admin.",
      });
    }

    // Recruiter rejected check
    if (
      user.role === "Recruiter" &&
      user.recruiterStatus === "Rejected"
    ) {
      return res.status(403).json({
        message: "Your recruiter account has been rejected.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    // Successful response
    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login",
    });
  }
};

// ================= EXPORT CONTROLLERS =================
module.exports = {
  registerUser,
  loginUser,
};

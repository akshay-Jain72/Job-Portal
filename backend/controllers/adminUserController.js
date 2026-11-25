
const mongoose = require("mongoose");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");
const Notification = require("../models/Notification");

// GET ALL USERS (Candidate + Recruiter)
const getAllAdminUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["Candidate", "Recruiter"] },
    })
      .select("-password -otp -otpExpiry")
      .sort({ createdAt: -1 });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Admin get users error:", error);

    return res.status(500).json({
      message: "Failed to fetch users.",
    });
  }
};

// BLOCK / UNBLOCK USER
const toggleAdminUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    if (!["Active", "Blocked"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Use Active or Blocked.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Admin ko block nahi kar sakte
    if (user.role === "Admin") {
      return res.status(403).json({
        message: "Admin cannot be blocked here.",
      });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({
      message: `User ${status} successfully.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Admin toggle user status error:", error);

    return res.status(500).json({
      message: "Failed to update user status.",
    });
  }
};

// DELETE USER
const deleteAdminUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: "Invalid user ID.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Admin ko delete nahi kar sakte
    if (user.role === "Admin") {
      return res.status(403).json({
        message: "Admin cannot be deleted here.",
      });
    }

    // If Recruiter, find all jobs posted by them
    let recruiterJobIds = [];

    if (user.role === "Recruiter") {
      const recruiterJobs = await Job.find({
        recruiter: userId,
      }).select("_id");

      recruiterJobIds = recruiterJobs.map((job) => job._id);
    }

    // Delete related applications
    await Application.deleteMany({
      $or: [
        { candidate: userId },
        { recruiter: userId },
        { job: { $in: recruiterJobIds } },
      ],
    });

    // Delete related saved jobs
    await SavedJob.deleteMany({
      $or: [
        { candidate: userId },
        { job: { $in: recruiterJobIds } },
      ],
    });

    // Delete recruiter jobs
    if (recruiterJobIds.length > 0) {
      await Job.deleteMany({
        recruiter: userId,
      });
    }

    // Delete user's notifications
    await Notification.deleteMany({
      recipient: userId,
    });

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      message: "User and related records deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete user error:", error);

    return res.status(500).json({
      message: "Failed to delete user.",
    });
  }
};

module.exports = {
  getAllAdminUsers,
  toggleAdminUserStatus,
  deleteAdminUser,
};

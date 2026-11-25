
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

const getAdminDashboard = async (req, res) => {
  try {
    const userFilter = {
      role: { $in: ["Candidate", "Recruiter"] },
    };

    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      totalApplications,
      activeJobs,
      pendingJobs,
      blockedUsers,
      recentUsers,
      recentJobs,
    ] = await Promise.all([
      User.countDocuments(userFilter),
      User.countDocuments({ role: "Candidate" }),
      User.countDocuments({ role: "Recruiter" }),
      Job.countDocuments(),
      Application.countDocuments(),
      Job.countDocuments({ status: "Active" }),
      Job.countDocuments({ status: "Pending" }),
      User.countDocuments({
        ...userFilter,
        status: "Blocked",
      }),

      User.find(userFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email role status createdAt"),

      Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("recruiter", "name email"),
    ]);

    return res.status(200).json({
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalApplications,
        activeJobs,
        pendingJobs,
        blockedUsers,
      },
      recentUsers,
      recentJobs,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);

    return res.status(500).json({
      message: "Failed to load admin dashboard",
    });
  }
};

module.exports = { getAdminDashboard };

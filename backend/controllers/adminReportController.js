
const Job = require("../models/Job");
const User = require("../models/User");
const Application = require("../models/Application");

// Admin Reports
const getAdminReports = async (req, res) => {
  try {
    const [
      totalJobs,
      totalApplicants,
      totalRecruiters,
      hiredCandidates,
      activeJobs,
      pendingJobs,
      rejectedJobs,
      closedJobs,
      applied,
      underReview,
      shortlisted,
      rejectedApplications,
      recentTopJobs,
    ] = await Promise.all([
      Job.countDocuments(),
      Application.countDocuments(),
      User.countDocuments({ role: "Recruiter" }),
      Application.countDocuments({ status: "Hired" }),

      Job.countDocuments({ status: "Active" }),
      Job.countDocuments({ status: "Pending" }),
      Job.countDocuments({ status: "Rejected" }),
      Job.countDocuments({ status: "Closed" }),

      Application.countDocuments({ status: "Applied" }),
      Application.countDocuments({ status: "Under Review" }),
      Application.countDocuments({ status: "Shortlisted" }),
      Application.countDocuments({ status: "Rejected" }),

      // Top 5 jobs by applicants
      Application.aggregate([
        {
          $group: {
            _id: "$job",
            applicants: { $sum: 1 },
          },
        },
        { $sort: { applicants: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "jobs",
            localField: "_id",
            foreignField: "_id",
            as: "job",
          },
        },
        { $unwind: "$job" },
        {
          $project: {
            _id: "$job._id",
            title: "$job.title",
            company: "$job.company",
            applicants: 1,
          },
        },
      ]),
    ]);

    // Monthly jobs for current year
    const year = new Date().getFullYear();

    const monthlyJobs = await Job.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          jobs: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill all 12 months
    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const found = monthlyJobs.find(
        (item) => item._id === index + 1
      );

      return {
        month: new Date(year, index, 1).toLocaleString("en", {
          month: "short",
        }),
        jobs: found ? found.jobs : 0,
      };
    });

    return res.status(200).json({
      stats: {
        totalJobs,
        totalApplicants,
        totalRecruiters,
        hiredCandidates,
        activeJobs,
        pendingJobs,
        rejectedJobs,
        closedJobs,
        applied,
        underReview,
        shortlisted,
        rejectedApplications,
      },
      monthlyData,
      topJobs: recentTopJobs,
    });
  } catch (error) {
    console.error("Admin Reports Error:", error);

    return res.status(500).json({
      message: "Failed to load admin reports",
    });
  }
};

module.exports = { getAdminReports };


const mongoose = require("mongoose");
const Job = require("../models/Job");
const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

// Get all jobs for Admin
const getAllAdminJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Admin get jobs error:", error);

    return res.status(500).json({
      message: "Failed to fetch jobs.",
    });
  }
};

// Admin update job status
const updateAdminJobStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const jobId = req.params.id;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const allowedStatuses = [
      "Active",
      "Pending",
      "Rejected",
      "Closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid job status.",
      });
    }

    const job = await Job.findByIdAndUpdate(
      jobId,
      { status },
      { new: true, runValidators: true }
    ).populate("recruiter", "name email");

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    return res.status(200).json({
      message: "Job status updated successfully.",
      job,
    });
  } catch (error) {
    console.error("Admin update job error:", error);

    return res.status(500).json({
      message: "Failed to update job status.",
    });
  }
};

// Admin delete job
const deleteAdminJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    // Delete related applications and saved jobs
    await Application.deleteMany({ job: jobId });
    await SavedJob.deleteMany({ job: jobId });

    // Delete job
    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({
      message: "Job and related records deleted successfully.",
    });
  } catch (error) {
    console.error("Admin delete job error:", error);

    return res.status(500).json({
      message: "Failed to delete job.",
    });
  }
};

module.exports = {
  getAllAdminJobs,
  updateAdminJobStatus,
  deleteAdminJob,
};

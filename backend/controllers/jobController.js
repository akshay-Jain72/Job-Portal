const Job = require("../models/Job");
const { notifyAdmins } = require("../services/notificationService");

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      category,
      jobType,
      workMode,
      location,
      salary,
      experience,
      skills,
      deadline,
      description,
      requirements,
    } = req.body;

    if (
      !title ||
      !company ||
      !category ||
      !jobType ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const job = await Job.create({
      title,
      company,
      category,
      jobType,
      workMode,
      location,
      salary,
      experience,
      skills: Array.isArray(skills)
        ? skills
        : skills
          ? skills.split(",").map((skill) => skill.trim())
          : [],
      deadline,
      description,
      requirements,
      recruiter: req.user.id,
    });

    // Automatic notification to Admins
    try {
      await notifyAdmins({
        title: "New Job Posted",
        message: `${job.title} at ${job.company} is waiting for approval.`,
        type: "job",
      });
    } catch (notificationError) {
      console.error(
        "Job notification error:",
        notificationError.message
      );
    }

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("Create job error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL ACTIVE JOBS
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Active" })
      .populate("recruiter", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE JOB
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "recruiter",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.status !== "Active" && req.user?.role !== "Admin") {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET RECRUITER'S JOBS
const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE JOB
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (
      req.user.role !== "Admin" &&
      job.recruiter.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
      });
    }

    const allowedFields = [
      "title",
      "company",
      "category",
      "jobType",
      "workMode",
      "location",
      "salary",
      "experience",
      "skills",
      "deadline",
      "description",
      "requirements",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    // Recruiter edits require fresh Admin approval
    if (req.user.role !== "Admin") {
      job.status = "Pending";
    }

    await job.save();

    res.status(200).json({
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE JOB
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (
      req.user.role !== "Admin" &&
      job.recruiter.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
};
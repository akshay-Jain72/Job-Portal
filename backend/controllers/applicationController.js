const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/user");
const Notification = require("../models/Notification");

// ========================================
// APPLY FOR JOB + RECRUITER NOTIFICATION
// ========================================

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
      });
    }

    if (job.status !== "Active") {
      return res.status(400).json({
        message: "This job is not available for applications.",
      });
    }

    const existingApplication = await Application.findOne({
      job: jobId,
      candidate: req.user.id,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      recruiter: job.recruiter,
      coverLetter: coverLetter || "",
    });

    // Notify recruiter
    try {
      const candidate = await User.findById(req.user.id).select("name");

      await Notification.create({
        recipient: job.recruiter,
        recipientRole: "Recruiter",
        title: "New Application Received",
        message: `${candidate?.name || "A candidate"} has applied for ${
          job.title
        }.`,
        type: "application",
      });
    } catch (notificationError) {
      console.error(
        "Recruiter notification error:",
        notificationError.message
      );
    }

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } catch (error) {
    // Handle duplicate application database error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already applied for this job.",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// GET RECRUITER APPLICATIONS
// ========================================

const getRecruiterApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      recruiter: req.user.id,
    })
      .populate(
        "candidate",
        "name email mobile location skills experience about resume"
      )
      .populate("job", "title company location")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// UPDATE APPLICATION STATUS
// + CANDIDATE NOTIFICATION
// ========================================

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Applied",
      "Under Review",
      "Shortlisted",
      "Hired",
      "Rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid application status.",
      });
    }

    const application = await Application.findOne({
      _id: req.params.id,
      recruiter: req.user.id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
      });
    }

    const previousStatus = application.status;

    // No unnecessary update or notification
    if (previousStatus === status) {
      return res.status(200).json({
        message: "Application status is already " + status,
        application,
      });
    }

    // Update application
    application.status = status;
    await application.save();

    // Notify candidate when status changes
    try {
      const job = await Job.findById(application.job).select("title");

      let title = "Application Status Updated";
      let message = `Your application status for ${
        job?.title || "a job"
      } has been changed to ${status}.`;
      let type = "info";

      if (status === "Shortlisted") {
        title = "Congratulations! You are Shortlisted";
        message = `Congratulations! You have been shortlisted for ${
          job?.title || "a job"
        }.`;
        type = "success";
      } else if (status === "Hired") {
        title = "Congratulations! You are Hired 🎉";
        message = `Congratulations! You have been hired for ${
          job?.title || "a job"
        }.`;
        type = "success";
      } else if (status === "Rejected") {
        title = "Application Update";
        message = `Your application for ${
          job?.title || "a job"
        } was not selected.`;
        type = "warning";
      } else if (status === "Under Review") {
        title = "Application Under Review";
        type = "application";
      } else if (status === "Applied") {
        title = "Application Status Updated";
        type = "application";
      }

      await Notification.create({
        recipient: application.candidate,
        recipientRole: "Candidate",
        title,
        message,
        type,
      });
    } catch (notificationError) {
      console.error(
        "Candidate notification error:",
        notificationError.message
      );
    }

    res.status(200).json({
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// CANDIDATE DASHBOARD
// ========================================

const getCandidateDashboard = async (req, res) => {
  try {
    const candidateId = req.user.id;

    const totalApplications = await Application.countDocuments({
      candidate: candidateId,
    });

    const shortlistedApplications = await Application.countDocuments({
      candidate: candidateId,
      status: "Shortlisted",
    });

    const hiredApplications = await Application.countDocuments({
      candidate: candidateId,
      status: "Hired",
    });

    const pendingApplications = await Application.countDocuments({
      candidate: candidateId,
      status: {
        $in: ["Applied", "Under Review"],
      },
    });

    const profile = await User.findById(candidateId).select(
      "name email mobile location skills experience about resume"
    );

    const profileFields = [
      profile?.name,
      profile?.email,
      profile?.mobile,
      profile?.location,
      profile?.skills?.length > 0,
      profile?.experience,
      profile?.about,
      profile?.resume,
    ];

    const completedFields = profileFields.filter(Boolean).length;

    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );

    res.status(200).json({
      totalApplications,
      shortlistedApplications,
      hiredApplications,
      pendingApplications,
      profileCompletion,
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// GET CANDIDATE APPLICATIONS
// ========================================

const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    })
      .populate(
        "job",
        "title company location salary jobType description skills createdAt"
      )
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
  applyForJob,
  getRecruiterApplications,
  updateApplicationStatus,
  getCandidateDashboard,
  getCandidateApplications,
};
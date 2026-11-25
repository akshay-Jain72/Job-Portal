
const SavedJob = require("../models/SavedJob");
const Job = require("../models/Job");

const getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({
      candidate: req.user.id,
    })
      .populate("job")
      .sort({ savedAt: -1 });

    res.json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const saveJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const existingSavedJob = await SavedJob.findOne({
      candidate: req.user.id,
      job: jobId,
    });

    if (existingSavedJob) {
      return res.status(400).json({
        message: "Job is already saved.",
      });
    }

    const savedJob = await SavedJob.create({
      candidate: req.user.id,
      job: jobId,
    });

    res.status(201).json({
      message: "Job saved successfully!",
      savedJob,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Job is already saved.",
      });
    }

    res.status(500).json({ message: error.message });
  }
};

const removeSavedJob = async (req, res) => {
  try {
    const savedJob = await SavedJob.findOneAndDelete({
      candidate: req.user.id,
      job: req.params.jobId,
    });

    if (!savedJob) {
      return res.status(404).json({
        message: "Saved job not found.",
      });
    }

    res.json({
      message: "Saved job removed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSavedJobs,
  saveJob,
  removeSavedJob,
};

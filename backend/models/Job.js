const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    workMode: {
      type: String,
      default: "On-site",
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      default: "Not disclosed",
    },
    experience: {
      type: String,
      default: "Fresher",
    },
    skills: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Rejected", "Closed"],
      default: "Pending",
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
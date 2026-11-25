
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Candidate", "Recruiter", "Admin"],
      default: "Candidate",
      required: true,
    },

    // User Account Status (Block / Unblock)
    status: {
      type: String,
      enum: ["Active", "Blocked"],
      default: "Active",
    },

    // Recruiter Approval Status
    recruiterStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    // Candidate Profile
    headline: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    education: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    about: {
      type: String,
      default: "",
    },

    // Recruiter / Company Profile
    companyName: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);

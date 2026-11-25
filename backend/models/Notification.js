const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipientRole: {
      type: String,
      enum: ["Candidate", "Recruiter", "Admin"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "success",
        "interview",
        "info",
        "reminder",
        "job",
        "application",
        "admin",
        "warning",
      ],
      default: "info",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, recipientRole: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
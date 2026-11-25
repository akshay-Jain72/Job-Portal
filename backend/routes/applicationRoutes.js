
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  applyForJob,
  getRecruiterApplications,
  updateApplicationStatus,
  getCandidateDashboard,
  getCandidateApplications,
} = require("../controllers/applicationController");

const candidateOnly = (req, res, next) => {
  if (req.user.role !== "Candidate") {
    return res.status(403).json({
      message: "Access denied. Candidates only.",
    });
  }

  next();
};

const recruiterOnly = (req, res, next) => {
  if (req.user.role !== "Recruiter") {
    return res.status(403).json({
      message: "Access denied. Recruiters only.",
    });
  }

  next();
};

router.post("/:jobId/apply", authMiddleware, candidateOnly, applyForJob);

router.get(
  "/candidate/dashboard",
  authMiddleware,
  candidateOnly,
  getCandidateDashboard
);

router.get(
  "/recruiter",
  authMiddleware,
  recruiterOnly,
  getRecruiterApplications
);

router.put(
  "/:id/status",
  authMiddleware,
  recruiterOnly,
  updateApplicationStatus
);

router.get(
  "/my-applications",
  authMiddleware,
  candidateOnly,
  getCandidateApplications
);

module.exports = router;

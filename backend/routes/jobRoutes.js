
const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Public: Get all active jobs
router.get("/", getAllJobs);

// Recruiter: Get own jobs
router.get(
  "/recruiter/my-jobs",
  authMiddleware,
  roleMiddleware("Recruiter"),
  getRecruiterJobs
);

// Public: Get single job
router.get("/:id", getJobById);

// Recruiter: Create job
router.post(
  "/",
  authMiddleware,
  roleMiddleware("Recruiter"),
  createJob
);

// Recruiter/Admin: Update job
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("Recruiter", "Admin"),
  updateJob
);

// Recruiter/Admin: Delete job
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("Recruiter", "Admin"),
  deleteJob
);

module.exports = router;

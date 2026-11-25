const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllAdminJobs,
  updateAdminJobStatus,
  deleteAdminJob,
} = require("../controllers/adminJobController");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

// Admin authentication for all routes
router.use(authMiddleware);
router.use(adminOnly);

// Get all jobs
router.get("/", getAllAdminJobs);

// Update job status
router.put("/:id/status", updateAdminJobStatus);

// Delete job
router.delete("/:id", deleteAdminJob);

module.exports = router;
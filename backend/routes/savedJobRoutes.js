const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getSavedJobs,
  saveJob,
  removeSavedJob,
} = require("../controllers/savedJobController");

const candidateOnly = (req, res, next) => {
  if (req.user.role !== "Candidate") {
    return res.status(403).json({
      message: "Access denied. Candidates only.",
    });
  }

  next();
};

router.get("/", authMiddleware, candidateOnly, getSavedJobs);

router.post("/:jobId", authMiddleware, candidateOnly, saveJob);

router.delete("/:jobId", authMiddleware, candidateOnly, removeSavedJob);

module.exports = router;
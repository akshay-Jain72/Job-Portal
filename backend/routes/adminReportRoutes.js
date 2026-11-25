const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAdminReports,
} = require("../controllers/adminReportController");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

router.get("/", authMiddleware, adminOnly, getAdminReports);

module.exports = router;
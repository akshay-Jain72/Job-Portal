const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getAdminDashboard } = require("../controllers/adminDashboardController");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

router.get("/", authMiddleware, adminOnly, getAdminDashboard);

module.exports = router;
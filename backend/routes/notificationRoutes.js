const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");

router.use(authMiddleware);

// Get notifications
router.get("/", getNotifications);

// Mark all as read
router.put("/mark-all-read", markAllRead);

// Delete all
router.delete("/delete-all", deleteAllNotifications);

// Mark one as read
router.put("/:id/read", markNotificationRead);

// Delete one
router.delete("/:id", deleteNotification);

module.exports = router;
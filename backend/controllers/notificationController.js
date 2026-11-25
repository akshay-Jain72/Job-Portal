const Notification = require("../models/Notification");

// Get notifications for logged-in user
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
      recipientRole: req.user.role,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark one notification as read
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user.id,
        recipientRole: req.user.role,
      },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.id,
        recipientRole: req.user.role,
        read: false,
      },
      { read: true }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete one notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
      recipientRole: req.user.role,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete all notifications
const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({
      recipient: req.user.id,
      recipientRole: req.user.role,
    });

    res.status(200).json({
      message: "All notifications deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllRead,
  deleteNotification,
  deleteAllNotifications,
};
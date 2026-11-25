const User = require("../models/user");
const Notification = require("../models/Notification");

// Send notification to a specific user
const createNotification = async ({
  recipient,
  recipientRole,
  title,
  message,
  type = "info",
}) => {
  return Notification.create({
    recipient,
    recipientRole,
    title,
    message,
    type,
  });
};

// Send notification to all users of a role
const notifyRole = async ({
  role,
  title,
  message,
  type = "info",
}) => {
  const users = await User.find({ role }).select("_id");

  if (!users.length) return;

  const notifications = users.map((user) => ({
    recipient: user._id,
    recipientRole: role,
    title,
    message,
    type,
  }));

  return Notification.insertMany(notifications);
};

// Send notification to all Admins
const notifyAdmins = async ({
  title,
  message,
  type = "admin",
}) => {
  return notifyRole({
    role: "Admin",
    title,
    message,
    type,
  });
};

module.exports = {
  createNotification,
  notifyRole,
  notifyAdmins,
};
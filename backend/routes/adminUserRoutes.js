const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getAllAdminUsers,
  toggleAdminUserStatus,
  deleteAdminUser,
} = require("../controllers/adminUserController");

const adminOnly = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};

// Authentication and Admin access
router.use(authMiddleware);
router.use(adminOnly);

// Get all users
router.get("/", getAllAdminUsers);

// Block / Unblock user
router.put("/:id/status", toggleAdminUserStatus);

// Delete user
router.delete("/:id", deleteAdminUser);

module.exports = router;
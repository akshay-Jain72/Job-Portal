
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const companyLogoUpload = require("../middleware/companyLogoUpload");

const {
  getProfile,
  updateProfile,
  uploadResume,
  uploadCompanyLogo,
} = require("../controllers/profileController");

// GET PROFILE
router.get("/", authMiddleware, getProfile);

// UPDATE PROFILE
router.put("/", authMiddleware, updateProfile);

// UPLOAD RESUME PDF
router.post(
  "/resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

// UPLOAD COMPANY LOGO
router.post(
  "/company-logo",
  authMiddleware,
  companyLogoUpload.single("logo"),
  uploadCompanyLogo
);

module.exports = router;


const User = require("../models/User");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otp -otpExpiry"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      message: "Error fetching profile",
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // CANDIDATE PROFILE
    if (user.role === "Candidate") {
      const {
        name,
        mobile,
        headline,
        location,
        skills,
        education,
        experience,
        about,
      } = req.body;

      if (name !== undefined) user.name = name.trim();
      if (mobile !== undefined) user.mobile = mobile.trim();
      if (headline !== undefined) user.headline = headline;
      if (location !== undefined) user.location = location;
      if (education !== undefined) user.education = education;
      if (experience !== undefined) user.experience = experience;
      if (about !== undefined) user.about = about;

      if (skills !== undefined) {
        if (!Array.isArray(skills)) {
          return res.status(400).json({
            message: "Skills must be an array",
          });
        }

        user.skills = skills
          .map((skill) => String(skill).trim())
          .filter(Boolean);
      }
    }

    // RECRUITER PROFILE
    else if (user.role === "Recruiter") {
      const {
        name,
        mobile,
        companyName,
        website,
        industry,
        location,
        companySize,
        description,
      } = req.body;

      if (name !== undefined) user.name = name.trim();
      if (mobile !== undefined) user.mobile = mobile.trim();

      if (companyName !== undefined) {
        user.companyName = companyName.trim();
      }

      if (website !== undefined) user.website = website;
      if (industry !== undefined) user.industry = industry;
      if (location !== undefined) user.location = location;
      if (companySize !== undefined) user.companySize = companySize;

      if (description !== undefined) {
        user.companyDescription = description;
      }
    }

    // OTHER ROLES
    else {
      return res.status(403).json({
        message: "This account cannot update this profile",
      });
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "-password -otp -otpExpiry"
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Error updating profile",
    });
  }
};

// UPLOAD RESUME
const uploadResume = async (req, res) => {
  try {
    if (req.user.role !== "Candidate") {
      return res.status(403).json({
        message: "Only candidates can upload resumes",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a PDF resume",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.resume = `/uploads/${req.file.filename}`;

    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resume: user.resume,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return res.status(500).json({
      message: "Resume upload failed",
    });
  }
};

// UPLOAD COMPANY LOGO
const uploadCompanyLogo = async (req, res) => {
  try {
    if (req.user.role !== "Recruiter") {
      return res.status(403).json({
        message: "Only recruiters can upload company logos",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please select a logo image",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const logoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    user.logo = logoUrl;

    await user.save();

    return res.status(200).json({
      message: "Company logo uploaded successfully",
      logo: user.logo,
    });
  } catch (error) {
    console.error("Logo upload error:", error);

    return res.status(500).json({
      message: "Failed to upload company logo",
    });
  }
};

// EXPORT CONTROLLERS
module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  uploadCompanyLogo,
};

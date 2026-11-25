const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    const uniqueName = crypto.randomUUID();
    cb(null, `${uniqueName}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" &&
    path.extname(file.originalname).toLowerCase() === ".pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF resumes are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

module.exports = upload;
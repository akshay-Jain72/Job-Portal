const path = require("path");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const adminJobRoutes = require("./routes/adminJobRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminReportRoutes = require("./routes/adminReportRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/jobs", adminJobRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/reports", adminReportRoutes);


// Home API
app.get("/", (req, res) => {
  res.send("Job Portal Backend is running");
});

// MongoDB Connection & Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error.message);
  });

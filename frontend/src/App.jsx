
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Jobs from "./pages/Jobs";
import Profile from "./pages/CandidateProfile";
import MyApplications from "./pages/MyApplications";
import SavedJobs from "./pages/SavedJobs";
import Notifications from "./pages/CandidateNotifications";
import PostJob from "./pages/PostJob";

import ManageJobs from "./pages/ManageJobs";
import Applicants from "./pages/Applicants";
import JobDetails from "./pages/JobDetails";
import RecruiterProfile from "./pages/RecruiterProfile";
import RecruiterNotifications from "./pages/RecruiterNotifications";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminManageUsers";
import AdminJobs from "./pages/AdminManageJobs";
import AdminReports from "./pages/AdminReports";
import AdminNotifications from "./pages/AdminNotifications";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />

        {/* Candidate Dashboard */}
        <Route
          path="/candidate-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Dashboard */}
        <Route
          path="/recruiter-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Notifications */}
        <Route
          path="/recruiter-notifications"
          element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <RecruiterNotifications />
            </ProtectedRoute>
          }
        />

        {/* Candidate Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Candidate Applications */}
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Saved Jobs */}
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <SavedJobs />
            </ProtectedRoute>
          }
        />

        {/* Candidate Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={["Candidate"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Post Job */}
        <Route
          path="/post-job"
          element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <PostJob />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Manage Jobs */}
        <Route
          path="/manage-jobs"
          element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <ManageJobs />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Applicants */}
        <Route
          path="/applicants"
          element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <Applicants />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Profile */}
        <Route
          path="/recruiter-profile"
          element={
            <ProtectedRoute allowedRoles={["Recruiter"]}>
              <RecruiterProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Users */}
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        {/* Admin Jobs */}
        <Route
          path="/admin-jobs"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminJobs />
            </ProtectedRoute>
          }
        />

        {/* Admin Reports */}
        <Route
          path="/admin-reports"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        {/* Admin Notifications */}
        <Route
          path="/admin-notifications"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />

        {/* 404 - Page Not Found */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <h1>404 - Page Not Found</h1>
              <p>Ye page exist nahi karta.</p>
              <a href="/">Go to Home</a>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          if (isMounted) {
            setError("Token not found. Please login again.");
            setLoading(false);
          }
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setDashboardData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Failed to load dashboard"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  // Retry dashboard
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboardData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <AdminNavbar />
        <main className="admin-main">
          <div className="admin-dashboard-content admin-message-container">
            <h2>Loading dashboard...</h2>
          </div>
        </main>
      </div>
    );
  }

  // Error
  if (error || !dashboardData) {
    return (
      <div className="admin-dashboard-page">
        <AdminNavbar />
        <main className="admin-main">
          <div className="admin-dashboard-content admin-message-container">
            <div className="admin-error-box">
              <i className="fa-solid fa-circle-exclamation"></i>
              <h2>Dashboard Error</h2>
              <p>{error || "Dashboard data not available."}</p>

              <button
                type="button"
                className="admin-retry-btn"
                onClick={fetchDashboard}
              >
                <i className="fa-solid fa-rotate-right"></i>
                Retry
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { stats, recentUsers, recentJobs } = dashboardData;

  const activeUsers = stats.totalUsers - stats.blockedUsers;

  return (
    <div className="admin-dashboard-page">
      <AdminNavbar />

      <main className="admin-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-heading">
            <h1>Admin Dashboard</h1>
            <p>Overview of your job portal</p>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-avatar">
              {(localStorage.getItem("name") || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <span>{localStorage.getItem("name") || "Admin"}</span>
          </div>
        </header>

        <div className="admin-dashboard-content">
          {/* WELCOME */}
          <section className="admin-welcome">
            <div>
              <h2>Welcome to Admin Panel</h2>
              <p>
                Monitor users, job postings and platform activity.
              </p>
            </div>
          </section>

          {/* STATS */}
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon blue">
                <i className="fa-solid fa-users"></i>
              </div>
              <div className="admin-stat-info">
                <span>Total Users</span>
                <h3>{stats.totalUsers}</h3>
                <p>Registered accounts</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon purple">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div className="admin-stat-info">
                <span>Total Recruiters</span>
                <h3>{stats.totalRecruiters}</h3>
                <p>Company accounts</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon green">
                <i className="fa-solid fa-briefcase"></i>
              </div>
              <div className="admin-stat-info">
                <span>Total Jobs</span>
                <h3>{stats.totalJobs}</h3>
                <p>Posted opportunities</p>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon orange">
                <i className="fa-solid fa-file-lines"></i>
              </div>
              <div className="admin-stat-info">
                <span>Applications</span>
                <h3>{stats.totalApplications}</h3>
                <p>Total applications</p>
              </div>
            </div>
          </section>

          {/* RECENT USERS & JOBS */}
          <section className="admin-dashboard-grid">
            {/* USERS */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Recent Users</h3>
                  <p>Latest registered accounts</p>
                </div>
                <NavLink to="/admin-users">View All</NavLink>
              </div>

              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="3">No users found</td>
                      </tr>
                    ) : (
                      recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td>
                            <div className="admin-user-cell">
                              <div className="admin-user-avatar">
                                {(user.name || "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="admin-user-details">
                                <strong>{user.name}</strong>
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </td>

                          <td>{user.role}</td>

                          <td>
                            <span
                              className={`admin-status ${
                                (user.status || "Active").toLowerCase()
                              }`}
                            >
                              {user.status || "Active"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* JOBS */}
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h3>Recent Jobs</h3>
                  <p>Latest job postings</p>
                </div>
                <NavLink to="/admin-jobs">View All</NavLink>
              </div>

              <div className="admin-recent-jobs">
                {recentJobs.length === 0 ? (
                  <p>No jobs found</p>
                ) : (
                  recentJobs.map((job) => (
                    <div className="admin-recent-job" key={job._id}>
                      <div className="admin-job-icon">
                        <i className="fa-solid fa-briefcase"></i>
                      </div>

                      <div className="admin-recent-job-info">
                        <strong>{job.title}</strong>
                        <span>
                          {job.company}
                          {job.recruiter?.name
                            ? ` • ${job.recruiter.name}`
                            : ""}
                        </span>
                      </div>

                      <span
                        className={`admin-status ${
                          (job.status || "Pending").toLowerCase()
                        }`}
                      >
                        {job.status || "Pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* PLATFORM OVERVIEW */}
          <section className="admin-panel admin-overview-panel">
            <div className="admin-panel-header">
              <div>
                <h3>Platform Overview</h3>
                <p>Current portal activity</p>
              </div>
            </div>

            <div className="admin-overview-grid">
              <div className="admin-overview-item">
                <span>Active Users</span>
                <strong>{activeUsers}</strong>
                <p>Total users minus blocked users</p>
              </div>

              <div className="admin-overview-item">
                <span>Pending Jobs</span>
                <strong>{stats.pendingJobs}</strong>
                <p>Waiting for review</p>
              </div>

              <div className="admin-overview-item">
                <span>Blocked Accounts</span>
                <strong>{stats.blockedUsers}</strong>
                <p>Restricted users</p>
              </div>

              <div className="admin-overview-item">
                <span>Active Jobs</span>
                <strong>{stats.activeJobs}</strong>
                <p>Currently active postings</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;


import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminReports.css";

function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // FETCH REPORTS
  useEffect(() => {
    const loadReports = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
          setReports(null);
          return;
        }

        const response = await axios.get(
          "https://job-portal-backend-15s4.onrender.com/api/admin/reports",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReports(response.data);
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load reports."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadReports();
  }, [refreshKey]);

  // REFRESH
  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
  };

  // DATA
  const stats = reports?.stats || {};
  const monthlyData = reports?.monthlyData || [];
  const topJobs = reports?.topJobs || [];

  const maxJobs = Math.max(
    ...monthlyData.map((item) => Number(item.jobs) || 0),
    1
  );

  // JOB STATUS
  const totalStatusJobs =
    (stats.activeJobs || 0) +
    (stats.pendingJobs || 0) +
    (stats.rejectedJobs || 0) +
    (stats.closedJobs || 0);

  const getPercentage = (value) => {
    if (!totalStatusJobs) return 0;

    return Math.round((value / totalStatusJobs) * 100);
  };

  // APPLICATION PIPELINE
  const pipeline = [
    {
      label: "Applied",
      value: stats.applied || 0,
      icon: "fa-file-circle-check",
      className: "applied",
    },
    {
      label: "Under Review",
      value: stats.underReview || 0,
      icon: "fa-magnifying-glass",
      className: "review",
    },
    {
      label: "Shortlisted",
      value: stats.shortlisted || 0,
      icon: "fa-star",
      className: "shortlisted",
    },
    {
      label: "Hired",
      value: stats.hiredCandidates || 0,
      icon: "fa-check",
      className: "hired",
    },
    {
      label: "Rejected",
      value: stats.rejectedApplications || 0,
      icon: "fa-ban",
      className: "rejected",
    },
  ];

  const totalPipeline = pipeline.reduce(
    (total, item) => total + item.value,
    0
  );

  // JOB STATUSES
  const jobStatuses = [
    {
      label: "Active Jobs",
      value: stats.activeJobs || 0,
      className: "active",
    },
    {
      label: "Pending Approval",
      value: stats.pendingJobs || 0,
      className: "pending",
    },
    {
      label: "Rejected Jobs",
      value: stats.rejectedJobs || 0,
      className: "rejected",
    },
    {
      label: "Closed Jobs",
      value: stats.closedJobs || 0,
      className: "closed",
    },
  ];

  // INSIGHTS
  const averageApplications =
    stats.totalJobs > 0
      ? (stats.totalApplicants / stats.totalJobs).toFixed(1)
      : "0";

  const hiringRate =
    stats.totalApplicants > 0
      ? Math.round(
          (stats.hiredCandidates / stats.totalApplicants) * 100
        )
      : 0;

  const highestMonth = monthlyData.reduce(
    (best, current) =>
      Number(current.jobs) > Number(best.jobs)
        ? current
        : best,
    { month: "-", jobs: 0 }
  );

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="admin-reports-page">
        <AdminNavbar />

        <main className="admin-reports-main">
          <div className="admin-reports-loading">
            <div className="reports-loader"></div>

            <h3>Preparing analytics</h3>

            <p>
              Collecting platform performance data...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ERROR SCREEN
  if (error && !reports) {
    return (
      <div className="admin-reports-page">
        <AdminNavbar />

        <main className="admin-reports-main">
          <div className="admin-reports-error">
            <i className="fa-solid fa-circle-exclamation"></i>

            <h2>{error}</h2>

            <button onClick={handleRefresh}>
              <i className="fa-solid fa-rotate-right"></i>
              Try Again
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      <AdminNavbar />

      <main className="admin-reports-main">
        {/* HEADER */}
        <header className="reports-hero">
          <div className="reports-hero-content">
            <span className="reports-eyebrow">
              <i className="fa-solid fa-chart-line"></i>
              PLATFORM INTELLIGENCE
            </span>

            <h1>Reports & Analytics</h1>

            <p>
              Track hiring performance, jobs and platform
              activity from one dashboard.
            </p>
          </div>

          <button
            className="reports-refresh-btn"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <i
              className={`fa-solid fa-rotate-right ${
                refreshing ? "reports-spin" : ""
              }`}
            ></i>

            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </header>

        {/* ERROR */}
        {error && reports && (
          <div className="reports-inline-error">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        {/* KPI CARDS */}
        <section className="reports-kpi-grid">
          <div className="reports-kpi-card">
            <div className="reports-kpi-top">
              <div className="reports-kpi-icon blue">
                <i className="fa-solid fa-briefcase"></i>
              </div>

              <span className="reports-kpi-tag">
                Job Activity
              </span>
            </div>

            <p>Total Jobs</p>
            <h2>{stats.totalJobs || 0}</h2>

            <div className="reports-kpi-footer">
              <i className="fa-solid fa-layer-group"></i>
              All job listings
            </div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-top">
              <div className="reports-kpi-icon purple">
                <i className="fa-solid fa-users"></i>
              </div>

              <span className="reports-kpi-tag">
                Candidate Activity
              </span>
            </div>

            <p>Total Applications</p>
            <h2>{stats.totalApplicants || 0}</h2>

            <div className="reports-kpi-footer">
              <i className="fa-solid fa-file-lines"></i>
              Applications received
            </div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-top">
              <div className="reports-kpi-icon green">
                <i className="fa-solid fa-user-tie"></i>
              </div>

              <span className="reports-kpi-tag">
                Network
              </span>
            </div>

            <p>Total Recruiters</p>
            <h2>{stats.totalRecruiters || 0}</h2>

            <div className="reports-kpi-footer">
              <i className="fa-solid fa-building"></i>
              Registered recruiters
            </div>
          </div>

          <div className="reports-kpi-card">
            <div className="reports-kpi-top">
              <div className="reports-kpi-icon orange">
                <i className="fa-solid fa-trophy"></i>
              </div>

              <span className="reports-kpi-tag">
                Hiring
              </span>
            </div>

            <p>Successful Hires</p>
            <h2>{stats.hiredCandidates || 0}</h2>

            <div className="reports-kpi-footer">
              <i className="fa-solid fa-circle-check"></i>
              Candidates hired
            </div>
          </div>
        </section>

        {/* INSIGHTS */}
        <section className="reports-insights-grid">
          <div className="reports-insight-card">
            <div className="reports-insight-icon">
              <i className="fa-solid fa-chart-simple"></i>
            </div>

            <div>
              <span>Applications per Job</span>
              <strong>{averageApplications}</strong>
              <small>Average applications per listing</small>
            </div>
          </div>

          <div className="reports-insight-card">
            <div className="reports-insight-icon">
              <i className="fa-solid fa-bullseye"></i>
            </div>

            <div>
              <span>Hiring Rate</span>
              <strong>{hiringRate}%</strong>
              <small>Hires / total applications</small>
            </div>
          </div>

          <div className="reports-insight-card">
            <div className="reports-insight-icon">
              <i className="fa-solid fa-calendar-check"></i>
            </div>

            <div>
              <span>Peak Posting Month</span>
              <strong>{highestMonth.month}</strong>
              <small>
                {highestMonth.jobs || 0} jobs posted
              </small>
            </div>
          </div>
        </section>

        {/* MONTHLY CHART */}
        <section className="reports-panel reports-monthly-panel">
          <div className="reports-panel-header">
            <div>
              <span className="reports-section-label">
                OVERVIEW
              </span>

              <h2>Job Posting Activity</h2>

              <p>Monthly job posting distribution</p>
            </div>

            <div className="reports-chart-legend">
              <span className="reports-legend-dot"></span>
              Job Postings
            </div>
          </div>

          {monthlyData.length > 0 ? (
            <div className="reports-chart">
              {monthlyData.map((item, index) => {
                const jobs = Number(item.jobs) || 0;

                return (
                  <div
                    className="reports-chart-column"
                    key={`${item.month}-${index}`}
                  >
                    <div className="reports-chart-bar-wrap">
                      <span className="reports-chart-value">
                        {jobs}
                      </span>

                      <div
                        className={`reports-chart-bar ${
                          jobs === maxJobs ? "peak" : ""
                        }`}
                        style={{
                          height: `${Math.max(
                            (jobs / maxJobs) * 100,
                            jobs > 0 ? 4 : 0
                          )}%`,
                        }}
                        title={`${item.month}: ${jobs} jobs`}
                      ></div>
                    </div>

                    <span className="reports-chart-month">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="reports-empty">
              <i className="fa-solid fa-chart-column"></i>
              <p>No monthly job data available.</p>
            </div>
          )}
        </section>

        {/* ANALYTICS GRID */}
        <section className="reports-analytics-grid">
          {/* JOB STATUS */}
          <div className="reports-panel">
            <div className="reports-panel-header">
              <div>
                <span className="reports-section-label">
                  JOB MANAGEMENT
                </span>

                <h2>Job Status Overview</h2>

                <p>Distribution of job listings</p>
              </div>
            </div>

            <div className="reports-status-list">
              {jobStatuses.map((item) => (
                <div
                  className="reports-status-row"
                  key={item.label}
                >
                  <div className="reports-status-top">
                    <div className="reports-status-label">
                      <span
                        className={`reports-status-dot ${item.className}`}
                      ></span>

                      {item.label}
                    </div>

                    <div className="reports-status-value">
                      <strong>{item.value}</strong>
                      <span>
                        {getPercentage(item.value)}%
                      </span>
                    </div>
                  </div>

                  <div className="reports-progress-track">
                    <div
                      className={`reports-progress-fill ${item.className}`}
                      style={{
                        width: `${getPercentage(item.value)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="reports-status-total">
              <span>Total classified jobs</span>
              <strong>{totalStatusJobs}</strong>
            </div>
          </div>

          {/* APPLICATION PIPELINE */}
          <div className="reports-panel">
            <div className="reports-panel-header">
              <div>
                <span className="reports-section-label">
                  CANDIDATE JOURNEY
                </span>

                <h2>Application Pipeline</h2>

                <p>Application status breakdown</p>
              </div>
            </div>

            <div className="reports-pipeline-total">
              <div>
                <span>Total Applications</span>
                <h3>{totalPipeline}</h3>
              </div>

              <div className="reports-pipeline-total-icon">
                <i className="fa-solid fa-users"></i>
              </div>
            </div>

            <div className="reports-pipeline-list">
              {pipeline.map((item) => {
                const percentage =
                  totalPipeline > 0
                    ? Math.round(
                        (item.value / totalPipeline) * 100
                      )
                    : 0;

                return (
                  <div
                    className="reports-pipeline-row"
                    key={item.label}
                  >
                    <div
                      className={`reports-pipeline-icon ${item.className}`}
                    >
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>

                    <div className="reports-pipeline-content">
                      <div className="reports-pipeline-top">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>

                      <div className="reports-pipeline-track">
                        <div
                          className={`reports-pipeline-fill ${item.className}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <span className="reports-pipeline-percent">
                      {percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TOP JOBS */}
        <section className="reports-panel reports-top-jobs">
          <div className="reports-panel-header">
            <div>
              <span className="reports-section-label">
                PERFORMANCE
              </span>

              <h2>Top Performing Jobs</h2>

              <p>Ranked by received applications</p>
            </div>

            <div className="reports-top-jobs-badge">
              <i className="fa-solid fa-award"></i>
              Top Listings
            </div>
          </div>

          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Job Position</th>
                  <th>Company</th>
                  <th>Applications</th>
                  <th>Performance</th>
                </tr>
              </thead>

              <tbody>
                {topJobs.length > 0 ? (
                  topJobs.map((job, index) => {
                    const maxApplicants = Math.max(
                      topJobs[0]?.applicants || 1,
                      1
                    );

                    const percentage = Math.min(
                      ((job.applicants || 0) /
                        maxApplicants) *
                        100,
                      100
                    );

                    return (
                      <tr key={job._id}>
                        <td>
                          <span
                            className={`reports-rank ${
                              index === 0 ? "first" : ""
                            }`}
                          >
                            {index + 1}
                          </span>
                        </td>

                        <td>
                          <strong className="reports-job-title">
                            {job.title || "Untitled Job"}
                          </strong>
                        </td>

                        <td>
                          <span className="reports-company">
                            {job.company || "N/A"}
                          </span>
                        </td>

                        <td>
                          <span className="reports-app-count">
                            {job.applicants || 0}
                          </span>
                        </td>

                        <td>
                          <div className="reports-performance">
                            <div className="reports-performance-track">
                              <div
                                className="reports-performance-fill"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              ></div>
                            </div>

                            <span>
                              {Math.round(percentage)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="reports-table-empty"
                    >
                      No job performance data available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="reports-footer">
          <div>
            <i className="fa-solid fa-shield-halved"></i>
            Admin analytics dashboard
          </div>

          <span>
            <i className="fa-regular fa-clock"></i>
            Last refreshed: {new Date().toLocaleTimeString()}
          </span>
        </footer>
      </main>
    </div>
  );
}

export default AdminReports;

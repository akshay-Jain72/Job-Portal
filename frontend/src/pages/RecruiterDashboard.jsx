
import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "./RecruiterDashboard.css";

const API = "http://localhost:5000/api";

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [jobsResponse, applicantsResponse] =
          await Promise.all([
            axios.get(
              `${API}/jobs/recruiter/my-jobs`,
              { headers }
            ),
            axios.get(
              `${API}/applications/recruiter`,
              { headers }
            ),
          ]);

        setJobs(
          Array.isArray(jobsResponse.data)
            ? jobsResponse.data
            : jobsResponse.data.jobs || []
        );

        setApplicants(
          Array.isArray(applicantsResponse.data)
            ? applicantsResponse.data
            : applicantsResponse.data.applications || []
        );
      } catch (err) {
        console.error("Dashboard error:", err);

        setError(
          err.response?.data?.message ||
          "Dashboard data load nahi hua."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const activeJobs = jobs.filter(
    (job) => job.status === "Active"
  );

  const pendingJobs = jobs.filter(
    (job) => job.status === "Pending"
  );

  const recentJobs = [...jobs]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const recentApplicants = [...applicants]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <RecruiterNavbar />
        <div className="recruiter-dashboard">
          <div className="dashboard-loading">
            Loading dashboard...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RecruiterNavbar />

      <div className="recruiter-dashboard">

        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1>Recruiter Dashboard</h1>
            <p>
              Manage your jobs and track candidate applications.
            </p>
          </div>
        </div>

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* STATS */}
        <div className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <i className="fas fa-briefcase"></i>
            </div>
            <div>
              <h3>Total Jobs</h3>
              <h2>{jobs.length}</h2>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon active-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div>
              <h3>Active Jobs</h3>
              <h2>{activeJobs.length}</h2>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon pending-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div>
              <h3>Pending Jobs</h3>
              <h2>{pendingJobs.length}</h2>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon applicant-icon">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <h3>Total Applicants</h3>
              <h2>{applicants.length}</h2>
            </div>
          </div>

        </div>

        {/* RECENT JOBS */}
        <div className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <h2>Recent Job Postings</h2>
              <p>Your latest posted jobs</p>
            </div>

            <button
              className="dashboard-view-all"
              onClick={() =>
                window.location.href = "/manage-jobs"
              }
            >
              View All
            </button>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Posted Date</th>
                  <th>Applicants</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <tr key={job._id}>
                      <td className="dashboard-job-title">
                        {job.title}
                      </td>

                      <td>
                        {job.category || "—"}
                      </td>

                      <td>
                        {formatDate(job.createdAt)}
                      </td>

                      <td>
                        {
                          applicants.filter(
                            (application) =>
                              application.job?._id === job._id ||
                              application.job === job._id
                          ).length
                        }
                      </td>

                      <td>
                        <span
                          className={`dashboard-status ${
                            job.status === "Active"
                              ? "status-active"
                              : "status-pending"
                          }`}
                        >
                          {job.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      No jobs posted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* RECENT APPLICANTS */}
        <div className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <h2>Recent Applicants</h2>
              <p>Latest candidates who applied to your jobs</p>
            </div>

            <button
              className="dashboard-view-all"
              onClick={() =>
                window.location.href = "/applicants"
              }
            >
              View All
            </button>
          </div>

          <div className="dashboard-applicants-list">

            {recentApplicants.length > 0 ? (
              recentApplicants.map((application) => (
                <div
                  className="dashboard-applicant-card"
                  key={application._id}
                >

                  <div className="dashboard-applicant-avatar">
                    {application.candidate?.name
                      ? application.candidate.name
                          .charAt(0)
                          .toUpperCase()
                      : "C"}
                  </div>

                  <div className="dashboard-applicant-info">
                    <h3>
                      {application.candidate?.name ||
                        "Unknown Candidate"}
                    </h3>

                    <p>
                      {application.job?.title ||
                        "Job title unavailable"}
                    </p>

                    <span>
                      {application.candidate?.email ||
                        "Email unavailable"}
                    </span>
                  </div>

                  <div className="dashboard-applicant-meta">
                    <span className="dashboard-application-status">
                      {application.status || "Applied"}
                    </span>

                    <p>
                      {formatDate(application.createdAt)}
                    </p>
                  </div>

                </div>
              ))
            ) : (
              <div className="dashboard-empty">
                <p>No applicants yet.</p>
              </div>
            )}

          </div>

        </div>

        {/* FOOTER */}
        <div className="dashboard-footer">
          <p>
            You have posted {jobs.length} job
            {jobs.length !== 1 ? "s" : ""} and received{" "}
            {applicants.length} application
            {applicants.length !== 1 ? "s" : ""}.
          </p>
        </div>

      </div>
    </>
  );
}

export default RecruiterDashboard;

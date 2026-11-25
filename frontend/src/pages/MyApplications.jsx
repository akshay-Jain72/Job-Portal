
import { useEffect, useState } from "react";
import axios from "axios";
import CandidateNavbar from "../components/CandidateNavbar";
import "./MyApplications.css";

const APPLICATION_STATUSES = [
  "All",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Rejected",
];

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5000/api/applications/my-applications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplications(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Applications load nahi ho rahi hain."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getJob = (application) => application.job || {};

  const getStatusClass = (status) => {
    return (status || "Applied").toLowerCase().replace(/\s+/g, "-");
  };

  const getAppliedDate = (date) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredApplications = applications.filter((application) => {
    const job = getJob(application);

    const title = job.title || "";
    const company = job.company || "";
    const location = job.location || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countByStatus = (status) =>
    applications.filter(
      (application) => application.status === status
    ).length;

  return (
    <div className="my-applications-page">
      <CandidateNavbar />

      <main className="applications-main">
        {/* Header */}
        <section className="applications-header">
          <div>
            <span className="applications-header-label">
              CANDIDATE PORTAL
            </span>
            <h1>My Applications</h1>
            <p>Track your job applications and hiring progress.</p>
          </div>
        </section>

        {/* Loading */}
        {loading && (
          <div className="applications-empty">
            <div className="applications-loader"></div>
            <p>Loading applications...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="applications-empty applications-error">
            <h3>Unable to load applications</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats */}
            <section className="applications-stats">
              <div className="application-stat total-stat">
                <span>Total Applications</span>
                <h2>{applications.length}</h2>
              </div>

              <div className="application-stat review-stat">
                <span>Under Review</span>
                <h2>{countByStatus("Under Review")}</h2>
              </div>

              <div className="application-stat shortlisted-stat">
                <span>Shortlisted</span>
                <h2>{countByStatus("Shortlisted")}</h2>
              </div>

              <div className="application-stat rejected-stat">
                <span>Rejected</span>
                <h2>{countByStatus("Rejected")}</h2>
              </div>
            </section>

            {/* Search and Filter */}
            <section className="applications-toolbar">
              <div className="applications-search">
                <span className="applications-search-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>

                <input
                  type="text"
                  placeholder="Search job, company or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="applications-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Statuses" : status}
                  </option>
                ))}
              </select>
            </section>

            {/* Application List */}
            <section className="applications-list-section">
              <div className="applications-list-heading">
                <div>
                  <h2>Applied Jobs</h2>
                  <p>Manage and track your applications.</p>
                </div>

                <span className="applications-count">
                  {filteredApplications.length} Applications
                </span>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="applications-empty">
                  <div className="applications-empty-icon">📋</div>
                  <h3>No applications found</h3>
                  <p>
                    You haven't applied to any matching jobs yet.
                  </p>
                </div>
              ) : (
                <div className="applications-list">
                  {filteredApplications.map((application) => {
                    const job = getJob(application);

                    return (
                      <article
                        className="application-card"
                        key={application._id}
                      >
                        {/* Card Top */}
                        <div className="application-card-top">
                          <div className="application-company-logo">
                            {(job.company || "C")
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="application-job-info">
                            <h3>
                              {job.title || "Job no longer available"}
                            </h3>

                            <p className="application-company-name">
                              {job.company || "Company"}
                            </p>
                          </div>

                          <span
                            className={`application-status ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status || "Applied"}
                          </span>
                        </div>

                        {/* Job Details */}
                        <div className="application-job-details">
                          <span>
                            <span className="application-detail-icon">📍</span>
                            {job.location || "Not specified"}
                          </span>

                          <span>
                            <span className="application-detail-icon">💼</span>
                            {job.jobType || "Not specified"}
                          </span>

                          <span>
                            <span className="application-detail-icon">💰</span>
                            {job.salary || "Not specified"}
                          </span>
                        </div>

                        {/* Card Footer */}
                        <div className="application-card-footer">
                          <p className="application-date">
                            Applied on:{" "}
                            <strong>
                              {getAppliedDate(application.createdAt)}
                            </strong>
                          </p>

                          <button
                            type="button"
                            className="application-view-btn"
                            onClick={() =>
                              setSelectedApplication(application)
                            }
                          >
                            View Details
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14" />
                              <path d="m12 5 7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      {/* Details Modal */}
      {selectedApplication && (
        <div
          className="application-modal-overlay"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="application-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="application-modal-close"
              onClick={() => setSelectedApplication(null)}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="application-modal-header">
              <div className="application-modal-logo">
                {(selectedApplication.job?.company || "C")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2 id="application-modal-title">
                  {selectedApplication.job?.title ||
                    "Job no longer available"}
                </h2>

                <h3>
                  {selectedApplication.job?.company || "Company"}
                </h3>
              </div>
            </div>

            {/* Modal Details */}
            <div className="application-modal-details">
              <p>
                <span>📍</span>
                {selectedApplication.job?.location || "Not specified"}
              </p>

              <p>
                <span>💼</span>
                {selectedApplication.job?.jobType || "Not specified"}
              </p>

              <p>
                <span>💰</span>
                {selectedApplication.job?.salary || "Not specified"}
              </p>

              <p>
                <span>📅</span>
                Applied: {getAppliedDate(selectedApplication.createdAt)}
              </p>
            </div>

            {/* Status */}
            <div className="application-modal-status">
              <span>Application Status</span>

              <strong
                className={`application-status ${getStatusClass(
                  selectedApplication.status
                )}`}
              >
                {selectedApplication.status || "Applied"}
              </strong>
            </div>

            {/* Description */}
            <div className="application-modal-description-section">
              <h4>Job Description</h4>

              <p className="application-modal-description">
                {selectedApplication.job?.description ||
                  "No description available."}
              </p>
            </div>

            {/* Close */}
            <button
              type="button"
              className="application-modal-done"
              onClick={() => setSelectedApplication(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyApplications;

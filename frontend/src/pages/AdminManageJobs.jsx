import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminManageJobs.css";

function AdminManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/admin/jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadJobs = async () => {
      await fetchJobs();
    };

    loadJobs();
  }, []);

  // Update status
  const updateJobStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/jobs/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Job ${status} successfully!`);
      fetchJobs();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update job status"
      );
    }
  };

  // Delete job
  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job deleted successfully!");
      setSelectedJob(null);
      fetchJobs();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete job"
      );
    }
  };

  // Search and filter
  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText) ||
      job.recruiter?.name?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || job.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Counts
  const totalJobs = jobs.length;
  const pendingJobs = jobs.filter(
    (job) => job.status === "Pending"
  ).length;
  const activeJobs = jobs.filter(
    (job) => job.status === "Active"
  ).length;
  const rejectedJobs = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "amj-active";

      case "Pending":
        return "amj-pending";

      case "Rejected":
        return "amj-rejected";

      case "Closed":
        return "amj-closed";

      default:
        return "";
    }
  };

  return (
    <div className="amj-layout">
      <AdminNavbar />

      <main className="amj-main">
        {/* Topbar */}
        <div className="amj-topbar">
          <div>
            <h1>Manage Jobs</h1>
            <p>Manage, approve and monitor job postings</p>
          </div>

          <div className="amj-admin-badge">
            <span>🛡️</span>
            <span>Admin</span>
          </div>
        </div>

        {/* Stats */}
        <div className="amj-stats">
          <div className="amj-stat-card">
            <div className="amj-stat-icon amj-icon-blue">
              💼
            </div>
            <div>
              <p>Total Jobs</p>
              <h2>{totalJobs}</h2>
            </div>
          </div>

          <div className="amj-stat-card">
            <div className="amj-stat-icon amj-icon-orange">
              ⏳
            </div>
            <div>
              <p>Pending</p>
              <h2>{pendingJobs}</h2>
            </div>
          </div>

          <div className="amj-stat-card">
            <div className="amj-stat-icon amj-icon-green">
              ✓
            </div>
            <div>
              <p>Active</p>
              <h2>{activeJobs}</h2>
            </div>
          </div>

          <div className="amj-stat-card">
            <div className="amj-stat-icon amj-icon-red">
              ✕
            </div>
            <div>
              <p>Rejected</p>
              <h2>{rejectedJobs}</h2>
            </div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="amj-content">
          <div className="amj-content-header">
            <div>
              <h2>All Job Postings</h2>
              <p>Review and manage jobs submitted by recruiters</p>
            </div>

            <button
              className="amj-refresh-btn"
              onClick={fetchJobs}
            >
              ↻ Refresh
            </button>
          </div>

          {/* Search and Filter */}
          <div className="amj-toolbar">
            <div className="amj-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search title, company, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="amj-filter"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Rejected">Rejected</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="amj-error">
              {error}
              <button onClick={fetchJobs}>Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="amj-loading">
              <div className="amj-spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : (
            <div className="amj-table-wrapper">
              <table className="amj-table">
                <thead>
                  <tr>
                    <th>JOB DETAILS</th>
                    <th>RECRUITER</th>
                    <th>LOCATION</th>
                    <th>TYPE</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="amj-empty">
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => (
                      <tr key={job._id}>
                        <td>
                          <div className="amj-job-title">
                            {job.title}
                          </div>

                          <div className="amj-company">
                            {job.company}
                          </div>
                        </td>

                        <td>
                          <div className="amj-recruiter">
                            {job.recruiter?.name || "Unknown"}
                          </div>

                          <div className="amj-email">
                            {job.recruiter?.email || ""}
                          </div>
                        </td>

                        <td>{job.location || "N/A"}</td>

                        <td>
                          <span className="amj-type">
                            {job.jobType || "N/A"}
                          </span>
                        </td>

                        <td>
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>

                        <td>
                          <span
                            className={`amj-status ${getStatusClass(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>
                        </td>

                        <td>
                          <div className="amj-actions">
                            <button
                              className="amj-view-btn"
                              title="View details"
                              onClick={() => setSelectedJob(job)}
                            >
                              👁
                            </button>

                            {job.status === "Pending" && (
                              <>
                                <button
                                  className="amj-approve-btn"
                                  title="Approve job"
                                  onClick={() =>
                                    updateJobStatus(
                                      job._id,
                                      "Active"
                                    )
                                  }
                                >
                                  ✓
                                </button>

                                <button
                                  className="amj-reject-btn"
                                  title="Reject job"
                                  onClick={() =>
                                    updateJobStatus(
                                      job._id,
                                      "Rejected"
                                    )
                                  }
                                >
                                  ✕
                                </button>
                              </>
                            )}

                            {job.status === "Rejected" && (
                              <button
                                className="amj-approve-btn"
                                title="Activate job"
                                onClick={() =>
                                  updateJobStatus(
                                    job._id,
                                    "Active"
                                  )
                                }
                              >
                                ✓
                              </button>
                            )}

                            {job.status === "Closed" && (
                              <button
                                className="amj-approve-btn"
                                title="Reopen job"
                                onClick={() =>
                                  updateJobStatus(
                                    job._id,
                                    "Active"
                                  )
                                }
                              >
                                ↻
                              </button>
                            )}

                            <button
                              className="amj-delete-btn"
                              title="Delete job"
                              onClick={() => deleteJob(job._id)}
                            >
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="amj-table-footer">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </div>
        </div>
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <div
          className="amj-modal-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="amj-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="amj-modal-header">
              <div>
                <h2>Job Details</h2>
                <p>Complete job posting information</p>
              </div>

              <button
                className="amj-close"
                onClick={() => setSelectedJob(null)}
              >
                ✕
              </button>
            </div>

            <div className="amj-modal-body">
              <h3>{selectedJob.title}</h3>
              <p className="amj-modal-company">
                {selectedJob.company}
              </p>

              <div className="amj-modal-status">
                <span
                  className={`amj-status ${getStatusClass(
                    selectedJob.status
                  )}`}
                >
                  {selectedJob.status}
                </span>
              </div>

              <div className="amj-details-grid">
                <div>
                  <label>Location</label>
                  <p>{selectedJob.location || "N/A"}</p>
                </div>

                <div>
                  <label>Job Type</label>
                  <p>{selectedJob.jobType || "N/A"}</p>
                </div>

                <div>
                  <label>Work Mode</label>
                  <p>{selectedJob.workMode || "N/A"}</p>
                </div>

                <div>
                  <label>Salary</label>
                  <p>{selectedJob.salary || "N/A"}</p>
                </div>

                <div>
                  <label>Category</label>
                  <p>{selectedJob.category || "N/A"}</p>
                </div>

                <div>
                  <label>Experience</label>
                  <p>{selectedJob.experience || "N/A"}</p>
                </div>

                <div>
                  <label>Recruiter</label>
                  <p>{selectedJob.recruiter?.name || "N/A"}</p>
                </div>

                <div>
                  <label>Recruiter Email</label>
                  <p>{selectedJob.recruiter?.email || "N/A"}</p>
                </div>

                <div>
                  <label>Posted Date</label>
                  <p>
                    {selectedJob.createdAt
                      ? new Date(
                          selectedJob.createdAt
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                <div>
                  <label>Deadline</label>
                  <p>
                    {selectedJob.deadline
                      ? new Date(
                          selectedJob.deadline
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="amj-modal-section">
                <label>Description</label>
                <p>
                  {selectedJob.description || "No description provided"}
                </p>
              </div>

              <div className="amj-modal-section">
                <label>Requirements</label>
                <p>
                  {selectedJob.requirements ||
                    "No requirements provided"}
                </p>
              </div>

              <div className="amj-modal-section">
                <label>Skills</label>
                <div className="amj-skills">
                  {selectedJob.skills?.length > 0 ? (
                    selectedJob.skills.map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))
                  ) : (
                    <span>No skills listed</span>
                  )}
                </div>
              </div>
            </div>

            <div className="amj-modal-footer">
              {selectedJob.status === "Pending" && (
                <>
                  <button
                    className="amj-modal-reject"
                    onClick={() =>
                      updateJobStatus(
                        selectedJob._id,
                        "Rejected"
                      )
                    }
                  >
                    Reject
                  </button>

                  <button
                    className="amj-modal-approve"
                    onClick={() =>
                      updateJobStatus(
                        selectedJob._id,
                        "Active"
                      )
                    }
                  >
                    Approve Job
                  </button>
                </>
              )}

              {selectedJob.status !== "Pending" && (
                <button
                  className="amj-modal-approve"
                  onClick={() =>
                    updateJobStatus(
                      selectedJob._id,
                      "Active"
                    )
                  }
                >
                  Make Active
                </button>
              )}

              <button
                className="amj-modal-delete"
                onClick={() => deleteJob(selectedJob._id)}
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManageJobs;
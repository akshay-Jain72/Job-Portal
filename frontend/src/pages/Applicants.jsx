
import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "./Applicants.css";

function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  // Fetch Applicants
  const loadApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/applications/recruiter",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page load
  useEffect(() => {
    const fetchData = async () => {
      await loadApplicants();
    };

    fetchData();
  }, []);

  // Update Application Status
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/applications/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === id
            ? { ...applicant, status }
            : applicant
        )
      );

      setSelectedApplicant((prev) =>
        prev && prev._id === id
          ? { ...prev, status }
          : prev
      );
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setUpdatingId("");
    }
  };

  // Skills Handler
  const getSkills = (skills) => {
    if (Array.isArray(skills)) return skills;

    if (typeof skills === "string") {
      return skills
        .split(",")
        .filter((skill) => skill.trim());
    }

    return [];
  };

  // Date Formatter
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Search and Filter
  const filteredApplicants = applicants.filter((applicant) => {
    const candidate = applicant.candidate || {};
    const job = applicant.job || {};
    const searchText = search.toLowerCase();

    const matchesSearch =
      (candidate.name || "")
        .toLowerCase()
        .includes(searchText) ||
      (candidate.email || "")
        .toLowerCase()
        .includes(searchText) ||
      (job.title || "")
        .toLowerCase()
        .includes(searchText);

    const matchesFilter =
      filter === "All" || applicant.status === filter;

    return matchesSearch && matchesFilter;
  });

  // Status Counts
  const statusCounts = {
    Applied: applicants.filter(
      (a) => a.status === "Applied"
    ).length,

    Shortlisted: applicants.filter(
      (a) => a.status === "Shortlisted"
    ).length,

    "Under Review": applicants.filter(
      (a) => a.status === "Under Review"
    ).length,

    Hired: applicants.filter(
      (a) => a.status === "Hired"
    ).length,

    Rejected: applicants.filter(
      (a) => a.status === "Rejected"
    ).length,
  };

  return (
    <>
      <RecruiterNavbar />

      <div className="applicants-page">
        <div className="applicants-header">
          <div>
            <h1>Applicants</h1>
            <p>
              Review and manage candidates who applied for your jobs.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="applicants-stats">
          <div className="app-stat-card">
            <span>Total Applicants</span>
            <h2>{applicants.length}</h2>
          </div>

          <div className="app-stat-card">
            <span>Applied</span>
            <h2>{statusCounts.Applied}</h2>
          </div>

          <div className="app-stat-card">
            <span>Shortlisted</span>
            <h2>{statusCounts.Shortlisted}</h2>
          </div>

          <div className="app-stat-card">
            <span>Under Review</span>
            <h2>{statusCounts["Under Review"]}</h2>
          </div>

          <div className="app-stat-card">
            <span>Hired 🎉</span>
            <h2>{statusCounts.Hired}</h2>
          </div>
        </div>

        {/* Applicants Container */}
        <div className="applicants-container">
          <div className="applicants-toolbar">
            <div>
              <h2>Candidate Applications</h2>
              <p>
                Review candidate details and application status.
              </p>
            </div>

            <div className="applicants-controls">
              <input
                type="text"
                placeholder="Search candidates or jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Hired">Hired</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="applicants-table-wrapper">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied For</th>
                  <th>Experience</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="app-empty">
                      Loading applicants...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="app-empty">
                      {error}
                      <button onClick={loadApplicants}>
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((applicant) => {
                    const candidate =
                      applicant.candidate || {};
                    const job = applicant.job || {};

                    const name =
                      candidate.name || "Unknown Candidate";
                    const email =
                      candidate.email || "No email";

                    return (
                      <tr key={applicant._id}>
                        <td>
                          <div className="app-candidate-cell">
                            <div className="app-avatar">
                              {name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .toUpperCase()}
                            </div>

                            <div>
                              <h3>{name}</h3>
                              <p>{email}</p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="app-job-name">
                            {job.title || "Job unavailable"}
                          </span>
                        </td>

                        <td>
                          {candidate.experience ||
                            "Not specified"}
                        </td>

                        <td>
                          {formatDate(applicant.createdAt)}
                        </td>

                        <td>
                          <span
                            className={`app-status ${(applicant.status || "Applied")
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`}
                          >
                            {applicant.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="app-view-btn"
                            onClick={() =>
                              setSelectedApplicant(applicant)
                            }
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}

                {!loading &&
                  !error &&
                  filteredApplicants.length === 0 && (
                    <tr>
                      <td colSpan="6" className="app-empty">
                        No applicants found.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Candidate Modal */}
        {selectedApplicant && (
          <div
            className="app-modal-overlay"
            onClick={() => setSelectedApplicant(null)}
          >
            <div
              className="app-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="app-modal-header">
                <div className="app-modal-person">
                  <div className="app-modal-avatar">
                    {(selectedApplicant.candidate?.name ||
                      "C")
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2>
                      {selectedApplicant.candidate?.name ||
                        "Candidate"}
                    </h2>

                    <p>
                      {selectedApplicant.job?.title ||
                        "Job Application"}
                    </p>
                  </div>
                </div>

                <button
                  className="app-modal-close"
                  onClick={() => setSelectedApplicant(null)}
                >
                  ×
                </button>
              </div>

              {/* Modal Body */}
              <div className="app-modal-body">
                <div className="app-detail-row">
                  <span>Email</span>
                  <strong>
                    {selectedApplicant.candidate?.email ||
                      "N/A"}
                  </strong>
                </div>

                <div className="app-detail-row">
                  <span>Mobile</span>
                  <strong>
                    {selectedApplicant.candidate?.mobile ||
                      "N/A"}
                  </strong>
                </div>

                <div className="app-detail-row">
                  <span>Location</span>
                  <strong>
                    {selectedApplicant.candidate?.location ||
                      "N/A"}
                  </strong>
                </div>

                <div className="app-detail-row">
                  <span>Experience</span>
                  <strong>
                    {selectedApplicant.candidate?.experience ||
                      "N/A"}
                  </strong>
                </div>

                <div className="app-detail-row">
                  <span>Applied Date</span>
                  <strong>
                    {formatDate(selectedApplicant.createdAt)}
                  </strong>
                </div>

                {/* Skills */}
                <div className="app-detail-section">
                  <h3>Skills</h3>

                  <div className="app-skills">
                    {getSkills(
                      selectedApplicant.candidate?.skills
                    ).length > 0 ? (
                      getSkills(
                        selectedApplicant.candidate?.skills
                      ).map((skill, index) => (
                        <span key={index}>
                          {skill.trim()}
                        </span>
                      ))
                    ) : (
                      <span>No skills added</span>
                    )}
                  </div>
                </div>

                {/* About */}
                <div className="app-detail-section">
                  <h3>About Candidate</h3>

                  <p>
                    {selectedApplicant.candidate?.about ||
                      selectedApplicant.coverLetter ||
                      "No description available."}
                  </p>
                </div>

                {/* Resume */}
                {selectedApplicant.candidate?.resume && (
                  <div className="app-detail-section">
                    <h3>Resume</h3>

                    <a
                      href={
                        selectedApplicant.candidate.resume
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Resume
                    </a>
                  </div>
                )}

                {/* Status */}
                <div className="app-detail-section">
                  <h3>Application Status</h3>

                  <select
                    value={selectedApplicant.status}
                    disabled={
                      updatingId === selectedApplicant._id
                    }
                    onChange={(e) =>
                      updateStatus(
                        selectedApplicant._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">
                      Under Review
                    </option>
                    <option value="Shortlisted">
                      Shortlisted
                    </option>
                    <option value="Hired">Hired</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  {updatingId === selectedApplicant._id && (
                    <p>Updating status...</p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="app-modal-footer">
                <button
                  className="app-reject-btn"
                  disabled={
                    updatingId === selectedApplicant._id
                  }
                  onClick={() =>
                    updateStatus(
                      selectedApplicant._id,
                      "Rejected"
                    )
                  }
                >
                  Reject
                </button>

                <button
                  className="app-shortlist-btn"
                  disabled={
                    updatingId === selectedApplicant._id
                  }
                  onClick={() =>
                    updateStatus(
                      selectedApplicant._id,
                      "Shortlisted"
                    )
                  }
                >
                  Shortlist
                </button>

                <button
                  className="app-hire-btn"
                  disabled={
                    updatingId === selectedApplicant._id ||
                    selectedApplicant.status === "Hired"
                  }
                  onClick={() =>
                    updateStatus(
                      selectedApplicant._id,
                      "Hired"
                    )
                  }
                >
                  {selectedApplicant.status === "Hired"
                    ? "Hired ✓"
                    : "Hire Candidate"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Applicants;

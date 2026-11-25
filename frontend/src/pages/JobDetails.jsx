
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CandidateNavbar from "../components/CandidateNavbar";
import "./JobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(
          `https://job-portal-backend-15s4.onrender.com/api/jobs/${id}`
        );

        setJob(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Job details load nahi hui."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    const checkSavedJob = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "Candidate") return;

      try {
        const response = await axios.get(
          "https://job-portal-backend-15s4.onrender.com/api/saved-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const isJobSaved = response.data.some(
          (item) => item.job?._id === id
        );

        setSaved(isJobSaved);
      } catch (err) {
        console.log("Saved job check failed:", err.message);
      }
    };

    checkSavedJob();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "Candidate") {
      setMessage("Sirf Candidate jobs save kar sakta hai.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      if (saved) {
        await axios.delete(
          `https://job-portal-backend-15s4.onrender.com/api/saved-jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSaved(false);
        setMessage("Job saved list se remove ho gayi.");
      } else {
        await axios.post(
          `https://job-portal-backend-15s4.onrender.com/api/saved-jobs/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSaved(true);
        setMessage("Job successfully save ho gayi!");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Save job mein error aaya."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      navigate("/login");
      return;
    }

    if (role !== "Candidate") {
      setMessage("Sirf Candidate job ke liye apply kar sakta hai.");
      return;
    }

    try {
      setApplying(true);
      setMessage("");

      const response = await axios.post(
        `https://job-portal-backend-15s4.onrender.com/api/applications/${id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplied(true);
      setMessage(
        response.data.message || "Successfully job ke liye apply ho gaya!"
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Application submit nahi hui.";

      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("applied")
      ) {
        setApplied(true);
      }

      setMessage(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <CandidateNavbar />
        <div className="job-details-state">Loading job details...</div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-details-page">
        <CandidateNavbar />
        <div className="job-details-state">
          <h2>{error || "Job not found"}</h2>
          <button onClick={() => navigate("/jobs")}>
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const skills = Array.isArray(job.skills)
    ? job.skills
    : typeof job.skills === "string"
    ? job.skills.split(",")
    : [];

  return (
    <div className="job-details-page">
      <CandidateNavbar />

      <main className="job-details-container">
        <button
          className="job-back-btn"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        <section className="job-details-header">
          <div className="job-details-company-logo">
            {(job.company || "C").charAt(0).toUpperCase()}
          </div>

          <div className="job-details-header-content">
            <h1>{job.title}</h1>
            <h3>{job.company || "Company"}</h3>

            <div className="job-details-meta">
              <span>📍 {job.location || "Not specified"}</span>
              <span>💼 {job.jobType || "Not specified"}</span>
              <span>🏢 {job.workMode || "Not specified"}</span>
              <span>💰 {job.salary || "Not specified"}</span>
            </div>
          </div>

          <div className="job-details-actions">
            <button
              className="job-details-save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : saved ? "♥ Saved" : "♡ Save Job"}
            </button>

            <button
              className="job-details-apply-btn"
              onClick={handleApply}
              disabled={applying || applied}
            >
              {applying
                ? "Applying..."
                : applied
                ? "Applied"
                : "Apply Now"}
            </button>
          </div>
        </section>

        {message && (
          <div className="job-details-message">
            {message}
          </div>
        )}

        <div className="job-details-layout">
          <section className="job-details-main">
            <div className="job-details-section">
              <h2>Job Description</h2>
              <p>{job.description || "No description available."}</p>
            </div>

            <div className="job-details-section">
              <h2>Requirements</h2>
              <p>
                {job.requirements || "No requirements provided."}
              </p>
            </div>

            <div className="job-details-section">
              <h2>Skills Required</h2>

              {skills.length > 0 ? (
                <div className="job-details-skills">
                  {skills.map((skill, index) => (
                    <span key={index}>
                      {String(skill).trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p>No skills listed.</p>
              )}
            </div>
          </section>

          <aside className="job-details-sidebar">
            <div className="job-details-section">
              <h2>Job Overview</h2>

              <div className="job-overview-item">
                <span>Job Title</span>
                <strong>{job.title || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Company</span>
                <strong>{job.company || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Category</span>
                <strong>{job.category || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Experience</span>
                <strong>{job.experience || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Job Type</span>
                <strong>{job.jobType || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Work Mode</span>
                <strong>{job.workMode || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Location</span>
                <strong>{job.location || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Salary</span>
                <strong>{job.salary || "Not specified"}</strong>
              </div>

              <div className="job-overview-item">
                <span>Posted On</span>
                <strong>
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Not specified"}
                </strong>
              </div>

              <div className="job-overview-item">
                <span>Deadline</span>
                <strong>
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "Not specified"}
                </strong>
              </div>
            </div>

            <button
              className="job-details-sidebar-apply"
              onClick={handleApply}
              disabled={applying || applied}
            >
              {applying
                ? "Applying..."
                : applied
                ? "Already Applied"
                : "Apply for this Job"}
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;

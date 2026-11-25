
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "./Jobs.css";

const API = "http://localhost:5000/api";

// Public Navbar
function PublicNavbar() {
  return (
    <nav className="jobs-public-navbar">
      <Link to="/" className="jobs-public-logo">
        <i className="fa-solid fa-briefcase"></i>
        <span>
          Job<span>Portal</span>
        </span>
      </Link>

      <div className="jobs-public-links">
        <Link to="/">Home</Link>
        <Link to="/jobs" className="active">
          Browse Jobs
        </Link>
      </div>

      <div className="jobs-public-buttons">
        <Link to="/login" className="jobs-login-link">
          Login
        </Link>
        <Link to="/register" className="jobs-register-link">
          Get Started
        </Link>
      </div>
    </nav>
  );
}

function Jobs() {
  const navigate = useNavigate();
  const routerLocation = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const isCandidateLoggedIn = Boolean(
    token && role === "Candidate"
  );

  // Read URL search parameters before initializing states
  const urlParams = new URLSearchParams(routerLocation.search);

  const [jobs, setJobs] = useState([]);

  const [search, setSearch] = useState(
    urlParams.get("search") || ""
  );

  const [location, setLocation] = useState(
    urlParams.get("location") || ""
  );

  const [jobType, setJobType] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const [applyingJob, setApplyingJob] = useState("");
  const [savingJob, setSavingJob] = useState("");

  const [message, setMessage] = useState("");

  const [expandedDescriptions, setExpandedDescriptions] = useState([]);
  const [expandedSkills, setExpandedSkills] = useState([]);

  // Fetch all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API}/jobs`);

        setJobs(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Jobs load nahi ho rahi hain. Backend check karo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch saved jobs for Candidate
  useEffect(() => {
    const fetchSavedJobs = async () => {
      const currentToken = localStorage.getItem("token");
      const currentRole = localStorage.getItem("role");

      if (!currentToken || currentRole !== "Candidate") {
        return;
      }

      try {
        const response = await axios.get(`${API}/saved-jobs`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        const savedIds = Array.isArray(response.data)
          ? response.data
              .map((item) => item.job?._id || item.job)
              .filter(Boolean)
              .map(String)
          : [];

        setSavedJobs(savedIds);
      } catch (err) {
        console.log(
          "Saved jobs load error:",
          err.response?.data?.message || err.message
        );
      }
    };

    fetchSavedJobs();
  }, []);

  // Fetch applied jobs for Candidate
  useEffect(() => {
    const fetchAppliedJobs = async () => {
      const currentToken = localStorage.getItem("token");
      const currentRole = localStorage.getItem("role");

      if (!currentToken || currentRole !== "Candidate") {
        return;
      }

      try {
        const response = await axios.get(
          `${API}/applications/my-applications`,
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );

        const appliedIds = Array.isArray(response.data)
          ? response.data
              .map(
                (application) =>
                  application.job?._id || application.job
              )
              .filter(Boolean)
              .map(String)
          : [];

        setAppliedJobs(appliedIds);
      } catch (err) {
        console.log(
          "Applied jobs load error:",
          err.response?.data?.message || err.message
        );
      }
    };

    fetchAppliedJobs();
  }, []);

  // Search and filter
  const filteredJobs = jobs.filter((job) => {
    const title = job.title || job.jobTitle || "";
    const company = job.company || job.companyName || "";
    const jobLocation = job.location || "";
    const type = job.jobType || job.type || "";

    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      company.toLowerCase().includes(search.toLowerCase());

    const matchesLocation = jobLocation
      .toLowerCase()
      .includes(location.toLowerCase());

    const matchesType =
      !jobType || type.toLowerCase() === jobType.toLowerCase();

    return matchesSearch && matchesLocation && matchesType;
  });

  // Description toggle
  const toggleDescription = (jobId) => {
    setExpandedDescriptions((prev) =>
      prev.includes(String(jobId))
        ? prev.filter((id) => id !== String(jobId))
        : [...prev, String(jobId)]
    );
  };

  // Skills toggle
  const toggleSkills = (jobId) => {
    setExpandedSkills((prev) =>
      prev.includes(String(jobId))
        ? prev.filter((id) => id !== String(jobId))
        : [...prev, String(jobId)]
    );
  };

  // Save / unsave job
  const handleSaveJob = async (job) => {
    const currentToken = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    setMessage("");

    if (!currentToken) {
      alert("Job save karne ke liye pehle login karo.");
      navigate("/login");
      return;
    }

    if (currentRole !== "Candidate") {
      setMessage("Sirf Candidate jobs save kar sakta hai.");
      return;
    }

    if (savingJob === job._id) return;

    try {
      setSavingJob(job._id);

      if (savedJobs.includes(String(job._id))) {
        await axios.delete(`${API}/saved-jobs/${job._id}`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        setSavedJobs((prev) =>
          prev.filter((id) => id !== String(job._id))
        );

        setMessage("Saved job remove ho gayi.");
      } else {
        await axios.post(
          `${API}/saved-jobs/${job._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );

        setSavedJobs((prev) =>
          prev.includes(String(job._id))
            ? prev
            : [...prev, String(job._id)]
        );

        setMessage("Job successfully save ho gayi!");
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Job save nahi ho paayi."
      );
    } finally {
      setSavingJob("");
    }
  };

  // Apply for job
  const handleApply = async (job) => {
    const currentToken = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    setMessage("");

    if (!currentToken) {
      alert("Job apply karne ke liye pehle login karo.");
      navigate("/login");
      return;
    }

    if (currentRole !== "Candidate") {
      setMessage("Sirf Candidate job ke liye apply kar sakta hai.");
      return;
    }

    if (appliedJobs.includes(String(job._id))) {
      setMessage("Tum is job ke liye pehle hi apply kar chuke ho.");
      return;
    }

    try {
      setApplyingJob(job._id);

      const response = await axios.post(
        `${API}/applications/${job._id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      setAppliedJobs((prev) =>
        prev.includes(String(job._id))
          ? prev
          : [...prev, String(job._id)]
      );

      setMessage(
        response.data.message ||
          "Job ke liye successfully apply ho gaya!"
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Application submit nahi hui.";

      if (
        errorMessage.toLowerCase().includes("already") ||
        errorMessage.toLowerCase().includes("applied")
      ) {
        setAppliedJobs((prev) =>
          prev.includes(String(job._id))
            ? prev
            : [...prev, String(job._id)]
        );
      }

      setMessage(errorMessage);
    } finally {
      setApplyingJob("");
    }
  };

  // Check saved / applied
  const isSaved = (jobId) =>
    savedJobs.includes(String(jobId));

  const isApplied = (jobId) =>
    appliedJobs.includes(String(jobId));

  // Reset filters
  const resetFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("");
    setMessage("");

    navigate("/jobs");
  };

  return (
    <div className="jobs-page">

      {/* Navbar */}
      {isCandidateLoggedIn ? (
        <CandidateNavbar />
      ) : (
        <PublicNavbar />
      )}

      {/* Hero */}
      <section className="jobs-hero">
        <div className="jobs-hero-content">
          <h1>Find Your Dream Job</h1>

          <p>
            Discover opportunities that match your skills,
            experience and career goals.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="jobs-search-section">
        <div className="jobs-search-box">

          <div className="jobs-search-field">
            <label>Job Title or Company</label>

            <input
              type="text"
              placeholder="e.g. React Developer"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="jobs-search-field">
            <label>Location</label>

            <input
              type="text"
              placeholder="e.g. Pune, Bengaluru"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="jobs-search-field">
            <label>Job Type</label>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">All Job Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <button
            type="button"
            className="jobs-reset-btn"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </section>

      {/* Jobs Content */}
      <main className="jobs-content">

        <div className="jobs-list-header">
          <div>
            <h2>Available Jobs</h2>
            <p>
              Explore opportunities from different companies.
            </p>
          </div>

          <span className="jobs-count">
            {filteredJobs.length} Jobs Found
          </span>
        </div>

        {/* Message */}
        {message && (
          <div className="jobs-state jobs-message">
            <p>{message}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="jobs-state">
            <p>Loading jobs...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="jobs-state jobs-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredJobs.length === 0 && (
          <div className="jobs-state">
            <h3>No jobs found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filteredJobs.length > 0 && (
          <div className="jobs-list">
            {filteredJobs.map((job) => {
              const jobId = String(job._id);

              const description =
                job.description || "No description available.";

              const skillsArray = job.skills
                ? Array.isArray(job.skills)
                  ? job.skills
                  : job.skills.split(",")
                : [];

              const descriptionExpanded =
                expandedDescriptions.includes(jobId);

              const skillsExpanded =
                expandedSkills.includes(jobId);

              const visibleSkills = skillsExpanded
                ? skillsArray
                : skillsArray.slice(0, 6);

              return (
                <article className="job-card" key={job._id}>

                  {/* Card Header */}
                  <div className="job-card-top">
                    <div className="job-card-heading">
                      <div className="job-company-logo">
                        {(job.company || job.companyName || "C")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="job-heading-info">
                        <h3>{job.title || job.jobTitle}</h3>

                        <p className="job-company">
                          {job.company || job.companyName || "Company"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`save-job-btn ${
                        isSaved(job._id) ? "saved" : ""
                      }`}
                      disabled={savingJob === job._id}
                      onClick={() => handleSaveJob(job)}
                    >
                      {savingJob === job._id
                        ? "Saving..."
                        : isSaved(job._id)
                        ? "♥ Saved"
                        : "♡ Save Job"}
                    </button>
                  </div>

                  {/* Details */}
                  <div className="job-details">
                    <span>
                      📍 {job.location || "Not specified"}
                    </span>

                    <span>
                      💼 {job.jobType || job.type || "Not specified"}
                    </span>

                    <span>
                      💰 {job.salary || "Not specified"}
                    </span>
                  </div>

                  {/* Description */}
                  <div className="job-description-section">
                    <p
                      className={`job-description ${
                        descriptionExpanded
                          ? "description-expanded"
                          : "description-collapsed"
                      }`}
                    >
                      {description}
                    </p>

                    {description.length > 180 && (
                      <button
                        type="button"
                        className="job-view-more-btn"
                        onClick={() => toggleDescription(jobId)}
                      >
                        {descriptionExpanded
                          ? "View Less ↑"
                          : "View More ↓"}
                      </button>
                    )}
                  </div>

                  {/* Skills */}
                  {skillsArray.length > 0 && (
                    <div className="job-skills-section">
                      <div className="job-skills">
                        {visibleSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="job-skill"
                          >
                            {String(skill).trim()}
                          </span>
                        ))}
                      </div>

                      {skillsArray.length > 6 && (
                        <button
                          type="button"
                          className="job-skills-toggle"
                          onClick={() => toggleSkills(jobId)}
                        >
                          {skillsExpanded
                            ? "Show Less Skills ↑"
                            : `+ ${skillsArray.length - 6} More Skills`}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="job-card-footer">
                    <span className="job-posted-date">
                      {job.createdAt
                        ? `Posted ${new Date(
                            job.createdAt
                          ).toLocaleDateString()}`
                        : "Available"}
                    </span>

                    <button
                      type="button"
                      className={`apply-button ${
                        isApplied(job._id)
                          ? "already-applied"
                          : ""
                      }`}
                      disabled={
                        applyingJob === job._id ||
                        isApplied(job._id)
                      }
                      onClick={() => handleApply(job)}
                    >
                      {applyingJob === job._id
                        ? "Applying..."
                        : isApplied(job._id)
                        ? "Already Applied ✓"
                        : "Apply Now"}
                    </button>
                  </div>

                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Jobs;

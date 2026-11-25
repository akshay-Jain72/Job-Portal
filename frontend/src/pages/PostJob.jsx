
import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "./PostJob.css";

const API = "http://localhost:5000/api";

const initialForm = {
  title: "",
  company: "",
  category: "",
  jobType: "",
  workMode: "",
  location: "",
  salary: "",
  experience: "",
  skills: "",
  deadline: "",
  description: "",
  requirements: "",
};

function PostJob() {
  const [formData, setFormData] = useState(initialForm);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingJobs, setFetchingJobs] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  // FETCH RECRUITER JOBS
  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        `${API}/jobs/recruiter/my-jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs(response.data);
    } catch (error) {
      console.error("Fetch jobs error:", error);
    }
  };

  // LOAD JOBS ON PAGE LOAD
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setFetchingJobs(true);
        await fetchJobs();
      } finally {
        setFetchingJobs(false);
      }
    };

    loadJobs();
  }, []);

  // FORM CHANGE
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // CANCEL FORM
  const handleCancel = () => {
    setFormData(initialForm);
    setShowForm(false);
  };

  // SUBMIT JOB
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        `${API}/jobs`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Job posted successfully. Awaiting admin approval."
      );

      setFormData(initialForm);
      setShowForm(false);

      await fetchJobs();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to post job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "Not specified";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // STATUS CLASS
  const getStatusClass = (status) => {
    const value = (status || "Pending").toLowerCase();

    if (value === "active" || value === "approved") {
      return "post-job-status-active";
    }

    if (value === "rejected") {
      return "post-job-status-rejected";
    }

    if (value === "closed") {
      return "post-job-status-closed";
    }

    return "post-job-status-pending";
  };

  return (
    <>
      <RecruiterNavbar />

      <div className="post-job-page">

        {/* HEADER */}
        <div className="post-job-header">
          <div>
            <span className="post-job-eyebrow">
              RECRUITER DASHBOARD
            </span>

            <h1>My Job Listings</h1>

            <p>
              Manage your job openings and find the right candidates
              for your company.
            </p>
          </div>

          <button
            type="button"
            className="post-job-add-btn"
            onClick={() => {
              setFormData(initialForm);
              setShowForm(true);
            }}
          >
            <span className="post-job-plus">+</span>
            Add New Job
          </button>
        </div>

        {/* STATS */}
        <div className="post-job-stats">

          {/* TOTAL JOBS */}
          <div className="post-job-stat-card">
            <div className="post-job-stat-icon blue">
              <span>▣</span>
            </div>

            <div>
              <span>Total Jobs</span>
              <h2>{jobs.length}</h2>
            </div>
          </div>

          {/* PENDING */}
          <div className="post-job-stat-card">
            <div className="post-job-stat-icon orange">
              <span>◷</span>
            </div>

            <div>
              <span>Pending Review</span>

              <h2>
                {
                  jobs.filter(
                    (job) =>
                      (job.status || "Pending").toLowerCase() ===
                      "pending"
                  ).length
                }
              </h2>
            </div>
          </div>

          {/* ACTIVE */}
          <div className="post-job-stat-card">
            <div className="post-job-stat-icon green">
              <span>✓</span>
            </div>

            <div>
              <span>Active Jobs</span>

              <h2>
                {
                  jobs.filter((job) =>
                    ["active", "approved"].includes(
                      (job.status || "").toLowerCase()
                    )
                  ).length
                }
              </h2>
            </div>
          </div>

          {/* REJECTED */}
          <div className="post-job-stat-card">
            <div className="post-job-stat-icon red">
              <span>✕</span>
            </div>

            <div>
              <span>Rejected</span>

              <h2>
                {
                  jobs.filter(
                    (job) =>
                      (job.status || "").toLowerCase() === "rejected"
                  ).length
                }
              </h2>
            </div>
          </div>

        </div>

        {/* ADD JOB FORM MODAL */}
        {showForm && (
          <div className="post-job-form-overlay">

            <div className="post-job-form-modal">

              {/* MODAL HEADER */}
              <div className="post-job-modal-header">
                <div>
                  <span className="post-job-eyebrow">
                    NEW OPPORTUNITY
                  </span>

                  <h2>Create Job Listing</h2>

                  <p>
                    Fill in the details to publish a new job opening.
                  </p>
                </div>

                <button
                  type="button"
                  className="post-job-close-btn"
                  onClick={handleCancel}
                  aria-label="Close form"
                >
                  ×
                </button>
              </div>

              {/* FORM */}
              <form
                className="post-job-form"
                onSubmit={handleSubmit}
              >

                {/* BASIC INFORMATION */}
                <div className="post-job-section">

                  <div className="post-job-section-heading">
                    <span className="post-job-section-number">
                      01
                    </span>

                    <div>
                      <h3>Basic Information</h3>
                      <p>
                        Enter the essential details of this job.
                      </p>
                    </div>
                  </div>

                  <div className="post-job-grid">

                    {/* TITLE */}
                    <div className="post-job-field full-width">
                      <label>Job Title *</label>

                      <input
                        type="text"
                        name="title"
                        placeholder="e.g. Frontend Developer"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* COMPANY */}
                    <div className="post-job-field">
                      <label>Company Name *</label>

                      <input
                        type="text"
                        name="company"
                        placeholder="Enter company name"
                        value={formData.company}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* CATEGORY */}
                    <div className="post-job-field">
                      <label>Job Category *</label>

                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        <option value="IT & Software">
                          IT & Software
                        </option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                        <option value="Customer Support">
                          Customer Support
                        </option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* JOB TYPE */}
                    <div className="post-job-field">
                      <label>Job Type *</label>

                      <select
                        name="jobType"
                        value={formData.jobType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select job type</option>
                        <option value="Full Time">Full Time</option>
                        <option value="Part Time">Part Time</option>
                        <option value="Internship">Internship</option>
                        <option value="Contract">Contract</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>

                    {/* WORK MODE */}
                    <div className="post-job-field">
                      <label>Work Mode *</label>

                      <select
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select work mode</option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    {/* LOCATION */}
                    <div className="post-job-field">
                      <label>Job Location *</label>

                      <input
                        type="text"
                        name="location"
                        placeholder="e.g. Pune, Maharashtra"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* SALARY */}
                    <div className="post-job-field">
                      <label>Salary Range</label>

                      <input
                        type="text"
                        name="salary"
                        placeholder="e.g. 4 LPA - 6 LPA"
                        value={formData.salary}
                        onChange={handleChange}
                      />
                    </div>

                    {/* EXPERIENCE */}
                    <div className="post-job-field">
                      <label>Experience Required *</label>

                      <select
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select experience</option>
                        <option value="Fresher">Fresher</option>
                        <option value="0-1 Years">0-1 Years</option>
                        <option value="1-3 Years">1-3 Years</option>
                        <option value="3-5 Years">3-5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    </div>

                    {/* DEADLINE */}
                    <div className="post-job-field">
                      <label>Application Deadline *</label>

                      <input
                        type="date"
                        name="deadline"
                        min={
                          new Date().toISOString().split("T")[0]
                        }
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    {/* SKILLS */}
                    <div className="post-job-field full-width">
                      <label>Required Skills *</label>

                      <input
                        type="text"
                        name="skills"
                        placeholder="React, JavaScript, HTML, CSS"
                        value={formData.skills}
                        onChange={handleChange}
                        required
                      />

                      <span className="post-job-hint">
                        Separate skills with commas.
                      </span>
                    </div>

                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="post-job-section">

                  <div className="post-job-section-heading">
                    <span className="post-job-section-number">
                      02
                    </span>

                    <div>
                      <h3>Job Description</h3>
                      <p>
                        Describe the role and responsibilities.
                      </p>
                    </div>
                  </div>

                  <div className="post-job-field full-width">
                    <label>Description *</label>

                    <textarea
                      name="description"
                      placeholder="Write the job description..."
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

                {/* REQUIREMENTS */}
                <div className="post-job-section">

                  <div className="post-job-section-heading">
                    <span className="post-job-section-number">
                      03
                    </span>

                    <div>
                      <h3>Requirements</h3>
                      <p>
                        Specify qualifications and expectations.
                      </p>
                    </div>
                  </div>

                  <div className="post-job-field full-width">
                    <label>Job Requirements *</label>

                    <textarea
                      name="requirements"
                      placeholder="Enter qualifications, responsibilities and requirements..."
                      rows="5"
                      value={formData.requirements}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>

                {/* BUTTONS */}
                <div className="post-job-submit-area">

                  <button
                    type="button"
                    className="post-job-cancel"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="post-job-submit"
                    disabled={loading}
                  >
                    {loading ? "Publishing..." : "Publish Job"}
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}

        {/* JOB LIST */}
        <div className="post-job-list-section">

          <div className="post-job-list-header">
            <div>
              <h2>Your Job Listings</h2>

              <p>
                View and track the jobs you've posted.
              </p>
            </div>

            <span className="post-job-count">
              {jobs.length} Jobs
            </span>
          </div>

          {/* LOADING */}
          {fetchingJobs ? (
            <div className="post-job-loading">
              <div className="post-job-spinner"></div>
              <p>Loading your jobs...</p>
            </div>
          ) : jobs.length === 0 ? (

            /* EMPTY */
            <div className="post-job-empty">

              <div className="post-job-empty-icon">
                ▣
              </div>

              <h3>No jobs posted yet</h3>

              <p>
                Start hiring by creating your first job listing.
              </p>

              <button
                type="button"
                className="post-job-add-btn"
                onClick={() => {
                  setFormData(initialForm);
                  setShowForm(true);
                }}
              >
                <span className="post-job-plus">+</span>
                Post Your First Job
              </button>

            </div>
          ) : (

            /* JOB CARDS */
            <div className="post-job-cards">

              {jobs.map((job) => (

                <div
                  className="post-job-card"
                  key={job._id}
                >

                  <div className="post-job-card-top">

                    <div className="post-job-card-icon">
                      {job.company?.charAt(0)?.toUpperCase() || "J"}
                    </div>

                    <span
                      className={`post-job-status ${getStatusClass(
                        job.status
                      )}`}
                    >
                      {job.status || "Pending"}
                    </span>

                  </div>

                  <div className="post-job-card-content">

                    <h3>{job.title}</h3>

                    <p className="post-job-card-company">
                      {job.company}
                    </p>

                    {/* JOB DETAILS */}
                    <div className="post-job-card-details">

                      <span>
                        <span className="post-job-detail-icon">
                          ⌖
                        </span>
                        {job.location || "Location not specified"}
                      </span>

                      <span>
                        <span className="post-job-detail-icon">
                          ◷
                        </span>
                        {job.jobType || "Job type not specified"}
                      </span>

                      <span>
                        <span className="post-job-detail-icon">
                          ⌘
                        </span>
                        {job.workMode || "Work mode not specified"}
                      </span>

                      <span>
                        <span className="post-job-detail-icon">
                          ♙
                        </span>
                        {job.experience || "Experience not specified"}
                      </span>

                    </div>

                    {/* SALARY AND DEADLINE */}
                    <div className="post-job-card-bottom">

                      <div className="post-job-card-salary">
                        {job.salary || "Salary not disclosed"}
                      </div>

                      <span className="post-job-deadline">
                        Deadline: {formatDate(job.deadline)}
                      </span>

                    </div>

                    {/* SKILLS */}
                    {job.skills && (
                      <div className="post-job-card-skills">

                        {(Array.isArray(job.skills)
                          ? job.skills
                          : job.skills.split(",")
                        )
                          .slice(0, 5)
                          .map((skill, index) => (
                            <span key={index}>
                              {String(skill).trim()}
                            </span>
                          ))}

                      </div>
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </>
  );
}

export default PostJob;

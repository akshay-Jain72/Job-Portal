
import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "./ManageJobs.css";

function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editJob, setEditJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");

  // FETCH RECRUITER JOBS
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          "https://job-portal-backend-15s4.onrender.com/api/jobs/recruiter/my-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJobs(response.data);
      } catch (error) {
        alert(error.response?.data?.message || "Failed to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [token]);

  // SEARCH AND FILTER
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "All" || job.status === filter;

    return matchesSearch && matchesFilter;
  });

  // DELETE JOB
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`https://job-portal-backend-15s4.onrender.com/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs((prev) => prev.filter((job) => job._id !== id));

      alert("Job deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete job");
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (job) => {
    setEditJob({
      ...job,
      title: job.title || "",
      company: job.company || "",
      category: job.category || "",
      jobType: job.jobType || "",
      workMode: job.workMode || "",
      location: job.location || "",
      salary: job.salary || "",
      experience: job.experience || "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : job.skills || "",
      deadline: job.deadline
        ? new Date(job.deadline).toISOString().split("T")[0]
        : "",
      description: job.description || "",
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join("\n")
        : job.requirements || "",
    });
  };

  // HANDLE EDIT INPUTS
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SAVE EDITED JOB
  const handleEditSave = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const updatedData = {
        title: editJob.title,
        company: editJob.company,
        category: editJob.category,
        jobType: editJob.jobType,
        workMode: editJob.workMode,
        location: editJob.location,
        salary: editJob.salary,
        experience: editJob.experience,
        skills: editJob.skills,
        deadline: editJob.deadline,
        description: editJob.description,
        requirements: editJob.requirements,
      };

      const response = await axios.put(
        `https://job-portal-backend-15s4.onrender.com/api/jobs/${editJob._id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJobs((prev) =>
        prev.map((job) =>
          job._id === editJob._id
            ? {
                ...job,
                ...(response.data.job || {}),
                ...updatedData,
                status: "Pending",
              }
            : job
        )
      );

      setEditJob(null);

      alert("Job updated successfully. It is awaiting admin approval.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <RecruiterNavbar />

      <div className="manage-jobs-page">
        <div className="manage-jobs-header">
          <div>
            <h1>Manage Jobs</h1>
            <p>Manage, edit and track your job postings.</p>
          </div>
        </div>

        {/* JOB STATS */}
        <div className="manage-jobs-stats">
          <div className="mj-stat">
            <span>Total Jobs</span>
            <h2>{jobs.length}</h2>
          </div>

          <div className="mj-stat">
            <span>Active Jobs</span>
            <h2>{jobs.filter((job) => job.status === "Active").length}</h2>
          </div>

          <div className="mj-stat">
            <span>Pending Jobs</span>
            <h2>{jobs.filter((job) => job.status === "Pending").length}</h2>
          </div>

          <div className="mj-stat">
            <span>Closed Jobs</span>
            <h2>{jobs.filter((job) => job.status === "Closed").length}</h2>
          </div>
        </div>

        {/* JOB TABLE */}
        <div className="manage-jobs-container">
          <div className="manage-jobs-toolbar">
            <div>
              <h2>Your Job Listings</h2>
              <p>Manage all your posted vacancies.</p>
            </div>

            <div className="manage-jobs-controls">
              <input
                type="text"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Jobs</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="manage-jobs-table-wrapper">
            <table className="manage-jobs-table">
              <thead>
                <tr>
                  <th>Job Details</th>
                  <th>Location</th>
                  <th>Job Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="mj-empty">
                      Loading jobs...
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <div className="mj-job-title">{job.title}</div>
                        <div className="mj-company">{job.company}</div>
                      </td>

                      <td>{job.location}</td>

                      <td>{job.jobType}</td>

                      <td>
                        <span
                          className={`mj-status ${
                            job.status === "Active"
                              ? "mj-active"
                              : "mj-closed"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td>
                        <div className="mj-actions">
                          <button
                            type="button"
                            className="mj-edit-btn"
                            onClick={() => openEditModal(job)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="mj-delete-btn"
                            onClick={() => handleDelete(job._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}

                {!loading && filteredJobs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="mj-empty">
                      No jobs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* EDIT MODAL */}
        {editJob && (
          <div className="mj-modal-overlay">
            <div className="mj-modal">
              <div className="mj-modal-header">
                <h2>Edit Job</h2>

                <button
                  type="button"
                  className="mj-modal-close"
                  onClick={() => setEditJob(null)}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEditSave}>
                {/* JOB TITLE */}
                <div className="mj-modal-field">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editJob.title}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                {/* COMPANY */}
                <div className="mj-modal-field">
                  <label>Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={editJob.company}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                {/* CATEGORY */}
                <div className="mj-modal-field">
                  <label>Job Category *</label>
                  <select
                    name="category"
                    value={editJob.category}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="HR">HR</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* JOB TYPE */}
                <div className="mj-modal-field">
                  <label>Job Type *</label>
                  <select
                    name="jobType"
                    value={editJob.jobType}
                    onChange={handleEditChange}
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
                <div className="mj-modal-field">
                  <label>Work Mode *</label>
                  <select
                    name="workMode"
                    value={editJob.workMode}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select work mode</option>
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* LOCATION */}
                <div className="mj-modal-field">
                  <label>Job Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={editJob.location}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                {/* SALARY */}
                <div className="mj-modal-field">
                  <label>Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={editJob.salary}
                    onChange={handleEditChange}
                    placeholder="e.g. 4 LPA - 6 LPA"
                  />
                </div>

                {/* EXPERIENCE */}
                <div className="mj-modal-field">
                  <label>Experience Required *</label>
                  <select
                    name="experience"
                    value={editJob.experience}
                    onChange={handleEditChange}
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
                <div className="mj-modal-field">
                  <label>Application Deadline *</label>
                  <input
                    type="date"
                    name="deadline"
                    min={new Date().toISOString().split("T")[0]}
                    value={editJob.deadline}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                {/* SKILLS */}
                <div className="mj-modal-field">
                  <label>Required Skills *</label>
                  <input
                    type="text"
                    name="skills"
                    value={editJob.skills}
                    onChange={handleEditChange}
                    placeholder="React, JavaScript, HTML, CSS"
                    required
                  />
                  <small>Separate skills with commas.</small>
                </div>

                {/* DESCRIPTION */}
                <div className="mj-modal-field">
                  <label>Description *</label>
                  <textarea
                    name="description"
                    rows="7"
                    value={editJob.description}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                {/* REQUIREMENTS */}
                <div className="mj-modal-field">
                  <label>Job Requirements *</label>
                  <textarea
                    name="requirements"
                    rows="6"
                    value={editJob.requirements}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                {/* ACTIONS */}
                <div className="mj-modal-actions">
                  <button
                    type="button"
                    className="mj-modal-cancel"
                    onClick={() => setEditJob(null)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="mj-modal-save"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ManageJobs;

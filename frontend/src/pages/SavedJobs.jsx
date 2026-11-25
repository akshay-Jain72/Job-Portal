
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "./SavedJobs.css";

function SavedJobs() {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchSavedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://job-portal-backend-15s4.onrender.com/api/saved-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedJobs(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to load saved jobs."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
  const loadJobs = async () => {
    await fetchSavedJobs();
  };

  loadJobs();
}, [fetchSavedJobs]);

  const removeSavedJob = async (jobId) => {
    try {
      await axios.delete(
        `https://job-portal-backend-15s4.onrender.com/api/saved-jobs/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedJobs((previousJobs) =>
        previousJobs.filter((savedJob) => savedJob.job?._id !== jobId)
      );

      if (selectedJob?.job?._id === jobId) {
        setSelectedJob(null);
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to remove saved job."
      );
    }
  };

  const filteredJobs = savedJobs.filter((savedJob) => {
    const job = savedJob.job;

    if (!job) return false;

    const searchText = search.toLowerCase();

    return (
      job.title?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="saved-jobs-page">
      <CandidateNavbar />

      <main className="saved-jobs-main">
        <section className="saved-jobs-header">
          <div>
            <h1>Saved Jobs</h1>
            <p>Keep track of jobs you are interested in applying for.</p>
          </div>

          <div className="saved-jobs-count">
            <span>Saved Jobs</span>
            <strong>{savedJobs.length}</strong>
          </div>
        </section>

        <section className="saved-jobs-search">
          <input
            type="text"
            placeholder="Search job title, company or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        <section className="saved-jobs-content">
          <div className="saved-jobs-heading">
            <h2>Your Saved Jobs</h2>
            <span>{filteredJobs.length} jobs</span>
          </div>

          {loading ? (
            <div className="saved-jobs-empty">
              <h3>Loading saved jobs...</h3>
            </div>
          ) : error ? (
            <div className="saved-jobs-empty">
              <h3>{error}</h3>
              <button
                className="saved-jobs-browse-btn"
                onClick={fetchSavedJobs}
              >
                Retry
              </button>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="saved-jobs-empty">
              <div className="saved-jobs-empty-icon">🔖</div>

              <h3>
                {savedJobs.length === 0
                  ? "No saved jobs yet"
                  : "No jobs found"}
              </h3>

              <p>
                {savedJobs.length === 0
                  ? "Save interesting jobs to keep track of them here."
                  : "Try searching with another job title or company."}
              </p>

              {savedJobs.length === 0 && (
                <button
                  onClick={() => navigate("/jobs")}
                  className="saved-jobs-browse-btn"
                >
                  Browse Jobs
                </button>
              )}
            </div>
          ) : (
            <div className="saved-jobs-list">
              {filteredJobs.map((savedJob) => {
                const job = savedJob.job;

                return (
                  <article className="saved-job-card" key={savedJob._id}>
                    <div className="saved-job-top">
                      <div className="saved-job-logo">
                        {job.company?.charAt(0).toUpperCase() || "J"}
                      </div>

                      <div className="saved-job-info">
                        <h3>{job.title}</h3>
                        <p>{job.company}</p>
                      </div>

                      <button
                        className="saved-job-remove"
                        title="Remove saved job"
                        onClick={() => removeSavedJob(job._id)}
                      >
                        <span>🔖</span>
                        <span>Remove</span>
                      </button>
                    </div>

                    <div className="saved-job-details">
                      <span>📍 {job.location || "Not specified"}</span>
                      <span>💼 {job.jobType || "Not specified"}</span>
                      <span>💰 {job.salary || "Not specified"}</span>
                    </div>

                    <p className="saved-job-description">
                      {job.description || "No job description available."}
                    </p>

                    <div className="saved-job-skills">
                      {(job.skills || []).map((skill, index) => (
                        <span key={index}>{skill}</span>
                      ))}
                    </div>

                    <div className="saved-job-footer">
                      <p>
                        Saved on{" "}
                        <strong>
                          {savedJob.savedAt
                            ? new Date(savedJob.savedAt).toLocaleDateString()
                            : "Recently"}
                        </strong>
                      </p>

                      <div className="saved-job-actions">
                        <button
                          className="saved-job-view-btn"
                          onClick={() => setSelectedJob(savedJob)}
                        >
                          View Details
                        </button>

                        <button
                          className="saved-job-apply-btn"
                          onClick={() =>
                            navigate("/jobs", {
                              state: { selectedJob: job },
                            })
                          }
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {selectedJob && (
        <div
          className="saved-job-modal-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="saved-job-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="saved-job-modal-close"
              onClick={() => setSelectedJob(null)}
            >
              &times;
            </button>

            <h2>{selectedJob.job?.title}</h2>
            <h3>{selectedJob.job?.company}</h3>

            <div className="saved-job-modal-info">
              <p>📍 {selectedJob.job?.location}</p>
              <p>💼 {selectedJob.job?.jobType}</p>
              <p>💰 {selectedJob.job?.salary}</p>
              <p>
                🔖 Saved on{" "}
                {selectedJob.savedAt
                  ? new Date(selectedJob.savedAt).toLocaleDateString()
                  : "Recently"}
              </p>
            </div>

            <h4>Required Skills</h4>

            <div className="saved-job-skills modal-skills">
              {(selectedJob.job?.skills || []).map((skill, index) => (
                <span key={index}>{skill}</span>
              ))}
            </div>

            <h4>Job Description</h4>

            <p className="saved-job-modal-description">
              {selectedJob.job?.description || "No description available."}
            </p>

            <button
              className="saved-job-modal-apply"
              onClick={() => {
                const job = selectedJob.job;
                setSelectedJob(null);
                navigate("/jobs", { state: { selectedJob: job } });
              }}
            >
              Go to Browse Jobs
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedJobs;

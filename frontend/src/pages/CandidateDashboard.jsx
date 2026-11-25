import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "./CandidateDashboard.css";


function CandidateDashboard() {
  const navigate = useNavigate();


  const [dashboard, setDashboard] = useState({
    totalApplications: 0,
    shortlistedApplications: 0,
    pendingApplications: 0,
    hiredApplications: 0,
    profileCompletion: 0,
    profile: null,
  });


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");


        const response = await axios.get(
          "https://job-portal-backend-15s4.onrender.com/api/applications/candidate/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );


        setDashboard((prev) => ({
          ...prev,
          ...response.data,
        }));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Dashboard data load nahi ho saka."
        );
      } finally {
        setLoading(false);
      }
    };


    fetchDashboard();
  }, []);


  const candidateName =
    dashboard.profile?.name ||
    localStorage.getItem("name") ||
    "Candidate";


  return (
    <div className="candidate-dashboard">
      <CandidateNavbar />


      <main className="candidate-main">
        {/* Welcome Section */}
        <section className="candidate-welcome">
          <div className="candidate-welcome-text">
            <span className="candidate-welcome-label">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              CANDIDATE DASHBOARD
            </span>


            <h1>Welcome, {candidateName}!</h1>


            <p>
              Find your dream job and take the next step in your career.
            </p>
          </div>


          <button
            className="candidate-explore-btn"
            onClick={() => navigate("/jobs")}
          >
            <span>Explore Jobs</span>
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
        </section>


        {/* Loading */}
        {loading && (
          <div className="candidate-dashboard-state">
            <div className="candidate-loader"></div>
            <p>Loading dashboard...</p>
          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="candidate-dashboard-state candidate-error">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <p>{error}</p>


            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        )}


        {/* Dashboard */}
        {!loading && !error && (
          <>
            <section className="candidate-stats">


              {/* Applied Jobs */}
              <div className="candidate-stat-card applied-card">
                <div className="candidate-stat-top">
                  <div className="candidate-stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                      <path d="M2 13h20" />
                    </svg>
                  </div>


                  <span className="candidate-stat-tag">
                    Applications
                  </span>
                </div>


                <h3>Applied Jobs</h3>


                <div className="candidate-stat-number">
                  {dashboard.totalApplications ?? 0}
                </div>


                <p>Total applications submitted</p>


                <button
                  onClick={() => navigate("/my-applications")}
                >
                  View Applications
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


              {/* Shortlisted */}
              <div className="candidate-stat-card shortlisted-card">
                <div className="candidate-stat-top">
                  <div className="candidate-stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>


                  <span className="candidate-stat-tag">
                    Selected
                  </span>
                </div>


                <h3>Shortlisted</h3>


                <div className="candidate-stat-number">
                  {dashboard.shortlistedApplications ?? 0}
                </div>


                <p>Applications shortlisted</p>


                <button
                  onClick={() => navigate("/my-applications")}
                >
                  View Status
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


              {/* In Progress */}
              <div className="candidate-stat-card progress-card">
                <div className="candidate-stat-top">
                  <div className="candidate-stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>


                  <span className="candidate-stat-tag">
                    Pending
                  </span>
                </div>


                <h3>In Progress</h3>


                <div className="candidate-stat-number">
                  {dashboard.pendingApplications ?? 0}
                </div>


                <p>Waiting for recruiter response</p>


                <button
                  onClick={() => navigate("/my-applications")}
                >
                  Track Applications
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


              {/* Hired */}
              <div className="candidate-stat-card hired-card">
                <div className="candidate-stat-top">
                  <div className="candidate-stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>


                  <span className="candidate-stat-tag">
                    Success
                  </span>
                </div>


                <h3>Hired</h3>


                <div className="candidate-stat-number">
                  {dashboard.hiredApplications ?? 0}
                </div>


                <p>Applications with hired status</p>


                <button
                  onClick={() => navigate("/my-applications")}
                >
                  View Results
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


              {/* Profile Completion */}
              <div className="candidate-stat-card profile-card">
                <div className="candidate-stat-top">
                  <div className="candidate-stat-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>


                  <span className="candidate-stat-tag">
                    Profile
                  </span>
                </div>


                <h3>Profile Completion</h3>


                <div className="candidate-stat-number">
                  {dashboard.profileCompletion ?? 0}%
                </div>


                <div className="candidate-progress-track">
                  <div
                    className="candidate-progress-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          Number(dashboard.profileCompletion) || 0
                        )
                      )}%`,
                    }}
                  ></div>
                </div>


                <p>Complete your professional profile</p>


                <button onClick={() => navigate("/profile")}>
                  Edit Profile
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


            </section>


            {/* Career Section */}
            <section className="candidate-career-section">
              <div className="candidate-career-content">
                <span className="candidate-career-label">
                  BUILD YOUR FUTURE
                </span>


                <h2>Your Career Starts Here</h2>


                <p>
                  Create a strong profile, explore opportunities
                  and connect with employers who are looking
                  for your skills.
                </p>


                <button
                  onClick={() => navigate("/profile")}
                  className="candidate-profile-btn"
                >
                  Complete Your Profile
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


              <div className="candidate-career-illustration">
                <div className="candidate-career-circle">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                </div>
              </div>
            </section>


            {/* Tips */}
            <section className="candidate-tips">
              <div className="candidate-tips-heading">
                <h2>Tips to get hired faster</h2>


                <p>
                  Small steps that can make a big difference
                </p>
              </div>


              <div className="candidate-tips-grid">


                <div className="candidate-tip">
                  <div className="candidate-tip-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>


                  <h3>Complete your profile</h3>


                  <p>
                    Add your skills, education and professional
                    details to make your profile stand out.
                  </p>
                </div>


                <div className="candidate-tip">
                  <div className="candidate-tip-icon">
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
                  </div>


                  <h3>Apply regularly</h3>


                  <p>
                    Search for relevant jobs and apply to
                    suitable positions regularly.
                  </p>
                </div>


                <div className="candidate-tip">
                  <div className="candidate-tip-icon">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                    </svg>
                  </div>


                  <h3>Keep your skills updated</h3>


                  <p>
                    Add new technologies and skills as you
                    learn and grow.
                  </p>
                </div>


              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}


export default CandidateDashboard;
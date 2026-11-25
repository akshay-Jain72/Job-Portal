import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);


    try {
      const response = await API.post("/login", {
        email,
        password,
      });


      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);


      const role = response.data.role;


      if (role === "Candidate") {
        navigate("/candidate-dashboard");
      } else if (role === "Recruiter") {
        navigate("/recruiter-dashboard");
      } else if (role === "Admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-container">
      <div className="login-visual">
        <div className="login-visual-content">
          <div className="login-logo">
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


          <h1>Welcome Back to Your Career</h1>
          <p>
            Login to continue applying for jobs, managing applications and
            connecting with recruiters.
          </p>


          <div className="login-visual-points">
            <div className="visual-point">
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
              <span>Access your job applications</span>
            </div>


            <div className="visual-point">
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
              <span>Discover new opportunities</span>
            </div>


            <div className="visual-point">
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
              <span>Secure and simple login</span>
            </div>
          </div>
        </div>
      </div>


      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-header">
            <h2>Welcome Back</h2>
            <p className="login-subtitle">Login to your account</p>
          </div>


          {error && (
            <div className="error-message">
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
              <span>{error}</span>
            </div>
          )}


          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 6L2 7" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>


          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>


          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner"></span>
                Logging in...
              </>
            ) : (
              <>
                Login
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
              </>
            )}
          </button>


          <div className="login-divider">
            <span>Don't have an account?</span>
          </div>


          <Link to="/register" className="register-link">
            Create a new account
          </Link>


          <Link to="/" className="back-home-link">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Home
          </Link>
        </form>
      </div>
    </div>
  );
}


export default Login;
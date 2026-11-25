
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateNavbar from "../components/CandidateNavbar";
import "./CandidateProfile.css";

const API = "http://localhost:5000/api/profile";

function CandidateProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    headline: "",
    location: "",
    skills: "",
    education: "",
    experience: "",
    about: "",
  });

  const [resumePath, setResumePath] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [profileExists, setProfileExists] = useState(false);
  const [editing, setEditing] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(API, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;

        const data = {
          name: user.name || "",
          mobile: user.mobile || "",
          headline: user.headline || "",
          location: user.location || "",
          skills: Array.isArray(user.skills)
            ? user.skills.join(", ")
            : "",
          education: user.education || "",
          experience: user.experience || "",
          about: user.about || "",
        };

        setFormData(data);
        setResumePath(user.resume || "");

        // Check whether candidate profile details exist
        const hasProfileDetails = Boolean(
          user.headline ||
          user.location ||
          user.education ||
          user.experience ||
          user.about ||
          (user.skills && user.skills.length > 0)
        );

        setProfileExists(hasProfileDetails);
        setEditing(!hasProfileDetails);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Profile load nahi hua."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Resume selection
  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    setMessage("");
    setSelectedResume(null);

    if (!file) return;

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setMessage("Sirf PDF file select karo.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Resume ka size 5 MB se kam hona chahiye.");
      e.target.value = "";
      return;
    }

    setSelectedResume(file);
  };

  // Upload Resume
  const handleResumeUpload = async () => {
    if (!selectedResume) {
      setMessage("Pehle PDF resume select karo.");
      return;
    }

    setUploading(true);
    setMessage("");

    try {
      const uploadData = new FormData();
      uploadData.append("resume", selectedResume);

      const response = await axios.post(
        `${API}/resume`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResumePath(response.data.resume);
      setSelectedResume(null);
      setMessage("Resume uploaded successfully!");

      const fileInput = document.getElementById("resume-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Resume upload nahi hua."
      );
    } finally {
      setUploading(false);
    }
  };

  // Save Profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const dataToSend = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await axios.put(
        API,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(
        response.data.message || "Profile saved successfully!"
      );

      localStorage.setItem("name", formData.name);

      setProfileExists(true);
      setEditing(false);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Profile update nahi hua."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = () => {
    setMessage("");
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setMessage("");
    setEditing(false);
  };

  const resumeUrl = resumePath
    ? `http://localhost:5000${resumePath}`
    : "";

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <CandidateNavbar />

      <div className="profile-container">
        <div className="profile-heading">
          <div>
            <h1>My Profile</h1>
            <p>Manage your personal and professional information.</p>
          </div>
        </div>

        {/* PROFILE VIEW MODE */}
        {!editing && profileExists && (
          <div className="candidate-profile-view">
            <div className="candidate-profile-view-header">
              <div className="candidate-profile-avatar">
                {formData.name?.charAt(0)?.toUpperCase() || "C"}
              </div>

              <div className="candidate-profile-title">
                <h2>{formData.name}</h2>
                <p>
                  {formData.headline || "Professional Profile"}
                </p>
                {formData.location && (
                  <span>{formData.location}</span>
                )}
              </div>

              <button
                className="profile-save"
                type="button"
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            </div>

            <div className="candidate-profile-view-section">
              <h3>Personal Information</h3>

              <div className="candidate-profile-view-grid">
                <div>
                  <strong>Full Name</strong>
                  <p>{formData.name || "Not added"}</p>
                </div>

                <div>
                  <strong>Mobile Number</strong>
                  <p>{formData.mobile || "Not added"}</p>
                </div>

                <div>
                  <strong>Professional Headline</strong>
                  <p>{formData.headline || "Not added"}</p>
                </div>

                <div>
                  <strong>Location</strong>
                  <p>{formData.location || "Not added"}</p>
                </div>
              </div>
            </div>

            <div className="candidate-profile-view-section">
              <h3>Professional Details</h3>

              <div className="candidate-profile-view-grid">
                <div>
                  <strong>Skills</strong>
                  <p>{formData.skills || "Not added"}</p>
                </div>

                <div>
                  <strong>Education</strong>
                  <p>{formData.education || "Not added"}</p>
                </div>

                <div>
                  <strong>Experience</strong>
                  <p>{formData.experience || "Not added"}</p>
                </div>
              </div>
            </div>

            <div className="candidate-profile-view-section">
              <h3>About Me</h3>
              <p className="candidate-profile-about">
                {formData.about || "About information not added."}
              </p>
            </div>

            <div className="candidate-profile-view-section">
              <h3>Resume</h3>

              {resumePath ? (
                <div className="candidate-resume-actions">
                  <span>PDF Resume uploaded</span>

                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="candidate-resume-btn"
                  >
                    View Resume
                  </a>

                  <a
                    href={resumeUrl}
                    download
                    className="candidate-resume-btn candidate-resume-download"
                  >
                    Download Resume
                  </a>
                </div>
              ) : (
                <p>No resume uploaded.</p>
              )}
            </div>

            {message && (
              <div className="profile-message">{message}</div>
            )}

            <div className="profile-actions">
              <button
                type="button"
                className="profile-cancel"
                onClick={() => navigate("/candidate-dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* PROFILE CREATE / EDIT MODE */}
        {editing && (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="profile-section">
              <h2>Personal Information</h2>

              <div className="profile-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label>Mobile Number</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="profile-field">
                  <label>Professional Headline</label>
                  <input
                    type="text"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g. MERN Stack Developer"
                  />
                </div>

                <div className="profile-field">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h2>Professional Details</h2>

              <div className="profile-field">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, Node.js, MongoDB, JavaScript"
                />
                <small>Skills ko comma (,) se separate karo.</small>
              </div>

              <div className="profile-field">
                <label>Education</label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g. BE Computer Science"
                />
              </div>

              <div className="profile-field">
                <label>Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Describe your work experience..."
                  rows="3"
                />
              </div>

              <div className="profile-field">
                <label>Upload Resume (PDF)</label>

                <input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleResumeChange}
                />

                <small>PDF only. Maximum file size: 5 MB.</small>

                {selectedResume && (
                  <p>Selected: {selectedResume.name}</p>
                )}

                <button
                  type="button"
                  className="profile-save"
                  onClick={handleResumeUpload}
                  disabled={uploading || !selectedResume}
                >
                  {uploading ? "Uploading..." : "Upload Resume"}
                </button>

                {resumePath && (
                  <div className="candidate-resume-actions">
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="candidate-resume-btn"
                    >
                      View Existing Resume
                    </a>

                    <a
                      href={resumeUrl}
                      download
                      className="candidate-resume-btn candidate-resume-download"
                    >
                      Download Resume
                    </a>
                  </div>
                )}
              </div>

              <div className="profile-field">
                <label>About Me</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Write something about yourself..."
                  rows="5"
                />
              </div>
            </div>

            {message && (
              <div className="profile-message">{message}</div>
            )}

            <div className="profile-actions">
              {profileExists && (
                <button
                  type="button"
                  className="profile-cancel"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              )}

              <button
                type="button"
                className="profile-cancel"
                onClick={() => navigate("/candidate-dashboard")}
              >
                Dashboard
              </button>

              <button
                type="submit"
                className="profile-save"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CandidateProfile;

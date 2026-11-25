
import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "./RecruiterProfile.css";

const API = "http://localhost:5000/api";

// LOGO PREVIEW
function LogoPreview({ logo, companyName, size = "large" }) {
  return (
    <div className={`company-logo-preview ${size}`}>
      {logo ? (
        <img
          src={logo}
          alt="Company Logo"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span>
          {companyName
            ? companyName.charAt(0).toUpperCase()
            : "C"}
        </span>
      )}
    </div>
  );
}

function RecruiterProfile() {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    recruiterName: "",
    email: "",
    phone: "",
    companyName: "",
    website: "",
    industry: "",
    location: "",
    companySize: "",
    logo: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // AUTH HEADERS
  const getHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  // FETCH PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!token) {
          setError("Please login again. Token not found.");
          return;
        }

        const response = await axios.get(`${API}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user || response.data;

        setFormData({
          recruiterName: user.name || "",
          email: user.email || "",
          phone: user.mobile || "",
          companyName: user.companyName || "",
          website: user.website || "",
          industry: user.industry || "",
          location: user.location || "",
          companySize: user.companySize || "",
          logo: user.logo || "",
          description: user.companyDescription || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, reloadKey]);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  // UPLOAD COMPANY LOGO
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];

    e.target.value = "";

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      setMessage("");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Logo size must be less than 2 MB.");
      setMessage("");
      return;
    }

    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("logo", file);

    setUploadingLogo(true);
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        `${API}/profile/company-logo`,
        uploadData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.logo) {
        throw new Error("Server did not return a logo URL.");
      }

      setFormData((prev) => ({
        ...prev,
        logo: response.data.logo,
      }));

      setMessage("Company logo uploaded successfully!");
    } catch (err) {
      console.error("Company logo upload error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Logo upload failed."
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  // REMOVE LOGO
  const handleRemoveLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: "",
    }));

    setMessage("");
    setError("");
  };

  // EDIT PROFILE
  const handleEdit = () => {
    setEditing(true);
    setMessage("");
    setError("");
  };

  // CANCEL EDIT
  const handleCancel = () => {
    setEditing(false);
    setMessage("");
    setError("");
    setLoading(true);
    setReloadKey((prev) => prev + 1);
  };

  // SAVE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        `${API}/profile`,
        {
          name: formData.recruiterName,
          mobile: formData.phone,
          companyName: formData.companyName,
          website: formData.website,
          industry: formData.industry,
          location: formData.location,
          companySize: formData.companySize,
          logo: formData.logo,
          description: formData.description,
        },
        {
          headers: getHeaders(),
        }
      );

      const user = response.data.user || response.data;

      setFormData({
        recruiterName: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        companyName: user.companyName || "",
        website: user.website || "",
        industry: user.industry || "",
        location: user.location || "",
        companySize: user.companySize || "",
        logo: user.logo || "",
        description: user.companyDescription || "",
      });

      localStorage.setItem("name", user.name || "");
      localStorage.setItem("email", user.email || "");

      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <>
        <RecruiterNavbar />

        <div className="recruiter-profile-page">
          <div className="recruiter-profile-loading">
            <div className="profile-spinner"></div>
            <p>Loading company profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <RecruiterNavbar />

      <div className="recruiter-profile-page">
        <div className="recruiter-profile-container">

          {/* HEADER */}
          <div className="recruiter-profile-header">
            <div>
              <span className="profile-eyebrow">
                RECRUITER ACCOUNT
              </span>

              <h1>Company Profile</h1>

              <p>
                Manage your company and recruiter information.
              </p>
            </div>

            {!editing && (
              <button
                className="profile-edit-btn"
                onClick={handleEdit}
              >
                ✎ Edit Profile
              </button>
            )}
          </div>

          {/* MESSAGES */}
          {message && (
            <div className="profile-success-message">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="profile-error-message">
              {error}
            </div>
          )}

          {/* PROFILE VIEW */}
          {!editing ? (
            <div className="recruiter-profile-view">

              {/* BANNER */}
              <div className="recruiter-profile-banner">
                <div className="profile-banner-content">

                  <LogoPreview
                    logo={formData.logo}
                    companyName={formData.companyName}
                  />

                  <div className="profile-banner-info">
                    <h2>
                      {formData.companyName || "Your Company"}
                    </h2>

                    <p>
                      {formData.industry ||
                        "Industry not specified"}
                    </p>

                    <div className="profile-badges">
                      <span className="profile-status">
                        <span className="status-dot"></span>
                        Recruiter Account
                      </span>

                      {formData.companySize && (
                        <span className="profile-size-badge">
                          {formData.companySize}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="recruiter-profile-content">

                {/* LEFT COLUMN */}
                <div className="profile-main-column">

                  {/* ABOUT COMPANY */}
                  <div className="profile-view-card">
                    <div className="profile-card-heading">
                      <h3>About Company</h3>
                    </div>

                    <p className="profile-about-text">
                      {formData.description ||
                        "No company description added yet."}
                    </p>
                  </div>

                  {/* COMPANY INFORMATION */}
                  <div className="profile-view-card">
                    <div className="profile-card-heading">
                      <h3>Company Information</h3>
                    </div>

                    <div className="profile-detail-grid">

                      <div className="profile-detail-item">
                        <span className="profile-detail-icon">
                          ⌕
                        </span>

                        <div>
                          <label>Industry</label>
                          <p>
                            {formData.industry ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="profile-detail-item">
                        <span className="profile-detail-icon">
                          ⌖
                        </span>

                        <div>
                          <label>Location</label>
                          <p>
                            {formData.location ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="profile-detail-item">
                        <span className="profile-detail-icon">
                          ♙
                        </span>

                        <div>
                          <label>Company Size</label>
                          <p>
                            {formData.companySize ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="profile-detail-item">
                        <span className="profile-detail-icon">
                          ↗
                        </span>

                        <div>
                          <label>Website</label>

                          {formData.website ? (
                            <a
                              href={
                                formData.website.startsWith("http")
                                  ? formData.website
                                  : `https://${formData.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {formData.website}
                            </a>
                          ) : (
                            <p>Not specified</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="profile-side-column">

                  {/* RECRUITER CONTACT */}
                  <div className="profile-view-card">
                    <div className="profile-card-heading">
                      <h3>Recruiter Contact</h3>
                    </div>

                    <div className="profile-contact-list">

                      <div className="profile-contact-item">
                        <span className="profile-contact-icon">
                          ♙
                        </span>

                        <div>
                          <label>Recruiter Name</label>
                          <p>
                            {formData.recruiterName ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="profile-contact-item">
                        <span className="profile-contact-icon">
                          ✉
                        </span>

                        <div>
                          <label>Email Address</label>
                          <p>
                            {formData.email ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>

                      <div className="profile-contact-item">
                        <span className="profile-contact-icon">
                          ☎
                        </span>

                        <div>
                          <label>Phone Number</label>
                          <p>
                            {formData.phone ||
                              "Not specified"}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* COMPLETION CARD */}
                  <div className="profile-completion-card">
                    <div className="completion-icon">✦</div>

                    <h3>Build Your Company Profile</h3>

                    <p>
                      Add your company information and logo to
                      help candidates recognize your organization.
                    </p>

                    <button onClick={handleEdit}>
                      Update Company Details
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ) : (

            /* EDIT PROFILE */
            <div className="recruiter-profile-card">

              <div className="profile-edit-heading">
                <div>
                  <h2>Edit Company Profile</h2>

                  <p>
                    Update your company and recruiter details.
                  </p>
                </div>
              </div>

              {/* LOGO UPLOAD */}
              <div className="profile-logo-upload-section">

                <LogoPreview
                  logo={formData.logo}
                  companyName={formData.companyName}
                />

                <div className="profile-logo-upload-content">
                  <h3>Company Logo</h3>

                  <p>
                    Upload your company's logo. JPG, PNG or WEBP.
                    Maximum 2 MB.
                  </p>

                  <div className="profile-logo-actions">

                    <label
                      className={`logo-upload-btn ${
                        uploadingLogo ? "disabled" : ""
                      }`}
                    >
                      {uploadingLogo
                        ? "Uploading..."
                        : "↑ Upload Logo"}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                      />
                    </label>

                    {formData.logo && (
                      <button
                        type="button"
                        className="logo-remove-btn"
                        onClick={handleRemoveLogo}
                        disabled={uploadingLogo}
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>

                  {uploadingLogo && (
                    <div className="logo-upload-progress">
                      <div className="profile-spinner small"></div>

                      <span>
                        Uploading your logo...
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* PROFILE FORM */}
              <form onSubmit={handleSubmit}>

                {/* RECRUITER INFORMATION */}
                <div className="profile-section">
                  <h3>Recruiter Information</h3>

                  <div className="profile-grid">

                    <div className="profile-field">
                      <label>Full Name</label>

                      <input
                        type="text"
                        name="recruiterName"
                        value={formData.recruiterName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="profile-field">
                      <label>Email Address</label>

                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                      />
                    </div>

                    <div className="profile-field">
                      <label>Phone Number</label>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>

                  </div>
                </div>

                {/* COMPANY INFORMATION */}
                <div className="profile-section">
                  <h3>Company Information</h3>

                  <div className="profile-grid">

                    <div className="profile-field">
                      <label>Company Name</label>

                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>

                    <div className="profile-field">
                      <label>Company Website</label>

                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="profile-field">
                      <label>Industry</label>

                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        placeholder="IT, Finance, Healthcare..."
                      />
                    </div>

                    <div className="profile-field">
                      <label>Company Location</label>

                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, State"
                      />
                    </div>

                    <div className="profile-field">
                      <label>Company Size</label>

                      <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select company size
                        </option>

                        <option value="1-10 employees">
                          1-10 employees
                        </option>

                        <option value="11-50 employees">
                          11-50 employees
                        </option>

                        <option value="51-200 employees">
                          51-200 employees
                        </option>

                        <option value="201-500 employees">
                          201-500 employees
                        </option>

                        <option value="501-1000 employees">
                          501-1000 employees
                        </option>

                        <option value="1000+ employees">
                          1000+ employees
                        </option>
                      </select>
                    </div>

                  </div>

                  {/* DESCRIPTION */}
                  <div className="profile-field profile-description-field">
                    <label>About Company</label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write about your company, work culture, mission and team..."
                      rows={5}
                    />
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="profile-edit-actions">

                  <button
                    type="button"
                    className="profile-cancel-btn"
                    onClick={handleCancel}
                    disabled={saving || uploadingLogo}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="profile-save-btn"
                    disabled={saving || uploadingLogo}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RecruiterProfile;

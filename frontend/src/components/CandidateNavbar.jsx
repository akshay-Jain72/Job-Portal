
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CandidateNavbar.css";

function CandidateNavbar() {
  const navigate = useNavigate();

  const name = localStorage.getItem("name") || "Candidate";
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    closeMenu();
    navigate("/login");
  };

  return (
    <>
      <nav className="main-navbar candidate-navbar">
        {/* BRAND */}
        <NavLink
          to="/candidate-dashboard"
          className="nav-brand"
          onClick={closeMenu}
        >
          <i className="fa-solid fa-briefcase"></i>
          JobPortal
        </NavLink>

        {/* HAMBURGER */}
        <button
          type="button"
          className="candidate-hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <i
            className={`fa-solid ${
              menuOpen ? "fa-xmark" : "fa-bars"
            }`}
          ></i>
        </button>

        {/* MOBILE OVERLAY */}
        {menuOpen && (
          <div
            className="candidate-navbar-overlay"
            onClick={closeMenu}
          ></div>
        )}

        {/* MENU + USER */}
        <div
          className={`candidate-navbar-drawer ${
            menuOpen ? "candidate-drawer-open" : ""
          }`}
        >
          {/* LINKS */}
          <div className="nav-menu">
            <NavLink
              to="/candidate-dashboard"
              onClick={closeMenu}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/jobs"
              onClick={closeMenu}
            >
              Browse Jobs
            </NavLink>

            <NavLink
              to="/my-applications"
              onClick={closeMenu}
            >
              My Applications
            </NavLink>

            <NavLink
              to="/saved-jobs"
              onClick={closeMenu}
            >
              Saved Jobs
            </NavLink>

            <NavLink
              to="/profile"
              onClick={closeMenu}
            >
              My Profile
            </NavLink>

            <NavLink
              to="/notifications"
              onClick={closeMenu}
            >
              Notifications
            </NavLink>
          </div>

          {/* USER */}
          <div className="nav-user">
            <span className="nav-user-name">
              {name}
            </span>

            <button
              type="button"
              className="nav-logout"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default CandidateNavbar;


import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./RecruiterNavbar.css";

function RecruiterNavbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Recruiter";

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // FETCH UNREAD NOTIFICATIONS
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          "https://job-portal-backend-15s4.onrender.com/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const notifications = Array.isArray(response.data)
          ? response.data
          : [];

        setUnreadCount(
          notifications.filter((notification) => !notification.read).length
        );
      } catch (error) {
        console.error("Notification error:", error.message);
      }
    };

    fetchNotifications();
  }, []);

  // CLOSE MENU
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    closeMenu();
    navigate("/login");
  };

  // NAVIGATION LINKS
  const menuItems = [
    {
      to: "/recruiter-dashboard",
      label: "Dashboard",
    },
    {
      to: "/post-job",
      label: "Post Job",
    },
    {
      to: "/manage-jobs",
      label: "Manage Jobs",
    },
    {
      to: "/applicants",
      label: "Applicants",
    },
    {
      to: "/recruiter-profile",
      label: "Profile",
    },
    {
      to: "/recruiter-notifications",
      label: "Notifications",
    },
  ];

  return (
    <header className="recruiter-navbar-wrapper">

      {/* NAVBAR */}
      <nav className="recruiter-navbar">

        {/* LOGO */}
        <NavLink
          to="/recruiter-dashboard"
          className="recruiter-brand"
          onClick={closeMenu}
        >
          <div className="recruiter-brand-logo">
            <i className="fa-solid fa-briefcase"></i>
          </div>

          <div className="recruiter-brand-text">
            <strong>JobPortal</strong>
            <span>RECRUITMENT PORTAL</span>
          </div>
        </NavLink>

        {/* DESKTOP LINKS */}
        <div className="recruiter-nav-links">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `recruiter-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span>{item.label}</span>

              {item.to === "/recruiter-notifications" &&
                unreadCount > 0 && (
                  <span className="recruiter-notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
            </NavLink>
          ))}
        </div>

        {/* USER */}
        <div className="recruiter-nav-user">

          <div className="recruiter-user-info">
            <div className="recruiter-user-avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="recruiter-user-details">
              <strong>{name}</strong>
              <span>Recruiter</span>
            </div>
          </div>

          <button
            type="button"
            className="recruiter-logout-btn"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="recruiter-hamburger"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <>
          <div
            className="recruiter-menu-overlay"
            onClick={closeMenu}
          ></div>

          <div className="recruiter-mobile-menu">

            <div className="recruiter-mobile-menu-links">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `recruiter-mobile-link ${isActive ? "active" : ""}`
                  }
                >
                  <span>{item.label}</span>

                  {item.to === "/recruiter-notifications" &&
                    unreadCount > 0 && (
                      <span className="recruiter-notification-badge">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                </NavLink>
              ))}
            </div>

            {/* MOBILE USER */}
            <div className="recruiter-mobile-user">
              <div className="recruiter-user-avatar">
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="recruiter-user-details">
                <strong>{name}</strong>
                <span>Recruiter</span>
              </div>

              <button
                type="button"
                className="recruiter-logout-btn"
                onClick={handleLogout}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </button>
            </div>

          </div>
        </>
      )}
    </header>
  );
}

export default RecruiterNavbar;

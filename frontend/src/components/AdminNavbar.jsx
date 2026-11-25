
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminNavbar.css";

function AdminNavbar() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Administrator";

  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fetch unread notifications
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const notifications = Array.isArray(response.data)
          ? response.data
          : [];

        const unread = notifications.filter(
          (notification) => !notification.read
        );

        setUnreadCount(unread.length);
      } catch (error) {
        console.error(
          "Notifications fetch error:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchUnreadNotifications();
  }, []);

  // Close menu
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    closeMenu();
    navigate("/login");
  };

  // Menu items
  const menuItems = [
    {
      to: "/admin-dashboard",
      icon: "fa-chart-pie",
      label: "Dashboard",
    },
    {
      to: "/admin-users",
      icon: "fa-users",
      label: "Manage Users",
    },
    {
      to: "/admin-jobs",
      icon: "fa-briefcase",
      label: "Manage Jobs",
    },
    {
      to: "/admin-reports",
      icon: "fa-chart-column",
      label: "Reports & Analytics",
    },
    {
      to: "/admin-notifications",
      icon: "fa-bell",
      label: "Notifications",
    },
  ];

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        type="button"
        className="admin-hamburger-btn"
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
          className="admin-navbar-overlay"
          onClick={closeMenu}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`admin-navbar ${
          menuOpen ? "admin-navbar-open" : ""
        }`}
      >
        {/* BRAND */}
        <div className="admin-navbar-brand">
          <div className="admin-navbar-logo">
            <i className="fa-solid fa-briefcase"></i>
          </div>

          <div className="admin-navbar-brand-text">
            <span className="admin-navbar-brand-name">
              JobPortal
            </span>
            <small>ADMINISTRATION</small>
          </div>
        </div>

        {/* LABEL */}
        <div className="admin-navbar-label">
          MAIN MENU
        </div>

        {/* LINKS */}
        <nav className="admin-navbar-links">
          {menuItems.map((item) => (
            <NavLink
              to={item.to}
              key={item.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="admin-nav-link-icon">
                <i className={`fa-solid ${item.icon}`}></i>
              </span>

              <span className="admin-nav-link-text">
                {item.label}
              </span>

              {item.to === "/admin-notifications" &&
                unreadCount > 0 && (
                  <span className="admin-notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
            </NavLink>
          ))}
        </nav>

        {/* BOTTOM PROFILE */}
        <div className="admin-navbar-bottom">
          <div className="admin-navbar-profile">
            <div className="admin-navbar-avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <div className="admin-navbar-user-info">
              <strong>{name}</strong>

              <span className="admin-navbar-role">
                <i className="fa-solid fa-circle"></i>
                Administrator
              </span>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            className="admin-navbar-logout"
            onClick={handleLogout}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminNavbar;

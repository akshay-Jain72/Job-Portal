import { useEffect, useState } from "react";
import axios from "axios";
import RecruiterNavbar from "../components/RecruiterNavbar";
import "./RecruiterNotifications.css";

function RecruiterNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        getHeaders()
      );

      setNotifications(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/notifications",
          getHeaders()
        );

        setNotifications(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load notifications."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  // Mark one as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        getHeaders()
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as read.");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/mark-all-read",
        {},
        getHeaders()
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark all as read.");
    }
  };

  // Delete one
  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/notifications/${id}`,
        getHeaders()
      );

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete notification.");
    }
  };

  // Delete all
  const deleteAllNotifications = async () => {
    if (!window.confirm("Are you sure you want to delete all notifications?")) {
      return;
    }

    try {
      await axios.delete(
        "http://localhost:5000/api/notifications/delete-all",
        getHeaders()
      );

      setNotifications([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete all notifications.");
    }
  };

  // Icons
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "fa-circle-check";
      case "interview":
        return "fa-calendar-check";
      case "reminder":
        return "fa-clock";
      case "job":
        return "fa-briefcase";
      case "application":
        return "fa-file-lines";
      case "admin":
        return "fa-user-shield";
      case "warning":
        return "fa-triangle-exclamation";
      default:
        return "fa-bell";
    }
  };

  // Filter
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "Unread") return !notification.read;
    if (filter === "Read") return notification.read;
    return true;
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  // Date format
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="recruiter-notifications-page">
      <RecruiterNavbar />

      <main className="recruiter-notifications-main">
        {/* Header */}
        <div className="recruiter-notifications-header">
          <div>
            <span className="recruiter-notifications-eyebrow">
              RECRUITER PANEL
            </span>

            <h1>Notifications</h1>

            <p>Stay updated with your recruitment activities.</p>
          </div>

          <div className="recruiter-notifications-header-icon">
            <i className="fa-solid fa-bell"></i>
          </div>
        </div>

        {/* Stats */}
        <div className="recruiter-notification-stats">
          <div className="recruiter-notification-stat-card">
            <div className="recruiter-notification-stat-icon total-icon">
              <i className="fa-solid fa-bell"></i>
            </div>

            <div>
              <span>Total Notifications</span>
              <h2>{totalCount}</h2>
            </div>
          </div>

          <div className="recruiter-notification-stat-card">
            <div className="recruiter-notification-stat-icon unread-icon">
              <i className="fa-solid fa-envelope"></i>
            </div>

            <div>
              <span>Unread</span>
              <h2>{unreadCount}</h2>
            </div>
          </div>

          <div className="recruiter-notification-stat-card">
            <div className="recruiter-notification-stat-icon read-icon">
              <i className="fa-solid fa-envelope-open"></i>
            </div>

            <div>
              <span>Read</span>
              <h2>{readCount}</h2>
            </div>
          </div>
        </div>

        {/* Notification Section */}
        <section className="recruiter-notification-section">
          <div className="recruiter-notification-toolbar">
            <div className="recruiter-notification-toolbar-left">
              <h2>All Notifications</h2>

              <span className="recruiter-notification-total-pill">
                {totalCount}
              </span>
            </div>

            <div className="recruiter-notification-toolbar-actions">
              {unreadCount > 0 && (
                <button
                  className="recruiter-notification-mark-all"
                  onClick={markAllAsRead}
                >
                  <i className="fa-solid fa-check-double"></i>
                  Mark all read
                </button>
              )}

              {totalCount > 0 && (
                <button
                  className="recruiter-notification-clear"
                  onClick={deleteAllNotifications}
                >
                  <i className="fa-solid fa-trash"></i>
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="recruiter-notification-filters">
            {["All", "Unread", "Read"].map((item) => (
              <button
                key={item}
                className={
                  filter === item
                    ? "recruiter-notification-filter active"
                    : "recruiter-notification-filter"
                }
                onClick={() => setFilter(item)}
              >
                {item}

                {item === "Unread" && unreadCount > 0 && (
                  <span className="recruiter-filter-count">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          {loading ? (
            <div className="recruiter-notification-loading">
              <i className="fa-solid fa-spinner fa-spin"></i>
              <p>Loading notifications...</p>
            </div>
          ) : error ? (
            <div className="recruiter-notification-error">
              <i className="fa-solid fa-circle-exclamation"></i>
              <p>{error}</p>

              <button onClick={fetchNotifications}>
                Try Again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="recruiter-notification-empty">
              <div className="recruiter-notification-empty-icon">
                <i className="fa-regular fa-bell-slash"></i>
              </div>

              <h3>No notifications found</h3>

              <p>
                {filter === "Unread"
                  ? "You have no unread notifications."
                  : filter === "Read"
                  ? "You have no read notifications."
                  : "Notifications will appear here when there is activity."}
              </p>
            </div>
          ) : (
            <div className="recruiter-notification-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`recruiter-notification-card ${
                    notification.read ? "is-read" : "is-unread"
                  }`}
                >
                  <div
                    className={`recruiter-notification-type-icon type-${notification.type || "info"}`}
                  >
                    <i
                      className={`fa-solid ${getIcon(notification.type)}`}
                    ></i>
                  </div>

                  <div className="recruiter-notification-content">
                    <div className="recruiter-notification-title-row">
                      <h3>{notification.title}</h3>

                      {!notification.read && (
                        <span className="recruiter-notification-unread-dot"></span>
                      )}
                    </div>

                    <p>{notification.message}</p>

                    <div className="recruiter-notification-meta">
                      <span>
                        <i className="fa-regular fa-clock"></i>
                        {formatDate(notification.createdAt)}
                      </span>

                      <span
                        className={
                          notification.read
                            ? "recruiter-notification-status read-status"
                            : "recruiter-notification-status unread-status"
                        }
                      >
                        {notification.read ? "Read" : "Unread"}
                      </span>
                    </div>
                  </div>

                  <div className="recruiter-notification-actions">
                    {!notification.read && (
                      <button
                        title="Mark as read"
                        className="recruiter-notification-action-btn"
                        onClick={() => markAsRead(notification._id)}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                    )}

                    <button
                      title="Delete notification"
                      className="recruiter-notification-action-btn delete-action"
                      onClick={() => deleteNotification(notification._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default RecruiterNotifications;
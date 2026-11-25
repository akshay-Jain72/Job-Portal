
import { useEffect, useState } from "react";
import axios from "axios";
import CandidateNavbar from "../components/CandidateNavbar";
import "./CandidateNotifications.css";

function CandidateNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "https://job-portal-backend-15s4.onrender.com/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };
useEffect(() => {
  const loadNotifications = async () => {
    await fetchNotifications();
  };

  loadNotifications();
}, []);
  // Mark one notification as read
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `https://job-portal-backend-15s4.onrender.com/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? { ...notification, read: true }
            : notification
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as read");
    }
  };

  // Mark all as read
  const markAllRead = async () => {
    try {
      await axios.put(
        "https://job-portal-backend-15s4.onrender.com/api/notifications/mark-all-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark all as read");
    }
  };

  // Delete one notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(
        `https://job-portal-backend-15s4.onrender.com/api/notifications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== id)
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete notification");
    }
  };

  // Delete all notifications
  const clearAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;

    try {
      await axios.delete(
        "https://job-portal-backend-15s4.onrender.com/api/notifications/delete-all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications([]);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to clear notifications");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  const readCount = notifications.filter(
    (notification) => notification.read
  ).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "read") return notification.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "🎉";
      case "interview":
        return "📅";
      case "reminder":
        return "⏰";
      case "job":
        return "💼";
      default:
        return "📢";
    }
  };

  return (
    <>
      <CandidateNavbar />

      <div className="notifications-container">
        <div className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your job applications.</p>
          </div>

          <div className="notification-header-actions">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="mark-all-btn">
                Mark All Read
              </button>
            )}

            {notifications.length > 0 && (
              <button onClick={clearAll} className="clear-all-btn">
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="notification-stats">
          <div className="notification-stat-card">
            <h3>{notifications.length}</h3>
            <p>Total</p>
          </div>

          <div className="notification-stat-card">
            <h3>{unreadCount}</h3>
            <p>Unread</p>
          </div>

          <div className="notification-stat-card">
            <h3>{readCount}</h3>
            <p>Read</p>
          </div>
        </div>

        <div className="notification-filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>

          <button
            className={filter === "unread" ? "active" : ""}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>

          <button
            className={filter === "read" ? "active" : ""}
            onClick={() => setFilter("read")}
          >
            Read ({readCount})
          </button>
        </div>

        {loading ? (
          <div className="notifications-empty">
            <p>Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="notifications-empty">
            <p>{error}</p>
            <button onClick={fetchNotifications}>Retry</button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="notifications-empty">
            <h3>No notifications found</h3>
            <p>You don't have any notifications in this section.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                className={`notification-card ${
                  notification.read ? "read" : "unread"
                }`}
                key={notification._id}
              >
                <div className="notification-icon">
                  {getIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {!notification.read && (
                      <span className="unread-badge">New</span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <span className="notification-date">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>

                  <div className="notification-actions">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="mark-read-btn"
                      >
                        Mark as Read
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteNotification(notification._id)
                      }
                      className="delete-notification-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CandidateNotifications;

import { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import "./AdminManageUsers.css";

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };

    loadUsers();
  }, []);

  // Block / Unblock
  const toggleStatus = async (user) => {
    const newStatus =
      user.status === "Blocked" ? "Active" : "Blocked";

    const confirmAction = window.confirm(
      `Are you sure you want to ${newStatus === "Blocked" ? "block" : "unblock"} ${user.name}?`
    );

    if (!confirmAction) return;

    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${user._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`User ${newStatus} successfully!`);
      fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to update user"
      );
    }
  };

  // Delete user
  const deleteUser = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      alert(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  };

  // Search and filters
  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "All" ||
      (user.status || "Active") === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Stats
  const totalCandidates = users.filter(
    (user) => user.role === "Candidate"
  ).length;

  const totalRecruiters = users.filter(
    (user) => user.role === "Recruiter"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked"
  ).length;

  const getStatusClass = (status) => {
    return status === "Blocked" ? "amu-blocked" : "amu-active";
  };

  return (
    <div className="amu-page">
      <AdminNavbar />

      <main className="amu-main">
        {/* Header */}
        <header className="amu-header">
          <div>
            <h1>User Management</h1>
            <p>
              Manage candidates and recruiter accounts across the platform.
            </p>
          </div>

          <div className="amu-admin-badge">
            🛡️ Admin
          </div>
        </header>

        {/* Stats */}
        <section className="amu-stats">
          <div className="amu-stat-card">
            <div className="amu-stat-icon amu-blue">
              <span>👥</span>
            </div>

            <div>
              <p>Total Users</p>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="amu-stat-card">
            <div className="amu-stat-icon amu-purple">
              <span>👤</span>
            </div>

            <div>
              <p>Candidates</p>
              <h2>{totalCandidates}</h2>
            </div>
          </div>

          <div className="amu-stat-card">
            <div className="amu-stat-icon amu-orange">
              <span>🏢</span>
            </div>

            <div>
              <p>Recruiters</p>
              <h2>{totalRecruiters}</h2>
            </div>
          </div>

          <div className="amu-stat-card">
            <div className="amu-stat-icon amu-red">
              <span>🚫</span>
            </div>

            <div>
              <p>Blocked Users</p>
              <h2>{blockedUsers}</h2>
            </div>
          </div>
        </section>

        {/* Users Panel */}
        <section className="amu-panel">
          <div className="amu-panel-header">
            <div>
              <h2>All Users</h2>
              <p>
                View, filter and manage registered accounts.
              </p>
            </div>

            <button
              className="amu-refresh-btn"
              onClick={fetchUsers}
            >
              ↻ Refresh
            </button>
          </div>

          {/* Filters */}
          <div className="amu-filters">
            <div className="amu-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Candidate">Candidate</option>
              <option value="Recruiter">Recruiter</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="amu-error">
              <span>{error}</span>
              <button onClick={fetchUsers}>Retry</button>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="amu-loading">
              <div className="amu-spinner"></div>
              <p>Loading users...</p>
            </div>
          ) : (
            <div className="amu-table-wrapper">
              <table className="amu-table">
                <thead>
                  <tr>
                    <th>USER</th>
                    <th>ROLE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="amu-empty">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const status = user.status || "Active";

                      return (
                        <tr key={user._id}>
                          <td>
                            <div className="amu-user-cell">
                              <div className="amu-avatar">
                                {user.name
                                  ?.charAt(0)
                                  .toUpperCase() || "U"}
                              </div>

                              <div className="amu-user-info">
                                <strong>{user.name}</strong>
                                <span>{user.email}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span
                              className={`amu-role ${user.role?.toLowerCase()}`}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`amu-status ${getStatusClass(status)}`}
                            >
                              <span className="amu-status-dot"></span>
                              {status}
                            </span>
                          </td>

                          <td>
                            <div className="amu-actions">
                              <button
                                className={
                                  status === "Active"
                                    ? "amu-block-btn"
                                    : "amu-unblock-btn"
                                }
                                onClick={() => toggleStatus(user)}
                              >
                                {status === "Active"
                                  ? "Block"
                                  : "Unblock"}
                              </button>

                              <button
                                className="amu-delete-btn"
                                onClick={() =>
                                  deleteUser(user._id, user.name)
                                }
                              >
                                <span>🗑</span>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="amu-footer">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminManageUsers;
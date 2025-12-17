import { useState, useEffect } from "react";
import EditUser from "../components/EditUser.tsx";
// import ChangePassword from "../components/ChangePassword.tsx";
import { getAllUsers, deleteUser, type UserResponse } from "../api.ts";
import "./UserManagement.css";



function shortenEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name}@${domain[0]}...`;
}

function UserManagement() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserResponse[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [_popen, setPopen] = useState(false);
  const [Eopen, setEopen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    date: ""
  });

  const itemsPerPage = 10;

  useEffect(() => {
    getAllUsersF();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  async function getAllUsersF() {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...users];

    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter(user => user.createdAt.includes(filters.date));
    }

    setFilteredUsers(filtered);
  }

  function handleAction(e: React.ChangeEvent<HTMLSelectElement>, user: UserResponse) {
    const action = e.target.value;
    setSelectedUser(user);

    switch (action) {
      case "edit":
        setEopen(true);
        break;
      case "reset":
        setPopen(true);
        break;
      case "desable":
        handleDisableUser(user);
        break;
      case "delete":
        if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
          handleDeleteUser(user);
        }
        break;
    }
    e.target.value = "";
  }

  async function handleDeleteUser(user: UserResponse) {
    try {
      await deleteUser(user._id );
      getAllUsersF();
      alert("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  }

  function handleDisableUser(user: UserResponse) {
    // Implement disable logic here
    alert(`User ${user.name} disabled`);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleUserUpdated() {
    getAllUsersF();
    setEopen(false);
  }

  function closeModals() {
    setEopen(false);
    setPopen(false);
    setSelectedUser(null);
  }

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="user_management_page">
      <header className="page_header">
        <h1>User Management</h1>
        <button>Add User +</button>
      </header>

      <div className="filters_section">
        <button>filter by</button>
        <div className="filter_box">
          <input
            name="search"
            placeholder="Search users..."
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter_box">
          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="filter_box">
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="filter_box">
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <table className="users_table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user._id}>
                  <td><img src={user.avatar} alt={user.name} /></td>
                  <td>{user.name}</td>
                  <td>{shortenEmail(user.email)}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.lastloggedin}</td>
                  <td>{user.createdAt}</td>
                  <td>
                    <select onChange={(e) => handleAction(e, user)}>
                      <option value="">User Actions</option>
                      <option value="edit">Edit User</option>
                      <option value="desable">Disable User</option>
                      <option value="reset">Reset Password</option>
                      <option value="delete">Delete User</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedUser && (
        <>
          <EditUser
            isopen={Eopen}
            close={closeModals}
            user={selectedUser}
            onUserUpdated={handleUserUpdated}
          />
          {/* <ChangePassword
            isopen={popen}
            close={closeModals}
            userId={selectedUser._id }
          /> */}
        </>
      )}
    </div>
  );
}

export default UserManagement;
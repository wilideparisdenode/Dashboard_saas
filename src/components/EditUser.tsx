import { useState, useEffect } from "react";
import type { UserResponse, UserType } from "../api";
import { Updateuse } from "../api";
import "./UserMComponent.css";

type Props = {
  isopen: boolean;
  close: () => void;
  user: UserResponse;
  onUserUpdated: (updatedUser: UserType) => void;
};

function EditUser({ isopen, close, user, onUserUpdated }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        status: user.status || "active"
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const updatedUser = await Updateuse({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status
        },
        user._id 
      );
      
      onUserUpdated(updatedUser);
      close();
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!isopen) return null;

  return (
    <div className={`editUserModal ${isopen ? "active" : ""}`} aria-hidden="true">
      <div className="modal-overlay" onClick={close}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={close} aria-label="Close">
          &times;
        </button>
        <h2>Edit User</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form id="editUserForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userName">Full Name</label>
            <input
              type="text"
              id="userName"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="userRole">Role</label>
            <select
              id="userRole"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="userStatus">Status</label>
            <select
              id="userStatus"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUser;
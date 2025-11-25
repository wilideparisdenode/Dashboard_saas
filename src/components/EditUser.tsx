import "./UserMComponent.css"
type Props = {
  isopen: boolean;
  close:any;
};


function EditUser({isopen,close}: Props) {
  return (
<div className={`editUserModal ${isopen?"active":""}`}  aria-hidden="true">
  <div className="modal-overlay"></div>
  <div className="modal-content">
    <button className="modal-close" onClick={close} aria-label="Close">&times;</button>
    <h2>Edit User</h2>
    <form id="editUserForm">
      <div className="form-group">
        <label htmlFor="userName">Full Name</label>
        <input type="text" id="userName" name="userName" required/>
      </div>
      <div className="form-group">
        <label htmlFor="userEmail">Email</label>
        <input type="email" id="userEmail" name="userEmail" required/>
      </div>
      <div className="form-group">
        <label htmlFor="userRole">Role</label>
        <select id="userRole" name="userRole" required>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="user">User</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="userStatus">Status</label>
        <select id="userStatus" name="userStatus" required>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <button type="submit" className="btn-primary">Save Changes</button>
    </form>
  </div>
</div>

  )
}

export default EditUser;
import "./UserMComponent.css"
type Props = {
  isopen: boolean;
  close:any;
};


function ChangePassword({isopen,close}: Props) {
  return (
 
<div className={`changePasswordModal ${isopen?"active":""}`}  aria-hidden="true">
  <div className="modal-overlay"></div>
  <div className="modal-content">
    <button className="modal-close" onClick={close} aria-label="Close">&times;</button>
    <h2>Change Password</h2>
    <form id="changePasswordForm">
      <div className="form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <input type="password" id="currentPassword" name="currentPassword" required/>
      </div>
      <div className="form-group">
        <label htmlFor="newPassword">New Password</label>
        <input type="password" id="newPassword" name="newPassword" required/>
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" required/>
      </div>
      <button type="submit" className="btn-primary">Update Password</button>
    </form>
  </div>
</div>

  )
}

export default ChangePassword
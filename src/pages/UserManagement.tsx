import EditUser from "../components/EditUser.tsx";
import ChangePassword from "../components/ChangePassword.tsx";
import { useState } from "react";
import "./UserManagement.css"
type Props = {}
const pageN=30;
import {mockUsers} from "./mockData.ts"
function shortenEmail(email:string){

  const [name,domain]=email.split("@");
  return `${name}@${domain[0]}...`
}
function UserManagement({}: Props) {

  const [popen,setPopen]=useState(false);
    const [Eopen,setEopen]=useState(false);
 
  function action(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>){
    const val=e.target.value;
   if(val=="edit"){
    setEopen(!Eopen)
   }else if(val=="reset"){
    setPopen(!popen)
   }
  }
  function close(){
     setEopen(false);
     setPopen(false);
  }
  return (
   <div className="user_management_page">

  <header className="page_header">
    <h1>User Management</h1>
    <button>Add User +</button>
  </header>

  <div className="filters_section">
    <button>filter by</button>
    <div className="filter_box">
      user
      <input placeholder="Search users..." />
    </div>
    <div className="filter_box">
      role
      <select>
    <option value="">admin</option>
    <option value="">user</option>
    <option value="">moderator</option>
    </select>
    </div>
    <div className="filter_box">
      status
       <select>
      <option value="">active</option>
    <option value="">suspended</option>
    <option value="">pending</option>
    </select>
    </div>
    <div className="filter_box">
      date
       <input type="date" />
    </div>
    
    
   
   
  </div>

  <table className="users_table">
    <thead>
      <tr>
        <th>avatar</th>
        <th>name</th>
        <th>email</th>
        <th>role</th>
        <th>status badge</th>
        <th>last login</th>
        <th>created at</th>
        <th>actions</th>
      </tr> 
    </thead>
    <tbody>
      {mockUsers.map((u,k)=>(
        <tr key={k}>
         <td> <img src={u.avatar} alt="" /></td>
         <td>{u.name}</td>
         <td>{shortenEmail(u.email)}</td>
         <td>{u.role}</td>
         <td>{u.status}</td>
         <td>{u.lastLogin}</td>
         <td>{u.createdAt}</td>
         <td><select name="" id="" onChange={action}>
                    <option value="">user actions</option>
                    <option value="edit">edit user</option>
                    <option value="desable">disable user</option>
                    <option value="reset">Reset Password</option>
                    <option value="delete">delete User</option>
                  </select></td>
      </tr>
      ))}
    </tbody>
  </table>

  <div className="pagination">
     {Array.from({length:(pageN/10)},(_,i) =>(<button key={i+1}>{i+1}</button>))}
     <button>next</button>
  </div>
     <EditUser isopen={Eopen} close={close}/>
     <ChangePassword isopen={popen} close={close}/>
</div>

  )
}

export default UserManagement
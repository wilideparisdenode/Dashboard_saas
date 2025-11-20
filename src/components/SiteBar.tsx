import {motion} from "framer-motion";
import {Link} from "react-router-dom"
type Props = {}
import "./componentStyle.css";
import { useState } from "react";
function SiteBar({}: Props) {
    const [open,setOpen]=useState(false);
    
  return (
    <div className="site_bar">
        <div className="links">
            <ul>
                <li><Link to="#">orders</Link></li>
                <li><Link to="#">customers</Link></li>
                <li><Link to="#">analytics</Link></li>
                <li><Link to="#">products</Link></li>
                <li><Link to="#">staff</Link></li>
                <li 
                onClick={()=>setOpen(!open)}
                >manage payments
                   {open && (
    <motion.ul
        className="dropdown"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        style={{
            overflow: "hidden",
            marginTop: "8px",
            padding: "8px"
        }}
    >
        <li><Link to="#">failures</Link></li>
        <li><Link to="#">analytics overview</Link></li>
    </motion.ul>
)}

                </li>
            </ul>
        </div>
    </div>
  )
}

export default SiteBar
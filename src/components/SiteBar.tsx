import { Link, useNavigate, useLocation } from "react-router-dom";
import "./componentStyle.css";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import {
  FaUsers,
  FaShoppingCart,
  FaCreditCard,
  FaBox,
  FaChartLine,
  FaHome,
  FaSignOutAlt,
  FaUser,
  FaCog,
  FaChevronDown,
  FaChevronRight,FaChevronLeft,
  FaBars,
  FaTimes
} from "react-icons/fa";

function SiteBar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { path: "/", label: "Overview", icon: <FaHome />, show: true },
    { path: "/user_management", label: "Users", icon: <FaUsers />, show: isAdmin },
    { path: "/order_management", label: "Orders", icon: <FaShoppingCart />, show: isAuthenticated },
    { path: "/payment_monitoring", label: "Payments", icon: <FaCreditCard />, show: isAuthenticated },
    { path: "/product_managment", label: "Products", icon: <FaBox />, show: isAuthenticated },
    { path: "/analytics", label: "Analytics", icon: <FaChartLine />, show: isAuthenticated },
  ];

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={`site_bar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Collapse Toggle (Desktop) */}
      <button 
        className="collapse-toggle"
        onClick={toggleCollapse}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Brand Section */}
      <div className="sidebar-brand">
        <h2 className="brand-title">Admin Panel</h2>
        {isAuthenticated && user && !isCollapsed && (
          <div className="user-info-mini">
            <div className="user-avatar-mini">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <span className="user-name-mini">{user.name}</span>
            <span className="user-role-mini">{user.role}</span>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="links">
        <ul>
          {menuItems.map((item) => 
            item.show && (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {!isCollapsed && <span className="nav-arrow">▸</span>}
                </Link>
              </li>
            )
          )}
          
          {/* Auth Dropdown */}
          {isAuthenticated ? (
            <li>
              <button 
                className={`dropdown-toggle ${openDropdown === 'auth' ? 'active' : ''}`}
                onClick={() => toggleDropdown('auth')}
              >
                <span className="nav-icon">
                  <FaUser />
                </span>
                {!isCollapsed && (
                  <>
                    <span className="nav-label">Account</span>
                    <span className="nav-arrow">
                      {openDropdown === 'auth' ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                  </>
                )}
              </button>
              
              {openDropdown === 'auth' && !isCollapsed && (
                <ul className="dropdown">
                  <li>
                    <Link 
                      to="/profile" 
                      className="dropdown-link"
                      onClick={() => {
                        setOpenDropdown(null);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FaUser /> Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/settings" 
                      className="dropdown-link"
                      onClick={() => {
                        setOpenDropdown(null);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <FaCog /> Settings
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setOpenDropdown(null);
                        setIsMobileMenuOpen(false);
                      }} 
                      className="dropdown-link logout-btn"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <FaUser />
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">Login</span>
                      <span className="nav-arrow">▸</span>
                    </>
                  )}
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="nav-link"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="nav-icon">
                    <FaUser />
                  </span>
                  {!isCollapsed && (
                    <>
                      <span className="nav-label">Register</span>
                      <span className="nav-arrow">▸</span>
                    </>
                  )}
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Footer/Status - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="auth-status">
              <span className="status-indicator active"></span>
              <span>Logged in as {user?.name}</span>
            </div>
          ) : (
            <div className="auth-status">
              <span className="status-indicator inactive"></span>
              <span>Not logged in</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SiteBar;
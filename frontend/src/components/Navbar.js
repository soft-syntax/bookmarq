import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";
import logo from "../assets/logo.png"; // place your logo in src/assets/

const Navbar = () => {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null); // update context and localStorage
    navigate("/");   // redirect to homepage
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="BookmarQ Logo" className="navbar-logo-img" />
          {/* <span className="navbar-logo-text">BookmarQ</span> */}
        </Link>
      </div>

      <div className="navbar-right">
        {token ? (
          <>
            <Link to="/dashboard" className="btn dashboard-btn">Dashboard</Link>
            <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn login-btn">Login</Link>
            <Link to="/register" className="btn register-btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

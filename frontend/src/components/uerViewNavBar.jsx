import React from 'react';
import { Link } from 'react-router-dom';
import './UserViewNavBar.css'; // We'll create this CSS file next
const UserViewNavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AccommodationFinder
        </Link>
        <div className="menu-icon">
          <i className="fas fa-bars" />
        </div>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/searchadd" className="nav-links">
              Search Accommodations
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/favorites" className="nav-links">
              Favorites
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-links">
              Contact
            </Link>
          </li>
        </ul>
        <div className="auth-buttons">
          <Link to="/login" className="login-button">
            Login
          </Link>
          <Link to="/register" className="register-button">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default UserViewNavBar;
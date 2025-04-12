import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      {/* Hamburger icon for mobile */}
      <div className="hamburger-menu" onClick={toggleMenu}>
        <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
        <div className={`hamburger-line ${menuOpen ? 'open' : ''}`}></div>
      </div>

      {/* Regular navbar for desktop */}
      <div className="navbar desktop-nav">
        <div className="dropdown">
          <button className="dropbtn" onClick={() => navigate("/home")}>Home 
            
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_27_52)">
                <path d="M9.2625 10.7375L15 16.4625L20.7375 10.7375L22.5 12.5L15 20L7.5 12.5L9.2625 10.7375Z" fill="#754480"/>
              </g>
              <defs>
                <clipPath id="clip0_27_52">
                  <rect width="30" height="30" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
          <div className="dropdown-content">
            <a onClick={() => navigate("/home")}>Events</a>
            <a href="#shop">Shop</a>
          </div>
        </div>
        <button className="header-button" onClick={() => navigate("/faq")}>FAQ</button>
        <button className="header-button" onClick={() => navigate("/contact")}>Contact</button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="mobile-dropdown">
            <button className="mobile-dropbtn" onClick={() => navigate("/home")}>Home</button>
            <div className="mobile-dropdown-items">
              <a onClick={() => navigate("/home")}>Events</a>
              <a href="#shop">Shop</a>
            </div>
          </div>
          <button className="mobile-nav-item" onClick={() => navigate("/home")}>FAQ</button>
          <button className="mobile-nav-item" onClick={() => navigate("/contact")}>Contact</button>
          
          {isLoggedIn ? (
            <button className="mobile-nav-item" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <button className="mobile-nav-item" onClick={() => navigate("/login")}>Sign In</button>
              <button className="mobile-nav-item sign-up-btn" onClick={() => navigate("/signup")}>Sign Up</button>
            </>
          )}
        </div>
      </div>

      <div className="nav-right desktop-nav">
        {isLoggedIn ? (
          <button className="header-button" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button className="header-button" onClick={() => navigate("/login")}>Sign In</button>
            <button className="header-button sign-up-btn" onClick={() => navigate("/signup")}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
}

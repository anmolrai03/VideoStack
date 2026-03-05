import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

import { Menu, X, LogIn, User } from "lucide-react";

import { useAuthContext } from "../../contexts/AuthContext/AuthContext.js";
import ActionButton from "../ActionButton/ActionButton.jsx";

import MobileViewNav from "../MobileView/MobileViewNav.jsx";

export default function Navbar() {
  const { user } = useAuthContext();

  // const user = {
  //   fullname: "Test User 1",
  //   email: "test@user1.com",
  //   username: "testuser1",
  //   createdAt: {
  //     date: "05 February 2026",
  //     time: "15:51",
  //   },
  //   avatarName: "TU1"
  // };

  const [isOpen, setIsOpen] = useState(false);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAvatarDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // DISABLE SCROLLING WHEN MOBILE MENU IS OPEN
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // TOGGLE MENU HANDLER
  const toggleMenu = () => setIsOpen(!isOpen);

  //LOGOUT HANDLER
  const handleLogout = () => {
    console.log("Handle logout called.")
  }

  return (
    <>
      {/* DESKTOP VIEW STARTS HERE */}
      <nav className="vs-navbar">
        {/* LOGO FOR > MOBILE STARTS HERE*/}
        <div className="text-2xl tracking-tight hidden md:block">
          VIDEOSTACK
        </div>
        {/* LOGO FOR > MOBILE ENDS HERE*/}

        {/* LOGO FOR MOBILE STARTS HERE*/}
        <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 text-xl tracking-tight">
          VIDEOSTACK
        </div>
        {/* LOGO FOR MOBILE ENDS HERE*/}

        {/* HAMBURGER FOR MOBILE MENU STARTS HERE*/}
        <div className="md:hidden z-50">
          <button onClick={toggleMenu}>
            {isOpen ? null : <Menu size={24} />}
          </button>
        </div>
        {/* HAMBURGER FOR MOBILE MENU ENDS HERE */}

        {/* NAVLINKS STARTS HERE*/}
        <div className="vs-nav-links hidden md:flex">
          {user && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? "vs-nav-active" : "")}
              >
                Home
              </NavLink>
              <NavLink
                to="/manage"
                className={({ isActive }) => (isActive ? "vs-nav-active" : "")}
              >
                Manage
              </NavLink>
              <NavLink
                to="/upload"
                className={({ isActive }) => (isActive ? "vs-nav-active" : "")}
              >
                Upload
              </NavLink>
            </>
          )}
        </div>
        {/* NAVLINK ENDS HERE */}

        {/* RIGHT SIDE STARTS HERE */}
        <div className="hidden md:flex items-center gap-4">
          {user ? 
            (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-medium cursor-pointer"
                  onClick={() => setShowAvatarDropdown(!showAvatarDropdown)}
                >
                  {user.avatarName}
                </button>

                {/* Dropdown Menu */}
                {showAvatarDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-bg-card border border-border-subtle rounded-lg shadow-lg z-50 overflow-hidden">
                    <NavLink
                      to="/profile"
                      className="px-4 py-2 text-text-primary hover:bg-(--bg-hover) transition-colors flex items-center gap-2"
                      onClick={() => setShowAvatarDropdown(false)}
                    >
                      <User size={14} /> Profile
                    </NavLink>
                    <button
                      className="w-full text-left px-4 py-2 text-text-primary hover:bg-(--bg-hover) transition-colors flex items-center gap-2 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogIn size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : 
            (
              <NavLink to="/login">
                <ActionButton
                  buttonName="Login/Signup"
                  icon={<LogIn />}
                  iconPosition="right"
                />
              </NavLink>
            )
          }
        </div>
        {/* RIGHT SIDE ENDS HERE */}
      </nav>
      {/* DESKTOP VIEW ENDS HERE */}

      {/* Mobile Menu Overlay: Full-screen with blur */}
      <MobileViewNav isOpen={isOpen} toggleMenu={toggleMenu} user={user} />
    </>
  );
}

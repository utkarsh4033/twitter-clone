// src/components/Navbar.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import FollowModal from "./FollowModel";

const navItems = [
  { id: "home", label: "Home", href: "/home" },
  { id: "profile", label: "Profile", href: "/profile" },
];

function renderIcon(id) {
  switch (id) {
    case "home":
      return (
        <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      );
    case "profile":
      return (
        <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a5 5 0 100 10 5 5 0 000-10zm-7 16a7 7 0 0114 0H3z" />
        </svg>
      );
    case "logout":
      return (
        <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm10.293 3.293a1 1 0 011.414 0L18 10l-3.293 2.707a1 1 0 01-1.414-1.414L14.586 11H9a1 1 0 110-2h5.586l-1.293-1.293a1 1 0 010-1.414z" />
        </svg>
      );
    case "follow":
      return (
        <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 7a3 3 0 11-6 0 3 3 0 016 0zM2 14a6 6 0 1112 0H2z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showFollowModal, setShowFollowModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 p-4">
        <div className="fixed flex flex-col h-screen justify-between">
          <div>
            <div className="mb-8">
              <img src="shared_image.jpg" alt="Logo" className="w-40 h-auto" />
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.href}
                  className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  {renderIcon(item.id)}
                  <span className="text-xl font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <button
            className="bg-red-500 text-white rounded-full py-2 px-8 mb-10 font-bold w-full hover:bg-red-600 transition-colors duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="flex flex-col items-center text-xs text-gray-600 hover:text-blue-500"
            >
              {renderIcon(item.id)}
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Follow Button */}
          <button
            onClick={() => setShowFollowModal(true)}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-purple-500"
          >
            {renderIcon("follow")}
            <span>Follow</span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-red-500"
          >
            {renderIcon("logout")}
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Modal */}
      {showFollowModal && (
        <FollowModal onClose={() => setShowFollowModal(false)} />
      )}
    </>
  );
}

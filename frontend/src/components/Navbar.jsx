import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
const navItems = [
  { id: "home", label: "Home", href: "/home" },
  { id: "profile", label: "Profile", href: "/profile" },
]

function renderIcon(id) {
  switch (id) {
    case "home":
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      );
    case "profile":
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      );
    default:
      return null;
  }
}

function Navbar({ setShowCreatePost }) {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="hidden md:block w-64 p-4">
      <div className="fixed flex flex-col h-screen justify-between">
        <div>
          <div className="mb-8">
            <img
              src="shared_image.jpg"
              alt=""
              className="w-50 h-15 text-blue-500"
            />
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                {renderIcon(item.id)}
                <span className="text-xl font-medium">{item.label}</span>
              </a>
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
  );
}

export default Navbar;
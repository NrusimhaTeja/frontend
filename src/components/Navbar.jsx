import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect admin users to admin page if they try to access other pages
  useEffect(() => {
    if (user?.role === "admin" && location.pathname !== "/admin") {
      navigate("/admin");
    }
  }, [location.pathname, user, navigate]);

  const handleLogout = async () => {
    await axios.post(
      import.meta.env.VITE_REACT_APP_BACKEND_BASEURL + "api/auth/logout",
      {},
      { withCredentials: true }
    );
    dispatch(removeUser());
    navigate("/login");
  };

  const handleNavigation = (path) => {
    // If user is admin, always navigate to admin page
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate(path);
    }
  };

  // Check if user has security role
  const isSecurityRole =
    user && (user.role === "securityGuard" || user.role === "securityOfficer");

  // Render different navigation options based on user role
  const renderNavLinks = () => {
    if (user?.role === "admin") {
      return (
        <Link
          to="/admin"
          className="text-2xl font-semibold text-white hover:text-blue-100 transition-colors"
        >
          findit Admin
          <span className="inline-block ml-1 transform hover:scale-110 transition-transform">
            🔍
          </span>
        </Link>
      );
    }
    
    return (
      <Link
        to="/"
        className="text-2xl font-semibold text-white hover:text-blue-100 transition-colors"
        onClick={(e) => {
          if (user?.role === "admin") {
            e.preventDefault();
            navigate("/admin");
          }
        }}
      >
        findit
        <span className="inline-block ml-1 transform hover:scale-110 transition-transform">
          🔍
        </span>
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-950 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {renderNavLinks()}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-white">
                Welcome, {user.firstName}
                {user.role === "admin" && " (Admin)"}
              </span>

              <div className="relative">
                <div className="dropdown dropdown-end">
                  <button
                    type="button"
                    className="flex rounded-full bg-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-950"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-blue-900">
                      <img
                        src={
                          user?.profilePhoto?.url || "../../public/assets/profile.jpg"
                        }
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </button>
                  <ul className="dropdown-content menu menu-sm mt-3 w-52 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                    {user.role === "admin" ? (
                      // Admin-only dropdown options
                      <li>
                        <Link
                          to="/admin"
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md"
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    ) : (
                      // Regular user dropdown options
                      <>
                        <li>
                          <Link
                            to="/report"
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md"
                            onClick={(e) => {
                              if (user?.role === "admin") {
                                e.preventDefault();
                                navigate("/admin");
                              }
                            }}
                          >
                            Reports
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/request"
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md"
                            onClick={(e) => {
                              if (user?.role === "admin") {
                                e.preventDefault();
                                navigate("/admin");
                              }
                            }}
                          >
                            Requests
                          </Link>
                        </li>
                      </>
                    )}
                    <li className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
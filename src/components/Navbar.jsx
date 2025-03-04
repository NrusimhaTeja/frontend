import React from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate, Link } from "react-router-dom";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.post(BASE_URL + "logout", {}, { withCredentials: true });
    dispatch(removeUser());
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-950 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-2xl font-semibold text-white hover:text-blue-100 transition-colors"
            >
              findit
              <span className="inline-block ml-1 transform hover:scale-110 transition-transform">
                🔍
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-white">
                Welcome, {user.firstName}
              </span>

              <div className="relative">
                <div className="dropdown dropdown-end">
                  <button
                    type="button"
                    className="flex rounded-full bg-blue-900 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-950"
                  >
                    <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-blue-900">
                      <img
                        src={user.profilePhoto.url || "/api/placeholder/400/320"}
                        alt="User"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </button>
                  <ul className="dropdown-content menu menu-sm mt-3 w-52 rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                    <li>
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md"
                      >
                        <span>Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/request" className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md">
                        Requests
                      </Link>
                    </li>
                    <li>
                      <a className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-md">
                        Settings
                      </a>
                    </li>
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
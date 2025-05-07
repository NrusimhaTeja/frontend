import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, UserCog, Trash2, AlertCircle, Menu, X } from "lucide-react";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState({});
  
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Check if user is admin, if not redirect
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/admin/users`,
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setUsers(response.data.data);
          setFilteredUsers(response.data.data);
        } else {
          throw new Error("Failed to fetch users");
        }
      } catch (err) {
        setError(err.message || "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchUsers();
    }
  }, [user]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    
    if (e.target.value.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = e.target.value.toLowerCase();
      const filtered = users.filter(user => 
        user.email.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  };

  // Handle server-side search
  const handleServerSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/admin/users/search?email=${searchQuery}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setFilteredUsers(response.data.data);
      } else {
        throw new Error("Search failed");
      }
    } catch (err) {
      setError("Search failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user role
  const handleRoleUpdate = async (userId, newRole) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/admin/users/${userId}/role`,
        { role: newRole },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the local state
        const updatedUsers = users.map((user) => {
          if (user._id === userId) {
            return { ...user, role: newRole };
          }
          return user;
        });

        setUsers(updatedUsers);
        setFilteredUsers(
          filteredUsers.map((user) => {
            if (user._id === userId) {
              return { ...user, role: newRole };
            }
            return user;
          })
        );

        setSuccessMessage("User role updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data.message || "Failed to update user role");
      }
    } catch (err) {
      setError(err.message || "Failed to update user role");
      setTimeout(() => setError(null), 3000);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/admin/users/${userId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        // Update the local state
        setUsers(users.filter((user) => user._id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));

        setSuccessMessage("User deleted successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (err) {
      setError(err.message || "Failed to delete user");
      setTimeout(() => setError(null), 3000);
    }
  };

  const toggleMobileActions = (userId) => {
    setShowMobileActions(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  // If not logged in or not admin
  if (!user || (user && user.role !== "admin")) {
    return null; // Will be redirected by useEffect
  }

  // Mobile card view for users
  const renderMobileUserCards = () => (
    <div className="space-y-4">
      {filteredUsers.map((user, index) => (
        <div key={user._id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <div className="font-medium">{user.firstName} {user.lastName || ''}</div>
            <div className="text-xs text-gray-500">#{index + 1}</div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Email:</span>
              <span className="text-right">{user.email}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Department:</span>
              <span>{user.department || 'N/A'}</span>
            </div>
            
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="text-gray-500">Role:</span>
              <select
                value={user.role}
                onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="securityGuard">Security Guard</option>
                <option value="securityOfficer">Security Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t">
            <button
              onClick={() => handleDeleteUser(user._id)}
              className="w-full flex items-center justify-center text-red-600 hover:text-red-800 py-1"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete User
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Table for tablet and desktop view
  const renderDesktopTable = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.No
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 truncate max-w-xs">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {user.firstName} {user.lastName || ''}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                    className="text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="securityGuard">Security Guard</option>
                    <option value="securityOfficer">Security Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.department || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(user._id)}
                    className="text-red-600 hover:text-red-800 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-blue-950">Admin Dashboard</h1>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="mb-4 md:mb-6 bg-green-100 text-green-700 p-3 rounded-lg flex items-center">
          <div className="mr-2">✓</div>
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 md:mb-6 bg-red-100 text-red-700 p-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex-1 flex items-center rounded-lg shadow-sm overflow-hidden border border-gray-300 bg-white">
            <div className="pointer-events-none pl-3 md:pl-4">
              <Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-2 md:py-3 pl-2 md:pl-3 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search users by email"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleServerSearch()}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 md:px-4 py-2 md:py-3 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
          <button
            onClick={handleServerSearch}
            className="px-4 py-2 md:py-3 bg-blue-950 text-white text-sm rounded-lg md:rounded-none hover:bg-blue-900"
          >
            Search
          </button>
        </div>
        <div className="mt-2 text-xs md:text-sm text-gray-600">
          {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center items-center py-8 md:py-12">
          <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-950"></div>
        </div>
      )}

      {/* Users Table or Cards (based on screen size) */}
      {!isLoading && filteredUsers.length > 0 && (
        <>
          {mobileView ? renderMobileUserCards() : renderDesktopTable()}
        </>
      )}

      {/* Empty State */}
      {!isLoading && filteredUsers.length === 0 && (
        <div className="py-8 md:py-12 text-center">
          <div className="text-gray-400 mb-3">
            <Search className="h-8 w-8 md:h-12 md:w-12 mx-auto" />
          </div>
          <h3 className="text-base md:text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-2 text-xs md:text-sm text-gray-500">
            {searchQuery ? `We couldn't find any users with email "${searchQuery}"` : 'No users available in the system.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 border border-transparent text-xs md:text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
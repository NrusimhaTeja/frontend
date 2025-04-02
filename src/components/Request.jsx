import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Search } from "lucide-react"; // Import Search icon
import RequestCard from "./RequestCard";
import ReceivedRequestCard from "./ReceivedRequestCard";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((Store) => Store.user);
  
  // Determine if the user is a security Officer
  const isSecurityOfficer = user?.role === "securityOfficer";
  
  const fetchItems = async () => {
    setLoading(true);
    try {
      // Use different endpoint based on user role
      const endpoint = isSecurityOfficer
        ? `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/received-requests`
        : `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/my-request-tokens`;
      
      const response = await axios.get(endpoint, {
        withCredentials: true,
      });
      
      console.log(response.data);
      setRequests(response.data);
    } catch (err) {
      console.error(`Error fetching ${isSecurityOfficer ? "Received" : ""} Requests:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [isSecurityOfficer]); // Re-fetch when role changes

  // Filter requests based on search term (for security officer)
  const filteredRequests = isSecurityOfficer && searchTerm
    ? requests.filter(request => 
        request.token && request.token.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : requests;

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isSecurityOfficer ? "Received Requests" : "My Requests"}
      </h2>
      
      {/* Search Bar - Only for security officers */}
      {isSecurityOfficer && (
        <div className="relative my-6">
          <div className="flex items-center rounded-lg shadow-sm overflow-hidden border border-gray-300 bg-white">
            <div className="pointer-events-none pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-3 pl-3 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search by token number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-0 px-4 py-3 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {filteredRequests.length} {filteredRequests.length === 1 ? 'item' : 'items'} found
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
        </div>
      )}
      
      {/* Items List */}
      {!loading && filteredRequests.length > 0 && (
        <div className="flex flex-col space-y-6">
          {filteredRequests.map((request) => (
            <React.Fragment key={request._id}>
              {isSecurityOfficer ? (
                <ReceivedRequestCard request={request} />
              ) : (
                <RequestCard
                  verifiedDescription={request.itemId.verifiedDescription}
                  images={request.itemId.images}
                  token={request.token}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && filteredRequests.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {isSecurityOfficer
              ? searchTerm 
                ? "No matching requests found."
                : "No received requests found."
              : "No requests found."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Request;
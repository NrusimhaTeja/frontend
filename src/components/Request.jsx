import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import RequestCard from "./RequestCard";
import ReceivedRequestCard from "./ReceivedRequestCard";

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((Store) => Store.user);
  
  // Determine if the user is a security Officer
  const isSecurityOfficer = user?.role === "securityOfficer";
  
  const fetchItems = async () => {
    setLoading(true);
    try {
      // Use different endpoint based on user role
      const endpoint = isSecurityOfficer 
        ? `${BASE_URL}api/items/received-requests` 
        : `${BASE_URL}api/items/my-request-tokens`;
      
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

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Title */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isSecurityOfficer ? "Received Requests" : "My Requests"}
      </h2>
      
      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
        </div>
      )}

      {/* Items List */}
      {!loading && requests.length > 0 && (
        <div className="flex flex-col space-y-6">
          {requests.map((request) => (
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
      {!loading && requests.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {isSecurityOfficer 
              ? "No received requests found." 
              : "No requests found."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Request;
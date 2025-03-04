import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../utils/constants";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "found":
      return "bg-emerald-500 text-white ring-emerald-500/20";
    case "lost":
      return "bg-rose-500 text-white ring-rose-500/20";
    case "claimed":
      return "bg-amber-500 text-gray-800 ring-amber-500/20";
    default:
      return "bg-gray-400 text-white ring-gray-400/20";
  }
};

const Card = ({
  itemId,
  title,
  description,
  location,
  status,
  itemImg,
  name,
  profilePhoto,
  designation,
  department,
  id,
}) => {
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    if (isRequested || isLoading) return;
    
    setIsLoading(true);
    try {
      let response;
      if (status === "lost") {
        response = await axios.post(BASE_URL+"request/send/return/"+itemId, {}, {withCredentials: true});
      } else {
        response = await axios.post(BASE_URL+"request/send/claim/"+itemId, {}, {withCredentials: true});
      }
      
      setIsRequested(true);
      toast.success("Request sent successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-72 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Upper Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex h-full">
          {/* Image Section */}
          <div className="w-1/2">
            <img
              src={itemImg || "../../public/assets/test.png"}
              alt="Item"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="w-1/2 p-4 flex flex-col justify-between">
            {/* Status Badge */}
            <div
              className={`inline-flex self-end px-2.5 py-1 text-xs font-medium rounded-full ring-1 ${getStatusColor(
                status
              )}`}
            >
              {status}
            </div>

            {/* Item Details */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                {title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {description}
              </p>
            </div>

            {/* Time and Location */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>10-Sep-2023</span>
                <span>4:00pm</span>
              </div>
              <div className="flex items-center text-xs font-medium text-gray-700">
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100">
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white">
            <img
              src={profilePhoto}
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{name}</div>
            <div className="text-xs text-gray-500">{id}</div>
            <div className="text-xs text-gray-500">
              {designation}, {department}
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={handleRequest}
          disabled={isRequested || isLoading}
          className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
            isRequested
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : isLoading
              ? "bg-blue-400 text-white cursor-wait"
              : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isLoading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isRequested ? (
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  status === "found"
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" // Checkmark for claim
                    : "M7 16l-4-4m0 0l4-4m-4 4h18" // Return arrow
                }
              />
            </svg>
          )}
          {isRequested
            ? "Requested"
            : isLoading
            ? "Processing"
            : status === "lost"
            ? "Return"
            : "Claim"}
        </button>
      </div>
    </div>
  );
};

export default Card;  
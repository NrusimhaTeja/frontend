import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../utils/constants";
import ClaimItemModal from "./ClaimItemModal";
import ReturnItemModal from "./ReturnItemModal";

// Default placeholder image (Base64 encoded)
const DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
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
  questions,
  time
}) => {
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // Safety checks for image URLs
  const safeItemImage = itemImg || DEFAULT_IMAGE;
  const safeProfilePhoto = profilePhoto || DEFAULT_IMAGE;

  const handleRequest = async () => {
    if (status?.toLowerCase() === "found") {
      setIsClaimModalOpen(true);
    } else if (status?.toLowerCase() === "lost") {
      setIsReturnModalOpen(true);
    }
  };

  return (
    <>
      <div className="w-72 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={safeItemImage}
            alt="Item"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = DEFAULT_IMAGE }}
          />
          
          {/* Status Badge */}
          <div
            className={`absolute top-2 right-2 inline-flex px-2.5 py-1 text-xs font-medium rounded-full ring-1 ${getStatusColor(
              status
            )}`}
          >
            {status || 'Unknown'}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-3">
          {/* Title and Description */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
              {title || 'Unknown Item'}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description || 'No description available'}
            </p>
          </div>

          {/* Location and Time */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-blue-600"
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
              {location || 'Unknown Location'}
            </div>
            <div className="flex items-center">
              <svg
                className="mr-2 h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {time ? new Date(time).toLocaleDateString() : 'N/A'}
            </div>
          </div>

          {/* User Profile and Action Button */}
          <div className="flex items-center justify-between border-t pt-3 mt-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white">
                <img
                  src={safeProfilePhoto}
                  alt="User"
                  className="h-full w-full object-cover"
                  onError={(e) => { e.target.src = DEFAULT_IMAGE }}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{name || 'Anonymous'}</div>
                <div className="text-xs text-gray-500">{id || 'N/A'}</div>
                <div className="text-xs text-gray-500">
                  {designation || 'No Designation'}, {department || 'No Department'}
                </div>
              </div>
            </div>

            {/* Action Button */}
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
              {status?.toLowerCase() === "lost" ? "Return" : "Claim"}
            </button>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimItemModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        itemId={itemId}
        questions={questions}
        title={title}
      />

      {/* Return Modal */}
      <ReturnItemModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        itemId={itemId}
        title={title}
      />
    </>
  );
};

export default Card;
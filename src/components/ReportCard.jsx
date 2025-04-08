import React, { useState } from "react";
import { MapPin, Tag, Key } from "lucide-react";

const DEFAULT_IMAGE = 
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const ReportCard = ({
  itemType,
  description,
  location,
  images,
  time,
  token,
}) => {
  const safeImages =
    images && images.length > 0 ? images : [{ url: "/assets/found.jpg" }];
    
  return (
    <>
      <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={safeImages[0].url || DEFAULT_IMAGE}
            alt="Reported Item"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
        
        {/* Details Section */}
        <div className="p-4 space-y-3">
          {/* Title and Description */}
          <div>
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                {itemType || "Unknown Item"}
              </h3>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description || "No description available"}
            </p>
          </div>
          
          {/* Location and Time */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-blue-600" />
              {location || "Unknown Location"}
            </div>
            <div>{time ? new Date(time).toLocaleDateString() : "N/A"}</div>
          </div>
          
          {/* Token Display */}
          <div className="flex flex-col border-t pt-3 mt-3">
            <div className="flex items-center mb-2">
              <Key className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-gray-700">Your Token:</span>
            </div>
            {token ? (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-center">
                <span className="font-mono text-sm text-blue-700 font-semibold tracking-wide">
                  {token}
                </span>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-2 text-center">
                <span className="font-mono text-sm text-gray-500">
                  No token available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportCard;
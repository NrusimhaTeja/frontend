import React, { useState } from "react";
import { MapPin, Tag } from "lucide-react";
import ClaimItemModal from "./ClaimItemModal";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "submitted":
      return "bg-emerald-500 text-white ring-emerald-500/20";
    case "lost":
      return "bg-rose-500 text-white ring-rose-500/20";
    case "claimed":
      return "bg-amber-500 text-gray-800 ring-amber-500/20";
    default:
      return "bg-gray-400 text-white ring-gray-400/20";
  }
};

const FoundItemCard = ({
  itemType,
  description,
  location,
  status,
  questions,
  currentHolder,
  images,
  time,
  itemId,
}) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const safeImages =
    images && images.length > 0 ? images : [{ url: DEFAULT_IMAGE }];
  const safeCurrentHolder = currentHolder || {};

  const handleRequest = () => {
    if (status?.toLowerCase() === "found") {
      setIsClaimModalOpen(true);
    }
  };

  return (
    <>
      <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={safeImages[0].url || DEFAULT_IMAGE}
            alt="Found Item"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />

          {/* Status Badge */}
          <div
            className={`absolute top-2 right-2 inline-flex px-2.5 py-1 text-xs font-medium rounded-full ring-1 ${getStatusColor(
              status
            )}`}
          >
            {status || "Unknown"}
          </div>
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

          {/* User Profile and Action Button */}
          <div className="flex items-center justify-between border-t pt-3 mt-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white">
                <img
                  src={safeCurrentHolder.profilePhoto?.url || DEFAULT_IMAGE}
                  alt="User"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {safeCurrentHolder.firstName || "Anonymous"}{" "}
                  {safeCurrentHolder.lastName || ""}
                </div>
                <div className="text-xs text-gray-500">
                  {safeCurrentHolder.id || "N/A"}
                </div>
                <div className="text-xs text-gray-500">
                  {safeCurrentHolder.designation || "No Designation"},
                  {safeCurrentHolder.department || "No Department"}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleRequest}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
              bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 
              shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Claim
            </button>
          </div>
        </div>
        <ClaimItemModal
          isOpen={isClaimModalOpen}
          onClose={() => setIsClaimModalOpen(false)}
          itemId={itemId}
          questions={questions}
          title={itemType}
        />
      </div>
    </>
  );
};

export default FoundItemCard;

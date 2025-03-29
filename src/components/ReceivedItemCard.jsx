import React, { useState } from "react";
import { MapPin, Tag, Calendar } from "lucide-react";
import ClaimItemModal from "./ClaimItemModal";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "received":
      return "bg-emerald-500 text-white ring-emerald-500/20";
    default:
      return "bg-gray-400 text-white ring-gray-400/20";
  }
};

const ReceivedItemCard = ({
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

  const handleClaim = () => {
    setIsClaimModalOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
        {/* Image Section - Fixed Height */}
        <div className="relative h-40 w-full overflow-hidden flex-shrink-0">
          <img
            src={safeImages[0].url || DEFAULT_IMAGE}
            alt="Received Item"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </div>

        {/* Details Section - Flexible Height */}
        <div className="p-4 space-y-3 flex-grow flex flex-col">
          {/* Title and Description */}
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <h3 className="text-base font-semibold text-gray-900">
                {itemType || "Unknown Item"}
              </h3>
            </div>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">
              {description || "No description available"}
            </p>
          </div>

          {/* Location and Time */}
          <div className="text-xs text-gray-500 space-y-1 mt-auto flex-shrink-0">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{location || "Unknown Location"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{time ? new Date(time).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>

          {/* Divider and Action Button */}
          <div className="pt-2 mt-2 border-t border-gray-100 flex-shrink-0">
            <div className="flex justify-end mt-2">
              <button
                onClick={handleClaim}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg 
                bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 
                shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      <ClaimItemModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        itemId={itemId}
        questions={questions}
        title={itemType}
      />
    </>
  );
};

export default ReceivedItemCard;
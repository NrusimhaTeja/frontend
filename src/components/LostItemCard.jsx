import React from "react";
import { MapPin, Tag } from "lucide-react";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

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

const LostItemCard = ({
  itemType,
  description,
  location,
  status,
  images,
  time,
}) => {
  const safeImages =
    images && images.length > 0 ? images : [{ url: DEFAULT_IMAGE }];

  return (
    <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={safeImages[0].url || DEFAULT_IMAGE}
          alt="Lost Item"
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
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4 text-blue-600" />
            {location || "Unknown Location"}
          </div>
          <div>{time ? new Date(time).toLocaleDateString() : "N/A"}</div>
        </div>
      </div>
    </div>
  );
};

export default LostItemCard;

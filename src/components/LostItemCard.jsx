import React, { useState } from "react";
import { MapPin, Tag, Calendar } from "lucide-react";

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
  const [imageError, setImageError] = useState(false);
  const safeImages =
    images && images.length > 0 ? images : [{ url: "../../public/assets/lost.jpg" }];

  return (
    <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
      {/* Image Section - Improved Height and Display */}
      <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
        <img
          src={imageError ? DEFAULT_IMAGE : (safeImages[0].url || DEFAULT_IMAGE)}
          alt="Lost Item"
          className="w-full h-full object-contain bg-gray-100"
          onError={(e) => {
            setImageError(true);
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        
        {/* Image Navigation for Multiple Images (if implemented in the future) */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {safeImages.map((_, index) => (
              <div 
                key={index} 
                className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'}`} 
              />
            ))}
          </div>
        )}
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
          <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-3">
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
      </div>
    </div>
  );
};

export default LostItemCard;
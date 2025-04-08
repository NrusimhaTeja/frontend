import React, { useState } from "react";
import { Calendar } from "lucide-react";
import ClaimItemModal from "./ClaimItemModal";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const VerifiedItemCard = ({
  verifiedDescription,
  images,
  time,
  status,
  itemId,
  questions = [], // Add questions prop with default empty array
}) => {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const user = useSelector((store) => store.user);

  const safeImages =
    images && images.length > 0 ? images : [{ url: "/assets/found.jpg"}];

  const handleClaim = () => {
    setIsClaimModalOpen(true);
  };

  // Format relative time (e.g., "11 hours ago", "1 week ago")
  const formattedTime = time
    ? formatDistanceToNow(new Date(time), { addSuffix: true })
    : "N/A";

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
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
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
          {/* Description */}
          <div className="mb-2 sm:mb-3 flex-grow">
            <p className="text-gray-800 text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
              {verifiedDescription || "No description available"}
            </p>
          </div>
          
          {/* Time */}
          <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
            <Calendar size={14} className="mr-1" />
            <span>{formattedTime}</span>
          </div>
          
          {/* Divider and Action Button */}
          <div className="pt-2 sm:pt-3 border-t border-gray-200">
            <button
              onClick={handleClaim}
              className="w-full py-1.5 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Claim
            </button>
          </div>
        </div>
      </div>
      
      {/* Claim Modal */}
      <ClaimItemModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        itemId={itemId}
        title="Verified Item"
        questions={questions} // Pass questions to the modal
      />
    </>
  );
};

export default VerifiedItemCard;
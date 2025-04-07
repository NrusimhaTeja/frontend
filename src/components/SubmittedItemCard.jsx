import React, { useState } from "react";
import { MapPin, Tag, Calendar, Check, X, User, Image } from "lucide-react";
import axios from "axios";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "submitted":
      return "bg-blue-500 text-white ring-blue-500/20";
    case "received":
      return "bg-emerald-500 text-white ring-emerald-500/20";
    case "rejected":
      return "bg-red-500 text-white ring-red-500/20";
    default:
      return "bg-gray-400 text-white ring-gray-400/20";
  }
};

const SubmittedItemCard = ({
  itemId,
  itemType,
  description,
  location,
  status,
  foundBy,
  images,
  time,
  onStatusUpdate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [notes, setNotes] = useState("");
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const safeImages =
    images && images.length > 0 ? images : [{ url: "../../public/assets/found.jpg" }];

  const handleActionClick = (action) => {
    setSelectedAction(action);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setNotes("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!itemId) return;
    
    setIsUpdating(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/${itemId}/review`,
        { 
          status: selectedAction,
          notes: notes 
        },
        { withCredentials: true }
      );
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
      handleFormClose();
    } catch (err) {
      console.error(`Error updating item status to ${selectedAction}:`, err);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const navigateImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
      {/* Status Badge */}
      <div className="absolute top-2 right-2 z-10">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(status)}`}>
          {status || "Unknown"}
        </span>
      </div>
      
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
        <img
          src={imageError ? DEFAULT_IMAGE : (safeImages[currentImageIndex]?.url || DEFAULT_IMAGE)}
          alt="Submitted Item"
          className="w-full h-full object-contain bg-gray-100"
          onError={(e) => {
            setImageError(true);
            e.target.src = DEFAULT_IMAGE;
          }}
        />
        
        {/* Image Navigation for Multiple Images */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
            {safeImages.map((_, index) => (
              <button 
                key={index} 
                onClick={() => navigateImage(index)}
                className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-blue-600' : 'bg-gray-300'}`} 
                aria-label={`View image ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Image Counter */}
        {safeImages.length > 1 && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Image className="h-3 w-3 mr-1" />
            {currentImageIndex + 1}/{safeImages.length}
          </div>
        )}
      </div>

      {/* Details Section */}
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

        {/* Found By Information */}
        {foundBy && (
          <div className="text-xs text-gray-500 flex items-center">
            <User className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
            <span>Found by: {foundBy}</span>
          </div>
        )}

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

        {/* Action Buttons */}
        <div className="pt-2 mt-2 border-t border-gray-100 flex-shrink-0">
          {isUpdating ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="flex space-x-2 justify-end">
              <button
                onClick={() => handleActionClick("received")}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg 
                          bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 
                          shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                disabled={status?.toLowerCase() === "received" || status?.toLowerCase() === "rejected"}
              >
                <Check className="h-3 w-3" /> Accept
              </button>
              <button
                onClick={() => handleActionClick("rejected")}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg 
                          bg-red-600 text-white hover:bg-red-700 active:bg-red-800 
                          shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                disabled={status?.toLowerCase() === "received" || status?.toLowerCase() === "rejected"}
              >
                <X className="h-3 w-3" /> Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notes Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {selectedAction === "received" ? "Accept Item" : "Reject Item"}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Add any relevant notes or comments..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleFormClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedAction === "received"
                      ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    `Confirm ${selectedAction === "received" ? "Accept" : "Reject"}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmittedItemCard;
import React, { useState } from "react";
import { MapPin, Tag, Calendar, Check, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const DEFAULT_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "submitted":
      return "bg-blue-500 text-white ring-blue-500/20";
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
  uniqueMarks,
  images,
  time,
  onStatusUpdate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [notes, setNotes] = useState("");

  const safeImages =
    images && images.length > 0 ? images : [{ url: DEFAULT_IMAGE }];

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
        `${BASE_URL}api/items/${itemId}/review`,
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

  return (
    <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
      {/* Image Section - Fixed Height */}
      <div className="relative h-40 w-full overflow-hidden flex-shrink-0">
        <img
          src={safeImages[0].url || DEFAULT_IMAGE}
          alt="Submitted Item"
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
          {uniqueMarks && (
            <div className="mt-1 text-xs text-gray-600">
              <span className="font-medium">Unique Marks:</span> {uniqueMarks}
            </div>
          )}
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
              >
                <Check className="h-3 w-3" /> Accept
              </button>
              <button
                onClick={() => handleActionClick("rejected")}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg 
                          bg-red-600 text-white hover:bg-red-700 active:bg-red-800 
                          shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
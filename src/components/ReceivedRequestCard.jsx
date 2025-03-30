import React, { useState } from "react";
import { MapPin, Tag, Calendar, User, Key, CheckCircle, Clock, MessageCircle, Image, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const DEFAULT_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

const ReceivedRequestCard = ({ request }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showItemDetails, setShowItemDetails] = useState(false);
  
  // Extract data from the request object
  const {
    itemId,
    token,
    _id,
    answers,
    proofImages
  } = request;

  // Get item images
  const itemImages = itemId.images && itemId.images.length > 0 
    ? itemId.images 
    : [{ url: DEFAULT_IMAGE }];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Parse answers if it's a string
  let parsedAnswers = [];
  if (answers && answers.length > 0) {
    try {
      if (typeof answers[0] === 'string') {
        parsedAnswers = JSON.parse(answers[0]);
      } else {
        parsedAnswers = answers;
      }
    } catch (err) {
      parsedAnswers = [];
    }
  }

  // Handle verification of item (Accept)
  const handleAccept = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      await axios.post(
        `${BASE_URL}api/items/verify/${request._id}`,
        { status: 'approved' },
        { withCredentials: true }
      );
      setSuccessMessage("Request accepted successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to accept request");
    } finally {
      setLoading(false);
    }
  };

  // Handle rejection of item
  const handleReject = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage("");
    try {
      await axios.post(
        `${BASE_URL}api/items/verify/${request._id}`,
        { status: 'rejected' },
        { withCredentials: true }
      );
      setSuccessMessage("Request rejected successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reject request");
    } finally {
      setLoading(false);
    }
  };

  // Toggle item details
  const toggleItemDetails = () => {
    setShowItemDetails(!showItemDetails);
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Main Card Content - Always Visible */}
      <div className="p-5">
        {/* Top Row: Token and Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Token Display */}
          <div className="flex items-center">
            <Key className="h-5 w-5 text-blue-600 mr-2" />
            <div className="bg-blue-50 border border-blue-100 rounded-md px-3 py-1">
              <span className="font-mono text-blue-700 font-medium tracking-wide">
                {token || itemId.token || "No token"}
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <Check className="h-4 w-4 mr-2" />
              )}
              Accept
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Reject
            </button>
          </div>
        </div>
        
        {/* Status Messages */}
        {(error || successMessage) && (
          <div className={`mb-4 p-3 rounded-md ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {error || successMessage}
          </div>
        )}
        
        {/* Middle Section: Proof Images and Q&A */}
        <div className="flex flex-col md:flex-row gap-6 mb-4">
          {/* Proof Images */}
          <div className="md:w-1/3">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Proof of Ownership</h3>
            {proofImages && proofImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {proofImages.map((image, index) => (
                  <div key={`proof-${index}`} className="aspect-square rounded-md overflow-hidden bg-gray-50">
                    <img
                      src={image.url || DEFAULT_IMAGE}
                      alt={`Proof ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = DEFAULT_IMAGE }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No proof images provided</p>
            )}
          </div>
          
          {/* Questions & Answers */}
          <div className="md:w-2/3">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Verification Questions</h3>
            {(itemId.questions && itemId.questions.length > 0) ? (
              <div className="space-y-2">
                {itemId.questions.map((question, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-1">Q: {question}</p>
                    {parsedAnswers[index] && (
                      <p className="text-sm text-gray-600">
                        A: {parsedAnswers[index].answer || parsedAnswers[index]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No verification questions</p>
            )}
          </div>
        </div>
        
        {/* Toggle Details Button */}
        <button 
          onClick={toggleItemDetails}
          className="w-full flex items-center justify-center py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-100 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          {showItemDetails ? (
            <>Hide Item Details <ChevronUp className="h-4 w-4 ml-1" /></>
          ) : (
            <>See Item Details <ChevronDown className="h-4 w-4 ml-1" /></>
          )}
        </button>
      </div>
      
      {/* Expandable Item Details */}
      {showItemDetails && (
        <div className="border-t border-gray-200 bg-gray-50 p-5">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Item Details</h3>
          
          {/* Item Gallery */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Item Images</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {itemImages.map((image, index) => (
                <div key={`item-${index}`} className="aspect-square rounded-md overflow-hidden bg-white border border-gray-200">
                  <img
                    src={image.url || DEFAULT_IMAGE}
                    alt={`Item ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = DEFAULT_IMAGE }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Item Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <Tag className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <div>
                <span className="text-sm font-medium text-gray-700">Item Type</span>
                <p className="text-sm text-gray-600">{itemId.itemType || "Unknown"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <div>
                <span className="text-sm font-medium text-gray-700">Location</span>
                <p className="text-sm text-gray-600">{itemId.location || "Unknown"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <div>
                <span className="text-sm font-medium text-gray-700">Time Found</span>
                <p className="text-sm text-gray-600">{itemId.time ? formatDate(itemId.time) : "Unknown"}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <User className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <div>
                <span className="text-sm font-medium text-gray-700">Found By</span>
                <p className="text-sm text-gray-600">{itemId.foundBy || "Unknown"}</p>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mt-4">
            <div className="flex items-start mb-1">
              <MessageCircle className="h-4 w-4 text-blue-600 mt-1 mr-2" />
              <span className="text-sm font-medium text-gray-700">Description</span>
            </div>
            <p className="text-sm text-gray-600 ml-6">{itemId.description || "No description available"}</p>
          </div>
          
          {/* Verified Description (if exists) */}
          {itemId.verifiedDescription && (
            <div className="mt-4">
              <div className="flex items-start mb-1">
                <CheckCircle className="h-4 w-4 text-green-600 mt-1 mr-2" />
                <span className="text-sm font-medium text-gray-700">Verified Description</span>
              </div>
              <p className="text-sm text-gray-600 ml-6">{itemId.verifiedDescription}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceivedRequestCard;
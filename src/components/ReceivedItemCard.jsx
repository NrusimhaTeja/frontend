import React, { useState } from "react";
import {
  MapPin,
  Tag,
  Calendar,
  Plus,
  Trash2,
  User,
  BadgeCheck,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

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
  foundBy,
  receivedBy,
  images,
  time,
  itemId,
}) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [questions, setQuestions] = useState([{ id: 1, text: "" }]);
  const [verifiedDescription, setVerifiedDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector((store) => store.user);

  const safeImages =
    images && images.length > 0 ? images : [{ url: "/assets/found.jpg" }];

  const handlePost = () => {
    setIsPostModalOpen(true);
  };

  const addQuestion = () => {
    const newId =
      questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setQuestions([...questions, { id: newId, text: "" }]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((question) => question.id !== id));
  };

  const updateQuestion = (id, text) => {
    setQuestions(
      questions.map((question) =>
        question.id === id ? { ...question, text } : question
      )
    );
  };

  // In your handleSubmitQuestions function, modify how you're handling FormData:

  const handleSubmitQuestions = async (e) => {
    e.preventDefault();

    // Filter out empty questions
    const validQuestions = questions.filter((q) => q.text.trim() !== "");

    // Show loading state
    setLoading(true);

    try {
      // Instead of using FormData, send a regular JSON object
      const requestData = {
        verifiedDescription: verifiedDescription,
        questions: validQuestions.map((q) => q.text),
      };

      // Debug logs
      console.log("Sending data:", requestData);

      // Make the API call with JSON
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/${itemId}/verify`,
        requestData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      // Show success toast
      toast.success("Questions submitted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Close modal and reset form
      setIsPostModalOpen(false);
      setQuestions([{ id: 1, text: "" }]);
      setVerifiedDescription("");
    } catch (error) {
      console.error("Error submitting questions:", error);
      toast.error("Failed to submit questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const navigateImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <>
      <div className="w-full max-w-xs mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
        {/* Status Badge */}
        {status && (
          <div className="absolute top-2 right-2 z-10">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
          <img
            src={
              imageError
                ? DEFAULT_IMAGE
                : safeImages[currentImageIndex]?.url || DEFAULT_IMAGE
            }
            alt="Received Item"
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
                  className={`h-2 w-2 rounded-full ${
                    index === currentImageIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
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

          {/* Found By and Received By */}
          <div className="text-xs text-gray-500 space-y-1 mt-1 flex-shrink-0">
            {foundBy && (
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Found by: {foundBy}</span>
              </div>
            )}
            {receivedBy && (
              <div className="flex items-center">
                <BadgeCheck className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Received by: {receivedBy}</span>
              </div>
            )}
          </div>

          {/* Location and Time */}
          <div className="text-xs text-gray-500 space-y-1 mt-1 flex-shrink-0">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{location || "Unknown Location"}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
              <span>{time ? new Date(time).toLocaleDateString() : "N/A"}</span>
            </div>
          </div>

          {/* Divider and Post Button */}
          <div className="pt-2 mt-2 border-t border-gray-100 flex-shrink-0">
            <div className="flex justify-center mt-2">
              <button
                onClick={handlePost}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg
                 bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
                 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Post Questions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Questions Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Post Questions for {itemType || "Item"}
            </h2>

            <form onSubmit={handleSubmitQuestions}>
              {/* Verified Description Field */}
              <div className="mb-4">
                <label
                  htmlFor="verified-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Verified Description
                </label>
                <textarea
                  id="verified-description"
                  value={verifiedDescription}
                  onChange={(e) => setVerifiedDescription(e.target.value)}
                  placeholder="Enter verified description of the item..."
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm"
                />
              </div>

              <div className="border-t border-gray-200 my-4 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Questions
                </h3>
                <div className="space-y-4 mb-6">
                  {questions.map((question) => (
                    <div key={question.id} className="flex items-start gap-2">
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(question.id, e.target.value)
                        }
                        placeholder="Enter a question..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500 p-2 rounded-md hover:bg-red-50"
                        aria-label="Remove question"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Question
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ReceivedItemCard;

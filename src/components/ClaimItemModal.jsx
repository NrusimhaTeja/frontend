import React, { useState } from "react";
import axios from "axios";
import { X, MessageCircle } from "lucide-react";
import { BASE_URL } from "../utils/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageUploader from "./ImageUploader";

const ClaimItemModal = ({ isOpen, onClose, itemId, questions = [], title }) => {
  const [formData, setFormData] = useState({});
  const [images, setImages] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...fileArray]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataObj = new FormData();

      // Append item ID
      formDataObj.append("itemId", itemId);

      // Append answers
      const answers = Object.entries(formData).map(([question, answer]) => ({
        question,
        answer,
      }));
      formDataObj.append("answers", JSON.stringify(answers));

      // Append proof images
      for (let i = 0; i < images.length; i++) {
        formDataObj.append("proofImages", images[i].file);
      }

      // Append additional notes if not empty
      if (additionalNotes.trim()) {
        formDataObj.append("additionalNotes", additionalNotes.trim());
      }


      // Debug: Log form data contents before appending
      console.log("Questions:", questions);
      console.log("Form Data:", formData);
      console.log("Images:", images);
      console.log("Additional Notes:", additionalNotes);

      for (let [key, value] of formDataObj.entries()) {
        console.log(`FormData - ${key}:`, value);
      }

      // Detailed axios config
      const response = await axios.post(
        `${BASE_URL}request/send/claim/${itemId}`,
        formDataObj,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          // Add these for debugging
          onUploadProgress: (progressEvent) => {
            console.log(
              "Upload Progress:",
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            );
          },
        }
      );

      console.log("Server Response:", response.data);

      // await axios.post(`${BASE_URL}request/send/claim/${itemId}`, formDataObj, {
      //   withCredentials: true,
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   },
      // });

      // Add delay to ensure toast is visible before closing
      await new Promise((resolve) => {
        toast.success("Claim request submitted successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: resolve,
        });
      });
      onClose();

      // Reset form
      setFormData({});
      setImages([]);
      setAdditionalNotes("");
    } catch (error) {
      console.error("Error submitting claim:", error);
      toast.error("Failed to submit claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Claim {title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Questions */}
          {questions.length > 0 ? (
            questions.map((q, index) => (
              <div key={index} className="mb-4">
                <label className="block text-gray-700 mb-1">{q}</label>
                <input
                  type="text"
                  name={q}
                  value={formData[q] || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your answer"
                  required
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              No claim questions available for this item.
            </div>
          )}

          {/* Image Upload */}
          <ImageUploader
            images={images}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            disabled={loading}
          />

          {/* Additional Notes Section */}
          <div className="mb-4">
            <label
              htmlFor="additional-notes"
              className="block text-gray-700 mb-1 flex items-center"
            >
              <MessageCircle size={16} className="mr-2" /> Additional Notes
            </label>
            <textarea
              id="additional-notes"
              rows={3}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide any additional context or unique details about your claim (optional)"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Helps provide context or explain any special circumstances about
              the claim
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 mt-4"
          >
            {loading ? "Submitting..." : "Submit Claim"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ClaimItemModal;

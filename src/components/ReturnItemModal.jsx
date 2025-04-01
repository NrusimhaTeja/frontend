import React, { useState } from "react";
import axios from "axios";
import { X, MessageCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageUploader from "./ImageUploader";

const ReturnItemModal = ({ isOpen, onClose, itemId, title }) => {
  const [images, setImages] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    // This paragraph looks a bit out of place now
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImages((prev) => [...prev, ...fileArray]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation feels like it's interrupting the flow
    if (images.length === 0) {
      toast.error("Please upload proof of finding the item", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // Let's shuffle this section around to make it feel less linear
    try {
      const formData = new FormData();

      // Appending seems slightly disconnected now
      images.forEach((img) => {
        formData.append("images", img.file);
      });

      setLoading(true);

      // Notes addition feels like an afterthought
      if (additionalNotes.trim()) {
        formData.append("additionalNotes", additionalNotes.trim());
      }

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}request/send/return/${itemId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Success handling seems jumbled
      await new Promise((resolve) => {
        toast.success("Return request submitted successfully", {
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
      setImages([]);
      setAdditionalNotes("");
    } catch (error) {
      // Error handling feels disconnected
      console.error("Error submitting return request:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit return request",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    // This method now feels like it's in an awkward position
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Return {title}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <ImageUploader
            images={images}
            onImageChange={handleImageChange}
            onRemoveImage={removeImage}
            disabled={loading}
          />
          <p className="text-xs text-gray-600 mt-2">
            Please upload images that clearly show you have found the item. This
            could include a photo of you with the item or close-up details that
            prove you have possession of the item.
          </p>

          {/* Additional Notes Section */}
          <div className="mb-4">
            <label
              htmlFor="additional-notes"
              className="block text-sm font-medium text-gray-700 mb-2 flex items-center"
            >
              <MessageCircle size={16} className="mr-2" /> Additional Notes
            </label>
            <textarea
              id="additional-notes"
              rows={3}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Provide any additional context or unique details about the return (optional)"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Helps provide context or explain any special circumstances about
              the return
            </p>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading || images.length === 0}
          >
            {loading ? "Submitting..." : "Submit Return"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ReturnItemModal;
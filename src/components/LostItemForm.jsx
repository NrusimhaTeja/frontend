import React, { useState } from "react";
import { X, Upload, Calendar, Clock, MapPin } from "lucide-react";
import axios from "axios";

const LostItemForm = ({ isOpen, onClose, onItemAdded }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    itemType: "",
    description: "",
    location: "",
    date: "",
    time: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
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

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataObj.append(key, formData[key]);
        }
      });

      // Append status
      formDataObj.append("status", "submitted");

      // Format date and time if both are provided
      if (formData.date && formData.time) {
        const combinedDateTime = new Date(`${formData.date}T${formData.time}`);
        formDataObj.append("time", combinedDateTime.toISOString());
      }

      // Upload images
      for (let i = 0; i < images.length; i++) {
        formDataObj.append("images", images[i].file);
      }

      // Send the form data to your API
      const response = await axios.post(
        import.meta.env.VITE_REACT_APP_BACKEND_BASEURL + "api/items/report/lost",
        formDataObj,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form
      setImages([]);
      setFormData({
        itemType: "",
        description: "",
        location: "",
        date: "",
        time: "",
      });

      // Close form and refresh items
      onClose();
      onItemAdded();
    } catch (err) {
      console.error("Error adding lost item:", err);
      alert("Failed to add lost item. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Report Lost Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Item Type */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Item Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., Wallet, Phone, Laptop"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              placeholder="Provide a comprehensive description of the item..."
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 flex items-center">
              <MapPin size={16} className="mr-1" /> Location 
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Where did you lose it?"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 flex items-center">
                <Calendar size={16} className="mr-1" /> Date 
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 flex items-center">
                <Clock size={16} className="mr-1" /> Time 
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Upload Images (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center mb-3">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={24} className="text-blue-500 mb-2" />
                <span className="text-gray-600 mb-1">
                  Click to upload images
                </span>
                <span className="text-xs text-gray-500">
                  (or drag and drop)
                </span>
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt="preview"
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                Submitting...
              </span>
            ) : (
              "Report Lost Item"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LostItemForm;
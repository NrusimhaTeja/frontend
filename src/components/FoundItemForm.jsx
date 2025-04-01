import React, { useState } from "react";
import { X, Upload, Calendar, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import axios from "axios";

const FoundItemForm = ({ isOpen, onClose, onItemAdded }) => {
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

      // Append all form fields as they are
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataObj.append(key, formData[key]);
        }
      });

      // Append status
      formDataObj.append("status", "found");

      // Upload images
      for (let i = 0; i < images.length; i++) {
        formDataObj.append("images", images[i].file);
      }

      // Send the form data to your API
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/report/found`,
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
      console.error("Error adding found item:", err);
      alert("Failed to add found item. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Report Found Item</h2>
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
            <label className="block text-gray-700 mb-1">Item Type<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="E.g., Wallet, Phone, Laptop, Keys"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Description<span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              placeholder="Description about the item ..."
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 flex items-center">
              <MapPin size={16} className="mr-1" /> Location<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="location where the item was found (e.g., near Library, Cafe, Logos)"
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-1 flex items-center">
                <Calendar size={16} className="mr-1" /> Date<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 flex items-center">
                <Clock size={16} className="mr-1" /> Time<span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1 flex items-center">
              <Upload size={16} className="mr-1" /> Upload Images<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
              >
                <Plus size={16} className="mr-1" /> Add Images
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 flex items-center justify-center"
          >
            {loading ? <span>Submitting...</span> : "Submit Found Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FoundItemForm;

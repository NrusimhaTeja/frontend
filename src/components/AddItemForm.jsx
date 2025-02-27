import React, { useState, useEffect } from 'react';
import { X, Upload, Calendar, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';

const AddItemForm = ({ isOpen, onClose, status, onItemAdded }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    status: status || 'found'
  });

  // Update form data when status prop changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, status }));
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...fileArray]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('location', formData.location);
      formDataObj.append('status', formData.status);
      
      // Format date and time
      formDataObj.append('date', formData.date);
      formDataObj.append('time', formData.time);
      
      // Upload images
      for (let i = 0; i < images.length; i++) {
        formDataObj.append('images', images[i].file);
      }
      
      // Send the form data to your API
      const response = await axios.post(BASE_URL + "report/item/" + status, formDataObj, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      
      // Reset form
      setImages([]);
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        status: status
      });
      
      // Close form and refresh items
      onClose();
      onItemAdded();
      
    } catch (err) {
      console.error("Error adding item:", err);
      alert("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {formData.status === "lost" ? "Report Lost Item" : "Report Found Item"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={formData.status === 'lost' ? "What did you lose?" : "What did you find?"}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              placeholder={formData.status === 'lost' ? "Describe the item in detail..." : "Describe what you found..."}
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
              placeholder={formData.status === 'lost' ? "Where did you lose it?" : "Where did you find it?"}
              required
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
                required
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
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Upload Images</label>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center mb-3">
              <label className="cursor-pointer flex flex-col items-center">
                <Upload size={24} className="text-blue-500 mb-2" />
                <span className="text-gray-600 mb-1">Click to upload images</span>
                <span className="text-xs text-gray-500">(or drag and drop)</span>
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
            className={`w-full py-2 px-4 rounded transition-colors text-white ${formData.status === 'lost' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                Submitting...
              </span>
            ) : (
              formData.status === 'lost' ? 'Report Lost Item' : 'Report Found Item'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;
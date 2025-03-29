// Common image upload pattern to be used in both ClaimItemModal and ReturnItemModal

import React, { useRef } from 'react';
import { Upload, Plus, Trash2 } from "lucide-react";

const ImageUploader = ({ 
  images, 
  onImageChange, 
  onRemoveImage, 
  disabled = false, 
  multiple = true 
}) => {
  const fileInputRef = useRef(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-1 flex items-center">
        <Upload size={16} className="mr-1" /> Upload Proof Images
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          ref={fileInputRef}
          multiple={multiple}
          accept="image/*"
          onChange={onImageChange}
          className="hidden"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={disabled}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer disabled:opacity-50"
        >
          <Plus size={16} className="mr-1" /> Add Proof Images
        </button>
        <span className="text-xs text-gray-500">
          {images.length} image{images.length !== 1 ? 's' : ''} uploaded
        </span>
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
                onClick={() => onRemoveImage(index)}
                disabled={disabled}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1 disabled:opacity-50"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
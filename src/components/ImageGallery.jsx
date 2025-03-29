import React, { useState } from 'react';

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`Proof image ${index + 1}`}
            className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
            onClick={() => setSelectedImage(image.url)}
          />
        ))}
      </div>

      {/* Full-size image modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-[90%] max-h-[90%] relative">
            <img 
              src={selectedImage} 
              alt="Full size" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-xl" 
            />
            <button 
              className="absolute top-2 right-2 bg-white/50 hover:bg-white/75 rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
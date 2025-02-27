import React from 'react';
import { PlusCircle } from 'lucide-react';

const AddButton = ({ onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-950 text-white rounded-full p-4 shadow-lg hover:bg-blue-800 transition-colors z-10"
    >
      <PlusCircle size={24} />
    </button>
  );
};

export default AddButton;
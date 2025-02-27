import React from 'react';

const EmptyState = ({ selectedTab }) => {
  return (
    <div className="text-center py-12">
      <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
      <p className="mt-1 text-sm text-gray-500">
        {selectedTab === "lost"
          ? "No lost items have been reported yet."
          : selectedTab === "found"
          ? "No found items have been reported yet."
          : "No items have been claimed yet."}
      </p>
    </div>
  );
};

export default EmptyState;
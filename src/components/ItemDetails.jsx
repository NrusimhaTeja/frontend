import React from "react";

const ItemDetails = ({ itemId }) => (
  <div className="flex gap-3 flex-1">
    <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
      {itemId.images && itemId.images[0] ? (
        <img
          src={itemId.images[0].url || "/api/placeholder/400/320"}
          alt={itemId.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M20.4 14.5L16 10 4 20" />
          </svg>
        </div>
      )}
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">{itemId.title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            itemId.status === "lost"
              ? "bg-rose-100 text-rose-800"
              : itemId.status === "found"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {itemId.status.toUpperCase()}
        </span>
        <span className="text-xs text-gray-500">
          <svg
            className="w-3 h-3 inline mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {itemId.location}
        </span>
      </div>
      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
        {itemId.description}
      </p>
    </div>
  </div>
);

export default ItemDetails;
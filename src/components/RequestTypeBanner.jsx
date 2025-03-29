import React from "react";

const RequestTypeBanner = ({ requestType, actionLabel, createdAt, formattedDate }) => (
  <div
    className={`px-4 py-2 text-sm font-medium flex items-center ${
      requestType === "claim"
        ? "bg-purple-50 text-purple-700"
        : "bg-blue-50 text-blue-700"
    }`}
  >
    {requestType === "claim" ? (
      <svg
        className="w-4 h-4 mr-2 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ) : (
      <svg
        className="w-4 h-4 mr-2 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
        />
      </svg>
    )}
    <span className="truncate">{actionLabel}</span>
    <div className="ml-auto text-xs opacity-80 flex-shrink-0">
      {formattedDate}
    </div>
  </div>
);

export default RequestTypeBanner;
import React from "react";

export const getActionLabel = (isOwnRequest, requestType, displayUser) => {
  const userName = `${displayUser?.firstName || ""} ${displayUser?.lastName || ""}`.trim();

  if (isOwnRequest) {
    if (requestType === "claim") return `You requested ${userName} to claim this item`;
    if (requestType === "return") return `You offered ${userName} to return this item`;
  } else {
    if (requestType === "claim") return `${userName} claimed this item`;
    if (requestType === "return") return `${userName} found this item`;
  }

  return requestType === "claim" 
    ? "Item claim request" 
    : "Item return request";
};

export const getStatusIndicator = (status) => {
  switch (status) {
    case "pending":
      return {
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        label: "Awaiting Response",
        color: "text-amber-600 bg-amber-50",
      };
    case "accepted":
      return {
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ),
        label: "Accepted",
        color: "text-emerald-600 bg-emerald-50",
      };
    case "rejected":
      return {
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ),
        label: "Declined",
        color: "text-rose-600 bg-rose-50",
      };
    default:
      return {
        icon: null,
        label: status,
        color: "text-gray-600 bg-gray-50",
      };
  }
};
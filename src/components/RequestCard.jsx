import React from "react";

const RequestCard = ({ request, isOwnRequest = false }) => {
  // Early return if no request data
  if (!request) return null;

  // Destructure request data
  const { itemId, requestType, status, requestedBy, requestedTo, createdAt } =
    request;

  // Determine which user to display (the other party in the request)
  const displayUser = isOwnRequest ? requestedTo : requestedBy;
  console.log(displayUser)

  // Format date with relative time if recent, otherwise show date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      // Show relative time for recent requests
      const hours = Math.floor(diffTime / (1000 * 60 * 60));
      if (hours < 1) return "Just now";
      if (hours === 1) return "1 hour ago";
      if (hours < 24) return `${hours} hours ago`;
      return "Yesterday";
    } else if (diffDays < 7) {
      // Show day of week for requests within a week
      return date.toLocaleDateString(undefined, { weekday: "long" });
    } else {
      // Show full date for older requests
      return date.toLocaleDateString();
    }
  };

  // Get action label based on request type and user perspective
  const getActionLabel = () => {
    const userName = `${displayUser?.firstName || ""} ${
      displayUser?.lastName || ""
    }`.trim();

    // For "sent" requests (user is the initiator)
    if (isOwnRequest) {
      if (requestType === "claim") {
        return `You requested ${userName} to claim this item`;
      } else if (requestType === "return") {
        return `You offered ${userName} to return this item`;
      }
    }
    // For "received" requests (user is the receiver)
    else {
      if (requestType === "claim") {
        return `${userName} claimed this item`;
      } else if (requestType === "return") {
        return `${userName} found this item`;
      }
    }

    // Fallback
    return requestType === "claim"
      ? "Item claim request"
      : "Item return request";
  };

  // Get appropriate status indicator
  const getStatusIndicator = () => {
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

  const statusInfo = getStatusIndicator();

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {/* Request Type Banner */}
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
        <span className="truncate">{getActionLabel()}</span>
        <div className="ml-auto text-xs opacity-80 flex-shrink-0">
          {formatDate(createdAt)}
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Item Details Section */}
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

          {/* User Info + Status (Desktop) */}
          <div className="hidden md:flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-gray-200">
              {displayUser?.profilePhoto ? (
                <img
                  src={displayUser.profilePhoto.url || "/api/placeholder/400/320"}
                  alt={`${displayUser.firstName} ${displayUser.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600">
                  {displayUser?.firstName?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="ml-3 mr-6">
              <p className="text-sm font-medium text-gray-900">
                {displayUser?.firstName} {displayUser?.lastName}
              </p>
              <div className="text-xs text-gray-500">
                {displayUser?.department}
              </div>
            </div>

            {/* Status Indicator */}
            <div
              className={`px-3 py-1 rounded-full text-sm flex items-center ${statusInfo.color}`}
            >
              {statusInfo.icon && (
                <span className="mr-1">{statusInfo.icon}</span>
              )}
              {statusInfo.label}
            </div>
          </div>

          {/* Mobile: Status + User info */}
          <div className="md:hidden flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 ring-1 ring-gray-200">
                {displayUser?.profilePhoto ? (
                  <img
                    src={displayUser.profilePhoto.url || "/api/placeholder/400/320"}
                    alt={`${displayUser.firstName} ${displayUser.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600">
                    {displayUser?.firstName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="ml-2">
                <p className="text-xs font-medium text-gray-900">
                  {displayUser?.firstName} {displayUser?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {displayUser?.department}
                </p>
              </div>
            </div>

            {/* Status Indicator */}
            <div
              className={`px-2 py-1 rounded-full text-xs flex items-center ${statusInfo.color}`}
            >
              {statusInfo.icon && (
                <span className="mr-1">{statusInfo.icon}</span>
              )}
              {statusInfo.label}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-3">
          {/* Chat Button - Always shown */}
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Message {displayUser?.firstName}
          </button>

          {/* Secondary Action Button - Only shown for pending requests */}
          {status === "pending" && (
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 shadow-sm flex items-center justify-center">
              {isOwnRequest ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Cancel Request
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2"
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
                  Reject
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestCard;

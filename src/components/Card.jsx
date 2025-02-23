import React from "react";

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "found":
      return "bg-emerald-500 text-white ring-emerald-500/20";
    case "lost":
      return "bg-rose-500 text-white ring-rose-500/20";
    case "claimed":
      return "bg-amber-500 text-gray-800 ring-amber-500/20";
    default:
      return "bg-gray-400 text-white ring-gray-400/20";
  }
};

const Card = ({ title, description, location, status }) => {
  return (
    <div className="w-72 rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      {/* Upper Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex h-full">
          {/* Image Section */}
          <div className="w-1/2">
            <img
              src="../../public/assets/test.png"
              alt="Item"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details Section */}
          <div className="w-1/2 p-4 flex flex-col justify-between">
            {/* Status Badge */}
            <div
              className={`inline-flex self-end px-2.5 py-1 text-xs font-medium rounded-full ring-1 ${getStatusColor(
                status
              )}`}
            >
              {status}
            </div>

            {/* Item Details */}
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
                {title}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
            </div>

            {/* Time and Location */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>10-Sep-2023</span>
                <span>4:00pm</span>
              </div>
              <div className="flex items-center text-xs font-medium text-gray-700">
                <svg
                  className="mr-1 h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {location}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100">
        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-white">
            <img
              src="../../public/assets/test.png"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">John Doe</div>
            <div className="text-xs text-gray-500">Engineering</div>
          </div>
        </div>

        {/* Chat Button */}
        <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          <svg
            className="mr-1.5 h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          Chat
        </button>
      </div>
    </div>
  );
};

export default Card;
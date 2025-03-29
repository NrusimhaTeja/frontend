import React from "react";

const UserInfoWithStatus = ({ displayUser, statusInfo }) => (
  <>
    {/* Desktop */}
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
      <div
        className={`px-3 py-1 rounded-full text-sm flex items-center ${statusInfo.color}`}
      >
        {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
        {statusInfo.label}
      </div>
    </div>

    {/* Mobile */}
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
      <div
        className={`px-2 py-1 rounded-full text-xs flex items-center ${statusInfo.color}`}
      >
        {statusInfo.icon && <span className="mr-1">{statusInfo.icon}</span>}
        {statusInfo.label}
      </div>
    </div>
  </>
);

export default UserInfoWithStatus;
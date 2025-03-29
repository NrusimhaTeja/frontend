import React, { useState } from "react";
import { formatDate } from "../utils/date";
import { getActionLabel, getStatusIndicator } from "../utils/request.jsx";
import RequestTypeBanner from "./RequestTypeBanner";
import ItemDetails from "./ItemDetails";
import UserInfoWithStatus from "./UserInfoWithStatus";
import ActionButtons from "./ActionButtons";
import ImageGallery from "./ImageGallery"; // Assuming you have an ImageGallery component

const RequestDetails = ({ request, isOwnRequest }) => {
  const { requestType, answers, proofImages, additionalNotes } = request;

  // Render for claim requests
  if (requestType === "claim") {
    return (
      <div className="space-y-4 mt-4">
        {/* Questions and Answers */}
        {answers && answers.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">
              Verification Questions
            </h3>
            {answers.map((answer, index) => (
              <div key={index} className="mb-2">
                <p className="text-sm text-gray-600">{answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Proof Images */}
        {proofImages && proofImages.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Proof Images</h3>
            <ImageGallery images={proofImages} />
          </div>
        )}

        {/* Additional Notes */}
        {additionalNotes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">
              Additional Notes
            </h3>
            <p className="text-sm text-gray-600">{additionalNotes}</p>
          </div>
        )}
      </div>
    );
  }

  // Render for return requests
  if (requestType === "return") {
    return (
      <div className="space-y-4 mt-4">
        {/* Proof Images */}
        {proofImages && proofImages.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Return Proof Images
            </h3>
            <ImageGallery images={proofImages} />
          </div>
        )}

        {/* Additional Notes */}
        {additionalNotes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">
              Additional Notes
            </h3>
            <p className="text-sm text-gray-600">{additionalNotes}</p>
          </div>
        )}
      </div>
    );
  }

  // Default case for other request types
  return null;
};

const RequestCard = ({ request, isOwnRequest = false }) => {
  if (!request) return null;

  const { itemId, requestType, status, requestedBy, requestedTo, createdAt } =
    request;

  const displayUser = isOwnRequest ? requestedTo : requestedBy;
  const actionLabel = getActionLabel(isOwnRequest, requestType, displayUser);
  const statusInfo = getStatusIndicator(status);
  const formattedDate = formatDate(createdAt);

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <RequestTypeBanner
        requestType={requestType}
        actionLabel={actionLabel}
        createdAt={createdAt}
        formattedDate={formattedDate}
      />

      <div className="p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <ItemDetails itemId={itemId} />
          <UserInfoWithStatus
            displayUser={displayUser}
            statusInfo={statusInfo}
          />
        </div>

        {/* Conditional Rendering of Request Details */}
        <RequestDetails request={request} isOwnRequest={isOwnRequest} />

        <ActionButtons
          status={status}
          isOwnRequest={isOwnRequest}
          displayUser={displayUser}
        />
      </div>
    </div>
  );
};

export default RequestCard;

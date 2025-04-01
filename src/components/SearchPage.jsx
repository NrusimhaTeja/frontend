import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import SubmittedItemCard from "./SubmittedItemCard";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const redirectToFeed = () => {
    navigate("/");
  };

  useEffect(() => {
    const searchItem = async () => {
      // Reset states
      setLoading(true);
      setError(null);
      setItem(null);
      
      try {
        // Check if the query looks like a token (simple validation)
        if (searchQuery && searchQuery.startsWith("ITEM-")) {
          // Make API call to get item by token
          const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/token/${searchQuery}`, {
            withCredentials: true,
          });
          
          // Only set the item if its status is 'submitted'
          if (response.data.item && response.data.item.status === 'submitted') {
            setItem(response.data.item);
          } else {
            // If item exists but status is not 'submitted', show error
            setError("No item found with this token");
          }
        } else {
          setError("Please enter a valid item token (format: ITEM-XXXXXXXX)");
        }
      } catch (err) {
        console.error("Error searching for item:", err);
        setError(err.response?.data?.message || "No item found with this token");
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      searchItem();
    }
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
        {searchQuery && (
          <p className="mt-1 text-sm text-gray-500">
            Showing results for token: <span className="font-mono font-medium">{searchQuery}</span>
          </p>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Item display - only for 'submitted' status */}
      {!loading && !error && item && (
        <div className="max-w-md mx-auto">
          <SubmittedItemCard
            key={item._id}
            itemId={item._id}
            itemType={item.itemType}
            description={item.description}
            location={item.location}
            status={item.status}
            foundBy={item.foundBy}
            images={item.images}
            time={item.time}
            onStatusUpdate={redirectToFeed}
          />
        </div>
      )}

      {/* No results state */}
      {!loading && !error && searchQuery && !item && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="mt-4 text-gray-500">No item found with this token</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
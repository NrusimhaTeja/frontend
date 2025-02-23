import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Card from "./Card"; 

const Feed = () => {
  const [selectedTab, setSelectedTab] = useState("found"); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchItems = async (status) => {
    setLoading(true);
    try {
      console.log(`${BASE_URL}items/${status}`);
      const response = await axios.get(`${BASE_URL}item/${status}`, {
        withCredentials: true,
      });
      console.log(response)
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(selectedTab);
  }, [selectedTab]);

  const tabs = [
    { id: "found", label: "Found Items" },
    { id: "lost", label: "Lost Items" },
    { id: "claimed", label: "Claimed Items" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  selectedTab === tab.id
                    ? "border-blue-950 text-blue-950"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card
              key={item._id}
              title={item.title}
              description={item.description}
              location={item.location}
              status={item.status}
            />
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
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
      )}
    </div>
  );
};

export default Feed;
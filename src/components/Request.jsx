import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Card from "./Card";
import AddButton from "./AddButton";
import AddItemForm from "./AddItemForm";
import EmptyState from "./EmptyState";
import TabNavigation from "./TabNavigation";
import { useSelector } from "react-redux";
import { Store } from "lucide-react";
import RequestCard from "./RequestCard";

const Request = () => {
  const [selectedTab, setSelectedTab] = useState("send");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((Store) => Store.user);
  console.log(user);

  const tabs = [
    { id: "send", label: "Send Requests" },
    { id: "receive", label: "Received Requests" },
  ];

  const fetchItems = async (status) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}request/${selectedTab}`, {
        withCredentials: true,
      });
      console.log(response.data);
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

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs Navigation */}
      <TabNavigation
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
        </div>
      )}

      {/* Items List - Changed from grid to flex column for full width cards */}
      {!loading && items.length > 0 && (
        <div className="flex flex-col space-y-4">
          {items.map((item) => (
            <RequestCard
              key={item._id || item.id}
              request={item}
              isOwnRequest={selectedTab === "send" ? true : false}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && <div>No Requests Found</div>}
    </div>
  );
};

export default Request;

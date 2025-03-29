import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import LostItemCard from "./LostItemCard";
import ReceivedItemCard from "./ReceivedItemCard";
import SubmittedItemCard from "./SubmittedItemCard";
import AddButton from "./AddButton";
import FoundItemForm from "./FoundItemForm";
import LostItemForm from "./LostItemForm";
import EmptyState from "./EmptyState";
import TabNavigation from "./TabNavigation";
import { useSelector } from "react-redux";

const Feed = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const user = useSelector((state) => state.user);

  // Define tabs based on user role
  const getTabs = () => {
    // Base tabs for all users
    const baseTabs = [
      { id: "received", label: "Found Items" },
      { id: "lost", label: "Lost Items" }
    ];
    
    // Add submitted tab for security roles
    if (user?.role === "securityGuard" || user?.role === "securityOfficer" || user?.role === "admin") {
      baseTabs.push({ id: "submitted", label: "Submitted Items" });
    }
    
    return baseTabs;
  };


  const tabs = getTabs();

  const fetchItems = async (status) => {
    setLoading(true);
    try {
      if (!user) {
        setItems([]);
        return;
      }
      console.log("Fetching items for status:", status);
      
      // Map the tab ID to the correct API endpoint status parameter
      let apiStatus = status;
      console.log("yo")
      
      const response = await axios.get(`${BASE_URL}api/items/status/${apiStatus}`, {
        withCredentials: true,
      });
      console.log("API Response:", response.data);
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching items:", err);
      // Handle forbidden access or other errors
      if (err.response && err.response.status === 403) {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Set initial tab based on user role
useEffect(() => {
  if (!user) return;
  const availableTabs = getTabs().map(tab => tab.id);
  let initialTab = availableTabs[0];
  
  if (user?.role === "securityGuard") {
    initialTab = "submitted"; // Default to 'submitted' for securityGuard
  }
  console.log(initialTab)

  setSelectedTab(initialTab);
}, [user?.role]);

// Fetch items only AFTER selectedTab is set
useEffect(() => {
  if (selectedTab) {
    fetchItems(selectedTab);
  }
}, [selectedTab]);

  const renderForm = () => {
    switch (selectedTab) {
      case 'received':
        return (
          <FoundItemForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onItemAdded={() => fetchItems(selectedTab)}
          />
        );
      case 'lost':
        return (
          <LostItemForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onItemAdded={() => fetchItems(selectedTab)}
          />
        );
      default:
        return null;
    }
  };

  const renderItemCard = (item) => {
    switch (selectedTab) {
      case 'received':
        return (
          <ReceivedItemCard
            key={item._id}
            itemId={item._id}
            itemType={item.itemType}
            description={item.description}
            location={item.location}
            status={item.status}
            uniqueMarks={item.uniqueMarks}
            currentHolder={item.currentHolder}
            images={item.images}
            questions={item.questions}
            time={item.time}
          />
        );
      case 'lost':
        return (
          <LostItemCard
            key={item._id}
            itemId={item._id}
            itemType={item.itemType}
            description={item.description}
            location={item.location}
            status={item.status}
            uniqueMarks={item.uniqueMarks}
            owner={item.owner}
            images={item.images}
            time={item.time}
          />
        );
      case 'submitted':
        return (
          <SubmittedItemCard
            key={item._id}
            itemId={item._id}
            itemType={item.itemType}
            description={item.description}
            location={item.location}
            status={item.status}
            uniqueMarks={item.uniqueMarks}
            foundBy={item.foundBy}
            images={item.images}
            time={item.time}
            token={item.token}
            onStatusUpdate={() => fetchItems(selectedTab)}
          />
        );
      default:
        return null;
    }
  };

  // Show add button only for certain tabs
  const showAddButton = selectedTab === 'lost' || selectedTab === 'received';

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

      {/* Items Grid */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => renderItemCard(item))}
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <EmptyState selectedTab={selectedTab} />
      )}

      {/* Add Button - Only show for Lost and Found tabs */}
      {showAddButton && <AddButton onClick={() => setIsFormOpen(true)} />}

      {/* Dynamic Form Modal */}
      {renderForm()}
    </div>
  );
};

export default Feed;
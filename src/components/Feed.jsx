import React, { useState, useEffect } from "react";
import axios from "axios";
import LostItemCard from "./LostItemCard";
import ReceivedItemCard from "./ReceivedItemCard";
import SubmittedItemCard from "./SubmittedItemCard";
import VerifiedItemCard from "./VerifiedItemCard";
import AddButton from "./AddButton";
import FoundItemForm from "./FoundItemForm";
import LostItemForm from "./LostItemForm";
import EmptyState from "./EmptyState";
import TabNavigation from "./TabNavigation";
import { useSelector } from "react-redux";
import { Search } from "lucide-react";

const Feed = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const user = useSelector((state) => state.user);

  // Define tabs based on user role
  const getTabs = () => {
    let tabs = [];
    
    // All users can see lost items
    tabs.push({ id: "lost", label: "Lost Items" });
    
    // All users can see found/verified items
    tabs.push({ id: "verified", label: "Found Items" });
    
    // Security Guard can see submitted items
    if (user?.role === "securityGuard") {
      tabs.push({ id: "submitted", label: "Submitted Items" });
    }
    
    // Security Officer can see received items
    if (user?.role === "securityOfficer" || user?.role === "admin") {
      tabs.push({ id: "submitted", label: "Submitted Items" });
      tabs.push({ id: "received", label: "Received Items" });
    }
    
    return tabs;
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
      
      const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/status/${status}`, {
        withCredentials: true,
      });
      console.log("API Response:", response.data);
      setItems(response.data);
      setFilteredItems(response.data);
      setSearchTerm(""); // Reset search when changing tabs
    } catch (err) {
      console.error("Error fetching items:", err);
      // Handle forbidden access or other errors
      if (err.response && err.response.status === 403) {
        setItems([]);
        setFilteredItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Set initial tab based on user role
  useEffect(() => {
    if (!user) return;
    
    const availableTabs = getTabs().map(tab => tab.id);
    
    // Set default tab based on user role
    if (user?.role === "securityGuard" && availableTabs.includes("submitted")) {
      setSelectedTab("submitted");
    } else if ((user?.role === "securityOfficer" || user?.role === "admin") && availableTabs.includes("received")) {
      setSelectedTab("received");
    } else {
      // Default for regular users
      setSelectedTab("lost");
    }
  }, [user?.role]);

  // Fetch items only AFTER selectedTab is set
  useEffect(() => {
    if (selectedTab) {
      fetchItems(selectedTab);
    }
  }, [selectedTab]);

  // Filter items based on search term (now using token)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(items);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = items.filter(item => {
      // Primary search is now based on token
      return (
        (item.token && item.token.toLowerCase().includes(searchTermLower))
      );
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const renderForm = () => {
    switch (selectedTab) {
      case 'verified':
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
      case 'verified':
        return (
          <VerifiedItemCard
            key={item._id}
            itemId={item._id}
            verifiedDescription={item.verifiedDescription}
            images={item.images}
            time={item.time}
            status={item.status}
            questions={item.questions}
          />
        );
      case 'received':
        return (
          <ReceivedItemCard
            key={item._id}
            itemId={item._id}
            itemType={item.itemType}
            description={item.description}
            foundBy={item.foundBy}
            location={item.location}
            receivedBy={item.receivedBy}
            images={item.images}
            time={item.time}
            status={item.status}
            token={item.token}
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
            reportedBy={item.reportedBy}
            images={item.images}
            time={item.time}
            status={item.status}
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
            foundBy={item.foundBy}
            images={item.images}
            time={item.time}
            status={item.status}
            token={item.token}
            onStatusUpdate={() => fetchItems(selectedTab)}
          />
        );
      default:
        return null;
    }
  };

  // Show search bar only for submitted and received tabs
  const showSearch = selectedTab === 'submitted' || selectedTab === 'received';
  
  // Show add button only for certain tabs
  const showAddButton = selectedTab === 'lost' || selectedTab === 'verified';

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Tabs Navigation */}
      <TabNavigation
        tabs={tabs}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />

      {/* Search Bar - Only for submitted and received tabs */}
      {showSearch && (
        <div className="relative my-6">
          <div className="flex items-center rounded-lg shadow-sm overflow-hidden border border-gray-300 bg-white">
            <div className="pointer-events-none pl-4">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full py-3 pl-3 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Search by token number...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-0 px-4 py-3 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950"></div>
        </div>
      )}

      {/* Items Grid */}
      {!loading && filteredItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => renderItemCard(item))}
        </div>
      )}

      {/* Empty State - Show custom message for search results */}
      {!loading && filteredItems.length === 0 && (
        searchTerm && items.length > 0 ? (
          <div className="py-12 text-center">
            <div className="text-gray-400 mb-3">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No results found</h3>
            <p className="mt-2 text-sm text-gray-500">
              We couldn't find any items with token number "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Clear search
            </button>
          </div>
        ) : (
          <EmptyState selectedTab={selectedTab} />
        )
      )}

      {/* Add Button - Only show for Lost and Found tabs */}
      {showAddButton && <AddButton onClick={() => setIsFormOpen(true)} />}

      {/* Dynamic Form Modal */}
      {renderForm()}
    </div>
  );
};

export default Feed;
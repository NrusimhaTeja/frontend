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

const Feed = () => {
  const [selectedTab, setSelectedTab] = useState("found");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const user = useSelector((Store) => Store.user);
  console.log(user)

  const tabs = [
    { id: "found", label: "Found Items" },
    { id: "lost", label: "Lost Items" },
    { id: "claimed", label: "Claimed Items" },
  ];

  const fetchItems = async (status) => {
    setLoading(true);
    try {
      console.log(`${BASE_URL}items/${status}`);
      const response = await axios.get(`${BASE_URL}item/${status}`, {
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

      {/* Items Grid */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) =>  (
                <Card
                  key={item._id}
                  itemId={item._id}
                  title={item.title}
                  description={item.description}
                  location={item.location}
                  status={item.status}
                  itemImg={item?.images[0]?.url}
                  name={
                    item.status === "found"
                      ? item.currentHolder.firstName
                      : item.owner.firstName
                  }
                  profilePhoto={
                    item.status === "found"
                      ? item.currentHolder.profilePhoto.url
                      : item.owner.profilePhoto.url
                  }
                  designation={
                    item.status === "found"
                      ? item.currentHolder.designation
                      : item.owner.designation
                  }
                  department={
                    item.status === "found"
                      ? item.currentHolder.department
                      : item.owner.department
                  }
                  id={
                    item.status === "found"
                      ? item.currentHolder.id
                      : item.owner.id
                  }
                />
              )
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <EmptyState selectedTab={selectedTab} />
      )}

      {/* Add Button - Only show for Lost and Found tabs */}
      {(selectedTab === "found" || selectedTab === "lost") && (
        <AddButton onClick={() => setIsFormOpen(true)} />
      )}

      {/* Form Modal */}
      <AddItemForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        status={selectedTab}
        onItemAdded={() => fetchItems(selectedTab)}
      />
    </div>
  );
};

export default Feed;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ReportCard from "./ReportCard";


const Report = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector((Store) => Store.user);
    console.log(user);

  
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}api/items/my-item-tokens`, {
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
      fetchItems();
    }, []);
  
    return (
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  
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
              <ReportCard
                key={item._id || item.id}
                {...item}
              />
            ))}
          </div>
        )}
  
        {/* Empty State */}
        {!loading && items.length === 0 && <div>No Reports Found</div>}
      </div>
    );
}

export default Report
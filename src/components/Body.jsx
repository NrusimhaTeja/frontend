import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUser = async () => {
    try {
      const user = await axios.get(
        import.meta.env.VITE_REACT_APP_BACKEND_BASEURL + "api/users/profile", 
        { withCredentials: true }
      );
      console.log(user.data);
      dispatch(addUser(user.data));
      
      // Redirect to admin page if user is admin
      if (user.data.role === "admin" && location.pathname !== "/admin") {
        navigate("/admin");
      }
    } catch (err) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Check if the user is an admin and redirect if they're on a non-admin page
  useEffect(() => {
    if (user?.role === "admin" && location.pathname !== "/admin") {
      navigate("/admin");
    }
  }, [location.pathname, user, navigate]);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;
import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch((store) => store.user);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const user = await axios.get(import.meta.env.VITE_REACT_APP_BACKEND_BASEURL + "api/users/profile", {
        withCredentials: true,
      });
      console.log(user.data)
      dispatch(addUser(user.data));
    } catch (err) {
      navigate("/login")
      // if (err.response?.status === 401) {
      //   navigate("/login");
      // } else {
      //   console.log("yo", err.message);
      // }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Body;

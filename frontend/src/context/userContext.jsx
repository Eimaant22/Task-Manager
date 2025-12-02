import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

 useEffect(() => {
  if (user) return; // (1) If user already exists, do nothing

  const accessToken = localStorage.getItem("token"); // (2) Get token from localStorage
  if (!accessToken) {
    setLoading(false);
    return; // (3) If no token, stop here
  }

  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
      setUser(response.data); // (4) If token exists, get the user info from backend
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  // 🔹 Update user and save token
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token); // Save token
    setLoading(false);
  };

  // 🔹 Clear user and remove token
  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

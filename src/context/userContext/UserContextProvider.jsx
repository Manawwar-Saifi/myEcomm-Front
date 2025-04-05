import React, { useState, useEffect } from "react";
import LoginContext from "./userContext.js";

const LoginContextProvider = ({ children }) => {
  // Initialize state based on localStorage
  const [loggedIn, setLoggedIn] = useState(() => {
    return Boolean(localStorage.getItem("token"));
  });

  const [userData, setUserData] = useState(() => ({
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    photo: localStorage.getItem("photo") || "",
  }));

  // Effect to update localStorage when userData changes
  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("name", userData.name);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("photo", userData.photo);
    }
  }, [userData]); // Sync only when userData changes

  // Effect to sync userData when loggedIn state changes
  useEffect(() => {
    if (loggedIn) {
      setUserData({
        name: localStorage.getItem("name") || "",
        email: localStorage.getItem("email") || "",
        photo: localStorage.getItem("photo") || "",
      });
    } else {
      setUserData({ name: "", email: "", photo: "" });
    }
  }, [loggedIn]); // Update state when login status changes

  // Effect to update localStorage when loggedIn state changes
  useEffect(() => {
    if (loggedIn) {
      localStorage.setItem("token", "true"); // Replace with actual token logic
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("photo");
    }
  }, [loggedIn]); // Trigger when login status changes

  return (
    <LoginContext.Provider value={{ loggedIn, setLoggedIn, userData, setUserData }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;

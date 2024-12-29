import React, { createContext, useState, useEffect } from "react";

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      const userId = localStorage.getItem("userId");

      if (!isAdmin && !userId) {
        throw new Error("Missing authentication data in localStorage.");
      }

      const base = isAdmin
        ? `${process.env.REACT_APP_BASE_URL}/admin`
        : `${process.env.REACT_APP_BASE_URL}/cp/${userId}`;

      const response = await fetch(base);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      console.log(data);
      setUser({ ...data, isAdmin });
    } catch (error) {
      console.error("Error fetching user:", error);
      localStorage.removeItem("userId");
      localStorage.removeItem("isAdmin");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!user && userId) {
      fetchUser();
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
};

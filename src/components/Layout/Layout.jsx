import React, { useContext, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!user && !localStorage.getItem("userId")) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Loading State
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-[var(--primary-green)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Admin Layout
  if (isAdmin) {
    return (
      <div className="flex h-screen relative">
        <Sidebar />
        <div className="flex-1">
          <Header />
          {children}
        </div>
      </div>
    );
  }

  // General Layout
  return (
    <div className="flex h-screen relative">
      <Sidebar />
      <div className="flex-1">
        <Header />
        {children}
      </div>
    </div>
  );
};

export default Layout;

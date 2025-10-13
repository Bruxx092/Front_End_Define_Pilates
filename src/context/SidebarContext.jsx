// @ts-nocheck
import React, { createContext, useContext, useState, useEffect } from "react";

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsExpanded(false);
        setSidebarWidth(0);
      } else {
        setSidebarWidth(isExpanded ? 280 : 72);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpanded]);

  useEffect(() => {
    setSidebarWidth(isMobile ? 0 : isExpanded ? 280 : 72);
  }, [isExpanded, isMobile]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const value = {
    isExpanded,
    isMobile,
    sidebarWidth,
    toggleSidebar,
    setIsExpanded,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

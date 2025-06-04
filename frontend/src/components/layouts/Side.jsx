import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const SideLayout = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size changes for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024); // Tailwind lg breakpoint
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      {/* Sidebar - Let Sidebar component handle its own mobile logic */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-grow w-full">
        {/* Header */}
        <header
          className={`
            sticky top-0 z-10 h-20 bg-white border-b shadow-sm flex items-center px-4 lg:px-6
            ${isMobile ? "pl-16" : ""}
          `}
        >
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className={`flex-grow overflow-auto p-4 ${isMobile ? "pr-8" : ""}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SideLayout;

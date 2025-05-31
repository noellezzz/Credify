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

  // State for mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Toggle sidebar open/close on mobile
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop, toggleable on mobile */}
      <div
        className={`
          fixed top-0 left-0 z-40 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out
          ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
          w-50
        `}
      >
        {/* Pass isMobile so Sidebar can hide internal burger icon on desktop */}
        <Sidebar onClose={() => setSidebarOpen(false)} isMobile={isMobile} />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div
        className={`
          flex flex-col flex-grow w-full
          ${!isMobile ? "ml-50" : ""}
        `}
      >
        {/* Header */}
        <header
          className={`
            sticky top-0 z-50 h-20 bg-white border-b shadow-sm flex items-center px-4 lg:px-6
            ${isMobile && sidebarOpen ? "pl-12" : ""}
          `}
        >
          {isMobile && (
            <button
              className="mr-4 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {/* Hamburger or Close Icon */}
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {sidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          )}
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="flex-grow overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SideLayout;

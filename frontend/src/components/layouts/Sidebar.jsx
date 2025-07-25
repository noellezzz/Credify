// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, matchPath, Outlet } from "react-router-dom";
import {
  LuClipboard,
  LuGitGraph,
  LuUsers,
  LuHouse,
  LuFileText,
  LuList,
  LuMenu,
  LuX,
  LuArchiveRestore,
  LuSchool,
} from "react-icons/lu";
import Logo from "../../assets/Credify.png";

// Internal SidebarLink component
const SidebarLink = ({ Icon, text, to, onClick, isMobile }) => {
  const location = useLocation();

  const isActive = !!matchPath(
    { path: to, end: true },
    location.pathname
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={`group flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-[var(--secondary-color)] text-white shadow-md"
          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {/* Mobile Layout - Horizontal */}
      {isMobile ? (
        <div className="flex items-center gap-4 w-full">
          <div className="flex-shrink-0">
            <Icon
              size={20}
              className={`transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-600 group-hover:text-gray-800"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium text-base transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-700 group-hover:text-gray-900"
              }`}
            >
              {text}
            </p>
          </div>
          {/* Active indicator for mobile */}
          {isActive && (
            <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
          )}
        </div>
      ) : (
        /* Desktop Layout - Grid */
        <div className="grid grid-cols-[25%_75%] items-center w-full gap-3">
          <div className="flex justify-end">
            <Icon
              size={18}
              className={`transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-600 group-hover:text-gray-800"
              }`}
            />
          </div>
          <div className="text-left">
            <p
              className={`font-medium text-sm transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-700 group-hover:text-gray-900"
              }`}
            >
              {text}
            </p>
          </div>
        </div>
      )}
    </Link>
  );
};

// Main Sidebar Layout Component
const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Close mobile menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        !event.target.closest(".mobile-sidebar") &&
        !event.target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen, isMobile]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      {/* Mobile Menu Button - Fixed Position */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-button fixed top-4 left-4 z-[60] bg-white shadow-lg rounded-lg p-3 border hover:bg-gray-50 transition-all duration-200 lg:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <LuX size={20} className="text-gray-700" />
          ) : (
            <LuMenu size={20} className="text-gray-700" />
          )}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/25 bg-opacity-50 z-[55] lg:hidden transition-opacity duration-300"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`mobile-sidebar bg-[var(--quaternary-color)] shadow-xl transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 lg:shadow-lg lg:z-auto ${
          isMobile
            ? `fixed top-0 left-0 z-[56] h-full w-80 transform ${
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : "h-full w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section - Responsive */}
          <div className="flex items-center justify-center py-6 px-4 border-b border-gray-200">
            <div className="text-center">
              <div className="flex flex-col items-center space-y-3">
                {/* Logo */}
                <div className="w-16 sm:w-20 lg:w-16">
                  <img
                    src={Logo}
                    alt="Credify"
                    className="w-full h-auto drop-shadow-sm"
                  />
                </div>
                <div>
                  <div className="text-xl lg:text-lg font-bold uppercase text-gray-800">
                    Credify
                  </div>
                  <div className="text-sm lg:text-xs uppercase text-gray-600 -mt-1">
                    Certificate Management
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-between py-4">
            <nav className="space-y-2 px-4">
              <SidebarLink
                to="/admin/certificates"
                Icon={LuFileText}
                text="Certificates"
                onClick={closeMobileMenu}
                isMobile={isMobile}
              />
              <SidebarLink
                to="/admin/certificates/all"
                Icon={LuList}
                text="Uploaded Certificates"
                onClick={closeMobileMenu}
                isMobile={isMobile}
              />
              <SidebarLink
                to="/admin/certificates/revoked"
                Icon={LuArchiveRestore}
                text="Revoked Certificates"
                onClick={closeMobileMenu}
                isMobile={isMobile}
              />
              <SidebarLink
                to="/admin/certificates/users"
                Icon={LuUsers}
                text="User Management"
                onClick={closeMobileMenu}
                isMobile={isMobile}
              />
              <SidebarLink
                to="/admin/schools"
                Icon={LuSchool}
                text="Verify Schools"
                onClick={closeMobileMenu}
                isMobile={isMobile}
              />
            </nav>

            {/* Footer Links */}
            <div className="border-t border-gray-200 pt-4 px-4 space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center justify-center p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              >
                Go back to Client
              </Link>
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center justify-center p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </div>

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

export default Sidebar;

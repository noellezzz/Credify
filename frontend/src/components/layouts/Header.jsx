import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectIsLoggedIn,
  selectUser,
  selectUserRole,
} from "../../features/user/userSelector";
import { clearUser } from "../../features/user/userSlice";
import Logo from "../../assets/Credify.png";

const Header = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(clearUser());
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="w-full bg-[var(--secondary-color)] px-4 sm:px-6 lg:px-8 py-3 lg:py-4 font-poppins relative overflow-visible">
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-3 max-w-[1350px] mx-auto items-center relative">
        {/* Logo positioned over content area - DESKTOP ONLY */}
        <img
          src={Logo}
          alt="Credify"
          className="absolute top-1 left-8 xl:left-16 h-20 w-auto z-10"
          style={{
            filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))",
          }}
        />

        {/* Left section - empty for logo space */}
        <div></div>

        {/* Center section - Navigation */}
        <div className="flex gap-6 xl:gap-8 items-center justify-center">
          <Link
            to="/"
            className="text-white hover:text-[var(--tertiary-color)] transition-colors text-sm xl:text-base"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white hover:text-[var(--tertiary-color)] transition-colors text-sm xl:text-base"
          >
            About
          </Link>
          <Link
            to="/verification"
            className="text-white hover:text-[var(--tertiary-color)] transition-colors text-sm xl:text-base"
          >
            Verification
          </Link>
          {userRole === "doctor" && (
            <Link
              to="/admin"
              className="text-white hover:text-[var(--tertiary-color)] transition-colors text-sm xl:text-base"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right section - Sign In/Logout */}
        <div className="flex justify-end">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer text-white hover:text-[var(--tertiary-color)] transition-colors font-medium text-sm xl:text-base"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[var(--tertiary-color)] text-[var(--secondary-color)] px-3 xl:px-4 py-2 rounded hover:bg-white transition-colors font-medium text-sm xl:text-base"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex lg:hidden items-center justify-between relative">
        {/* Mobile Logo */}
        <div className="relative z-10">
          <img
            src={Logo}
            alt="Credify"
            className="h-12 sm:h-16 w-auto"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
            }}
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--tertiary-color)]"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[var(--secondary-color)] border-t border-[var(--tertiary-color)] z-50">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block text-white hover:text-[var(--tertiary-color)] transition-colors py-2"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="block text-white hover:text-[var(--tertiary-color)] transition-colors py-2"
            >
              About
            </Link>
            <Link
              to="/verification"
              onClick={closeMobileMenu}
              className="block text-white hover:text-[var(--tertiary-color)] transition-colors py-2"
            >
              Verification
            </Link>
            {userRole === "doctor" && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="block text-white hover:text-[var(--tertiary-color)] transition-colors py-2"
              >
                Admin
              </Link>
            )}

            {/* Mobile Sign In/Logout */}
            <div className="pt-4 border-t border-[var(--tertiary-color)]">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left text-white hover:text-[var(--tertiary-color)] transition-colors font-medium py-2"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block bg-[var(--tertiary-color)] text-[var(--secondary-color)] px-4 py-2 rounded hover:bg-white transition-colors font-medium text-center"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

// SidebarLink.jsx
import { Link, useLocation } from "react-router-dom";

const SidebarLink = ({ Icon, text, to, onClick, isMobile }) => {
  const location = useLocation();
  let isActive = false;

  if (location.pathname === "/admin") {
    isActive = location.pathname === to;
  } else {
    isActive = location.pathname.startsWith(to) && to !== "/admin";
  }

  const handleClick = () => {
    if (onClick) {
      onClick(); // Close mobile menu when link is clicked
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
        <div className="flex items-center gap-4 w-full bg-red-500 mt-20">
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

export default SidebarLink;

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { selectSchoolProfile } from '../../features/school/schoolSelector';
import { 
  FiHome, 
  FiUser, 
  FiGrid, 
  FiList, 
  FiBarChart2, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiBell,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';

const SchoolSidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useSelector(selectSchoolProfile);
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: FiBarChart2,
      path: '/school/dashboard',
      description: 'Overview and statistics'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: FiUser,
      path: '/school/profile',
      description: 'Manage school information'
    },
    {
      id: 'feed',
      label: 'Events Feed',
      icon: FiGrid,
      path: '/school/feed',
      description: 'View events in cards'
    },
    {
      id: 'table',
      label: 'Events Table',
      icon: FiList,
      path: '/school/table',
      description: 'Manage events in table'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: FiSettings,
      path: '/school/settings',
      description: 'Account settings'
    }
  ];

  const handleLogout = () => {
    // Add logout logic here
    navigate('/login');
  };

  const getVerificationStatus = () => {
    if (!profile) return null;
    
    switch (profile.verification_status) {
      case 'verified':
        return {
          icon: <FiCheckCircle className="text-green-500" size={16} />,
          text: 'Verified School',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        };
      case 'pending':
        return {
          icon: <FiClock className="text-yellow-500" size={16} />,
          text: 'Pending Verification',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        };
      case 'rejected':
        return {
          icon: <FiX className="text-red-500" size={16} />,
          text: 'Verification Rejected',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          icon: <FiClock className="text-gray-500" size={16} />,
          text: 'Unknown Status',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        };
    }
  };

  const status = getVerificationStatus();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#4a5d23] rounded-lg flex items-center justify-center">
                <FiHome className="text-white" size={20} />
              </div>
              <span className="font-semibold text-gray-800">School Panel</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
            >
              {isCollapsed ? <FiMenu size={16} /> : <FiX size={16} />}
            </button>
            
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* School Info */}
        {!isCollapsed && profile && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#4a5d23] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {profile.name?.charAt(0)?.toUpperCase() || 'S'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 truncate">
                  {profile.name || 'School Name'}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {profile.email || 'school@example.com'}
                </p>
              </div>
            </div>
            
            {status && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${status.bgColor}`}>
                {status.icon}
                <span className={`text-xs font-medium ${status.color}`}>
                  {status.text}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={onToggle}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group
                  ${isActive 
                    ? 'bg-[#4a5d23] text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <div className="flex-1">
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs opacity-75">{item.description}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {/* {!isCollapsed && (
            <div className="flex items-center gap-3 mb-3">
              <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <FiBell size={16} />
                <span className="text-sm">Notifications</span>
              </button>
            </div>
          )} */}
          
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
            title={isCollapsed ? 'Logout' : undefined}
          >
            <FiLogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default SchoolSidebar; 
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { selectSchoolProfile, selectSchoolStats } from '../../features/school/schoolSelector';
import SchoolProfile from '../../components/school/SchoolProfile';
import SchoolFeed from '../../components/school/SchoolFeed';
import SchoolPostTable from '../../components/school/SchoolPostTable';
import SchoolPostModal from '../../components/school/SchoolPostModal';
import SchoolSidebar from '../../components/school/SchoolSidebar';
import { 
  FiUser, 
  FiGrid, 
  FiList, 
  FiBarChart2, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiMenu
} from 'react-icons/fi';

const SchoolDashboard = () => {
  const profile = useSelector(selectSchoolProfile);
  const stats = useSelector(selectSchoolStats);
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const DashboardOverview = () => (
    <div className="mx-auto p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back {profile?.name || ''}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your school events</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCalendar className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <FiTrendingUp size={16} />
            <span className="ml-1">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Active events</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Pending publication</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verifications</p>
              <p className="text-3xl font-bold text-blue-600">{stats.withVerification}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiCheckCircle className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Require verification</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/school/feed"
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiGrid className="text-blue-600" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">View Events Feed</p>
                  <p className="text-sm text-gray-600">Browse all your events</p>
                </div>
              </div>
              <FiCalendar className="text-gray-400" size={20} />
            </Link>

            <Link 
              to="/school/table"
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiList className="text-green-600" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Manage Events</p>
                  <p className="text-sm text-gray-600">Edit and organize events</p>
                </div>
              </div>
              <FiCalendar className="text-gray-400" size={20} />
            </Link>

            <Link 
              to="/school/profile"
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiUser className="text-purple-600" size={20} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-800">Update Profile</p>
                  <p className="text-sm text-gray-600">Edit school information</p>
                </div>
              </div>
              <FiCalendar className="text-gray-400" size={20} />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {stats.total === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📚</div>
                <p className="text-gray-600">No recent activity</p>
                <p className="text-sm text-gray-500">Create your first event to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiCheckCircle className="text-green-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Event published</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiCalendar className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">New event created</p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <FiClock className="text-yellow-600" size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Draft saved</p>
                    <p className="text-xs text-gray-600">3 days ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* School Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">School Status</h3>
        <div className="flex items-center gap-4">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            profile?.verification_status === 'verified' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {profile?.verification_status === 'verified' ? '✓ Verified School' : 'Pending Verification'}
          </div>
          <div className="text-sm text-gray-600">
            {profile?.email}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SchoolSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">School Dashboard</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/profile" element={<SchoolProfile />} />
            <Route path="/feed" element={<SchoolFeed />} />
            <Route path="/table" element={<SchoolPostTable />} />
          </Routes>
        </div>
      </div>

      {/* Modal */}
      <SchoolPostModal />
    </div>
  );
};

export default SchoolDashboard; 
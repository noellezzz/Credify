import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { 
  fetchOrganizationProfile, 
  fetchOrganizationEvents,
  fetchVerificationRequests 
} from '../../features/organization/organizationSlice';
import { 
  selectOrganizationProfile, 
  selectDashboardStats,
  selectOrganizationLoading,
  selectRecentActivity 
} from '../../features/organization/organizationSelector';
import {
  selectCurrentOrganization,
  selectIsOrganizationVerified
} from '../../features/organizationAuth/organizationAuthSelectors';
import { logoutOrganization } from '../../features/organizationAuth/organizationAuthSlice';
import OrganizationProfile from '../../components/organization/OrganizationProfile';
import OrganizationFeed from '../../components/organization/OrganizationFeed';
import OrganizationPostTable from '../../components/organization/OrganizationPostTable';
import OrganizationPostModal from '../../components/organization/OrganizationPostModal';
import OrganizationSidebar from '../../components/organization/OrganizationSidebar';
import OrganizationVerifications from '../../components/organization/OrganizationVerifications';
import { 
  FiUser, 
  FiGrid, 
  FiList, 
  FiBarChart2, 
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiMenu,
  FiFileText,
  FiShield,
  FiAward,
  FiLogOut
} from 'react-icons/fi';

const OrganizationDashboard = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectOrganizationProfile);
  const authOrganization = useSelector(selectCurrentOrganization);
  const isVerified = useSelector(selectIsOrganizationVerified);
  const stats = useSelector(selectDashboardStats);
  const loading = useSelector(selectOrganizationLoading);
  const recentActivity = useSelector(selectRecentActivity);
  const location = useLocation();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Use auth organization data as fallback if profile is not loaded yet
  const organizationData = profile || authOrganization;

  useEffect(() => {
    // Only fetch additional data if we have an authenticated organization
    if (authOrganization?.id) {
      dispatch(fetchOrganizationProfile());
      dispatch(fetchOrganizationEvents());
      dispatch(fetchVerificationRequests());
    }
  }, [authOrganization?.id, dispatch]);

  const handleLogout = () => {
    dispatch(logoutOrganization());
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const DashboardOverview = () => {
    const getVerificationStatusBadge = () => {
      const orgData = organizationData;
      if (!orgData) return null;

      switch (orgData.verification_status) {
        case 'verified':
          return (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <FiCheckCircle size={16} />
              Verified Organization
            </div>
          );
        case 'pending':
          return (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              <FiClock size={16} />
              Verification Pending
            </div>
          );
        case 'rejected':
          return (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              <FiShield size={16} />
              Verification Rejected
            </div>
          );
        default:
          return (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              <FiShield size={16} />
              Not Verified
            </div>
          );
      }
    };

    return (
      <div className="p-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome back, {organizationData?.name || 'Organization'}!
              </h1>
              <p className="text-gray-600">Manage your events and certificate verifications</p>
            </div>
            {getVerificationStatusBadge()}
          </div>
        </div>

        {/* Verification Alert */}
        {organizationData?.verification_status !== 'verified' && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-4">
              <FiShield className="text-blue-600 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Complete Your Organization Verification
                </h3>
                <p className="text-blue-800 mb-4">
                  To publish events and manage certificate verifications, you need to complete the organization verification process.
                </p>
                <Link 
                  to="/organization/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiFileText size={16} />
                  Complete Verification
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalEvents || 0}</p>
                <p className="text-sm text-green-600 mt-1">
                  {stats?.publishedEvents || 0} published
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiCalendar className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verification Requests</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalVerificationRequests || 0}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  {stats?.pendingRequests || 0} pending
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiFileText className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved Certificates</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.approvedRequests || 0}</p>
                <p className="text-sm text-green-600 mt-1">
                  {Math.round((stats?.approvedRequests || 0) / Math.max(stats?.totalVerificationRequests || 1, 1) * 100)}% approval rate
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Organization Score</p>
                <p className="text-3xl font-bold text-gray-800">
                  {organizationData?.verification_status === 'verified' ? '100' : '0'}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {organizationData?.verification_status === 'verified' ? 'Verified' : 'Pending'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiAward className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Events */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiCalendar size={20} />
              Recent Events
            </h3>
            <div className="space-y-3">
              {recentActivity?.recentEvents?.length > 0 ? (
                recentActivity.recentEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiCalendar className="text-blue-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {event.event_type} • {new Date(event.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FiCalendar size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No recent events</p>
                  <Link 
                    to="/organization/feed"
                    className="text-[#4a5d23] hover:text-[#3a4d1a] text-sm font-medium"
                  >
                    Create your first event →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Verification Requests */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiFileText size={20} />
              Recent Requests
            </h3>
            <div className="space-y-3">
              {recentActivity?.recentRequests?.length > 0 ? (
                recentActivity.recentRequests.map((request, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FiFileText className="text-yellow-600" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{request.participant_name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(request.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FiFileText size={32} className="mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No verification requests yet</p>
                  <Link 
                    to="/organization/verifications"
                    className="text-[#4a5d23] hover:text-[#3a4d1a] text-sm font-medium"
                  >
                    Manage verifications →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/organization/feed"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiGrid className="text-[#4a5d23]" size={20} />
              <span className="font-medium text-gray-700">View Events</span>
            </Link>
            
            <Link
              to="/organization/table"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiList className="text-[#4a5d23]" size={20} />
              <span className="font-medium text-gray-700">Manage Events</span>
            </Link>
            
            <Link
              to="/organization/verifications"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFileText className="text-[#4a5d23]" size={20} />
              <span className="font-medium text-gray-700">Verifications</span>
            </Link>
            
            <Link
              to="/organization/profile"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiUser className="text-[#4a5d23]" size={20} />
              <span className="font-medium text-gray-700">Profile Settings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5d23]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Organization Dashboard</h1>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiMenu size={20} />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <OrganizationSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <div className="">
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="profile" element={<OrganizationProfile />} />
            <Route path="feed" element={<OrganizationFeed />} />
            <Route path="table" element={<OrganizationPostTable />} />
            <Route path="verifications" element={<OrganizationVerifications />} />
            <Route path="settings" element={<div className="p-6"><h1>Settings - Coming Soon</h1></div>} />
          </Routes>
        </div>
      </div>

      {/* Event Modal */}
      <OrganizationPostModal />
    </div>
  );
};

export default OrganizationDashboard;

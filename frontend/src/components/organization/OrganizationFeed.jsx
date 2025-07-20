import React, { useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrganizationEvents, openModal, setCurrentEvent, clearError } from '../../features/organization/organizationSlice';
import { 
  selectOrganizationEvents, 
  selectOrganizationLoading, 
  selectOrganizationError,
  selectDashboardStats 
} from '../../features/organization/organizationSelector';
import {
  selectCurrentOrganization,
  selectIsOrganizationVerified
} from '../../features/organizationAuth/organizationAuthSelectors';
import { logoutOrganization } from '../../features/organizationAuth/organizationAuthSlice';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../../utils/errorHandler';
import { FiPlus, FiCalendar, FiUsers, FiCheckCircle, FiClock, FiEye, FiEdit, FiTrash2, FiX, FiShield } from 'react-icons/fi';

const OrganizationFeed = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const events = useSelector(selectOrganizationEvents);
  const loading = useSelector(selectOrganizationLoading);
  const error = useSelector(selectOrganizationError);
  const stats = useSelector(selectDashboardStats);
  const currentOrganization = useSelector(selectCurrentOrganization);
  const isVerified = useSelector(selectIsOrganizationVerified);
  
  // Memoize the organization ID to prevent unnecessary re-renders
  const organizationId = useMemo(() => currentOrganization?.id, [currentOrganization?.id]);
  
  // Prevent infinite loops by tracking if we've already attempted to fetch
  const hasFetchedRef = useRef(false);
  const lastOrgIdRef = useRef(null);
  const hasErrorRef = useRef(false);
  
  const errorType = getErrorType(error);
  const errorMessage = formatErrorMessage(error);
  const errorIcon = getErrorIcon(errorType);
  const errorColorClass = getErrorColorClass(errorType);

  useEffect(() => {
    console.log('OrganizationFeed useEffect triggered:', {
      organizationId,
      lastOrgId: lastOrgIdRef.current,
      hasFetched: hasFetchedRef.current,
      hasError: hasErrorRef.current,
      loading,
      error
    });
    
    // Only fetch if we have an organization ID, it's different from the last one, and we haven't encountered an error
    if (organizationId && organizationId !== lastOrgIdRef.current && !hasErrorRef.current) {
      console.log('Fetching organization events for new org:', organizationId);
      lastOrgIdRef.current = organizationId;
      hasFetchedRef.current = true;
      dispatch(fetchOrganizationEvents());
    }
  }, [organizationId, dispatch]);

  // Handle errors and prevent infinite loops
  useEffect(() => {
    if (error) {
      hasErrorRef.current = true;
      console.log('OrganizationFeed error detected:', error);
      
      // Handle 401 Unauthorized - user is not an organization or token expired
      if (error.includes('401') || error.includes('Unauthorized') || error.includes('Invalid or expired token')) {
        console.log('401 Unauthorized detected, immediately logging out organization');
        
        // Clear auth data immediately
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('organizationAuth');
        
        // Dispatch logout
        dispatch(logoutOrganization());
        
        // Immediate redirect without timeout
        navigate('/organization/login', { 
          replace: true,
          state: { message: 'Session expired. Please log in again.' }
        });
      }
    }
  }, [error, dispatch, navigate]);

  const handleCreateEvent = () => {
    dispatch(openModal('create'));
  };

  const handleRetryFetch = () => {
    console.log('Manual retry - fetching organization events');
    dispatch(clearError());
    hasErrorRef.current = false;
    if (organizationId) {
      // Reset the tracking refs to allow a fresh fetch
      lastOrgIdRef.current = null;
      hasFetchedRef.current = false;
      dispatch(fetchOrganizationEvents());
    }
  };

  const handleViewEvent = (event) => {
    dispatch(setCurrentEvent(event));
    dispatch(openModal('view'));
  };

  const handleEditEvent = (event) => {
    dispatch(setCurrentEvent(event));
    dispatch(openModal('edit'));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'graduation':
        return '🎓';
      case 'certification':
        return '📜';
      case 'award':
        return '🏆';
      case 'workshop':
        return '🔧';
      case 'course':
        return '📚';
      case 'training':
        return '💪';
      case 'conference':
        return '🎤';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5d23]"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Organization Feed</h1>
            <p className="text-gray-600">Manage and view your organization events and programs</p>
          </div>
          <button
            onClick={handleCreateEvent}
            className="flex items-center gap-2 px-6 py-3 bg-[#4a5d23] text-white rounded-lg hover:bg-[#3a4d1a] transition-colors"
          >
            <FiPlus size={20} />
            Create Event
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`mb-6 p-4 border rounded-lg ${errorColorClass}`}>
          <div className="flex items-center gap-3">
            <span className="text-lg">{errorIcon}</span>
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
              <p className="text-sm opacity-75 mt-1">
                {error.includes('401') || error.includes('Unauthorized') || error.includes('Invalid or expired token') ? 
                  'Redirecting to organization login...' :
                  'Please try again or contact support if the problem persists.'
                }
              </p>
            </div>
            <div className="flex gap-2">
              {!(error.includes('401') || error.includes('Unauthorized') || error.includes('Invalid or expired token')) && (
                <button
                  onClick={handleRetryFetch}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              )}
              <button
                onClick={() => dispatch(clearError())}
                className="p-1 hover:bg-black/10 rounded transition-colors"
              >
                <FiX size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verification Status Banner */}
      {/* {!isVerified && (
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <FiShield className="text-blue-600" size={20} />
            <div className="flex-1">
              <p className="text-blue-800 font-medium">Organization Verification Status</p>
              <p className="text-blue-600 text-sm">
                Only verified organizations can publish events. Complete your verification to start publishing.
              </p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
              {currentOrganization?.verification_status === 'pending' ? 'Verification Pending' : 'Not Verified'}
            </span>
          </div>
        </div>
      )} */}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalEvents || 0}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats?.publishedEvents || 0}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats?.draftEvents || 0}</p>
            </div>
            <div className="text-2xl">📝</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verifications</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.totalVerificationRequests || 0}</p>
            </div>
            <div className="text-2xl">🔍</div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first organization event or program</p>
          <button
            onClick={handleCreateEvent}
            className="flex items-center gap-2 px-6 py-3 bg-[#4a5d23] text-white rounded-lg hover:bg-[#3a4d1a] transition-colors mx-auto"
          >
            <FiPlus size={20} />
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Event Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getEventTypeIcon(event.event_type)}</span>
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {event.event_type}
                    </span>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {event.description}
                </p>
              </div>

              {/* Event Details */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar size={16} />
                    <span>{formatDate(event.event_date)}</span>
                  </div>
                  {event.application_deadline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiClock size={16} />
                      <span>Deadline: {formatDate(event.application_deadline)}</span>
                    </div>
                  )}
                  {event.requires_verification && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FiCheckCircle size={16} />
                      <span>Requires Verification</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewEvent(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <FiEye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleEditEvent(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FiEdit size={16} />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {events.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-6 py-3 text-[#4a5d23] border border-[#4a5d23] rounded-lg hover:bg-[#4a5d23] hover:text-white transition-colors">
            Load More Events
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganizationFeed;

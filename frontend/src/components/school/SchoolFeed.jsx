import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolEvents, openModal, setCurrentEvent, clearError } from '../../features/school/schoolSlice';
import { 
  selectSchoolEvents, 
  selectSchoolLoading, 
  selectSchoolError,
  selectSchoolStats 
} from '../../features/school/schoolSelector';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../../utils/errorHandler';
import { FiPlus, FiCalendar, FiUsers, FiCheckCircle, FiClock, FiEye, FiEdit, FiTrash2, FiX } from 'react-icons/fi';

const SchoolFeed = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectSchoolEvents);
  const loading = useSelector(selectSchoolLoading);
  const error = useSelector(selectSchoolError);
  const stats = useSelector(selectSchoolStats);
  
  const errorType = getErrorType(error);
  const errorMessage = formatErrorMessage(error);
  const errorIcon = getErrorIcon(errorType);
  const errorColorClass = getErrorColorClass(errorType);

  useEffect(() => {
    dispatch(fetchSchoolEvents());
  }, [dispatch]);

  const handleCreateEvent = () => {
    dispatch(openModal('create'));
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
            <h1 className="text-3xl font-bold text-gray-800 mb-2">School Feed</h1>
            <p className="text-gray-600">Manage and view your school events and posts</p>
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
                Please try again or contact support if the problem persists.
              </p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="p-1 hover:bg-black/10 rounded transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="text-2xl">📊</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="text-2xl">✅</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.draft}</p>
            </div>
            <div className="text-2xl">📝</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verifications</p>
              <p className="text-2xl font-bold text-blue-600">{stats.withVerification}</p>
            </div>
            <div className="text-2xl">🔍</div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Yet</h3>
          <p className="text-gray-600 mb-6">Start by creating your first school event or post</p>
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

export default SchoolFeed; 
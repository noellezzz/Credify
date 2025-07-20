import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSchoolEvents, 
  openModal, 
  setCurrentEvent,
  deleteSchoolEvent,
  publishSchoolEvent,
  clearError 
} from '../../features/school/schoolSlice';
import { 
  selectSchoolEvents, 
  selectSchoolLoading, 
  selectSchoolError 
} from '../../features/school/schoolSelector';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../../utils/errorHandler';
import { 
  FiPlus, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiSearch,
  FiX
} from 'react-icons/fi';

const SchoolPostTable = () => {
  const dispatch = useDispatch();
  const events = useSelector(selectSchoolEvents);
  const loading = useSelector(selectSchoolLoading);
  const error = useSelector(selectSchoolError);
  
  const errorType = getErrorType(error);
  const errorMessage = formatErrorMessage(error);
  const errorIcon = getErrorIcon(errorType);
  const errorColorClass = getErrorColorClass(errorType);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

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

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await dispatch(deleteSchoolEvent(eventId));
    }
  };

  const handlePublishEvent = async (eventId) => {
    await dispatch(publishSchoolEvent(eventId));
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
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.event_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5d23]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Events Table</h1>
            <p className="text-gray-600">Manage and organize your school events</p>
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="graduation">Graduation</option>
              <option value="certification">Certification</option>
              <option value="award">Award</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-600">
              {filteredEvents.length} of {events.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Event</th>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Type</th>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Event Date</th>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left font-medium text-gray-700">Created</th>
                <th className="px-6 py-4 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">📚</div>
                    <p className="text-lg font-medium">No events found</p>
                    <p className="text-sm">Try adjusting your filters or create a new event</p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-medium text-gray-800">{event.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEventTypeIcon(event.event_type)}</span>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {event.event_type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiCalendar size={14} />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      {event.application_deadline && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <FiClock size={12} />
                          <span>Deadline: {formatDate(event.application_deadline)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full w-fit ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        {event.requires_verification && (
                          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full w-fit">
                            <FiCheckCircle size={10} />
                            Verification
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(event.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewEvent(event)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </button>
                        {event.status === 'draft' && (
                          <button
                            onClick={() => handlePublishEvent(event.id)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Publish"
                          >
                            <FiCheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchoolPostTable; 
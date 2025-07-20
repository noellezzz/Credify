import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createOrganizationEvent, 
  updateOrganizationEvent, 
  closeModal,
  clearError 
} from '../../features/organization/organizationSlice';
import { 
  selectIsModalOpen, 
  selectModalType, 
  selectCurrentEvent,
  selectOrganizationLoading,
  selectOrganizationError 
} from '../../features/organization/organizationSelector';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../../utils/errorHandler';
import { FiX, FiCalendar, FiClock, FiCheckCircle, FiSave, FiEye } from 'react-icons/fi';

const OrganizationPostModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsModalOpen);
  const modalType = useSelector(selectModalType);
  const currentEvent = useSelector(selectCurrentEvent);
  const loading = useSelector(selectOrganizationLoading);
  const error = useSelector(selectOrganizationError);
  
  const errorType = getErrorType(error);
  const errorMessage = formatErrorMessage(error);
  const errorIcon = getErrorIcon(errorType);
  const errorColorClass = getErrorColorClass(errorType);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'course',
    requires_verification: false,
    event_date: '',
    application_deadline: '',
    status: 'draft'
  });

  useEffect(() => {
    if (currentEvent && modalType === 'edit') {
      setFormData({
        title: currentEvent.title || '',
        description: currentEvent.description || '',
        event_type: currentEvent.event_type || 'course',
        requires_verification: currentEvent.requires_verification || false,
        event_date: currentEvent.event_date ? new Date(currentEvent.event_date).toISOString().split('T')[0] : '',
        application_deadline: currentEvent.application_deadline ? new Date(currentEvent.application_deadline).toISOString().split('T')[0] : '',
        status: currentEvent.status || 'draft'
      });
    } else if (modalType === 'create') {
      setFormData({
        title: '',
        description: '',
        event_type: 'course',
        requires_verification: false,
        event_date: '',
        application_deadline: '',
        status: 'draft'
      });
    }
  }, [currentEvent, modalType]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (modalType === 'create') {
      await dispatch(createOrganizationEvent(formData));
    } else if (modalType === 'edit') {
      await dispatch(updateOrganizationEvent({ id: currentEvent.id, eventData: formData }));
    }
  };

  const handleClose = () => {
    dispatch(closeModal());
  };

  const getModalTitle = () => {
    switch (modalType) {
      case 'create':
        return 'Create New Event';
      case 'edit':
        return 'Edit Event';
      case 'view':
        return 'Event Details';
      default:
        return 'Event';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'course':
        return '📚';
      case 'certification':
        return '📜';
      case 'training':
        return '🎯';
      case 'workshop':
        return '🔧';
      case 'conference':
        return '🎤';
      case 'seminar':
        return '💼';
      case 'award':
        return '🏆';
      case 'competition':
        return '🏁';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{getModalTitle()}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className={`mx-6 mt-4 p-4 border rounded-lg ${errorColorClass}`}>
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

        {/* Content */}
        <div className="p-6">
          {modalType === 'view' ? (
            // View Mode
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getEventTypeIcon(currentEvent?.event_type)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{currentEvent?.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">{currentEvent?.event_type}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-2">Description</h4>
                <p className="text-gray-600">{currentEvent?.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FiCalendar size={16} />
                  <span>Event Date: {formatDate(currentEvent?.event_date)}</span>
                </div>
                {currentEvent?.application_deadline && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiClock size={16} />
                    <span>Deadline: {formatDate(currentEvent?.application_deadline)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  currentEvent?.status === 'published' ? 'bg-green-100 text-green-800' :
                  currentEvent?.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {currentEvent?.status}
                </span>
                {currentEvent?.requires_verification && (
                  <span className="flex items-center gap-1 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                    <FiCheckCircle size={14} />
                    Requires Verification
                  </span>
                )}
              </div>
            </div>
          ) : (
            // Create/Edit Mode
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
                  required
                  placeholder="Enter event title..."
                />
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  name="event_type"
                  value={formData.event_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
                >
                  <option value="course">📚 Course</option>
                  <option value="certification">📜 Certification</option>
                  <option value="training">🎯 Training</option>
                  <option value="workshop">🔧 Workshop</option>
                  <option value="conference">🎤 Conference</option>
                  <option value="seminar">💼 Seminar</option>
                  <option value="award">🏆 Award</option>
                  <option value="competition">🏁 Competition</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent resize-none"
                  required
                  placeholder="Describe your event..."
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="application_deadline"
                    value={formData.application_deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Verification Required */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="requires_verification"
                  checked={formData.requires_verification}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#4a5d23] border-gray-300 rounded focus:ring-[#4a5d23]"
                />
                <label className="text-sm font-medium text-gray-700">
                  Requires Certificate Verification
                </label>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          {modalType !== 'view' && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#4a5d23] text-white rounded-lg hover:bg-[#3a4d1a] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave size={16} />
                  {modalType === 'create' ? 'Create Event' : 'Save Changes'}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationPostModal;

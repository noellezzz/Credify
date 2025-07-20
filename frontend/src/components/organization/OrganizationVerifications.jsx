import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchVerificationRequests, approveVerificationRequest, rejectVerificationRequest, clearError } from '../../features/organization/organizationSlice';
import { selectVerificationRequests, selectOrganizationLoading, selectOrganizationError } from '../../features/organization/organizationSelector';
import { logoutOrganization } from '../../features/organizationAuth/organizationAuthSlice';
import { 
  FiFileText, 
  FiCheck, 
  FiX, 
  FiEye, 
  FiDownload, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiUser,
  FiAlertTriangle
} from 'react-icons/fi';

const OrganizationVerifications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verificationRequests = useSelector(selectVerificationRequests);
  const loading = useSelector(selectOrganizationLoading);
  const error = useSelector(selectOrganizationError);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Prevent infinite loops on errors
  const hasFetchedRef = useRef(false);
  const hasErrorRef = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't fetched before and haven't encountered an error
    if (!hasFetchedRef.current && !hasErrorRef.current) {
      console.log('Fetching verification requests...');
      hasFetchedRef.current = true;
      dispatch(fetchVerificationRequests());
    }
  }, [dispatch]);

  // Handle errors and prevent infinite loops
  useEffect(() => {
    if (error) {
      hasErrorRef.current = true;
      console.log('OrganizationVerifications error detected:', error);
      
      // Handle 401 Unauthorized - user is not an organization or token expired
      if (error.includes('401') || error.includes('Unauthorized') || error.includes('Invalid or expired token')) {
        console.log('Unauthorized access detected, logging out organization');
        setTimeout(() => {
          dispatch(logoutOrganization());
          navigate('/organization/login', { 
            replace: true,
            state: { message: 'Session expired. Please log in again.' }
          });
        }, 2000);
      }
      
      // For 500 errors, just stop trying and show error
      if (error.includes('500') || error.includes('Internal Server Error') || error.includes('TypeError: fetch failed')) {
        console.log('Server error detected, stopping fetch attempts');
      }
    }
  }, [error, dispatch, navigate]);

  const filteredRequests = verificationRequests.filter(request => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSearch = request.participant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.participant_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.event_title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRetryFetch = () => {
    console.log('Manual retry - fetching verification requests');
    dispatch(clearError());
    hasErrorRef.current = false;
    hasFetchedRef.current = false;
    dispatch(fetchVerificationRequests());
  };

  const handleApprove = async (requestId) => {
    try {
      await dispatch(approveVerificationRequest({ requestId, notes: '' })).unwrap();
      // Refresh the list
      dispatch(fetchVerificationRequests());
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await dispatch(rejectVerificationRequest({ requestId, notes: '' })).unwrap();
      // Refresh the list
      dispatch(fetchVerificationRequests());
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
            <FiCheckCircle size={14} />
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
            <FiXCircle size={14} />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
            <FiClock size={14} />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && verificationRequests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a5d23]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Certificate Verification Requests</h1>
        <p className="text-gray-600">Review and manage certificate verification requests from participants</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className={`mb-6 p-4 border rounded-lg ${
          error.includes('500') || error.includes('Internal Server Error') || error.includes('TypeError: fetch failed') 
            ? 'bg-red-50 border-red-200 text-red-800' 
            : error.includes('401') || error.includes('Unauthorized') || error.includes('Invalid or expired token')
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-current" size={20} />
            <div className="flex-1">
              <p className="font-medium">
                {error.includes('500') || error.includes('Internal Server Error') || error.includes('TypeError: fetch failed') 
                  ? 'Server Error' 
                  : error.includes('401') || error.includes('Unauthorized') || error.includes('Invalid or expired token')
                  ? 'Authentication Error'
                  : 'Error'
                }
              </p>
              <p className="text-sm opacity-75 mt-1">
                {error.includes('500') || error.includes('Internal Server Error') || error.includes('TypeError: fetch failed') 
                  ? 'The server is experiencing issues. Please try again later or contact support.' 
                  : error.includes('401') || error.includes('Unauthorized') || error.includes('Invalid or expired token')
                  ? 'Redirecting to organization login...'
                  : 'Please try again or contact support if the problem persists.'
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

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by participant name, participant ID, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4a5d23] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-800">{verificationRequests.length}</p>
            </div>
            <FiFileText className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {verificationRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <FiClock className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {verificationRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <FiCheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {verificationRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <FiXCircle className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      {/* Verification Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <FiFileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No verification requests</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'No requests match your current filters.' 
                : 'Verification requests will appear here when participants submit them.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant ID
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{request.participant_name}</p>
                          <p className="text-sm text-gray-500">Year: {request.participation_year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{request.event_title}</p>
                      <p className="text-sm text-gray-500">{request.event_type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{request.participant_id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{formatDate(request.submitted_at)}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewRequest(request)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Verification Request Details</h3>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Participant Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Participant Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <p className="text-gray-900">{selectedRequest.participant_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Participant ID</label>
                    <p className="text-gray-900">{selectedRequest.participant_id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Participation Year</label>
                    <p className="text-gray-900">{selectedRequest.participation_year}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </div>

              {/* Event Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Event Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Event Title</label>
                    <p className="text-gray-900">{selectedRequest.event_title}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Event Type</label>
                    <p className="text-gray-900">{selectedRequest.event_type}</p>
                  </div>
                </div>
              </div>

              {/* Certificate */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Certificate</h4>
                {selectedRequest.certificate_file_url ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FiFileText className="text-blue-600" size={24} />
                        <div>
                          <p className="font-medium text-gray-900">Certificate File</p>
                          <p className="text-sm text-gray-600">Click to view or download</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={selectedRequest.certificate_file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Certificate"
                        >
                          <FiEye size={16} />
                        </a>
                        <a
                          href={selectedRequest.certificate_file_url}
                          download
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Certificate"
                        >
                          <FiDownload size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No certificate file provided</p>
                )}
              </div>

              {/* Submission Details */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Submission Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Submitted At</label>
                    <p className="text-gray-900">{formatDate(selectedRequest.submitted_at)}</p>
                  </div>
                  {selectedRequest.processed_at && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Processed At</label>
                      <p className="text-gray-900">{formatDate(selectedRequest.processed_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setShowRequestModal(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FiCheck size={16} />
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedRequest.id);
                        setShowRequestModal(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FiX size={16} />
                      Reject Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationVerifications;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchVerificationRequests,
    fetchVerificationStats,
    approveRequest,
    rejectRequest,
    setFilters,
    clearError
} from '../../features/verification/verificationSlice';
import {
    selectVerificationRequests,
    selectVerificationLoading,
    selectVerificationError,
    selectVerificationStats,
    selectFilteredVerificationRequests
} from '../../features/verification/verificationSelector';
import { formatErrorMessage, getErrorType, getErrorIcon, getErrorColorClass } from '../../utils/errorHandler';
import {
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiEye,
    FiFilter,
    FiDownload,
    FiSearch,
    FiX
} from 'react-icons/fi';

const VerificationRequestsTable = () => {
    const dispatch = useDispatch();
    const requests = useSelector(selectFilteredVerificationRequests);
    const loading = useSelector(selectVerificationLoading);
    const error = useSelector(selectVerificationError);
    const stats = useSelector(selectVerificationStats);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewModal, setReviewModal] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [reviewAction, setReviewAction] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const errorType = getErrorType(error);
    const errorMessage = formatErrorMessage(error);
    const errorIcon = getErrorIcon(errorType);
    const errorColorClass = getErrorColorClass(errorType);

    useEffect(() => {
        dispatch(fetchVerificationRequests());
        dispatch(fetchVerificationStats());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setFilters({
            search: searchTerm,
            status: statusFilter
        }));
    }, [searchTerm, statusFilter, dispatch]);

    const handleReview = (request, action) => {
        setSelectedRequest(request);
        setReviewAction(action);
        setReviewModal(true);
        setReviewNotes('');
    };

    const submitReview = async () => {
        if (!selectedRequest) return;

        try {
            if (reviewAction === 'approve') {
                await dispatch(approveRequest({
                    id: selectedRequest.id,
                    review_notes: reviewNotes
                })).unwrap();
            } else {
                await dispatch(rejectRequest({
                    id: selectedRequest.id,
                    review_notes: reviewNotes
                })).unwrap();
            }
            setReviewModal(false);
            setSelectedRequest(null);
            setReviewNotes('');
        } catch (error) {
            console.error('Failed to process review:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <FiClock className="w-4 h-4" />;
            case 'approved':
                return <FiCheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <FiXCircle className="w-4 h-4" />;
            default:
                return <FiClock className="w-4 h-4" />;
        }
    };

    if (loading && requests.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading verification requests...</span>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header with Stats */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Verification Requests</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                            </div>
                            <FiEye className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <FiClock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                            </div>
                            <FiCheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Rejected</p>
                                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                            <FiXCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className={`mb-6 p-4 rounded-lg border ${errorColorClass} flex items-center justify-between`}>
                    <div className="flex items-center">
                        {errorIcon}
                        <span className="ml-2 font-medium">{errorMessage}</span>
                    </div>
                    <button 
                        onClick={() => dispatch(clearError())}
                        className="text-current opacity-75 hover:opacity-100"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by student name, ID, or event..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {requests.length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500">No verification requests found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Submitted
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {request.student_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {request.student_id}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Year: {request.graduation_year}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {request.events?.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {request.events?.event_type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(request.submitted_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                {getStatusIcon(request.status)}
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                {request.certificate_file_url && (
                                                    <a
                                                        href={request.certificate_file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <FiDownload className="w-4 h-4" />
                                                    </a>
                                                )}
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleReview(request, 'approve')}
                                                            className="text-green-600 hover:text-green-900"
                                                        >
                                                            <FiCheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReview(request, 'reject')}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <FiXCircle className="w-4 h-4" />
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

            {/* Review Modal */}
            {reviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {reviewAction === 'approve' ? 'Approve' : 'Reject'} Verification Request
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Student: {selectedRequest?.student_name}
                        </p>
                        <textarea
                            value={reviewNotes}
                            onChange={(e) => setReviewNotes(e.target.value)}
                            placeholder="Add review notes (optional)"
                            className="w-full p-3 border border-gray-200 rounded-lg resize-none h-24 mb-4"
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setReviewModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReview}
                                className={`px-4 py-2 rounded-lg text-white ${
                                    reviewAction === 'approve' 
                                        ? 'bg-green-600 hover:bg-green-700' 
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {reviewAction === 'approve' ? 'Approve' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerificationRequestsTable;

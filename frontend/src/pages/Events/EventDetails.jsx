import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPublicEvent } from '../../features/events/eventsSlice';
import { submitVerificationRequest, fetchUserVerificationStatus } from '../../features/verification/verificationSlice';
import {
    selectCurrentEvent,
    selectEventsLoading,
    selectEventsError
} from '../../features/events/eventsSelector';
import { 
    selectVerificationLoading, 
    selectUserVerificationStatus 
} from '../../features/verification/verificationSelector';
import { selectUser } from '../../features/user/userSelector';
import { selectUserId, selectUserFirstname, selectUserLastname } from '../../features/user/userSelector';
import {
    FiCalendar,
    FiMapPin,
    FiUser,
    FiMail,
    FiPhone,
    FiClock,
    FiCheckCircle,
    FiUpload,
    FiArrowLeft,
    FiFileText,
    FiDownload,
    FiAward,
    FiShield
} from 'react-icons/fi';

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const event = useSelector(selectCurrentEvent);
    const loading = useSelector(selectEventsLoading);
    const error = useSelector(selectEventsError);
    const verificationLoading = useSelector(selectVerificationLoading);
    const user = useSelector(selectUser);
    const userId = useSelector(selectUserId);
    const userFirstname = useSelector(selectUserFirstname);
    const userLastname = useSelector(selectUserLastname);
    const userVerificationStatus = useSelector(selectUserVerificationStatus);

    const [showVerificationForm, setShowVerificationForm] = useState(false);
    const [certificateFile, setCertificateFile] = useState(null);
    
    // Initialize form data with user information
    const getInitialVerificationData = () => ({
        participant_name: user ? `${userFirstname || ''} ${userLastname || ''}`.trim() : '',
        participant_id: userId || '',
        participation_year: new Date().getFullYear(),
        completion_date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
        certificate_file_url: ''
    });
    
    const [verificationData, setVerificationData] = useState(getInitialVerificationData());

    useEffect(() => {
        if (id) {
            dispatch(fetchPublicEvent(id));
            // Check if user has existing verification for this event
            if (user?.id) {
                console.log('Fetching verification status for:', { eventId: id, userId: user.id, userObject: user });
                console.log('Full user object:', JSON.stringify(user, null, 2));
                dispatch(fetchUserVerificationStatus({ eventId: id, userId: user.id }));
            } else {
                console.log('No user ID found, user object:', user);
            }
        }
    }, [dispatch, id, user?.id]);

    // Update form data when user data is available
    useEffect(() => {
        if (user) {
            setVerificationData(getInitialVerificationData());
        }
    }, [user, userFirstname, userLastname, userId]);

    // Debug verification status
    useEffect(() => {
        console.log('userVerificationStatus changed:', userVerificationStatus);
    }, [userVerificationStatus]);

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare the certificate file URL or base64 data
            let certificateFileUrl = verificationData.certificate_file_url;
            if (certificateFile) {
                certificateFileUrl = `data:${certificateFile.type};base64,${await convertToBase64(certificateFile)}`;
            }

            const requestData = {
                participant_name: verificationData.participant_name,
                participant_id: verificationData.participant_id,
                participation_year: verificationData.participation_year,
                completion_date: verificationData.completion_date,
                certificate_file_url: certificateFileUrl,
                user_id: userId // Include the actual user ID
            };

            await dispatch(submitVerificationRequest({
                eventId: id,
                requestData
            })).unwrap();
            
            alert('Verification request submitted successfully!');
            setShowVerificationForm(false);
            setVerificationData(getInitialVerificationData());
            setCertificateFile(null);
            
            // Refresh verification status to show the new request
            dispatch(fetchUserVerificationStatus({ eventId: id, userId: userId }));
        } catch (error) {
            console.error('Failed to submit verification request:', error);
            
            // Handle specific error cases
            if (error.response?.status === 409) {
                alert('You have already submitted a verification request for this event.');
                // Refresh status to show existing request
                dispatch(fetchUserVerificationStatus({ eventId: id, userId: userId }));
                setShowVerificationForm(false);
            } else {
                alert('Failed to submit verification request. Please try again.');
            }
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type and size
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a valid file type (JPG, PNG, or PDF)');
                return;
            }

            if (file.size > maxSize) {
                alert('File size must be less than 5MB');
                return;
            }

            setCertificateFile(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVerificationData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'graduation':
                return 'bg-blue-100 text-blue-800';
            case 'certification':
                return 'bg-green-100 text-green-800';
            case 'award':
                return 'bg-purple-100 text-purple-800';
            case 'workshop':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const isEventUpcoming = (eventDate) => {
        return new Date(eventDate) >= new Date();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading event details...</p>
                </div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                    <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/events')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Events
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/events')}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to Events
                </button>

                {/* Event Header */}
                <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.event_type)}`}>
                                    {event.event_type.charAt(0).toUpperCase() + event.event_type.slice(1)}
                                </span>
                                {event.requires_verification && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                                        <FiCheckCircle className="w-4 h-4" />
                                        Verification Available
                                    </span>
                                )}
                                {isEventUpcoming(event.event_date) && (
                                    <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                                        Upcoming
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {event.title}
                            </h1>

                            <div className="flex items-center text-gray-600 mb-4">
                                <FiCalendar className="w-5 h-5 mr-3" />
                                <span className="text-lg">{formatDate(event.event_date)}</span>
                            </div>

                            {event.application_deadline && (
                                <div className="flex items-center text-gray-600 mb-4">
                                    <FiClock className="w-5 h-5 mr-3" />
                                    <span>Application Deadline: {formatDate(event.application_deadline)}</span>
                                </div>
                            )}
                        </div>

                        {event.requires_verification && (
                            <div className="mt-6 lg:mt-0">
                                {userVerificationStatus ? (
                                    // Show verification status if user has one
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            {userVerificationStatus.status === 'approved' ? (
                                                <>
                                                    <FiAward className="text-green-600" size={24} />
                                                    <div>
                                                        <p className="font-semibold text-green-800">Certificate Verified!</p>
                                                        <p className="text-sm text-green-600">Your certificate has been approved</p>
                                                    </div>
                                                </>
                                            ) : userVerificationStatus.status === 'rejected' ? (
                                                <>
                                                    <FiShield className="text-red-600" size={24} />
                                                    <div>
                                                        <p className="font-semibold text-red-800">Verification Rejected</p>
                                                        <p className="text-sm text-red-600">Please contact the organization for details</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <FiClock className="text-yellow-600" size={24} />
                                                    <div>
                                                        <p className="font-semibold text-yellow-800">Verification Pending</p>
                                                        <p className="text-sm text-yellow-600">Your request is being reviewed</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        
                                        {userVerificationStatus.status === 'approved' && userVerificationStatus.certificate_url && (
                                            <div className="mt-4">
                                                <a
                                                    href={userVerificationStatus.certificate_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <FiDownload size={16} />
                                                    Download Verified Certificate
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ) : user ? (
                                    // Show apply button to any logged-in user who hasn't submitted verification
                                    <button
                                        onClick={() => setShowVerificationForm(true)}
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FiFileText className="w-5 h-5" />
                                        Verify My Certificate
                                    </button>
                                ) : (
                                    // Show login prompt if not logged in
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-blue-800 font-medium mb-2">Login Required</p>
                                        <p className="text-blue-600 text-sm mb-3">Please login to apply for certificate verification</p>
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            Login
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="prose max-w-none">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-700 leading-relaxed">
                            {event.description}
                        </p>
                    </div>
                </div>

                {/* School Information */}
                {/* <div className="bg-white rounded-lg shadow-sm border p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center mb-3">
                                <FiUser className="w-5 h-5 mr-3 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-600">School Name</p>
                                    <p className="font-medium text-gray-900">{event.schools?.name}</p>
                                </div>
                            </div>
                            
                            {event.schools?.email && (
                                <div className="flex items-center mb-3">
                                    <FiMail className="w-5 h-5 mr-3 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">{event.schools.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div>
                            {event.schools?.phone && (
                                <div className="flex items-center mb-3">
                                    <FiPhone className="w-5 h-5 mr-3 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium text-gray-900">{event.schools.phone}</p>
                                    </div>
                                </div>
                            )}
                            
                            {event.schools?.address && (
                                <div className="flex items-center mb-3">
                                    <FiMapPin className="w-5 h-5 mr-3 text-gray-400" />
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-medium text-gray-900">{event.schools.address}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div> */}

                {/* Verification Request Modal */}
                {showVerificationForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-semibold mb-4">Submit Verification Request</h3>
                            <p className="text-gray-600 mb-6">
                                Please provide your participation information and upload your certificate for verification.
                            </p>
                            
                            <form onSubmit={handleVerificationSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="participant_name"
                                        value={verificationData.participant_name}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                        placeholder="Auto-filled from your profile"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This is automatically filled from your profile information
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Participant ID
                                    </label>
                                    <input
                                        type="text"
                                        name="participant_id"
                                        value={verificationData.participant_id}
                                        readOnly
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                                        placeholder="Auto-filled with your user ID"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This is automatically set to your unique user ID
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Participation Year
                                    </label>
                                    <input
                                        type="number"
                                        name="participation_year"
                                        value={verificationData.participation_year}
                                        onChange={handleInputChange}
                                        required
                                        min="1900"
                                        max={new Date().getFullYear() + 10}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Completion Date
                                    </label>
                                    <input
                                        type="date"
                                        name="completion_date"
                                        value={verificationData.completion_date}
                                        onChange={handleInputChange}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Certificate File
                                    </label>
                                    <div className="space-y-3">
                                        {/* File Upload */}
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                                            <input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="certificate-upload"
                                            />
                                            <label htmlFor="certificate-upload" className="cursor-pointer">
                                                <FiUpload className="mx-auto mb-2 text-gray-400" size={24} />
                                                <p className="text-sm text-gray-600 mb-1">
                                                    Click to upload your certificate
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Supports JPG, PNG, PDF (max 5MB)
                                                </p>
                                            </label>
                                        </div>
                                        
                                        {certificateFile && (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                <div className="flex items-center gap-2">
                                                    <FiFileText className="text-green-600" size={16} />
                                                    <span className="text-sm text-green-800 font-medium">
                                                        {certificateFile.name}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* OR divider */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 border-t border-gray-300"></div>
                                            <span className="text-sm text-gray-500">OR</span>
                                            <div className="flex-1 border-t border-gray-300"></div>
                                        </div>
                                        
                                        {/* URL Input */}
                                        <input
                                            type="url"
                                            name="certificate_file_url"
                                            value={verificationData.certificate_file_url}
                                            onChange={handleInputChange}
                                            disabled={!!certificateFile}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                                            placeholder="https://example.com/certificate.pdf"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Provide a publicly accessible URL to your certificate
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowVerificationForm(false)}
                                        className="flex-1 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={verificationLoading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {verificationLoading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetailsPage;

import axios from '../utils/axios';

// Verification Requests API
export const verificationApi = {
    // School verification management
    getVerificationRequests: () => axios.get('/schools/verification-requests'),
    getVerificationRequest: (id) => axios.get(`/schools/verification-requests/${id}`),
    approveVerificationRequest: (id, data) => axios.put(`/schools/verification-requests/${id}/approve`, data),
    rejectVerificationRequest: (id, data) => axios.put(`/schools/verification-requests/${id}/reject`, data),
    getVerificationStats: () => axios.get('/schools/verification-requests/stats'),

    // User verification submission
    submitVerificationRequest: (eventId, data) => axios.post(`/verification-requests/events/${eventId}/apply`, data),
    getUserVerificationStatus: (eventId, userId) => axios.get(`/verification-requests/events/${eventId}/status?user_id=${userId}`),
};

export default verificationApi;

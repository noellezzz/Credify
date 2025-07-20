import axios from '../utils/axios';

// School Profile APIs
export const schoolApi = {
    // Profile management
    getProfile: () => axios.get('/schools/profile'),
    updateProfile: (data) => axios.put('/schools/profile', data),

    // Events management
    getEvents: () => axios.get('/schools/events'),
    createEvent: (data) => axios.post('/schools/events', data),
    updateEvent: (id, data) => axios.put(`/schools/events/${id}`, data),
    deleteEvent: (id) => axios.delete(`/schools/events/${id}`),
    publishEvent: (id) => axios.post(`/schools/events/${id}/publish`),

    // Verification requests
    getVerificationRequests: () => axios.get('/schools/verification-requests'),
    getVerificationRequest: (id) => axios.get(`/schools/verification-requests/${id}`),
    approveVerificationRequest: (id, data) => axios.put(`/schools/verification-requests/${id}/approve`, data),
    rejectVerificationRequest: (id, data) => axios.put(`/schools/verification-requests/${id}/reject`, data),
    getVerificationStats: () => axios.get('/schools/verification-requests/stats'),

    // Public events (for users)
    getPublicEvents: () => axios.get('/events'),
    getPublicEvent: (id) => axios.get(`/events/${id}`),
    applyForEvent: (eventId, data) => axios.post(`/verification-requests/events/${eventId}/apply`, data),
};

export default schoolApi; 
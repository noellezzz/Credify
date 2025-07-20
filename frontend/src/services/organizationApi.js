import api from '../utils/axios';

// Organization profile API calls
export const getOrganizationProfile = async () => {
    const response = await api.get('/organizations/profile/me');
    return response.data;
};

export const updateOrganizationProfile = async (profileData) => {
    const response = await api.put('/organizations/profile/me', profileData);
    return response.data;
};

// Organization verification API calls
export const submitVerificationRequest = async (verificationData) => {
    const response = await api.post('/organizations/verification/submit', verificationData);
    return response.data;
};

export const getVerificationStatus = async () => {
    const response = await api.get('/organizations/verification/status');
    return response.data;
};

// Organization events management
export const getOrganizationEvents = async () => {
    const response = await api.get('/organizations/events/manage');
    return response.data;
};

export const createOrganizationEvent = async (eventData) => {
    const response = await api.post('/organizations/events', eventData);
    return response.data;
};

export const updateOrganizationEvent = async (eventId, eventData) => {
    const response = await api.put(`/organizations/events/${eventId}`, eventData);
    return response.data;
};

export const deleteOrganizationEvent = async (eventId) => {
    const response = await api.delete(`/organizations/events/${eventId}`);
    return response.data;
};

export const publishOrganizationEvent = async (eventId) => {
    const response = await api.post(`/organizations/events/${eventId}/publish`);
    return response.data;
};

// Organization verification requests management
export const getVerificationRequests = async () => {
    const response = await api.get('/organizations/verification-requests');
    return response.data;
};

export const getVerificationRequestStats = async () => {
    const response = await api.get('/organizations/verification-requests/stats');
    return response.data;
};

export const getVerificationRequest = async (requestId) => {
    const response = await api.get(`/organizations/verification-requests/${requestId}`);
    return response.data;
};

export const approveVerificationRequest = async (requestId, notes = '') => {
    const response = await api.put(`/organizations/verification-requests/${requestId}/approve`, { notes });
    return response.data;
};

export const rejectVerificationRequest = async (requestId, notes = '') => {
    const response = await api.put(`/organizations/verification-requests/${requestId}/reject`, { notes });
    return response.data;
};

// Public API calls (for users browsing organizations)
export const getPublicOrganizations = async () => {
    const response = await api.get('/organizations');
    return response.data;
};

export const getPublicOrganization = async (organizationId) => {
    const response = await api.get(`/organizations/${organizationId}`);
    return response.data;
};

export const getPublicOrganizationEvents = async (organizationId) => {
    const response = await api.get(`/organizations/${organizationId}/events`);
    return response.data;
};

export default {
    // Organization management
    getOrganizationProfile,
    updateOrganizationProfile,
    submitVerificationRequest,
    getVerificationStatus,

    // Events management
    getOrganizationEvents,
    createOrganizationEvent,
    updateOrganizationEvent,
    deleteOrganizationEvent,
    publishOrganizationEvent,

    // Verification requests management
    getVerificationRequests,
    getVerificationRequestStats,
    getVerificationRequest,
    approveVerificationRequest,
    rejectVerificationRequest,

    // Public API
    getPublicOrganizations,
    getPublicOrganization,
    getPublicOrganizationEvents,
};

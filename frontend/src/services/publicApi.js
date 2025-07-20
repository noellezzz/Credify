import api from '../utils/axios';

// Public API for users to browse events and organizations
export const publicApi = {
    // Public events browsing
    getPublicEvents: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        if (filters.organization) params.append('organization', filters.organization);
        if (filters.date_from) params.append('date_from', filters.date_from);
        if (filters.date_to) params.append('date_to', filters.date_to);

        const queryString = params.toString();
        const url = queryString ? `/events?${queryString}` : '/events';

        const response = await api.get(url);
        return response.data;
    },

    getPublicEvent: async (eventId) => {
        const response = await api.get(`/events/${eventId}`);
        return response.data;
    },

    // Public organizations browsing
    getPublicOrganizations: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        if (filters.location) params.append('location', filters.location);

        const queryString = params.toString();
        const url = queryString ? `/organizations?${queryString}` : '/organizations';

        const response = await api.get(url);
        return response.data;
    },

    getPublicOrganization: async (organizationId) => {
        const response = await api.get(`/organizations/${organizationId}`);
        return response.data;
    },

    getPublicOrganizationEvents: async (organizationId, filters = {}) => {
        const params = new URLSearchParams();

        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);

        const queryString = params.toString();
        const url = queryString
            ? `/organizations/${organizationId}/events?${queryString}`
            : `/organizations/${organizationId}/events`;

        const response = await api.get(url);
        return response.data;
    },

    // Certificate verification request submission
    submitVerificationRequest: async (eventId, verificationData) => {
        const formData = new FormData();

        // Add text fields
        formData.append('participant_name', verificationData.participant_name);
        formData.append('participant_id', verificationData.participant_id);
        formData.append('completion_date', verificationData.completion_date);

        // Add file if present
        if (verificationData.certificate_file) {
            formData.append('certificate_file', verificationData.certificate_file);
        }

        const response = await api.post(`/events/${eventId}/apply`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get verification request status (for users to track their requests)
    getVerificationRequestStatus: async (requestId) => {
        const response = await api.get(`/verification-requests/${requestId}`);
        return response.data;
    },
};

export default publicApi;

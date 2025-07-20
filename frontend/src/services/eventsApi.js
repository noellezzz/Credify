import axios from '../utils/axios';

// Events API
export const eventsApi = {
    // Public events (for users) - aligned with backend /api/events
    getPublicEvents: () => axios.get('/events'),
    getPublicEvent: (id) => axios.get(`/events/${id}`),

    // School events management (for schools) - legacy support
    getSchoolEvents: () => axios.get('/schools/events'),
    createSchoolEvent: (data) => axios.post('/schools/events', data),
    updateSchoolEvent: (id, data) => axios.put(`/schools/events/${id}`, data),
    deleteSchoolEvent: (id) => axios.delete(`/schools/events/${id}`),
    publishSchoolEvent: (id) => axios.post(`/schools/events/${id}/publish`),

    // Organization events management - aligned with backend /api/events/organization/events
    getOrganizationEvents: () => axios.get('/events/organization/events'),
    createOrganizationEvent: (data) => axios.post('/events/organization/events', data),
    updateOrganizationEvent: (id, data) => axios.put(`/events/organization/events/${id}`, data),
    deleteOrganizationEvent: (id) => axios.delete(`/events/organization/events/${id}`),
    publishOrganizationEvent: (id) => axios.post(`/events/organization/events/${id}/publish`),
};

export default eventsApi;

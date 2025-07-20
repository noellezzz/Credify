import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    organization: null,
    profile: null,
    events: [],
    verificationRequests: [],
    statistics: {
        totalEvents: 0,
        publishedEvents: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        rejectedRequests: 0,
    },
    isLoading: false,
    error: null,
};

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        setOrganization: (state, action) => {
            state.organization = action.payload;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
        },
        setEvents: (state, action) => {
            state.events = action.payload;
        },
        addEvent: (state, action) => {
            state.events.push(action.payload);
        },
        updateEvent: (state, action) => {
            const index = state.events.findIndex(event => event.id === action.payload.id);
            if (index !== -1) {
                state.events[index] = action.payload;
            }
        },
        deleteEvent: (state, action) => {
            state.events = state.events.filter(event => event.id !== action.payload);
        },
        setVerificationRequests: (state, action) => {
            state.verificationRequests = action.payload;
        },
        addVerificationRequest: (state, action) => {
            state.verificationRequests.push(action.payload);
        },
        updateVerificationRequest: (state, action) => {
            const index = state.verificationRequests.findIndex(req => req.id === action.payload.id);
            if (index !== -1) {
                state.verificationRequests[index] = action.payload;
            }
        },
        setStatistics: (state, action) => {
            state.statistics = action.payload;
        },
        updateStatistics: (state, action) => {
            state.statistics = { ...state.statistics, ...action.payload };
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearOrganization: (state) => {
            state.organization = null;
            state.profile = null;
            state.events = [];
            state.verificationRequests = [];
            state.statistics = {
                totalEvents: 0,
                publishedEvents: 0,
                pendingRequests: 0,
                approvedRequests: 0,
                rejectedRequests: 0,
            };
            state.error = null;
        },
    },
});

export const {
    setOrganization,
    setProfile,
    setEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    setVerificationRequests,
    addVerificationRequest,
    updateVerificationRequest,
    setStatistics,
    updateStatistics,
    setLoading,
    setError,
    clearError,
    clearOrganization,
} = organizationSlice.actions;

export default organizationSlice.reducer; 
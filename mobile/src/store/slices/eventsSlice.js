import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    events: [],
    organizations: [],
    selectedEvent: null,
    selectedOrganization: null,
    filters: {
        eventType: null,
        organizationType: null,
        dateRange: null,
        searchQuery: '',
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        hasMore: true,
    },
    isLoading: false,
    error: null,
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setEvents: (state, action) => {
            state.events = action.payload;
        },
        addEvents: (state, action) => {
            state.events = [...state.events, ...action.payload];
        },
        setOrganizations: (state, action) => {
            state.organizations = action.payload;
        },
        setSelectedEvent: (state, action) => {
            state.selectedEvent = action.payload;
        },
        setSelectedOrganization: (state, action) => {
            state.selectedOrganization = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                eventType: null,
                organizationType: null,
                dateRange: null,
                searchQuery: '',
            };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        nextPage: (state) => {
            state.pagination.page += 1;
        },
        resetPagination: (state) => {
            state.pagination = {
                page: 1,
                limit: 10,
                total: 0,
                hasMore: true,
            };
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
        clearEvents: (state) => {
            state.events = [];
            state.selectedEvent = null;
            state.selectedOrganization = null;
            state.error = null;
        },
    },
});

export const {
    setEvents,
    addEvents,
    setOrganizations,
    setSelectedEvent,
    setSelectedOrganization,
    setFilters,
    clearFilters,
    setPagination,
    nextPage,
    resetPagination,
    setLoading,
    setError,
    clearError,
    clearEvents,
} = eventsSlice.actions;

export default eventsSlice.reducer; 
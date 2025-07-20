import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    verificationRequests: [],
    certificates: [],
    selectedRequest: null,
    selectedCertificate: null,
    filters: {
        status: null,
        eventType: null,
        dateRange: null,
        searchQuery: '',
    },
    statistics: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
    },
    isLoading: false,
    error: null,
};

const verificationSlice = createSlice({
    name: 'verification',
    initialState,
    reducers: {
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
        setCertificates: (state, action) => {
            state.certificates = action.payload;
        },
        addCertificate: (state, action) => {
            state.certificates.push(action.payload);
        },
        updateCertificate: (state, action) => {
            const index = state.certificates.findIndex(cert => cert.id === action.payload.id);
            if (index !== -1) {
                state.certificates[index] = action.payload;
            }
        },
        setSelectedRequest: (state, action) => {
            state.selectedRequest = action.payload;
        },
        setSelectedCertificate: (state, action) => {
            state.selectedCertificate = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                status: null,
                eventType: null,
                dateRange: null,
                searchQuery: '',
            };
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
        clearVerification: (state) => {
            state.verificationRequests = [];
            state.certificates = [];
            state.selectedRequest = null;
            state.selectedCertificate = null;
            state.error = null;
        },
    },
});

export const {
    setVerificationRequests,
    addVerificationRequest,
    updateVerificationRequest,
    setCertificates,
    addCertificate,
    updateCertificate,
    setSelectedRequest,
    setSelectedCertificate,
    setFilters,
    clearFilters,
    setStatistics,
    updateStatistics,
    setLoading,
    setError,
    clearError,
    clearVerification,
} = verificationSlice.actions;

export default verificationSlice.reducer; 
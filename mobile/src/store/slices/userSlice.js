import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    profile: null,
    certificates: [],
    verificationRequests: [],
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setProfile: (state, action) => {
            state.profile = action.payload;
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
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearUser: (state) => {
            state.user = null;
            state.profile = null;
            state.certificates = [];
            state.verificationRequests = [];
            state.error = null;
        },
    },
});

export const {
    setUser,
    setProfile,
    setCertificates,
    addCertificate,
    updateCertificate,
    setVerificationRequests,
    addVerificationRequest,
    updateVerificationRequest,
    setLoading,
    setError,
    clearError,
    clearUser,
} = userSlice.actions;

export default userSlice.reducer; 
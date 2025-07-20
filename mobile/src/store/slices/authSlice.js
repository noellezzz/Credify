import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: false,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
    userType: null, // 'user', 'organization', 'admin'
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
            state.userType = action.payload.userType;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
            state.userType = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
            state.userType = null;
            state.error = null;
        },
        updateToken: (state, action) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    updateToken,
    clearError,
} = authSlice.actions;

export default authSlice.reducer; 
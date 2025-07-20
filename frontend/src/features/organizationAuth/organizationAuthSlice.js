import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import organizationAuthApi from '../../services/organizationAuth';

// Async thunks
export const registerOrganization = createAsyncThunk(
    'organizationAuth/register',
    async (organizationData, { rejectWithValue }) => {
        try {
            const response = await organizationAuthApi.register(organizationData);
            return response;
        } catch (error) {
            return rejectWithValue(error.error || error.message || 'Registration failed');
        }
    }
);

export const loginOrganization = createAsyncThunk(
    'organizationAuth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await organizationAuthApi.login(email, password);
            return response;
        } catch (error) {
            return rejectWithValue(error.error || error.message || 'Login failed');
        }
    }
);

export const logoutOrganization = createAsyncThunk(
    'organizationAuth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await organizationAuthApi.logout();
            return { message: 'Logout successful' };
        } catch (error) {
            return rejectWithValue(error.error || error.message || 'Logout failed');
        }
    }
);

export const getCurrentOrganization = createAsyncThunk(
    'organizationAuth/getCurrent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await organizationAuthApi.getCurrentOrganization();
            return response;
        } catch (error) {
            return rejectWithValue(error.error || error.message || 'Failed to get current organization');
        }
    }
);

export const refreshSession = createAsyncThunk(
    'organizationAuth/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await organizationAuthApi.refreshSession();
            return response;
        } catch (error) {
            return rejectWithValue(error.error || error.message || 'Session refresh failed');
        }
    }
);

const initialState = {
    user: null,
    organization: organizationAuthApi.getStoredOrganization(),
    session: organizationAuthApi.getStoredSession(),
    isAuthenticated: organizationAuthApi.isAuthenticated(),
    loading: false,
    error: null,
    registrationStep: 1, // For multi-step registration
    registrationData: {}
};

const organizationAuthSlice = createSlice({
    name: 'organizationAuth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setRegistrationStep: (state, action) => {
            state.registrationStep = action.payload;
        },
        updateRegistrationData: (state, action) => {
            state.registrationData = { ...state.registrationData, ...action.payload };
        },
        clearRegistrationData: (state) => {
            state.registrationData = {};
            state.registrationStep = 1;
        },
        updateOrganizationProfile: (state, action) => {
            state.organization = action.payload;
            organizationAuthApi.updateStoredOrganization(action.payload);
        },
        initializeAuth: (state) => {
            // Initialize auth state from localStorage
            state.organization = organizationAuthApi.getStoredOrganization();
            state.session = organizationAuthApi.getStoredSession();
            state.isAuthenticated = organizationAuthApi.isAuthenticated();
        }
    },
    extraReducers: (builder) => {
        builder
            // Register Organization
            .addCase(registerOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.session = action.payload.session;
                state.isAuthenticated = true;
                state.error = null;
                // Clear registration data after successful registration
                state.registrationData = {};
                state.registrationStep = 1;
            })
            .addCase(registerOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // Login Organization
            .addCase(loginOrganization.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.session = action.payload.session;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            // Logout Organization
            .addCase(logoutOrganization.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutOrganization.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.organization = null;
                state.session = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutOrganization.rejected, (state, action) => {
                state.loading = false;
                // Even if logout fails, clear the state
                state.user = null;
                state.organization = null;
                state.session = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })

            // Get Current Organization
            .addCase(getCurrentOrganization.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentOrganization.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.organization = action.payload.organization;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(getCurrentOrganization.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // If getting current organization fails, user might not be authenticated
                state.user = null;
                state.organization = null;
                state.session = null;
                state.isAuthenticated = false;
            })

            // Refresh Session
            .addCase(refreshSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(refreshSession.fulfilled, (state, action) => {
                state.loading = false;
                state.session = action.payload.session;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(refreshSession.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                // If refresh fails, clear auth state
                state.user = null;
                state.organization = null;
                state.session = null;
                state.isAuthenticated = false;
            });
    }
});

export const {
    clearError,
    setRegistrationStep,
    updateRegistrationData,
    clearRegistrationData,
    updateOrganizationProfile,
    initializeAuth
} = organizationAuthSlice.actions;

export default organizationAuthSlice.reducer;

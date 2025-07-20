import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { verificationApi } from '../../services/verificationApi';

// Async thunks
export const fetchVerificationRequests = createAsyncThunk(
    'verification/fetchRequests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await verificationApi.getVerificationRequests();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch verification requests');
        }
    }
);

export const fetchVerificationRequest = createAsyncThunk(
    'verification/fetchRequest',
    async (id, { rejectWithValue }) => {
        try {
            const response = await verificationApi.getVerificationRequest(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch verification request');
        }
    }
);

export const approveRequest = createAsyncThunk(
    'verification/approveRequest',
    async ({ id, review_notes }, { rejectWithValue }) => {
        try {
            const response = await verificationApi.approveVerificationRequest(id, { review_notes });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to approve request');
        }
    }
);

export const rejectRequest = createAsyncThunk(
    'verification/rejectRequest',
    async ({ id, review_notes }, { rejectWithValue }) => {
        try {
            const response = await verificationApi.rejectVerificationRequest(id, { review_notes });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to reject request');
        }
    }
);

export const fetchVerificationStats = createAsyncThunk(
    'verification/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await verificationApi.getVerificationStats();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch verification stats');
        }
    }
);

export const submitVerificationRequest = createAsyncThunk(
    'verification/submitRequest',
    async ({ eventId, requestData }, { rejectWithValue }) => {
        try {
            const response = await verificationApi.submitVerificationRequest(eventId, requestData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to submit verification request');
        }
    }
);

export const fetchUserVerificationStatus = createAsyncThunk(
    'verification/fetchUserStatus',
    async ({ eventId, userId }, { rejectWithValue }) => {
        try {
            console.log('fetchUserVerificationStatus called with:', { eventId, userId });
            const response = await verificationApi.getUserVerificationStatus(eventId, userId);
            console.log('fetchUserVerificationStatus response:', response);
            return response.data;
        } catch (error) {
            console.log('fetchUserVerificationStatus error:', error);
            // If it's a 404 (no verification request found), return null instead of error
            if (error.response?.status === 404) {
                console.log('No verification request found (404), returning null');
                return null;
            }
            return rejectWithValue(error.response?.data || 'Failed to fetch verification status');
        }
    }
);

const initialState = {
    requests: [],
    currentRequest: null,
    userVerificationStatus: null,
    stats: {
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0
    },
    loading: false,
    error: null,
    filters: {
        status: 'all',
        eventType: 'all',
        dateRange: 'all'
    },
    pagination: {
        page: 1,
        limit: 10,
        total: 0
    }
};

const verificationSlice = createSlice({
    name: 'verification',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setCurrentRequest: (state, action) => {
            state.currentRequest = action.payload;
        },
        clearCurrentRequest: (state) => {
            state.currentRequest = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch verification requests
            .addCase(fetchVerificationRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVerificationRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.requests = action.payload.data || action.payload;
                state.pagination.total = state.requests.length;
            })
            .addCase(fetchVerificationRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single verification request
            .addCase(fetchVerificationRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVerificationRequest.fulfilled, (state, action) => {
                state.loading = false;
                state.currentRequest = action.payload;
            })
            .addCase(fetchVerificationRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Approve request
            .addCase(approveRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveRequest.fulfilled, (state, action) => {
                state.loading = false;
                const updatedRequest = action.payload;
                state.requests = state.requests.map(req =>
                    req.id === updatedRequest.id ? updatedRequest : req
                );
                if (state.currentRequest && state.currentRequest.id === updatedRequest.id) {
                    state.currentRequest = updatedRequest;
                }
            })
            .addCase(approveRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Reject request
            .addCase(rejectRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectRequest.fulfilled, (state, action) => {
                state.loading = false;
                const updatedRequest = action.payload;
                state.requests = state.requests.map(req =>
                    req.id === updatedRequest.id ? updatedRequest : req
                );
                if (state.currentRequest && state.currentRequest.id === updatedRequest.id) {
                    state.currentRequest = updatedRequest;
                }
            })
            .addCase(rejectRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch verification stats
            .addCase(fetchVerificationStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            })

            // Submit verification request
            .addCase(submitVerificationRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitVerificationRequest.fulfilled, (state, action) => {
                state.loading = false;
                // Optionally add to requests if this is the school view
            })
            .addCase(submitVerificationRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch user verification status
            .addCase(fetchUserVerificationStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserVerificationStatus.fulfilled, (state, action) => {
                state.loading = false;
                state.userVerificationStatus = action.payload;
            })
            .addCase(fetchUserVerificationStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.userVerificationStatus = null;
            });
    }
});

export const {
    clearError,
    setFilters,
    setPagination,
    setCurrentRequest,
    clearCurrentRequest
} = verificationSlice.actions;

export default verificationSlice.reducer;

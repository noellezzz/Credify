import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import organizationApi from '../../services/organizationApi';

// Async thunks for organization management
export const fetchOrganizationProfile = createAsyncThunk(
    'organization/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            return await organizationApi.getOrganizationProfile();
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

export const updateOrganizationProfile = createAsyncThunk(
    'organization/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            return await organizationApi.updateOrganizationProfile(profileData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const submitVerificationRequest = createAsyncThunk(
    'organization/submitVerification',
    async (verificationData, { rejectWithValue }) => {
        try {
            return await organizationApi.submitVerificationRequest(verificationData);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit verification');
        }
    }
);

export const fetchOrganizationEvents = createAsyncThunk(
    'organization/fetchEvents',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            return await organizationApi.getOrganizationEvents();
        } catch (error) {
            console.log('fetchOrganizationEvents error:', error);

            // Handle 401 errors immediately - logout user
            if (error.response?.status === 401 ||
                error.message?.includes('401') ||
                error.message?.includes('Unauthorized') ||
                error.message?.includes('Invalid or expired token')) {

                console.log('401 error detected in fetchOrganizationEvents, dispatching logout');
                // Import and dispatch logout immediately
                const { logoutOrganization } = await import('../organizationAuth/organizationAuthSlice');
                dispatch(logoutOrganization());

                return rejectWithValue('401|Unauthorized - Session expired');
            }

            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch events');
        }
    }
);

export const createOrganizationEvent = createAsyncThunk(
    'organization/createEvent',
    async (eventData, { rejectWithValue, dispatch }) => {
        try {
            const result = await organizationApi.createOrganizationEvent(eventData);
            dispatch(fetchOrganizationEvents()); // Refresh events list
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create event');
        }
    }
);

export const updateOrganizationEvent = createAsyncThunk(
    'organization/updateEvent',
    async ({ id, eventData }, { rejectWithValue, dispatch }) => {
        try {
            const result = await organizationApi.updateOrganizationEvent(id, eventData);
            dispatch(fetchOrganizationEvents()); // Refresh events list
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update event');
        }
    }
);

export const deleteOrganizationEvent = createAsyncThunk(
    'organization/deleteEvent',
    async (eventId, { rejectWithValue, dispatch }) => {
        try {
            await organizationApi.deleteOrganizationEvent(eventId);
            dispatch(fetchOrganizationEvents()); // Refresh events list
            return eventId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
        }
    }
);

export const publishOrganizationEvent = createAsyncThunk(
    'organization/publishEvent',
    async (eventId, { rejectWithValue, dispatch }) => {
        try {
            const result = await organizationApi.publishOrganizationEvent(eventId);
            dispatch(fetchOrganizationEvents()); // Refresh events list
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to publish event');
        }
    }
);

export const fetchVerificationRequests = createAsyncThunk(
    'organization/fetchVerificationRequests',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const result = await organizationApi.getVerificationRequests();
            return result;
        } catch (error) {
            // Handle 401 errors immediately - logout user
            if (error.response?.status === 401 ||
                error.message?.includes('401') ||
                error.message?.includes('Unauthorized') ||
                error.message?.includes('Invalid or expired token')) {

                // Import and dispatch logout immediately
                const { logoutOrganization } = await import('../organizationAuth/organizationAuthSlice');
                dispatch(logoutOrganization());

                return rejectWithValue('401|Unauthorized - Session expired');
            }

            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch verification requests');
        }
    }
);

export const approveVerificationRequest = createAsyncThunk(
    'organization/approveVerificationRequest',
    async ({ requestId, notes }, { rejectWithValue, dispatch }) => {
        try {
            const result = await organizationApi.approveVerificationRequest(requestId, notes);
            dispatch(fetchVerificationRequests()); // Refresh requests list
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to approve request');
        }
    }
);

export const rejectVerificationRequest = createAsyncThunk(
    'organization/rejectVerificationRequest',
    async ({ requestId, notes }, { rejectWithValue, dispatch }) => {
        try {
            const result = await organizationApi.rejectVerificationRequest(requestId, notes);
            dispatch(fetchVerificationRequests()); // Refresh requests list
            return result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reject request');
        }
    }
);

const initialState = {
    profile: null,
    events: [],
    verificationRequests: [],
    verificationStats: null,
    isModalOpen: false,
    modalType: null, // 'create', 'edit', 'view'
    currentEvent: null,
    loading: false,
    error: null,
};

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        openModal: (state, action) => {
            state.isModalOpen = true;
            state.modalType = action.payload;
        },
        closeModal: (state) => {
            state.isModalOpen = false;
            state.modalType = null;
            state.currentEvent = null;
        },
        setCurrentEvent: (state, action) => {
            state.currentEvent = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch profile
            .addCase(fetchOrganizationProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizationProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchOrganizationProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update profile
            .addCase(updateOrganizationProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrganizationProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateOrganizationProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Submit verification
            .addCase(submitVerificationRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitVerificationRequest.fulfilled, (state, action) => {
                state.loading = false;
                if (state.profile) {
                    state.profile.verification_status = 'pending';
                }
            })
            .addCase(submitVerificationRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch events
            .addCase(fetchOrganizationEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrganizationEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchOrganizationEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create event
            .addCase(createOrganizationEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrganizationEvent.fulfilled, (state) => {
                state.loading = false;
                state.isModalOpen = false;
                state.modalType = null;
                state.currentEvent = null;
            })
            .addCase(createOrganizationEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update event
            .addCase(updateOrganizationEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrganizationEvent.fulfilled, (state) => {
                state.loading = false;
                state.isModalOpen = false;
                state.modalType = null;
                state.currentEvent = null;
            })
            .addCase(updateOrganizationEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete event
            .addCase(deleteOrganizationEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOrganizationEvent.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteOrganizationEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Publish event
            .addCase(publishOrganizationEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(publishOrganizationEvent.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(publishOrganizationEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch verification requests
            .addCase(fetchVerificationRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchVerificationRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.verificationRequests = action.payload;
            })
            .addCase(fetchVerificationRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Approve verification request
            .addCase(approveVerificationRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveVerificationRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(approveVerificationRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Reject verification request
            .addCase(rejectVerificationRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectVerificationRequest.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(rejectVerificationRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, openModal, closeModal, setCurrentEvent } = organizationSlice.actions;
export default organizationSlice.reducer;

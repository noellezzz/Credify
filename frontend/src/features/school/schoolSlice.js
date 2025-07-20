import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Async thunks
export const fetchSchoolProfile = createAsyncThunk(
    'school/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/schools/profile');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch profile');
        }
    }
);

export const updateSchoolProfile = createAsyncThunk(
    'school/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const response = await axios.put('/schools/profile', profileData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update profile');
        }
    }
);

export const fetchSchoolEvents = createAsyncThunk(
    'school/fetchEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/schools/events');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch events');
        }
    }
);

export const createSchoolEvent = createAsyncThunk(
    'school/createEvent',
    async (eventData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/schools/events', eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create event');
        }
    }
);

export const updateSchoolEvent = createAsyncThunk(
    'school/updateEvent',
    async ({ id, eventData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/schools/events/${id}`, eventData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update event');
        }
    }
);

export const deleteSchoolEvent = createAsyncThunk(
    'school/deleteEvent',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/schools/events/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete event');
        }
    }
);

export const publishSchoolEvent = createAsyncThunk(
    'school/publishEvent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.post(`/schools/events/${id}/publish`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to publish event');
        }
    }
);

const initialState = {
    profile: null,
    events: [],
    loading: false,
    error: null,
    currentEvent: null,
    isModalOpen: false,
    modalType: null, // 'create', 'edit', 'view'
};

const schoolSlice = createSlice({
    name: 'school',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCurrentEvent: (state, action) => {
            state.currentEvent = action.payload;
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
    },
    extraReducers: (builder) => {
        // Profile actions
        builder
            .addCase(fetchSchoolProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchoolProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchSchoolProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSchoolProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSchoolProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(updateSchoolProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Events actions
            .addCase(fetchSchoolEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSchoolEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload;
            })
            .addCase(fetchSchoolEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createSchoolEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSchoolEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events.push(action.payload);
                state.isModalOpen = false;
                state.modalType = null;
            })
            .addCase(createSchoolEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSchoolEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSchoolEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(event => event.id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
                state.isModalOpen = false;
                state.modalType = null;
                state.currentEvent = null;
            })
            .addCase(updateSchoolEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteSchoolEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSchoolEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.events = state.events.filter(event => event.id !== action.payload);
            })
            .addCase(deleteSchoolEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(publishSchoolEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(publishSchoolEvent.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.events.findIndex(event => event.id === action.payload.id);
                if (index !== -1) {
                    state.events[index] = action.payload;
                }
            })
            .addCase(publishSchoolEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, setCurrentEvent, openModal, closeModal } = schoolSlice.actions;
export default schoolSlice.reducer; 
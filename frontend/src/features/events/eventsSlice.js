import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import eventsApi from '../../services/eventsApi';

// Async thunks
export const fetchPublicEvents = createAsyncThunk(
    'events/fetchPublicEvents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await eventsApi.getPublicEvents();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch public events');
        }
    }
);

export const fetchPublicEvent = createAsyncThunk(
    'events/fetchPublicEvent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await eventsApi.getPublicEvent(id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch event details');
        }
    }
);

const initialState = {
    publicEvents: [],
    currentEvent: null,
    loading: false,
    error: null,
    filters: {
        eventType: 'all',
        location: 'all',
        dateRange: 'all',
        search: ''
    },
    pagination: {
        page: 1,
        limit: 12,
        total: 0
    }
};

const eventsSlice = createSlice({
    name: 'events',
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
        setCurrentEvent: (state, action) => {
            state.currentEvent = action.payload;
        },
        clearCurrentEvent: (state) => {
            state.currentEvent = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch public events
            .addCase(fetchPublicEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.publicEvents = action.payload.data || action.payload;
                state.pagination.total = state.publicEvents.length;
            })
            .addCase(fetchPublicEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single public event
            .addCase(fetchPublicEvent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPublicEvent.fulfilled, (state, action) => {
                state.loading = false;
                state.currentEvent = action.payload;
            })
            .addCase(fetchPublicEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearError,
    setFilters,
    setPagination,
    setCurrentEvent,
    clearCurrentEvent
} = eventsSlice.actions;

export default eventsSlice.reducer;

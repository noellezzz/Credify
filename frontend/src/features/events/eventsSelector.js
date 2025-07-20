import { createSelector } from '@reduxjs/toolkit';

const selectEventsState = (state) => state.events;

export const selectPublicEvents = createSelector(
    [selectEventsState],
    (events) => events.publicEvents || []
);

export const selectCurrentEvent = createSelector(
    [selectEventsState],
    (events) => events.currentEvent
);

export const selectEventsLoading = createSelector(
    [selectEventsState],
    (events) => events.loading
);

export const selectEventsError = createSelector(
    [selectEventsState],
    (events) => events.error
);

export const selectEventsFilters = createSelector(
    [selectEventsState],
    (events) => events.filters
);

export const selectEventsPagination = createSelector(
    [selectEventsState],
    (events) => events.pagination
);

// Filtered and paginated events
export const selectFilteredPublicEvents = createSelector(
    [selectPublicEvents, selectEventsFilters],
    (events, filters) => {
        let filtered = events;

        if (filters.eventType !== 'all') {
            filtered = filtered.filter(event => event.event_type === filters.eventType);
        }

        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(event =>
                event.title.toLowerCase().includes(searchTerm) ||
                event.description?.toLowerCase().includes(searchTerm) ||
                event.schools?.name.toLowerCase().includes(searchTerm)
            );
        }

        if (filters.dateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (filters.dateRange) {
                case 'upcoming':
                    filtered = filtered.filter(event =>
                        new Date(event.event_date) >= now
                    );
                    break;
                case 'this_month':
                    filterDate.setMonth(now.getMonth() + 1);
                    filtered = filtered.filter(event => {
                        const eventDate = new Date(event.event_date);
                        return eventDate >= now && eventDate <= filterDate;
                    });
                    break;
                case 'this_year':
                    filterDate.setFullYear(now.getFullYear() + 1);
                    filtered = filtered.filter(event => {
                        const eventDate = new Date(event.event_date);
                        return eventDate >= now && eventDate <= filterDate;
                    });
                    break;
            }
        }

        return filtered;
    }
);

export const selectPaginatedPublicEvents = createSelector(
    [selectFilteredPublicEvents, selectEventsPagination],
    (events, pagination) => {
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        return events.slice(startIndex, endIndex);
    }
);

// Event type statistics
export const selectEventTypeStats = createSelector(
    [selectPublicEvents],
    (events) => {
        const stats = {
            graduation: 0,
            certification: 0,
            award: 0,
            workshop: 0
        };

        events.forEach(event => {
            if (stats.hasOwnProperty(event.event_type)) {
                stats[event.event_type]++;
            }
        });

        return stats;
    }
);

// Upcoming events
export const selectUpcomingEvents = createSelector(
    [selectPublicEvents],
    (events) => {
        const now = new Date();
        return events
            .filter(event => new Date(event.event_date) >= now)
            .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
            .slice(0, 5);
    }
);

// Events requiring verification
export const selectVerificationEvents = createSelector(
    [selectPublicEvents],
    (events) => events.filter(event => event.requires_verification)
);

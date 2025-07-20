import { createSelector } from '@reduxjs/toolkit';

const selectVerificationState = (state) => state.verification;

export const selectVerificationRequests = createSelector(
    [selectVerificationState],
    (verification) => verification.requests
);

export const selectCurrentVerificationRequest = createSelector(
    [selectVerificationState],
    (verification) => verification.currentRequest
);

export const selectVerificationLoading = createSelector(
    [selectVerificationState],
    (verification) => verification.loading
);

export const selectVerificationError = createSelector(
    [selectVerificationState],
    (verification) => verification.error
);

export const selectVerificationStats = createSelector(
    [selectVerificationState],
    (verification) => verification.stats
);

export const selectUserVerificationStatus = createSelector(
    [selectVerificationState],
    (verification) => verification.userVerificationStatus
);

export const selectVerificationFilters = createSelector(
    [selectVerificationState],
    (verification) => verification.filters
);

export const selectVerificationPagination = createSelector(
    [selectVerificationState],
    (verification) => verification.pagination
);

// Filtered and paginated requests
export const selectFilteredVerificationRequests = createSelector(
    [selectVerificationRequests, selectVerificationFilters],
    (requests, filters) => {
        let filtered = requests;

        if (filters.status !== 'all') {
            filtered = filtered.filter(request => request.status === filters.status);
        }

        if (filters.eventType !== 'all') {
            filtered = filtered.filter(request =>
                request.events?.event_type === filters.eventType
            );
        }

        // Add date range filtering if needed
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (filters.dateRange) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                default:
                    return filtered;
            }

            filtered = filtered.filter(request =>
                new Date(request.submitted_at) >= filterDate
            );
        }

        return filtered;
    }
);

export const selectPaginatedVerificationRequests = createSelector(
    [selectFilteredVerificationRequests, selectVerificationPagination],
    (requests, pagination) => {
        const startIndex = (pagination.page - 1) * pagination.limit;
        const endIndex = startIndex + pagination.limit;
        return requests.slice(startIndex, endIndex);
    }
);

// Statistics selectors
export const selectPendingRequestsCount = createSelector(
    [selectVerificationRequests],
    (requests) => requests.filter(request => request.status === 'pending').length
);

export const selectApprovedRequestsCount = createSelector(
    [selectVerificationRequests],
    (requests) => requests.filter(request => request.status === 'approved').length
);

export const selectRejectedRequestsCount = createSelector(
    [selectVerificationRequests],
    (requests) => requests.filter(request => request.status === 'rejected').length
);

export const selectRecentRequests = createSelector(
    [selectVerificationRequests],
    (requests) => {
        const sorted = [...requests].sort((a, b) =>
            new Date(b.submitted_at) - new Date(a.submitted_at)
        );
        return sorted.slice(0, 5);
    }
);

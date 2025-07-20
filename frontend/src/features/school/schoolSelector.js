import { createSelector } from '@reduxjs/toolkit';

// Base selectors
export const selectSchoolState = (state) => state.school;

export const selectSchoolProfile = createSelector(
    [selectSchoolState],
    (school) => school.profile
);

export const selectSchoolEvents = createSelector(
    [selectSchoolState],
    (school) => school.events
);

export const selectSchoolLoading = createSelector(
    [selectSchoolState],
    (school) => school.loading
);

export const selectSchoolError = createSelector(
    [selectSchoolState],
    (school) => school.error
);

export const selectCurrentEvent = createSelector(
    [selectSchoolState],
    (school) => school.currentEvent
);

export const selectIsModalOpen = createSelector(
    [selectSchoolState],
    (school) => school.isModalOpen
);

export const selectModalType = createSelector(
    [selectSchoolState],
    (school) => school.modalType
);

// Derived selectors
export const selectPublishedEvents = createSelector(
    [selectSchoolEvents],
    (events) => events.filter(event => event.status === 'published')
);

export const selectDraftEvents = createSelector(
    [selectSchoolEvents],
    (events) => events.filter(event => event.status === 'draft')
);

export const selectEventsByType = createSelector(
    [selectSchoolEvents, (_, eventType) => eventType],
    (events, eventType) => events.filter(event => event.event_type === eventType)
);

export const selectEventsRequiringVerification = createSelector(
    [selectSchoolEvents],
    (events) => events.filter(event => event.requires_verification)
);

export const selectSchoolStats = createSelector(
    [selectSchoolEvents],
    (events) => ({
        total: events.length,
        published: events.filter(e => e.status === 'published').length,
        draft: events.filter(e => e.status === 'draft').length,
        closed: events.filter(e => e.status === 'closed').length,
        withVerification: events.filter(e => e.requires_verification).length,
    })
); 
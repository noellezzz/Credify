// Organization profile selectors
export const selectOrganizationProfile = (state) => state?.organization?.profile || null;
export const selectOrganizationLoading = (state) => state?.organization?.loading || false;
export const selectOrganizationError = (state) => state?.organization?.error || null;

// Organization events selectors
export const selectOrganizationEvents = (state) => {
    const events = state?.organization?.events;
    return Array.isArray(events) ? events : [];
};
export const selectOrganizationEventsCount = (state) => {
    const events = state?.organization?.events;
    return Array.isArray(events) ? events.length : 0;
};

// Published events only
export const selectPublishedEvents = (state) => {
    const events = state?.organization?.events;
    return Array.isArray(events) ? events.filter(event => event?.status === 'published') : [];
};

// Draft events only
export const selectDraftEvents = (state) => {
    const events = state?.organization?.events;
    return Array.isArray(events) ? events.filter(event => event?.status === 'draft') : [];
};

// Events by type
export const selectEventsByType = (state, eventType) => {
    const events = state?.organization?.events;
    return Array.isArray(events) ? events.filter(event => event?.event_type === eventType) : [];
};

// Organization verification requests selectors
export const selectVerificationRequests = (state) => {
    const requests = state?.organization?.verificationRequests;
    return Array.isArray(requests) ? requests : [];
};
export const selectVerificationRequestsCount = (state) => {
    const requests = state?.organization?.verificationRequests;
    return Array.isArray(requests) ? requests.length : 0;
};

// Pending verification requests
export const selectPendingVerificationRequests = (state) => {
    const requests = state?.organization?.verificationRequests;
    return Array.isArray(requests) ? requests.filter(request => request?.status === 'pending') : [];
};

// Approved verification requests
export const selectApprovedVerificationRequests = (state) => {
    const requests = state?.organization?.verificationRequests;
    return Array.isArray(requests) ? requests.filter(request => request?.status === 'approved') : [];
};

// Rejected verification requests
export const selectRejectedVerificationRequests = (state) => {
    const requests = state?.organization?.verificationRequests;
    return Array.isArray(requests) ? requests.filter(request => request?.status === 'rejected') : [];
};

// Verification stats
export const selectVerificationStats = (state) => state?.organization?.verificationStats || null;

// Modal selectors
export const selectIsModalOpen = (state) => state?.organization?.isModalOpen || false;
export const selectModalType = (state) => state?.organization?.modalType || null;
export const selectCurrentEvent = (state) => state?.organization?.currentEvent || null;

// Organization status selectors
export const selectIsVerified = (state) =>
    state?.organization?.profile?.verification_status === 'verified';

export const selectVerificationStatus = (state) =>
    state?.organization?.profile?.verification_status || 'pending';

export const selectCanPublishEvents = (state) =>
    state?.organization?.profile?.verification_status === 'verified';

// Dashboard stats selectors
export const selectDashboardStats = (state) => {
    // Ensure state.organization exists and has the required properties
    const organizationState = state?.organization || {};
    const events = Array.isArray(organizationState.events) ? organizationState.events : [];
    const verificationRequests = Array.isArray(organizationState.verificationRequests) ? organizationState.verificationRequests : [];

    return {
        totalEvents: events.length || 0,
        publishedEvents: events.filter(event => event?.status === 'published').length || 0,
        draftEvents: events.filter(event => event?.status === 'draft').length || 0,
        totalVerificationRequests: verificationRequests.length || 0,
        pendingRequests: verificationRequests.filter(request => request?.status === 'pending').length || 0,
        approvedRequests: verificationRequests.filter(request => request?.status === 'approved').length || 0,
        rejectedRequests: verificationRequests.filter(request => request?.status === 'rejected').length || 0,
    };
};

// Recent activity selector
export const selectRecentActivity = (state) => {
    const organizationState = state?.organization || {};
    const events = Array.isArray(organizationState.events) ? organizationState.events : [];
    const verificationRequests = Array.isArray(organizationState.verificationRequests) ? organizationState.verificationRequests : [];

    const recentEvents = events
        .filter(event => {
            if (!event?.created_at) return false;
            const createdAt = new Date(event.created_at);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return createdAt > sevenDaysAgo;
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    const recentRequests = verificationRequests
        .filter(request => {
            if (!request?.submitted_at) return false;
            const submittedAt = new Date(request.submitted_at);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return submittedAt > sevenDaysAgo;
        })
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))
        .slice(0, 5);

    return {
        recentEvents: recentEvents || [],
        recentRequests: recentRequests || [],
    };
};

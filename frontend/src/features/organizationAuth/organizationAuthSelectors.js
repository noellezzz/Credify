// Organization Auth Selectors
export const selectOrganizationAuth = (state) => state.organizationAuth || {};

export const selectCurrentOrganization = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return orgAuth.organization || null;
};

export const selectAuthUser = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return orgAuth.user || null;
};

export const selectAuthSession = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return orgAuth.session || null;
};

export const selectIsAuthenticated = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return Boolean(orgAuth.isAuthenticated);
};

export const selectAuthLoading = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return Boolean(orgAuth.loading);
};

export const selectAuthError = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return orgAuth.error || null;
};

export const selectRegistrationStep = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return orgAuth.registrationStep || 1;
};

export const selectRegistrationData = (state) => {
    const orgAuth = selectOrganizationAuth(state);
    return orgAuth.registrationData || {};
};

export const selectOrganizationName = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.name || '';
};

export const selectOrganizationEmail = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.email || '';
};

export const selectOrganizationType = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.type || '';
};

export const selectOrganizationVerificationStatus = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.verification_status || 'pending';
};

export const selectIsOrganizationVerified = (state) => {
    const verificationStatus = selectOrganizationVerificationStatus(state);
    return verificationStatus === 'verified';
};

export const selectOrganizationId = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.id || null;
};

export const selectOrganizationLogo = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.logo_url || null;
};

export const selectOrganizationWebsite = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.website || null;
};

export const selectOrganizationDescription = (state) => {
    const organization = selectCurrentOrganization(state);
    return organization?.description || '';
};

export const selectOrganizationAddress = (state) => {
    const organization = selectCurrentOrganization(state);
    return {
        street: organization?.address || '',
        city: organization?.city || '',
        state: organization?.state || '',
        country: organization?.country || '',
        postal_code: organization?.postal_code || ''
    };
};

export const selectOrganizationContactInfo = (state) => {
    const organization = selectCurrentOrganization(state);
    return {
        email: organization?.email || '',
        phone: organization?.phone || '',
        website: organization?.website || ''
    };
};

export const selectCanIssue = (state) => {
    const isAuthenticated = selectIsAuthenticated(state);
    const isVerified = selectIsOrganizationVerified(state);
    return isAuthenticated && isVerified;
};

export const selectAuthToken = (state) => {
    const session = selectAuthSession(state);
    return session?.access_token || null;
};

export const selectSessionExpiry = (state) => {
    const session = selectAuthSession(state);
    return session?.expires_at || null;
};

export const selectIsSessionExpired = (state) => {
    const expiryTime = selectSessionExpiry(state);
    if (!expiryTime) return true;

    const now = new Date().getTime();
    const expiry = new Date(expiryTime).getTime();
    return now >= expiry;
};

export const selectNeedsSessionRefresh = (state) => {
    const expiryTime = selectSessionExpiry(state);
    if (!expiryTime) return false;

    const now = new Date().getTime();
    const expiry = new Date(expiryTime).getTime();
    const fiveMinutesFromNow = now + (5 * 60 * 1000); // 5 minutes buffer

    return fiveMinutesFromNow >= expiry;
};

export const selectUserRole = (state) => {
    const user = selectAuthUser(state);
    return user?.role || 'organization';
};

export const selectUserMetadata = (state) => {
    const user = selectAuthUser(state);
    return user?.user_metadata || {};
};

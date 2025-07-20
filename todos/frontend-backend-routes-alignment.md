# Frontend-Backend Route Alignment for Organization System

## 1. Public Routes (User Browsing)

### Events Browsing
- **Frontend Route**: `/events`
- **Backend API**: `GET /api/events`
- **Frontend API Call**: `publicApi.getPublicEvents()`
- **Purpose**: Browse all published events from verified organizations

- **Frontend Route**: `/events/:id`
- **Backend API**: `GET /api/events/:id`
- **Frontend API Call**: `publicApi.getPublicEvent(eventId)`
- **Purpose**: View specific event details and submit verification requests

### Organizations Browsing
- **Frontend Route**: `/organizations`
- **Backend API**: `GET /api/organizations`
- **Frontend API Call**: `publicApi.getPublicOrganizations()`
- **Purpose**: Browse all verified organizations

- **Frontend Route**: `/organizations/:id`
- **Backend API**: `GET /api/organizations/:id`
- **Frontend API Call**: `publicApi.getPublicOrganization(organizationId)`
- **Purpose**: View specific organization profile and events

### Certificate Verification Request Submission
- **Frontend Action**: Submit verification request from event details page
- **Backend API**: `POST /api/verification-requests/events/:eventId/apply`
- **Frontend API Call**: `publicApi.submitVerificationRequest(eventId, data)`
- **Purpose**: Users submit certificate for verification by organization

## 2. Organization Dashboard Routes

### Authentication & Registration
- **Frontend Route**: `/register/as-organization`
- **Component**: `OrganizationRegister`
- **Purpose**: Organization registration form

- **Frontend Route**: `/organization/*`
- **Component**: `OrganizationDashboard`
- **Purpose**: Main organization dashboard with nested routes

### Organization Profile Management
- **Frontend Nested Route**: `/organization/profile`
- **Backend API**: `GET /api/organizations/profile/me`
- **Backend API**: `PUT /api/organizations/profile/me`
- **Frontend API Call**: `organizationApi.getOrganizationProfile()`
- **Frontend API Call**: `organizationApi.updateOrganizationProfile(data)`
- **Purpose**: Manage organization information and verification documents

### Organization Verification
- **Frontend Action**: Submit verification documents
- **Backend API**: `POST /api/organizations/verification/submit`
- **Frontend API Call**: `organizationApi.submitVerificationRequest(data)`
- **Purpose**: Submit documents for organization verification

- **Frontend Action**: Check verification status
- **Backend API**: `GET /api/organizations/verification/status`
- **Frontend API Call**: `organizationApi.getVerificationStatus()`
- **Purpose**: Get current verification status

### Events Management
- **Frontend Nested Route**: `/organization/feed` (events card view)
- **Frontend Nested Route**: `/organization/table` (events table view)
- **Backend API**: `GET /api/organizations/events/manage`
- **Frontend API Call**: `organizationApi.getOrganizationEvents()`
- **Purpose**: View organization's events in different formats

- **Frontend Action**: Create new event
- **Backend API**: `POST /api/organizations/events`
- **Frontend API Call**: `organizationApi.createOrganizationEvent(data)`
- **Purpose**: Create new events/courses

- **Frontend Action**: Update existing event
- **Backend API**: `PUT /api/organizations/events/:id`
- **Frontend API Call**: `organizationApi.updateOrganizationEvent(id, data)`
- **Purpose**: Edit event details

- **Frontend Action**: Delete event
- **Backend API**: `DELETE /api/organizations/events/:id`
- **Frontend API Call**: `organizationApi.deleteOrganizationEvent(id)`
- **Purpose**: Remove events

- **Frontend Action**: Publish event
- **Backend API**: `POST /api/organizations/events/:id/publish`
- **Frontend API Call**: `organizationApi.publishOrganizationEvent(id)`
- **Purpose**: Make events visible to public

### Verification Requests Management
- **Frontend Nested Route**: `/organization/verifications`
- **Backend API**: `GET /api/organizations/verification-requests`
- **Frontend API Call**: `organizationApi.getVerificationRequests()`
- **Purpose**: View all verification requests for organization's events

- **Frontend Action**: Get verification statistics
- **Backend API**: `GET /api/organizations/verification-requests/stats`
- **Frontend API Call**: `organizationApi.getVerificationRequestStats()`
- **Purpose**: Dashboard statistics

- **Frontend Action**: View specific request
- **Backend API**: `GET /api/organizations/verification-requests/:id`
- **Frontend API Call**: `organizationApi.getVerificationRequest(id)`
- **Purpose**: Review individual verification requests

- **Frontend Action**: Approve verification request
- **Backend API**: `PUT /api/organizations/verification-requests/:id/approve`
- **Frontend API Call**: `organizationApi.approveVerificationRequest(id, notes)`
- **Purpose**: Approve certificate verification

- **Frontend Action**: Reject verification request
- **Backend API**: `PUT /api/organizations/verification-requests/:id/reject`
- **Frontend API Call**: `organizationApi.rejectVerificationRequest(id, notes)`
- **Purpose**: Reject certificate verification

## 3. Admin Routes

### Organization Management
- **Frontend Route**: `/admin/organizations`
- **Component**: `OrganizationReview`
- **Purpose**: Admin panel for managing organization verifications

## 4. Alternative API Routes (Backend)

### Events API (Alternative Access)
- **Backend API**: `GET /api/events/organization/events` (alternative to organizations API)
- **Backend API**: `POST /api/events/organization/events`
- **Backend API**: `PUT /api/events/organization/events/:id`
- **Backend API**: `DELETE /api/events/organization/events/:id`
- **Backend API**: `POST /api/events/organization/events/:id/publish`
- **Purpose**: Alternative endpoints for organization event management

### Verification Requests API (Alternative Access)
- **Backend API**: `GET /api/verification-requests/organization` (alternative to organizations API)
- **Backend API**: `GET /api/verification-requests/organization/stats`
- **Backend API**: `GET /api/verification-requests/organization/:id`
- **Backend API**: `PUT /api/verification-requests/organization/:id/approve`
- **Backend API**: `PUT /api/verification-requests/organization/:id/reject`
- **Purpose**: Alternative endpoints for verification request management

## 5. Redux State Management

### Organization Slice
- **Location**: `frontend/src/features/organization/organizationSlice.js`
- **Selectors**: `frontend/src/features/organization/organizationSelector.js`
- **State**: Profile, events, verification requests, modal states, loading states

### API Services
- **Organization API**: `frontend/src/services/organizationApi.js`
- **Public API**: `frontend/src/services/publicApi.js`
- **Events API**: `frontend/src/services/eventsApi.js` (updated with organization endpoints)

## 6. Legacy Support

### School Routes (Maintained for Backward Compatibility)
- **Frontend Route**: `/school/*`
- **Frontend Route**: `/register/as-school`
- **Admin Route**: `/admin/schools`
- **Backend APIs**: All existing school endpoints remain unchanged

## Summary

The route alignment ensures:
1. **Consistent API endpoints** between frontend and backend
2. **RESTful API design** with proper HTTP methods
3. **Clear separation** between public, organization, and admin functionality
4. **Backward compatibility** with existing school system
5. **Scalable architecture** supporting multiple organization types
6. **Proper authentication boundaries** (public vs protected routes)

All routes are now properly aligned and ready for the organization-based certificate verification platform!

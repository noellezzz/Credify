# Credify Mobile App

A React Native Expo mobile application for certificate verification and organization management, aligned with the Credify frontend design system.

## Features

### For Users
- **Certificate Verification**: Submit and track certificate verification requests
- **Event Browsing**: Discover and register for events from verified organizations
- **Organization Discovery**: Browse verified organizations and their credentials
- **Profile Management**: Manage personal information and view verification history
- **Real-time Notifications**: Get updates on verification status and event registrations

### For Organizations
- **Event Management**: Create, edit, and manage events with verification capabilities
- **Verification Requests**: Review and approve/reject certificate verification requests
- **Dashboard Analytics**: View statistics and insights about events and verifications
- **Profile Management**: Manage organization information and verification status
- **Document Upload**: Upload verification documents and certificates

### For Administrators
- **User Management**: Manage user accounts and permissions
- **Organization Verification**: Review and approve organization verification requests
- **Certificate Management**: Oversee certificate verification processes
- **System Analytics**: Monitor platform usage and performance

## Tech Stack

- **React Native**: 0.79.5
- **Expo**: ~53.0.20
- **React Navigation**: 6.x
- **Redux Toolkit**: 2.8.2
- **React Native Paper**: 5.12.3
- **React Native Elements**: 3.4.3
- **Expo Vector Icons**: For consistent iconography
- **React Native Linear Gradient**: For gradient backgrounds
- **Redux Persist**: For state persistence

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── LoadingScreen.js
│   │   └── navigation/
│   │       └── CustomDrawerContent.js
│   ├── navigation/
│   │   └── AppNavigator.js
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── OrganizationRegisterScreen.js
│   │   ├── User/
│   │   │   ├── UserHomeScreen.js
│   │   │   ├── UserProfileScreen.js
│   │   │   ├── EventsScreen.js
│   │   │   ├── EventDetailsScreen.js
│   │   │   ├── OrganizationsScreen.js
│   │   │   ├── OrganizationDetailsScreen.js
│   │   │   ├── VerificationScreen.js
│   │   │   └── UserCertificatesScreen.js
│   │   ├── Organization/
│   │   │   ├── OrganizationDashboardScreen.js
│   │   │   ├── OrganizationProfileScreen.js
│   │   │   ├── OrganizationEventsScreen.js
│   │   │   ├── CreateEventScreen.js
│   │   │   ├── EditEventScreen.js
│   │   │   ├── VerificationRequestsScreen.js
│   │   │   └── RequestDetailsScreen.js
│   │   ├── Admin/
│   │   │   ├── AdminDashboardScreen.js
│   │   │   ├── UserManagementScreen.js
│   │   │   ├── CertificateManagementScreen.js
│   │   │   └── OrganizationManagementScreen.js
│   │   └── Welcome/
│   │       └── WelcomeScreen.js
│   ├── store/
│   │   ├── store.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── userSlice.js
│   │       ├── organizationSlice.js
│   │       ├── eventsSlice.js
│   │       └── verificationSlice.js
│   ├── theme/
│   │   └── theme.js
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── organizationService.js
│   │   ├── eventsService.js
│   │   └── verificationService.js
│   └── utils/
│       ├── constants.js
│       ├── helpers.js
│       └── validation.js
├── assets/
├── App.js
├── app.json
├── package.json
└── README.md
```

## Design System

The mobile app follows the same design system as the frontend:

### Colors
- **Primary**: #1e293b (Dark blue)
- **Secondary**: #f59e0b (Amber)
- **Background**: #ffffff (White)
- **Surface**: #f8fafc (Light gray)
- **Success**: #10b981 (Green)
- **Error**: #ef4444 (Red)
- **Warning**: #f59e0b (Amber)
- **Info**: #3b82f6 (Blue)

### Typography
- **Font Family**: Poppins (Regular, Medium, SemiBold, Bold)
- **Font Sizes**: 11px to 36px
- **Line Heights**: Optimized for readability

### Spacing
- **xs**: 4px
- **sm**: 8px
- **md**: 16px
- **lg**: 24px
- **xl**: 32px
- **xxl**: 48px
- **xxxl**: 64px

### Border Radius
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **full**: 9999px

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Credify/mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

### Environment Configuration

Create a `.env` file in the mobile directory:

```env
API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

## Navigation Structure

### Authentication Flow
- Welcome Screen
- Login Screen
- Register Screen (User)
- Organization Register Screen

### User Flow
- **Tab Navigation**:
  - Home (Dashboard)
  - Events (Browse events)
  - Organizations (Browse organizations)
  - Profile (User profile)

- **Stack Screens**:
  - Event Details
  - Organization Details
  - Verification
  - User Certificates

### Organization Flow
- **Drawer Navigation**:
  - Dashboard
  - Events
  - Verification Requests
  - Profile

- **Stack Screens**:
  - Create Event
  - Edit Event
  - Request Details

### Admin Flow
- **Drawer Navigation**:
  - Dashboard
  - User Management
  - Certificate Management
  - Organization Management

## State Management

The app uses Redux Toolkit for state management with the following slices:

- **authSlice**: Authentication state, tokens, user type
- **userSlice**: User profile, certificates, verification requests
- **organizationSlice**: Organization data, events, statistics
- **eventsSlice**: Public events, organizations, filters
- **verificationSlice**: Verification requests, certificates, status

## API Integration

The app integrates with the same backend API as the frontend:

- **Authentication**: Login, register, token management
- **Users**: Profile management, certificate upload
- **Organizations**: Registration, verification, event management
- **Events**: CRUD operations, public browsing
- **Verification**: Request submission, status tracking

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React Native best practices
- Use TypeScript for type safety (future enhancement)
- Implement proper error handling
- Add loading states for better UX

### Component Structure
- Keep components small and focused
- Use composition over inheritance
- Implement proper prop validation
- Add accessibility features

### Performance
- Use React.memo for expensive components
- Implement proper list virtualization
- Optimize images and assets
- Use lazy loading where appropriate

## Testing

### Unit Testing
- Use Jest for unit tests
- Test Redux slices and actions
- Test utility functions
- Mock API calls

### Integration Testing
- Test navigation flows
- Test form submissions
- Test API integration
- Test error scenarios

### E2E Testing
- Use Detox for E2E tests
- Test critical user journeys
- Test cross-platform compatibility

## Deployment

### Expo Build
```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### App Store Deployment
1. Configure app.json with proper metadata
2. Build production version
3. Submit to App Store Connect
4. Submit to Google Play Console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository. 
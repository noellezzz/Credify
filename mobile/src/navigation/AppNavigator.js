import React from 'react';
import { useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import OrganizationRegisterScreen from '../screens/Auth/OrganizationRegisterScreen';

// User screens
import UserHomeScreen from '../screens/User/UserHomeScreen';
import UserProfileScreen from '../screens/User/UserProfileScreen';
import EventsScreen from '../screens/User/EventsScreen';
import EventDetailsScreen from '../screens/User/EventDetailsScreen';
import OrganizationsScreen from '../screens/User/OrganizationsScreen';
import OrganizationDetailsScreen from '../screens/User/OrganizationDetailsScreen';
import VerificationScreen from '../screens/User/VerificationScreen';
import UserCertificatesScreen from '../screens/User/UserCertificatesScreen';

// Organization screens
import OrganizationDashboardScreen from '../screens/Organization/OrganizationDashboardScreen';
import OrganizationProfileScreen from '../screens/Organization/OrganizationProfileScreen';
import OrganizationEventsScreen from '../screens/Organization/OrganizationEventsScreen';
import CreateEventScreen from '../screens/Organization/CreateEventScreen';
import EditEventScreen from '../screens/Organization/EditEventScreen';
import VerificationRequestsScreen from '../screens/Organization/VerificationRequestsScreen';
import RequestDetailsScreen from '../screens/Organization/RequestDetailsScreen';

// Admin screens
import AdminDashboardScreen from '../screens/Admin/AdminDashboardScreen';
import UserManagementScreen from '../screens/Admin/UserManagementScreen';
import CertificateManagementScreen from '../screens/Admin/CertificateManagementScreen';
import OrganizationManagementScreen from '../screens/Admin/OrganizationManagementScreen';

// Components
import CustomDrawerContent from '../components/navigation/CustomDrawerContent';
import LoadingScreen from '../components/common/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// User Tab Navigator
const UserTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Events') {
                    iconName = focused ? 'calendar' : 'calendar-outline';
                } else if (route.name === 'Organizations') {
                    iconName = focused ? 'business' : 'business-outline';
                } else if (route.name === 'Profile') {
                    iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#f59e0b',
            tabBarInactiveTintColor: '#64748b',
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopColor: '#e2e8f0',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
            },
            headerShown: false,
        })}
    >
        <Tab.Screen name="Home" component={UserHomeScreen} />
        <Tab.Screen name="Events" component={EventsScreen} />
        <Tab.Screen name="Organizations" component={OrganizationsScreen} />
        <Tab.Screen name="Profile" component={UserProfileScreen} />
    </Tab.Navigator>
);

// Organization Drawer Navigator
const OrganizationDrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            headerStyle: {
                backgroundColor: '#1e293b',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
                fontWeight: '600',
            },
            drawerStyle: {
                backgroundColor: '#ffffff',
                width: 280,
            },
            drawerActiveTintColor: '#f59e0b',
            drawerInactiveTintColor: '#64748b',
        }}
    >
        <Drawer.Screen
            name="Dashboard"
            component={OrganizationDashboardScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="grid-outline" size={size} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="Events"
            component={OrganizationEventsScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="calendar-outline" size={size} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="VerificationRequests"
            component={VerificationRequestsScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="checkmark-circle-outline" size={size} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="Profile"
            component={OrganizationProfileScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="person-outline" size={size} color={color} />
                ),
            }}
        />
    </Drawer.Navigator>
);

// Admin Drawer Navigator
const AdminDrawerNavigator = () => (
    <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
            headerStyle: {
                backgroundColor: '#1e293b',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
                fontWeight: '600',
            },
            drawerStyle: {
                backgroundColor: '#ffffff',
                width: 280,
            },
            drawerActiveTintColor: '#f59e0b',
            drawerInactiveTintColor: '#64748b',
        }}
    >
        <Drawer.Screen
            name="Dashboard"
            component={AdminDashboardScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="grid-outline" size={size} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="UserManagement"
            component={UserManagementScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="people-outline" size={size} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="CertificateManagement"
            component={CertificateManagementScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="document-outline" size={size} color={color} />
                ),
            }}
        />
        <Drawer.Screen
            name="OrganizationManagement"
            component={OrganizationManagementScreen}
            options={{
                drawerIcon: ({ color, size }) => (
                    <Ionicons name="business-outline" size={size} color={color} />
                ),
            }}
        />
    </Drawer.Navigator>
);

const AppNavigator = () => {
    const { isAuthenticated, userType, isLoading } = useSelector((state) => state.auth);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            {!isAuthenticated ? (
                // Auth Stack
                <>
                    <Stack.Screen name="Welcome" component={WelcomeScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="OrganizationRegister" component={OrganizationRegisterScreen} />
                </>
            ) : (
                // Main App Stack based on user type
                <>
                    {userType === 'user' && (
                        <>
                            <Stack.Screen name="UserMain" component={UserTabNavigator} />
                            <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
                            <Stack.Screen name="OrganizationDetails" component={OrganizationDetailsScreen} />
                            <Stack.Screen name="Verification" component={VerificationScreen} />
                            <Stack.Screen name="UserCertificates" component={UserCertificatesScreen} />
                        </>
                    )}

                    {userType === 'organization' && (
                        <>
                            <Stack.Screen name="OrganizationMain" component={OrganizationDrawerNavigator} />
                            <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
                            <Stack.Screen name="EditEvent" component={EditEventScreen} />
                            <Stack.Screen name="RequestDetails" component={RequestDetailsScreen} />
                        </>
                    )}

                    {userType === 'admin' && (
                        <Stack.Screen name="AdminMain" component={AdminDrawerNavigator} />
                    )}
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator; 
import { createClient } from '@supabase/supabase-js';
import axios from '../utils/axios';

// Initialize Supabase client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Organization Authentication API
export const organizationAuthApi = {
    // Register new organization
    register: async (organizationData) => {
        try {
            const response = await axios.post('/auth/organizations/register', organizationData);

            // Store session in localStorage if successful
            if (response.data.session) {
                localStorage.setItem('supabase.auth.token', JSON.stringify(response.data.session));
                localStorage.setItem('organization.profile', JSON.stringify(response.data.organization));
                localStorage.setItem('user.type', 'organization');
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Login organization
    login: async (email, password) => {
        try {
            const response = await axios.post('/auth/organizations/login', {
                email,
                password
            });

            // Store session in localStorage if successful
            if (response.data.session) {
                localStorage.setItem('supabase.auth.token', JSON.stringify(response.data.session));
                localStorage.setItem('organization.profile', JSON.stringify(response.data.organization));
                localStorage.setItem('user.type', 'organization');
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Logout organization
    logout: async () => {
        try {
            await axios.post('/auth/organizations/logout');

            // Clear localStorage
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('organization.profile');
            localStorage.removeItem('user.type');

            // Also sign out from Supabase client
            await supabase.auth.signOut();

            return { message: 'Logout successful' };
        } catch (error) {
            // Even if the API call fails, clear local storage
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('organization.profile');
            localStorage.removeItem('user.type');
            await supabase.auth.signOut();

            throw error.response?.data || error;
        }
    },

    // Get current organization profile
    getCurrentOrganization: async () => {
        try {
            const response = await axios.get('/auth/organizations/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Refresh session
    refreshSession: async () => {
        try {
            const storedSession = localStorage.getItem('supabase.auth.token');
            if (!storedSession) {
                throw new Error('No session found');
            }

            const session = JSON.parse(storedSession);
            const response = await axios.post('/auth/organizations/refresh', {
                refresh_token: session.refresh_token
            });

            // Update stored session
            localStorage.setItem('supabase.auth.token', JSON.stringify(response.data.session));

            return response.data;
        } catch (error) {
            // If refresh fails, clear stored data
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('organization.profile');
            localStorage.removeItem('user.type');

            throw error.response?.data || error;
        }
    },

    // Check if user is authenticated as organization
    isAuthenticated: () => {
        const session = localStorage.getItem('supabase.auth.token');
        const userType = localStorage.getItem('user.type');
        return !!(session && userType === 'organization');
    },

    // Get stored organization profile
    getStoredOrganization: () => {
        try {
            const stored = localStorage.getItem('organization.profile');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    },

    // Get stored session
    getStoredSession: () => {
        try {
            const stored = localStorage.getItem('supabase.auth.token');
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    },

    // Update stored organization profile
    updateStoredOrganization: (organization) => {
        localStorage.setItem('organization.profile', JSON.stringify(organization));
    }
};

export default organizationAuthApi;

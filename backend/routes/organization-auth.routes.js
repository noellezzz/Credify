import express from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Organization Registration
router.post('/register', async (req, res) => {
    try {
        const {
            email,
            password,
            name,
            organization_type,
            phone,
            address,
            city,
            state,
            country,
            postal_code,
            website,
            description
        } = req.body;

        // Combine address fields into a single address string
        const fullAddress = [address, city, state, country, postal_code]
            .filter(Boolean)
            .join(', ');

        // Debug: Log the organization type value
        console.log('Received organization_type:', organization_type);
        console.log('Type of organization_type:', typeof organization_type);

        // Validate required fields
        if (!email || !password || !name || !organization_type) {
            return res.status(400).json({
                error: 'Email, password, name, and organization type are required'
            });
        }

        // Validate organization type against allowed values
        const allowedTypes = ['university', 'college', 'training_center', 'certification_body', 'corporate', 'government', 'nonprofit'];
        if (!allowedTypes.includes(organization_type)) {
            return res.status(400).json({
                error: `Invalid organization type. Must be one of: ${allowedTypes.join(', ')}`
            });
        }

        // Create auth user in Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    user_type: 'organization',
                    organization_name: name
                }
            }
        });

        if (authError) {
            return res.status(400).json({
                error: authError.message
            });
        }

        // Create organization record
        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert([
                {
                    id: authData.user.id, // Use auth user ID as organization ID
                    name,
                    email,
                    phone: phone || null,
                    address: fullAddress || null,
                    website: website || null,
                    organization_type,
                    description: description || null,
                    verification_status: 'verified', // Auto-verify due to email verification
                    verified_at: new Date().toISOString() // Set verification date
                }
            ])
            .select()
            .single();

        if (orgError) {
            // If organization creation fails, we should clean up the auth user
            await supabase.auth.admin.deleteUser(authData.user.id);
            return res.status(400).json({
                error: 'Failed to create organization profile: ' + orgError.message
            });
        }

        res.status(201).json({
            message: 'Organization registered successfully',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                user_type: 'organization'
            },
            organization: orgData,
            session: authData.session
        });

    } catch (error) {
        console.error('Organization registration error:', error);
        res.status(500).json({
            error: 'Internal server error during registration'
        });
    }
});

// Organization Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Authenticate with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return res.status(401).json({
                error: authError.message
            });
        }

        // Get organization profile
        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (orgError || !orgData) {
            return res.status(404).json({
                error: 'Organization profile not found'
            });
        }

        // Auto-verify organization if still pending and email is verified
        let finalOrgData = orgData;
        if (orgData.verification_status === 'pending' && authData.user.email_confirmed_at) {
            const { data: updatedOrgData, error: updateError } = await supabase
                .from('organizations')
                .update({
                    verification_status: 'verified',
                    verified_at: new Date().toISOString()
                })
                .eq('id', authData.user.id)
                .select()
                .single();

            if (!updateError && updatedOrgData) {
                finalOrgData = updatedOrgData;
            }
        }

        // Check if user metadata indicates this is an organization account
        const userType = authData.user.user_metadata?.user_type;
        if (userType !== 'organization') {
            return res.status(403).json({
                error: 'This account is not registered as an organization'
            });
        }

        res.json({
            message: 'Login successful',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                user_type: 'organization'
            },
            organization: finalOrgData,
            session: authData.session
        });

    } catch (error) {
        console.error('Organization login error:', error);
        res.status(500).json({
            error: 'Internal server error during login'
        });
    }
});

// Organization Logout
router.post('/logout', async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({
                error: error.message
            });
        }

        res.json({
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Organization logout error:', error);
        res.status(500).json({
            error: 'Internal server error during logout'
        });
    }
});

// Get Current Organization Profile
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Authorization token required'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token with Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({
                error: 'Invalid or expired token'
            });
        }

        // Get organization profile
        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', user.id)
            .single();

        if (orgError || !orgData) {
            return res.status(404).json({
                error: 'Organization profile not found'
            });
        }

        // Auto-verify organization if still pending and email is verified
        let finalOrgData = orgData;
        if (orgData.verification_status === 'pending' && user.email_confirmed_at) {
            const { data: updatedOrgData, error: updateError } = await supabase
                .from('organizations')
                .update({
                    verification_status: 'verified',
                    verified_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single();

            if (!updateError && updatedOrgData) {
                finalOrgData = updatedOrgData;
            }
        }

        res.json({
            user: {
                id: user.id,
                email: user.email,
                user_type: 'organization'
            },
            organization: finalOrgData
        });

    } catch (error) {
        console.error('Get organization profile error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Refresh Session
router.post('/refresh', async (req, res) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                error: 'Refresh token is required'
            });
        }

        const { data, error } = await supabase.auth.refreshSession({
            refresh_token
        });

        if (error) {
            return res.status(401).json({
                error: error.message
            });
        }

        res.json({
            session: data.session,
            user: data.user
        });

    } catch (error) {
        console.error('Refresh session error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

export default router;

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Middleware to authenticate organization users
const authenticateOrganization = async (req, res, next) => {
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

        // Check if user is an organization
        const userType = user.user_metadata?.user_type;
        console.log('User type from metadata:', userType);
        console.log('User email:', user.email);

        // Try to get organization profile first, then check user type
        const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', user.id)
            .single();

        console.log('Organization lookup result:', { orgData: !!orgData, orgError });

        if (orgError || !orgData) {
            // If no organization found, reject access
            return res.status(404).json({
                error: 'Organization profile not found. Please ensure you have an organization account.'
            });
        }

        // If we found organization data, the user is valid
        // Attach user and organization data to request
        req.user = user;
        req.organization = orgData;

        next();

    } catch (error) {
        console.error('Authentication middleware error:', error);
        res.status(500).json({
            error: 'Internal server error during authentication'
        });
    }
};

// Middleware to check if organization is verified
const requireVerifiedOrganization = (req, res, next) => {
    if (!req.organization) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }

    if (req.organization.verification_status !== 'verified') {
        return res.status(403).json({
            error: 'Organization must be verified to perform this action',
            verification_status: req.organization.verification_status
        });
    }

    next();
};

// Middleware to authenticate any user (organization or regular user)
const authenticateUser = async (req, res, next) => {
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

        // Attach user data to request
        req.user = user;

        next();

    } catch (error) {
        console.error('User authentication middleware error:', error);
        res.status(500).json({
            error: 'Internal server error during authentication'
        });
    }
};

export {
    authenticateOrganization,
    requireVerifiedOrganization,
    authenticateUser
};

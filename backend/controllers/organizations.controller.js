import { supabaseAdmin } from "../services/supabase.service.js";

export const getOrganizations = async (req, res) => {
    try {
        // Get only verified organizations for public listing
        const { data, error } = await supabaseAdmin
            .from("organizations")
            .select("*")
            .eq("verification_status", "verified");

        if (error) throw error;
        return res.status(200).json({ data });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch organizations",
            error: e.message
        });
    }
};

export const getOrganizationProfile = async (req, res) => {
    try {
        // Get the authenticated organization's profile
        const organizationId = req.organization.id;

        const { data, error } = await supabaseAdmin
            .from("organizations")
            .select("*")
            .eq("id", organizationId)
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch organization profile",
            error: e.message
        });
    }
};

export const getPublicOrganization = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabaseAdmin
            .from("organizations")
            .select("*")
            .eq("id", id)
            .eq("verification_status", "verified")
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch organization details",
            error: e.message
        });
    }
};

export const updateOrganizationProfile = async (req, res) => {
    const formData = req.body;
    try {
        // Update the authenticated organization's profile
        const organizationId = req.organization.id;

        const { data, error } = await supabaseAdmin
            .from("organizations")
            .update({
                ...formData,
                updated_at: new Date()
            })
            .eq("id", organizationId)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to update organization profile",
            error: e.message
        });
    }
};

export const updateOrganization = async (req, res) => {
    const formData = req.body;
    const { id } = req.params;
    try {
        const { data, error } = await supabaseAdmin
            .from("organizations")
            .update({
                ...formData,
                updated_at: new Date()
            })
            .eq("id", id)
            .select();

        if (error) throw error;
        return res.status(200).json({ data });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to update organization",
            error: e.message
        });
    }
};

export const submitVerificationRequest = async (req, res) => {
    const { verification_documents } = req.body;
    try {
        // For now, we'll update the first organization as a placeholder
        // In a real implementation, this would update the authenticated organization
        const { data, error } = await supabaseAdmin
            .from("organizations")
            .update({
                verification_documents,
                verification_status: 'pending',
                updated_at: new Date()
            })
            .limit(1)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json({
            success: true,
            message: "Verification request submitted successfully",
            data
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to submit verification request",
            error: e.message
        });
    }
};

export const getVerificationStatus = async (req, res) => {
    try {
        // For now, we'll get the first organization as a placeholder
        // In a real implementation, this would get the authenticated organization's status
        const { data, error } = await supabaseAdmin
            .from("organizations")
            .select("verification_status, verified_at, verification_documents")
            .limit(1)
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch verification status",
            error: e.message
        });
    }
};

// Get organization's public events
export const getOrganizationEvents = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabaseAdmin
            .from("events")
            .select(`
        *,
        organizations:organization_id (
          id,
          name,
          verification_status
        )
      `)
            .eq("organization_id", id)
            .eq("status", "published")
            .order('event_date', { ascending: true });

        if (error) throw error;

        // Filter to only show events from verified organizations
        const verifiedEvents = data.filter(event =>
            event.organizations?.verification_status === 'verified'
        );

        return res.status(200).json({ data: verifiedEvents });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch organization events",
            error: e.message
        });
    }
};

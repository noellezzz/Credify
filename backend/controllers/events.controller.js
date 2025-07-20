import { supabaseAdmin } from "../services/supabase.service.js";

// Organization Events Management
export const getOrganizationEvents = async (req, res) => {
    try {
        // Get events for the authenticated organization
        const organizationId = req.organization.id;

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
            .eq('organization_id', organizationId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch events",
            error: e.message
        });
    }
};

export const createEvent = async (req, res) => {
    const eventData = req.body;
    try {
        // Use the authenticated organization ID
        const organizationId = req.organization.id;

        const eventToCreate = {
            ...eventData,
            organization_id: organizationId,
            status: eventData.status || 'draft',
            created_at: new Date(),
            updated_at: new Date()
        };

        const { data, error } = await supabaseAdmin
            .from("events")
            .insert([eventToCreate])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to create event",
            error: e.message
        });
    }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const eventData = req.body;
    try {
        const organizationId = req.organization.id;

        const { data, error } = await supabaseAdmin
            .from("events")
            .update({
                ...eventData,
                updated_at: new Date()
            })
            .eq("id", id)
            .eq("organization_id", organizationId) // Only update events owned by this organization
            .select()
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Event not found or access denied"
            });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to update event",
            error: e.message
        });
    }
};

export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const organizationId = req.organization.id;

        const { error } = await supabaseAdmin
            .from("events")
            .delete()
            .eq("id", id)
            .eq("organization_id", organizationId); // Only delete events owned by this organization

        if (error) throw error;
        return res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to delete event",
            error: e.message
        });
    }
};

export const publishEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const organizationId = req.organization.id;

        // First check if the event exists and belongs to this organization
        const { data: event, error: eventError } = await supabaseAdmin
            .from("events")
            .select(`
        *,
        organizations:organization_id (
          verification_status
        )
      `)
            .eq("id", id)
            .eq("organization_id", organizationId)
            .single();

        if (eventError) throw eventError;

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found or access denied"
            });
        }

        if (event.organizations?.verification_status !== 'verified') {
            return res.status(403).json({
                success: false,
                message: "Only verified organizations can publish events"
            });
        }

        const { data, error } = await supabaseAdmin
            .from("events")
            .update({
                status: 'published',
                updated_at: new Date()
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to publish event",
            error: e.message
        });
    }
};

// Public Events (for users) - only from verified organizations
export const getPublicEvents = async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("events")
            .select(`
        *,
        organizations:organization_id (
          id,
          name,
          address,
          organization_type,
          verification_status,
          logo_url
        )
      `)
            .eq('status', 'published')
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
            message: "Failed to fetch public events",
            error: e.message
        });
    }
};

export const getPublicEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabaseAdmin
            .from("events")
            .select(`
        *,
        organizations:organization_id (
          id,
          name,
          address,
          phone,
          email,
          website,
          organization_type,
          verification_status,
          logo_url,
          description
        )
      `)
            .eq('id', id)
            .eq('status', 'published')
            .single();

        if (error) throw error;

        // Check if organization is verified
        if (data.organizations?.verification_status !== 'verified') {
            return res.status(404).json({
                success: false,
                message: "Event not found or organization not verified"
            });
        }

        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch event details",
            error: e.message
        });
    }
};
import { supabaseAdmin } from "../services/supabase.service.js";

// Verification Requests Management for Organizations
export const getVerificationRequests = async (req, res) => {
    try {
        console.log('getVerificationRequests called');
        console.log('req.organization:', req.organization);

        if (!req.organization || !req.organization.id) {
            console.log('No organization found in request');
            return res.status(401).json({
                success: false,
                message: "Organization authentication required"
            });
        }

        const organizationId = req.organization.id;
        console.log('Organization ID:', organizationId);

        // First get events belonging to this organization
        const { data: organizationEvents, error: eventsError } = await supabaseAdmin
            .from("events")
            .select("id")
            .eq('organization_id', organizationId);

        console.log('Organization events found:', organizationEvents?.length || 0);
        console.log('Events error:', eventsError);

        if (eventsError) throw eventsError;

        if (!organizationEvents || organizationEvents.length === 0) {
            console.log('No events found for organization, returning empty array');
            return res.status(200).json([]);
        }

        const eventIds = organizationEvents.map(event => event.id);
        console.log('Event IDs:', eventIds);

        // Get verification requests for events belonging to this organization
        const { data, error } = await supabaseAdmin
            .from("verification_requests")
            .select(`
                *,
                events:event_id (
                    id,
                    title,
                    event_type,
                    organization_id
                )
            `)
            .in('event_id', eventIds)
            .order('submitted_at', { ascending: false });

        console.log('Verification requests found:', data?.length || 0);
        console.log('Requests error:', error);

        if (error) throw error;

        // Transform the data to match what the frontend expects
        const transformedData = data.map(request => ({
            ...request,
            event_title: request.events?.title || 'Unknown Event',
            event_type: request.events?.event_type || 'Unknown Type'
        }));

        console.log('Transformed data:', transformedData.length, 'requests');
        return res.status(200).json(transformedData);
    } catch (e) {
        console.log('Error in getVerificationRequests:', e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch verification requests",
            error: e.message
        });
    }
};

export const getVerificationRequest = async (req, res) => {
    const { id } = req.params;
    try {
        const { data, error } = await supabaseAdmin
            .from("verification_requests")
            .select(`
        *,
        events:event_id (
          id,
          title,
          event_type,
          description,
          organization_id
        )
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch verification request",
            error: e.message
        });
    }
};

export const approveVerificationRequest = async (req, res) => {
    const { id } = req.params;
    const { review_notes } = req.body;

    try {
        const organizationId = req.organization.id; // Get the actual organization ID from auth middleware

        const { data, error } = await supabaseAdmin
            .from("verification_requests")
            .update({
                status: 'approved',
                review_notes: review_notes || '',
                reviewed_at: new Date(),
                reviewed_by: organizationId // Use the actual organization ID
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to approve verification request",
            error: e.message
        });
    }
};

export const rejectVerificationRequest = async (req, res) => {
    const { id } = req.params;
    const { review_notes } = req.body;

    try {
        const organizationId = req.organization.id; // Get the actual organization ID from auth middleware

        const { data, error } = await supabaseAdmin
            .from("verification_requests")
            .update({
                status: 'rejected',
                review_notes: review_notes || '',
                reviewed_at: new Date(),
                reviewed_by: organizationId // Use the actual organization ID
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to reject verification request",
            error: e.message
        });
    }
};

// User submission of verification request
export const submitVerificationRequest = async (req, res) => {
    const { eventId } = req.params;
    const requestData = req.body;

    try {
        // First verify that the event exists and belongs to a verified organization
        const { data: event, error: eventError } = await supabaseAdmin
            .from("events")
            .select(`
        *,
        organizations:organization_id (
          verification_status
        )
      `)
            .eq('id', eventId)
            .eq('status', 'published')
            .single();

        if (eventError || !event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.organizations?.verification_status !== 'verified') {
            return res.status(403).json({
                success: false,
                message: "This event belongs to an unverified organization"
            });
        }

        // Check if user already has a verification request for this event
        if (requestData.user_id) {
            const { data: existingRequest, error: checkError } = await supabaseAdmin
                .from("verification_requests")
                .select('id, status')
                .eq('event_id', eventId)
                .eq('user_id', requestData.user_id) // This should match the auth_id format
                .single();

            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found"
                throw checkError;
            }

            if (existingRequest) {
                return res.status(409).json({
                    success: false,
                    message: "You have already submitted a verification request for this event",
                    existingRequest
                });
            }
        }

        const requestToCreate = {
            event_id: eventId,
            user_id: requestData.user_id || null, // This will be the auth_id from users table
            certificate_file_url: requestData.certificate_file_url,
            participant_name: requestData.participant_name,
            participant_id: requestData.participant_id,
            completion_date: requestData.completion_date,
            status: 'pending',
            submitted_at: new Date()
        };

        // Add participation_year only if it exists
        if (requestData.participation_year) {
            requestToCreate.participation_year = requestData.participation_year;
        }

        const { data, error } = await supabaseAdmin
            .from("verification_requests")
            .insert([requestToCreate])
            .select()
            .single();

        if (error) throw error;
        return res.status(201).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to submit verification request",
            error: e.message
        });
    }
};

// Get verification requests stats for dashboard
export const getVerificationStats = async (req, res) => {
    try {
        const { data: pending, error: pendingError } = await supabaseAdmin
            .from("verification_requests")
            .select('id', { count: 'exact' })
            .eq('status', 'pending');

        const { data: approved, error: approvedError } = await supabaseAdmin
            .from("verification_requests")
            .select('id', { count: 'exact' })
            .eq('status', 'approved');

        const { data: rejected, error: rejectedError } = await supabaseAdmin
            .from("verification_requests")
            .select('id', { count: 'exact' })
            .eq('status', 'rejected');

        if (pendingError || approvedError || rejectedError) {
            throw pendingError || approvedError || rejectedError;
        }

        const stats = {
            pending: pending?.length || 0,
            approved: approved?.length || 0,
            rejected: rejected?.length || 0,
            total: (pending?.length || 0) + (approved?.length || 0) + (rejected?.length || 0)
        };

        return res.status(200).json(stats);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch verification stats",
            error: e.message
        });
    }
};

// Get user's verification status for a specific event
export const getUserVerificationStatus = async (req, res) => {
    const { eventId } = req.params;
    const { user_id } = req.query; // In real app, get from authenticated session

    try {
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // Get all verification requests for this user and event, ordered by submission time
        const { data: allRequests, error } = await supabaseAdmin
            .from("verification_requests")
            .select(`
                *,
                events:event_id (
                    id,
                    title,
                    event_type
                )
            `)
            .eq('event_id', eventId)
            .eq('user_id', user_id) // This should match the auth_id format
            .order('submitted_at', { ascending: false }); // Most recent first

        if (error) {
            throw error;
        }

        if (!allRequests || allRequests.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No verification request found for this event"
            });
        }

        // Prioritize approved requests, then most recent
        let selectedRequest = allRequests.find(req => req.status === 'approved');
        if (!selectedRequest) {
            selectedRequest = allRequests[0]; // Most recent request
        }

        // If approved, include certificate URL (in real app, generate a secure certificate)
        const response = {
            ...selectedRequest,
            certificate_url: selectedRequest.status === 'approved' ?
                `/api/certificates/download/${selectedRequest.id}` : null
        };

        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch verification status",
            error: e.message
        });
    }
};
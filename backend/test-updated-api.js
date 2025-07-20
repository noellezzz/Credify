import { supabaseAdmin } from './services/supabase.service.js';

async function testUpdatedAPI() {
    const eventId = 'dd835763-7d0f-4116-bade-abf4cfc25db7';
    const userId = '6b93bb89-0655-4201-80da-deaeeb115452'; // Seilah Nakamura

    console.log('Testing updated getUserVerificationStatus for:', { eventId, userId });

    // Simulate the updated function logic
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
        .eq('user_id', userId)
        .order('submitted_at', { ascending: false });

    console.log('All requests:', allRequests);
    console.log('Error:', error);

    if (allRequests && allRequests.length > 0) {
        // Prioritize approved requests, then most recent
        let selectedRequest = allRequests.find(req => req.status === 'approved');
        if (!selectedRequest) {
            selectedRequest = allRequests[0]; // Most recent request
        }

        console.log('Selected request:', {
            id: selectedRequest.id,
            status: selectedRequest.status,
            submitted_at: selectedRequest.submitted_at,
            participant_name: selectedRequest.participant_name
        });
    }

    process.exit(0);
}

testUpdatedAPI();

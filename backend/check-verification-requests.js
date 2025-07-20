import { supabaseAdmin } from './services/supabase.service.js';

async function checkVerificationRequests() {
    const eventId = 'dd835763-7d0f-4116-bade-abf4cfc25db7';
    const userId = '6b93bb89-0655-4201-80da-deaeeb115452'; // Seilah Nakamura

    console.log('Checking all verification requests for:', { eventId, userId });

    // Get all requests (not single)
    const { data, error } = await supabaseAdmin
        .from('verification_requests')
        .select(`
            *,
            events:event_id (
                id,
                title,
                event_type
            )
        `)
        .eq('event_id', eventId)
        .eq('user_id', userId);

    console.log('Query result:', { data, error });

    if (data) {
        console.log('Found', data.length, 'verification requests:');
        data.forEach((request, index) => {
            console.log(`Request ${index + 1}:`, {
                id: request.id,
                status: request.status,
                submitted_at: request.submitted_at,
                participant_name: request.participant_name
            });
        });
    }

    process.exit(0);
}

checkVerificationRequests();

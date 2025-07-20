import { supabaseAdmin } from './services/supabase.service.js';

async function testUserVerificationStatus() {
    const eventId = 'dd835763-7d0f-4116-bade-abf4cfc25db7';
    const userId = '6b93bb89-0655-4201-80da-deaeeb115452'; // Seilah Nakamura

    console.log('Testing getUserVerificationStatus for:', { eventId, userId });

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
        .eq('user_id', userId)
        .single();

    console.log('Query result:', { data, error });

    if (error && error.code !== 'PGRST116') {
        console.log('Unexpected error:', error);
    } else if (!data) {
        console.log('No verification request found for this user and event');
    } else {
        console.log('Verification request found:', data);
    }

    process.exit(0);
}

testUserVerificationStatus();

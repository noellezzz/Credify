import { supabaseAdmin } from './services/supabase.service.js';

async function checkUsers() {
    const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('*');

    console.log('All users in database:');
    users.forEach(user => {
        console.log({
            auth_id: user.auth_id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
        });
    });

    process.exit(0);
}

checkUsers();

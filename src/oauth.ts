import { supabase } from './supabaseClient';

async function loginWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });

    if (error) {
        console.error('Error during Google login:', error.message);
    }
}

export { loginWithGoogle };
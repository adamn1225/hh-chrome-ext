import React, { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };

        fetchUser();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {user ? (
                <div>
                    <p>Name: {user.user_metadata.full_name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.user_metadata.avatar_url} alt="Profile" />
                </div>
            ) : (
                <div>Please log in</div>
            )}
        </div>
    );
};

export default UserProfile;
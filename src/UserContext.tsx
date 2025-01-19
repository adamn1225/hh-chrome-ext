// src/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient'; // Import the supabase client from supabaseClient.ts
import { Database } from './database.types';

interface UserProfile {
    id: string;
    email: string;
    role: string;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    profile_picture: string | null;
    address: string | null;
    phone_number: string | null;
}

interface UserContextType {
    userProfile: UserProfile | null;
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
    loading: boolean;
    error: string | null;
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const session = useSession();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentSession, setCurrentSession] = useState<Session | null>(session);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentSession) {
                setLoading(false);
                return;
            }

            console.log('Fetching user profile for user ID:', currentSession.user.id);
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, role, first_name, last_name, company_name, profile_picture, address, phone_number')
                .eq('id', currentSession.user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error.message);
                setError('Error fetching user profile');
            } else {
                console.log('Fetched user profile:', data);
                setUserProfile(data);
            }

            setLoading(false);
        };

        if (currentSession) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [currentSession]);

    return (
        <UserContext.Provider value={{ userProfile, setUserProfile, loading, error, session: currentSession, setSession: setCurrentSession }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
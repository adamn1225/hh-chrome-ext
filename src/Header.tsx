// src/Header.tsx
import React from 'react';
import { useUser } from './UserContext';

const Header = () => {
    const { userProfile, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <header className="w-full">
            <div className='p-4 bg-gray-800 text-white absolute top-0 left-0 w-full'>
                <h1 className="text-xl font-bold">Shipper-Connect Quote Extension</h1>
            </div>
            {userProfile && (
                <div className="flex items-center justify-center gap-4">
                    <p>Welcome, {userProfile.first_name || 'User'}</p>
                </div>
            )}
        </header>
    );
};

export default Header;
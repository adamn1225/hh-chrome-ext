// src/Header.tsx
import React from 'react';
import { useUser } from './UserContext';

const Header = () => {
    const { userProfile, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <header className="p-4 bg-gray-800 absolute top-0 left-0 w-full z-10">
            <div className='text-white flex justify-between items-center'>
                <h1 className="text-xl font-bold">Shipper-Connect Quote Extension</h1>
                {userProfile && (
                    <div className="flex items-center justify-center gap-4">
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
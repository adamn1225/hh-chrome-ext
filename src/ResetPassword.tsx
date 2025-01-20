import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        const { error } = await supabase.auth.updateUser({ password });
        if (error) {
            setMessage(`Error resetting password: ${error.message}`);
        } else {
            setMessage('Password reset successfully');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg border w-1/2 border-amber-500">
                <h1 className="text-2xl mb-4 text-gray-900 font-semibold">Shipper-Connect</h1>
                <h1 className="text-xl mb-4 text-amber-500">Reset Password</h1>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="m-2 p-2 border border-gray-300 rounded w-full"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="m-2 p-2 border border-gray-300 rounded w-full"
                />
                <button
                    onClick={handleResetPassword}
                    className="m-2 px-4 py-2 border border-amber-500 shadow-md bg-amber-500 text-white font-medium hover:bg-amber-600 rounded"
                >
                    Reset Password
                </button>
                {message && <p className="text-green-500 mt-4">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
// src/Login.tsx
import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        } else {
            onLogin();
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-4 space-y-4 w-full">
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full"
            />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="bg-amber-400 shadow-lg text-md font-semibold text-gray-900 border border-gray-900 self-center w-full p-2 rounded">
                Login
            </button>
        </form>
    );
};

export default Login;
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push('/admin');
            } else {
                setError('Invalid password');
            }
        } catch {
            setError('An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white pt-20">
            <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center text-[#00ff99]">Admin Login</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-[#00ff99]"
                />
                <button
                    type="submit"
                    className="w-full bg-[#00ff99] text-black font-bold py-3 rounded hover:bg-[#00e68a] transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

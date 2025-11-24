"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteProjectButton({ id }: { id: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                alert('Failed to delete project');
            }
        } catch {
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
        >
            {loading ? 'Deleting...' : 'Delete Project'}
        </button>
    );
}

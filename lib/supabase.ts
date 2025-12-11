import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadImageToSupabase(file: File, folder: string = 'projects'): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const response = await fetch('/api/storage/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload image');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Upload exception:', error);
        throw error;
    }
}

export async function listImagesFromSupabase(folder: string = ''): Promise<{ name: string; url: string }[]> {
    try {
        const params = new URLSearchParams();
        if (folder) params.append('folder', folder);
        params.append('limit', '100');

        const response = await fetch(`/api/storage/list?${params.toString()}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to list images');
        }

        const data = await response.json();
        return data.files || [];
    } catch (error) {
        console.error('List exception:', error);
        throw error;
    }
}

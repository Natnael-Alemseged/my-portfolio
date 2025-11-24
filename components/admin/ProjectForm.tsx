"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectFormProps {
    initialData?: {
        _id?: string;
        title?: string;
        description?: string;
        content?: string;
        images?: string[];
        techStack?: string[];
        links?: {
            web?: string;
            playstore?: string;
            appstore?: string;
            github?: string;
        };
    };
    isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        content: initialData?.content || '',
        images: initialData?.images?.join('\n') || '',
        techStack: initialData?.techStack?.join(', ') || '',
        links: {
            web: initialData?.links?.web || '',
            playstore: initialData?.links?.playstore || '',
            appstore: initialData?.links?.appstore || '',
            github: initialData?.links?.github || '',
        },
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('link_')) {
            const linkType = name.replace('link_', '');
            setFormData(prev => ({
                ...prev,
                links: { ...prev.links, [linkType]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            images: formData.images.split('\n').filter((s: string) => s.trim()),
            techStack: formData.techStack.split(',').map((s: string) => s.trim()).filter((s: string) => s),
        };

        try {
            const url = isEdit ? `/api/projects/${initialData?._id}` : '/api/projects';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/admin');
                router.refresh();
            } else {
                alert('Failed to save project');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto text-white">
            <div>
                <label className="block mb-2 font-bold">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    required
                />
            </div>
            <div>
                <label className="block mb-2 font-bold">Description (Short)</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-24"
                    required
                />
            </div>
            <div>
                <label className="block mb-2 font-bold">Content (Detailed Markdown/HTML)</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-48"
                />
            </div>
            <div>
                <label className="block mb-2 font-bold">Images (One URL per line)</label>
                <textarea
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-32"
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
            </div>
            <div>
                <label className="block mb-2 font-bold">Tech Stack (Comma separated)</label>
                <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleChange}
                    className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    placeholder="React, Node.js, MongoDB"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2 font-bold">Web Link</label>
                    <input
                        type="text"
                        name="link_web"
                        value={formData.links.web}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-bold">GitHub Link</label>
                    <input
                        type="text"
                        name="link_github"
                        value={formData.links.github}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-bold">Play Store Link</label>
                    <input
                        type="text"
                        name="link_playstore"
                        value={formData.links.playstore}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-bold">App Store Link</label>
                    <input
                        type="text"
                        name="link_appstore"
                        value={formData.links.appstore}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00ff99] text-black font-bold py-3 rounded hover:bg-[#00e68a] transition disabled:opacity-50"
            >
                {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
            </button>
        </form>
    );
}

"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImageToSupabase } from '@/lib/supabase';
import { Upload, Link as LinkIcon, X, Code, FileText } from 'lucide-react';

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
            playstore?: string[];
            appstore?: string[];
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
            playstore: initialData?.links?.playstore || ['', ''],
            appstore: initialData?.links?.appstore || ['', ''],
            github: initialData?.links?.github || '',
        },
    });
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
    const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
    const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState('');
    const jsonEditingRef = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('link_')) {
            const parts = name.replace('link_', '').split('_');
            const linkType = parts[0];
            const index = parts[1] ? parseInt(parts[1]) : 0;
            setFormData(prev => {
                const newLinks = { ...prev.links };
                if (Array.isArray(newLinks[linkType as keyof typeof newLinks])) {
                    (newLinks[linkType as keyof typeof newLinks] as string[])[index] = value;
                } else {
                    newLinks[linkType as keyof typeof newLinks] = value;
                }
                return { ...prev, links: newLinks };
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const newUrls: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = await uploadImageToSupabase(file);
            if (url) {
                newUrls.push(url);
            }
        }

        setUploadedUrls(prev => [...prev, ...newUrls]);
        setFormData(prev => ({
            ...prev,
            images: [...prev.images.split('\n').filter(s => s.trim()), ...newUrls].join('\n')
        }));
        setUploadingImages(false);
    };

    const removeUploadedImage = (urlToRemove: string) => {
        setUploadedUrls(prev => prev.filter(url => url !== urlToRemove));
        const currentImages = formData.images.split('\n').filter(s => s.trim());
        const updatedImages = currentImages.filter(url => url !== urlToRemove);
        setFormData(prev => ({ ...prev, images: updatedImages.join('\n') }));
    };

    const convertFormToJson = () => {
        const payload = {
            title: formData.title,
            description: formData.description,
            content: formData.content,
            images: formData.images.split('\n').filter((s: string) => s.trim()),
            techStack: formData.techStack.split(',').map((s: string) => s.trim()).filter((s: string) => s),
            links: {
                web: formData.links.web,
                playstore: formData.links.playstore.filter((s: string) => s.trim()),
                appstore: formData.links.appstore.filter((s: string) => s.trim()),
                github: formData.links.github,
            },
        };
        return JSON.stringify(payload, null, 2);
    };

    const switchToJsonMode = () => {
        setJsonInput(convertFormToJson());
        setJsonError('');
        setViewMode('json');
    };

    const handleJsonInputChange = (value: string) => {
        setJsonInput(value);
        try {
            const parsed = JSON.parse(value);
            jsonEditingRef.current = true;
            setFormData({
                title: parsed.title || '',
                description: parsed.description || '',
                content: parsed.content || '',
                images: Array.isArray(parsed.images) ? parsed.images.join('\n') : '',
                techStack: Array.isArray(parsed.techStack) ? parsed.techStack.join(', ') : '',
                links: {
                    web: parsed.links?.web || '',
                    playstore: Array.isArray(parsed.links?.playstore) ? parsed.links.playstore : ['', ''],
                    appstore: Array.isArray(parsed.links?.appstore) ? parsed.links.appstore : ['', ''],
                    github: parsed.links?.github || '',
                },
            });
            setJsonError('');
        } catch {
            setJsonError('Invalid JSON format. Please check your syntax.');
        } finally {
            jsonEditingRef.current = false;
        }
    };

    useEffect(() => {
        if (viewMode === 'json' && !jsonEditingRef.current) {
            setJsonInput(convertFormToJson());
        }
    }, [formData, viewMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            images: formData.images.split('\n').filter((s: string) => s.trim()),
            techStack: formData.techStack.split(',').map((s: string) => s.trim()).filter((s: string) => s),
            links: {
                ...formData.links,
                playstore: formData.links.playstore.filter((s: string) => s.trim()),
                appstore: formData.links.appstore.filter((s: string) => s.trim()),
            },
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
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto text-white pt-24 md:pt-28">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setViewMode('form')}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                            viewMode === 'form'
                                ? 'bg-[#00ff99] text-black'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                    >
                        <FileText size={16} />
                        Form View
                    </button>
                    <button
                        type="button"
                        onClick={switchToJsonMode}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                            viewMode === 'json'
                                ? 'bg-[#00ff99] text-black'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                    >
                        <Code size={16} />
                        JSON Editor
                    </button>
                </div>
                <span className="text-xs text-gray-400">
                    {viewMode === 'form' ? 'Fill form or switch to JSON' : 'Edit JSON or switch back to form'}
                </span>
            </div>

            {/* JSON Editor View */}
            {viewMode === 'json' ? (
                <div className="space-y-4">
                    <div>
                        <label className="block mb-2 font-bold">JSON Data</label>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => handleJsonInputChange(e.target.value)}
                            className="w-full p-4 bg-gray-900 rounded border border-gray-700 font-mono text-sm h-96"
                            placeholder="Paste or edit JSON here..."
                        />
                        {jsonError && (
                            <p className="text-red-500 text-sm mt-2">{jsonError}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Changes here sync automatically with the form.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                navigator.clipboard.writeText(jsonInput);
                                alert('JSON copied to clipboard!');
                            }}
                            className="px-6 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition"
                        >
                            Copy JSON
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Form View */}
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
                <label className="block mb-2 font-bold">Images</label>
                
                {/* Toggle between URL and Upload */}
                <div className="flex gap-2 mb-3">
                    <button
                        type="button"
                        onClick={() => setImageInputMode('url')}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                            imageInputMode === 'url'
                                ? 'bg-[#00ff99] text-black'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                    >
                        <LinkIcon size={16} />
                        Paste URL
                    </button>
                    <button
                        type="button"
                        onClick={() => setImageInputMode('upload')}
                        className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
                            imageInputMode === 'upload'
                                ? 'bg-[#00ff99] text-black'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                    >
                        <Upload size={16} />
                        Upload Files
                    </button>
                </div>

                {imageInputMode === 'url' ? (
                    <div>
                        <textarea
                            name="images"
                            value={formData.images}
                            onChange={handleChange}
                            className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-32"
                            placeholder="Paste image URLs (one per line)&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                        />
                        
                        {/* Display pasted URLs as chips with preview */}
                        {formData.images.split('\n').filter(url => url.trim()).length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-400 mb-2">Image URLs ({formData.images.split('\n').filter(url => url.trim()).length}):</p>
                                <div className="flex flex-wrap gap-2">
                                    {formData.images.split('\n').filter(url => url.trim()).map((url, idx) => (
                                        <div key={idx} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Image ${idx + 1}`}
                                                className="w-20 h-20 object-cover rounded border border-gray-700"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23374151" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239CA3AF" font-size="10"%3EInvalid URL%3C/text%3E%3C/svg%3E';
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const urls = formData.images.split('\n').filter(u => u.trim());
                                                    urls.splice(idx, 1);
                                                    setFormData(prev => ({ ...prev, images: urls.join('\n') }));
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileUpload}
                            disabled={uploadingImages}
                            className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#00ff99] file:text-black file:cursor-pointer hover:file:bg-[#00e68a] disabled:opacity-50"
                        />
                        {uploadingImages && (
                            <p className="text-[#00ff99] text-sm mt-2">Uploading images...</p>
                        )}
                    </div>
                )}

                {/* Display uploaded images */}
                {uploadedUrls.length > 0 && (
                    <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Uploaded Images:</p>
                        <div className="flex flex-wrap gap-2">
                            {uploadedUrls.map((url, idx) => (
                                <div key={idx} className="relative group">
                                    <img
                                        src={url}
                                        alt={`Upload ${idx + 1}`}
                                        className="w-20 h-20 object-cover rounded border border-gray-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeUploadedImage(url)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
                    <label className="block mb-2 font-bold">Play Store Link 1</label>
                    <input
                        type="text"
                        name="link_playstore_0"
                        value={formData.links.playstore[0] || ''}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-bold">Play Store Link 2</label>
                    <input
                        type="text"
                        name="link_playstore_1"
                        value={formData.links.playstore[1] || ''}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-bold">App Store Link 1</label>
                    <input
                        type="text"
                        name="link_appstore_0"
                        value={formData.links.appstore[0] || ''}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                    />
                </div>
                <div>
                    <label className="block mb-2 font-bold">App Store Link 2</label>
                    <input
                        type="text"
                        name="link_appstore_1"
                        value={formData.links.appstore[1] || ''}
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
                </>
            )}
        </form>
    );
}

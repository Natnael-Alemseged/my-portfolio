"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { uploadImageToSupabase } from '@/lib/supabase';
import { Upload, Link as LinkIcon, X, Code, FileText, Plus, Trash2 } from 'lucide-react';
import { Project, ProjectImage, ProjectLink } from '@/types/project';

const safeParseJson = <T,>(value: string | undefined, fallback: T): T => {
    if (!value || !value.trim()) {
        return fallback;
    }
    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};

interface ProjectFormProps {
    initialData?: Project;
    isEdit?: boolean;
}

export default function ProjectForm({ initialData, isEdit = false }: ProjectFormProps) {
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        summary: initialData?.summary || '',
        role: initialData?.role || '',
        problem: initialData?.problem || '',
        solution: initialData?.solution || '',
        keyTakeaway: initialData?.keyTakeaway || '',
        content: initialData?.content || '',
        contentFormat: initialData?.contentFormat || 'markdown' as 'markdown' | 'html',
        architecture: initialData?.architecture || '',
        features: initialData?.features?.join('\n') || '',
        techStack: initialData?.techStack?.join(', ') || '',
        tags: initialData?.tags?.join(', ') || '',
        images: JSON.stringify(initialData?.images || [], null, 2),
        logo_image: initialData?.logo_image ? JSON.stringify(initialData.logo_image, null, 2) : '',
        links: JSON.stringify(initialData?.links || [], null, 2),
        duration: initialData?.metrics?.duration || '',
        teamSize: initialData?.metrics?.teamSize?.toString() || '',
        impact: initialData?.metrics?.impact || '',
        featured: initialData?.featured || false,
        status: initialData?.status || 'active' as 'active' | 'archived' | 'in-progress',
        visibility: initialData?.visibility || 'public' as 'public' | 'private' | 'unlisted',
        schemaType: initialData?.schemaType || 'SoftwareApplication' as 'SoftwareApplication' | 'WebApplication' | 'MobileApplication' | 'CreativeWork',
    });

    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
    const [jsonInput, setJsonInput] = useState('');
    const [jsonError, setJsonError] = useState('');
    const jsonEditingRef = useRef(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploadingImages(true);
        const currentImages: ProjectImage[] = JSON.parse(formData.images || '[]');

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const url = await uploadImageToSupabase(file);
            if (url) {
                currentImages.push({
                    url,
                    alt: file.name.replace(/\.[^/.]+$/, ''),
                    order: currentImages.length
                });
            }
        }

        setFormData(prev => ({ ...prev, images: JSON.stringify(currentImages, null, 2) }));
        setUploadingImages(false);
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setUploadingLogo(true);

        const url = await uploadImageToSupabase(file);
        if (url) {
            const logoPayload: ProjectImage = {
                url,
                alt: file.name.replace(/\.[^/.]+$/, ''),
                order: 0,
            };
            setFormData(prev => ({ ...prev, logo_image: JSON.stringify(logoPayload, null, 2) }));
        }

        setUploadingLogo(false);
    };

    const buildPayload = () => {
        return {
            title: formData.title,
            summary: formData.summary,
            role: formData.role,
            problem: formData.problem,
            solution: formData.solution,
            keyTakeaway: formData.keyTakeaway || undefined,
            content: formData.content,
            contentFormat: formData.contentFormat,
            architecture: formData.architecture,
            features: formData.features.split('\n').filter(s => s.trim()),
            techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s),
            tags: formData.tags.split(',').map(s => s.trim()).filter(s => s),
            images: safeParseJson<ProjectImage[]>(formData.images, []),
            logo_image: safeParseJson<ProjectImage | undefined>(formData.logo_image, undefined),
            links: safeParseJson<ProjectLink[]>(formData.links, []),
            metrics: {
                duration: formData.duration || undefined,
                teamSize: formData.teamSize ? parseInt(formData.teamSize) : undefined,
                impact: formData.impact || undefined,
            },
            featured: formData.featured,
            status: formData.status,
            visibility: formData.visibility,
            schemaType: formData.schemaType,
        };
    };

    const convertFormToJson = () => {
        try {
            const payload = buildPayload();
            return JSON.stringify(payload, null, 2);
        } catch {
            return '{}';
        }
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
                summary: parsed.summary || '',
                role: parsed.role || '',
                problem: parsed.problem || '',
                solution: parsed.solution || '',
                keyTakeaway: parsed.keyTakeaway || '',
                content: parsed.content || '',
                contentFormat: parsed.contentFormat || 'markdown',
                architecture: parsed.architecture || '',
                features: Array.isArray(parsed.features) ? parsed.features.join('\n') : '',
                techStack: Array.isArray(parsed.techStack) ? parsed.techStack.join(', ') : '',
                tags: Array.isArray(parsed.tags) ? parsed.tags.join(', ') : '',
                images: JSON.stringify(parsed.images || [], null, 2),
                logo_image: parsed.logo_image ? JSON.stringify(parsed.logo_image, null, 2) : '',
                links: JSON.stringify(parsed.links || [], null, 2),
                duration: parsed.metrics?.duration || '',
                teamSize: parsed.metrics?.teamSize?.toString() || '',
                impact: parsed.metrics?.impact || '',
                featured: parsed.featured || false,
                status: parsed.status || 'active',
                visibility: parsed.visibility || 'public',
                schemaType: parsed.schemaType || 'SoftwareApplication',
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

        try {
            const payload = buildPayload();

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
                const error = await res.json();
                alert(`Failed to save project: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto text-white">
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
                            type="submit"
                            disabled={loading || !!jsonError}
                            className="px-6 py-2 bg-[#00ff99] text-black font-bold rounded hover:bg-[#00e68a] transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
                        </button>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4">Basic Information</h2>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Slug will be auto-generated from title</p>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Summary *</label>
                            <textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-24"
                                placeholder="Short description for project cards"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold">Your Role</label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                                placeholder="e.g., Full-Stack Developer"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                            >
                                <option value="active">Active</option>
                                <option value="in-progress">In Progress</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                    className="w-4 h-4"
                                />
                                <span className="font-bold">Featured Project</span>
                            </label>
                        </div>

                        {/* SEO & Visibility */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4 mt-6">SEO & Visibility</h2>
                        </div>

                        <div>
                            <label className="block mb-2 font-bold">Visibility</label>
                            <select
                                name="visibility"
                                value={formData.visibility}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                            >
                                <option value="public">Public</option>
                                <option value="unlisted">Unlisted</option>
                                <option value="private">Private</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Controls indexing and public access</p>
                        </div>

                        <div>
                            <label className="block mb-2 font-bold">Schema Type</label>
                            <select
                                name="schemaType"
                                value={formData.schemaType}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                            >
                                <option value="SoftwareApplication">Software Application</option>
                                <option value="WebApplication">Web Application</option>
                                <option value="MobileApplication">Mobile Application</option>
                                <option value="CreativeWork">Creative Work</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-1">For Schema.org structured data</p>
                        </div>


                        {/* Problem & Solution */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4 mt-6">Problem & Solution</h2>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Problem</label>
                            <textarea
                                name="problem"
                                value={formData.problem}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-24"
                                placeholder="What problem does this project solve?"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Solution</label>
                            <textarea
                                name="solution"
                                value={formData.solution}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-24"
                                placeholder="How did you solve it?"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Key Takeaway</label>
                            <input
                                type="text"
                                name="keyTakeaway"
                                value={formData.keyTakeaway}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                                placeholder="Quick insight for LLMs and summaries"
                            />
                            <p className="text-xs text-gray-500 mt-1">One-sentence summary for chatbot responses</p>
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4 mt-6">Detailed Content</h2>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Content</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-48 font-mono text-sm"
                                placeholder="## Overview&#10;Detailed project description..."
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold">Content Format</label>
                            <select
                                name="contentFormat"
                                value={formData.contentFormat}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                            >
                                <option value="markdown">Markdown</option>
                                <option value="html">HTML</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Architecture</label>
                            <textarea
                                name="architecture"
                                value={formData.architecture}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-24"
                                placeholder="Technical architecture overview"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Features (One per line)</label>
                            <textarea
                                name="features"
                                value={formData.features}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-32"
                                placeholder="Real-time collaboration&#10;AI-powered search&#10;Mobile responsive"
                            />
                        </div>

                        {/* Tech & Tags */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4 mt-6">Technologies & Tags</h2>
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

                        <div>
                            <label className="block mb-2 font-bold">Tags (Comma separated)</label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                                placeholder="AI/ML, Full-Stack, Mobile"
                            />
                        </div>

                        {/* Images */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4 mt-6">Images</h2>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Images (JSON)</label>
                            <textarea
                                name="images"
                                value={formData.images}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-48 font-mono text-sm"
                                placeholder='[{"url": "https://...", "alt": "Description", "caption": "Optional", "order": 0}]'
                            />
                            <div className="mt-2">
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
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Logo Image (JSON)</label>
                            <textarea
                                name="logo_image"
                                value={formData.logo_image}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-32 font-mono text-sm"
                                placeholder='{"url": "https://...", "alt": "Logo", "order": 0}'
                            />
                            <div className="mt-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    disabled={uploadingLogo}
                                    className="w-full p-2 bg-gray-800 rounded border border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#00ff99] file:text-black file:cursor-pointer hover:file:bg-[#00e68a] disabled:opacity-50"
                                />
                                {uploadingLogo && (
                                    <p className="text-[#00ff99] text-sm mt-2">Uploading logo image...</p>
                                )}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4 mt-6">Links</h2>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Links (JSON)</label>
                            <textarea
                                name="links"
                                value={formData.links}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-48 font-mono text-sm"
                                placeholder='[{"type": "web", "url": "https://...", "label": "Optional"}]'
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Supported types: web, github, playstore, appstore, demo, docs, or custom
                            </p>
                        </div>

                        {/* Metrics */}
                        <div className="md:col-span-2">
                            <h2 className="text-xl font-bold text-[#00ff99] mb-4 mt-6">Metrics (Optional)</h2>
                        </div>

                        <div>
                            <label className="block mb-2 font-bold">Duration</label>
                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                                placeholder="e.g., 3 months"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-bold">Team Size</label>
                            <input
                                type="number"
                                name="teamSize"
                                value={formData.teamSize}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700"
                                placeholder="e.g., 4"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block mb-2 font-bold">Impact</label>
                            <textarea
                                name="impact"
                                value={formData.impact}
                                onChange={handleChange}
                                className="w-full p-2 bg-gray-800 rounded border border-gray-700 h-24"
                                placeholder="e.g., Reduced processing time by 60%"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#00ff99] text-black font-bold py-3 rounded hover:bg-[#00e68a] transition disabled:opacity-50 mt-8"
                    >
                        {loading ? 'Saving...' : (isEdit ? 'Update Project' : 'Create Project')}
                    </button>
                </>
            )}
        </form>
    );
}

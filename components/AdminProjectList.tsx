'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface Project {
    _id: string;
    title: string;
    summary?: string;
    position?: number;
}

function SortableProject({ project }: { project: Project }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-gray-900 p-6 rounded-lg flex items-center gap-4 ${isDragging ? 'z-50 shadow-2xl' : ''
                }`}
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-[#00ff99] transition-colors p-2"
                aria-label="Drag to reorder"
            >
                <GripVertical size={24} />
            </button>
            <div className="flex-1">
                <h2 className="text-xl font-bold">{project.title}</h2>
                <p className="text-gray-400 text-sm">
                    {(project.summary || '').substring(0, 100) || 'No summary yet'}...
                </p>
            </div>
            <div className="flex gap-4">
                <Link
                    href={`/admin/edit/${project._id}`}
                    className="text-blue-400 hover:text-blue-300"
                >
                    Edit
                </Link>
            </div>
        </div>
    );
}

export default function AdminProjectList({ initialProjects }: { initialProjects: Project[] }) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = projects.findIndex((p) => p._id === active.id);
        const newIndex = projects.findIndex((p) => p._id === over.id);

        const newProjects = arrayMove(projects, oldIndex, newIndex);
        setProjects(newProjects);

        // Save the new order to the backend
        setIsSaving(true);
        setSaveMessage('');

        try {
            const response = await fetch('/api/projects/reorder', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectIds: newProjects.map((p) => p._id),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save order');
            }

            setSaveMessage('✓ Order saved successfully');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Error saving order:', error);
            setSaveMessage('✗ Failed to save order');
            // Revert on error
            setProjects(initialProjects);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#00ff99]">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm mt-2">
                            Drag and drop to reorder projects
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {saveMessage && (
                            <span
                                className={`text-sm ${saveMessage.includes('✓')
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                    }`}
                            >
                                {saveMessage}
                            </span>
                        )}
                        {isSaving && (
                            <span className="text-sm text-gray-400">Saving...</span>
                        )}
                        <Link
                            href="/admin/add"
                            className="bg-[#00ff99] text-black px-4 py-2 rounded font-bold hover:bg-[#00e68a]"
                        >
                            Add New Project
                        </Link>
                    </div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={projects.map((p) => p._id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="grid gap-6">
                            {projects.map((project) => (
                                <SortableProject key={project._id} project={project} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                {projects.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No projects yet. Add your first project to get started.
                    </div>
                )}
            </div>
        </div>
    );
}

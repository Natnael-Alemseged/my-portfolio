import connectToDatabase from '@/lib/db/mongoose';
import Project from '@/lib/db/project.model';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaGithub, FaGlobe, FaGooglePlay, FaAppStoreIos, FaArrowLeft } from 'react-icons/fa';

async function getProject(id: string) {
    try {
        await connectToDatabase();
        const project = await Project.findById(id).lean();
        if (!project) return null;
        return JSON.parse(JSON.stringify(project));
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProject(id);
    if (!project) return { title: 'Project Not Found' };
    return {
        title: `${project.title} – Natnael Alemseged`,
        description: project.description,
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#0d0d0d] text-white pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <Link href="/#projects" className="inline-flex items-center text-[#00ff99] hover:underline mb-8">
                    <FaArrowLeft className="mr-2" /> Back to Projects
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#00ff99]">{project.title}</h1>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.techStack.map((tech: string) => (
                        <span key={tech} className="bg-gray-800 text-emerald-400 px-3 py-1 rounded-full text-sm font-semibold border border-emerald-900/30">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="grid gap-6 mb-12">
                    {project.images.map((img: string, idx: number) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                            <img
                                src={img}
                                alt={`${project.title} screenshot ${idx + 1}`}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-12">
                    {project.links.web && (
                        <a href={project.links.web} target="_blank" rel="noopener noreferrer" className="flex items-center bg-[#00ff99] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#00e68a] transition">
                            <FaGlobe className="mr-2" /> Visit Website
                        </a>
                    )}
                    {project.links.github && (
                        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center border border-[#00ff99] text-[#00ff99] px-6 py-3 rounded-lg font-bold hover:bg-[#00ff99] hover:text-black transition">
                            <FaGithub className="mr-2" /> View Code
                        </a>
                    )}
                    {project.links.playstore && project.links.playstore.map((link:string, index:string) => (
                        <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition border border-gray-700">
                            <FaGooglePlay className="mr-2 text-green-500" /> Play Store {project.links.playstore!.length > 1 ? (index + 1) : ''}
                        </a>
                    ))}
                    {project.links.appstore && project.links.appstore.map((link:string, index:string) => (
                        <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700 transition border border-gray-700">
                            <FaAppStoreIos className="mr-2 text-blue-500" /> App Store {project.links.appstore!.length > 1 ? (index + 1) : ''}
                        </a>
                    ))}
                </div>

                <div className="prose prose-invert max-w-none">
                    <h2 className="text-2xl font-bold text-[#00ff99] mb-4">About the Project</h2>
                    <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                        {project.content || project.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

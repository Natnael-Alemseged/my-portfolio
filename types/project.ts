export interface ProjectImage {
    url: string;
    alt: string;
    caption?: string;
    order?: number;
}

export interface ProjectLink {
    type: 'web' | 'github' | 'playstore' | 'appstore' | 'demo' | 'docs' | string;
    url: string;
    label?: string;
}

export interface ProjectMetrics {
    duration?: string;
    teamSize?: number;
    impact?: string;
}

export interface Project {
    _id?: string;
    slug: string;
    title: string;
    summary: string;
    role?: string;
    
    problem?: string;
    solution?: string;
    keyTakeaway?: string;
    
    content?: string;
    contentFormat?: 'markdown' | 'html';
    
    architecture?: string;
    features?: string[];
    
    techStack?: string[];
    tags?: string[];
    
    images?: ProjectImage[];
    links?: ProjectLink[];
    
    metrics?: ProjectMetrics;
    
    // SEO & Visibility
    featured?: boolean;
    status?: 'active' | 'archived' | 'in-progress';
    visibility?: 'public' | 'private' | 'unlisted';
    schemaType?: 'SoftwareApplication' | 'WebApplication' | 'MobileApplication' | 'CreativeWork';
    
    createdAt?: Date;
    updatedAt?: Date;
    publishedAt?: Date;
}

export interface ProjectFormData {
    title: string;
    summary: string;
    role: string;
    problem: string;
    solution: string;
    keyTakeaway: string;
    content: string;
    contentFormat: 'markdown' | 'html';
    architecture: string;
    features: string;
    techStack: string;
    tags: string;
    images: string; // JSON string of ProjectImage[]
    links: string; // JSON string of ProjectLink[]
    duration: string;
    teamSize: string;
    impact: string;
    featured: boolean;
    status: 'active' | 'archived' | 'in-progress';
    visibility: 'public' | 'private' | 'unlisted';
    schemaType: 'SoftwareApplication' | 'WebApplication' | 'MobileApplication' | 'CreativeWork';
}

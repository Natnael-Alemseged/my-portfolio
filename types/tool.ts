export interface Tool {
    id?: string;
    name?: string;
    slug?: string;
    link?: string;
    category?: string;
    description?: string;
    feature_list?: string[];
    keywords?: string[];
    pricing?: string;
    hasFreeVersion?: boolean;
    logoUrl?: string;
    image_url?: string[];
    contactName?: string;
    contactEmail?: string;
    createdAt?: string;
    updated_at?: string;
    status?: "pending" | "approved" | "rejected";
    isFeatured?: boolean;
    savedByUser?: boolean;
    // Fallback properties mentioned in comments/casts
    pricingPlans?: any[];
    reviews?: any[];
    relatedTools?: any[];
}

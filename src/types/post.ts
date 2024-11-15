import { ReactNode } from "react";

export interface PostAuthor {
  bio: ReactNode;
  github: any;
  name: string;
  role: string;
  avatar: string;
  twitter?: string;
  linkedin?: string;
}

export interface PostSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface PostSocial {
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
  };
  facebook?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

export interface PostSeries {
  previousSlug: any;
  nextSlug: any;
  name: string;
  order: number;
  totalParts: number;
}

export interface PostResource {
  type: string;
  url: string;
  title: string;
}

export interface PostChangelogEntry {
  date: string;
  changes: string[];
}

export interface PostData {
  // Basic Information
  title: string;
  subtitle?: string;
  date: string;
  lastUpdated?: string;
  description: string;

  // Media
  imageUrl: string;
  imageAlt?: string;
  videoUrl?: string;
  ogImage?: string;

  // Content Metadata
  readTime: string;
  wordCount?: number;
  language?: string;
  locale?: string;
  featured?: boolean;
  trending?: boolean;
  status: 'published' | 'draft' | 'archived';

  // Author Information
  author: PostAuthor;

  // Categorization
  category?: string;
  subcategories?: string[];
  tags?: string[];

  // SEO
  seo?: PostSEO;

  // Social Sharing
  social?: PostSocial;

  // Content Features
  toc?: boolean;
  mathjax?: boolean;
  mermaid?: boolean;
  codeHighlighting?: boolean;
  interactive?: boolean;

  // Reading Experience
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: {
    read: string;
    implement?: string;
  };
  prerequisites?: string[];

  // Engagement
  comments?: boolean;
  sharing?: boolean;
  newsletter?: boolean;
  relatedPosts?: string[];

  // Series Information
  series?: PostSeries;

  // Content Ratings
  rating?: {
    score: number;
    votes: number;
    featured: boolean;
  };

  // Technical Details
  techStack?: string[];
  codeRepo?: string;
  liveDemo?: string;

  // Learning Outcomes
  learningOutcomes?: string[];

  // Additional Resources
  resources?: PostResource[];

  // Version Control
  version?: string;
  changelog?: PostChangelogEntry[];

  // Internationalization
  translations?: Record<string, string>;

  // Monetization
  premium?: boolean;
  sponsoredBy?: string | null;
  affiliateLinks?: boolean;

  // Analytics
  pageType?: string;
  contentGroup?: string;
  funnel?: 'awareness' | 'consideration' | 'conversion';

  // Accessibility
  a11y?: {
    videoCaption: boolean;
    imageDescriptions: boolean;
    colorContrast: boolean;
  };

  // Print
  printable?: boolean;
  pdfVersion?: string;

  // Archive
  archived?: boolean;
  archiveReason?: string | null;
  archiveDate?: string | null;

  // Required by system
  content: string;
  slug: string;
  filepath: string;

  // Custom Metadata
  custom?: {
    showInNewsletter?: boolean;
    featuredInPodcast?: boolean;
    podcastEpisode?: string | null;
    webinarDate?: string | null;
    certification?: boolean;
  };
} 
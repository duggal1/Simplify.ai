export interface Author {
  name: string;
  github?: string;
  role?: string;
  avatar?: string;
  bio?: string;
}

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

export interface Social {
  facebook?: {
    title?: string;
    description?: string;
    image?: string;
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
  };
}

export interface Series {
  name: string;
  posts: PostData[];
}

export interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'github' | 'docs';
}

export interface ChangelogEntry {
  date: string;
  changes: string[];
}

export interface PostAuthor {
  name: string;
  avatar: string;
  bio: string;
  role: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
}

export interface PostData {
  slug: string;
  title: string;
  description?: string;
  content?: string;
  date: string;
  author?: PostAuthor;
  readTime?: string;
  wordCount?: number;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  social?: {
    facebook?: {
      title?: string;
      description?: string;
      image?: string;
    };
    twitter?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };
  ogImage?: string;
  imageUrl?: string;
  status: 'draft' | 'published' | 'archived';
  series?: Series;
  tableOfContents?: boolean;
  relatedPosts?: PostData[];
  resources?: Resource[];
  changelog?: ChangelogEntry[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  techStack?: string[];
  archived?: boolean;
}

export interface Post {
  title: string;
  description: string;
  content: string;
  date: string;
  imageUrl: string;
  readTime: string;
  author?: PostAuthor;
  tableOfContents?: boolean;
  archived?: boolean;
  relatedPosts?: Post[];
  series?: Series;
  resources?: Resource[];
  changelog?: ChangelogEntry[];
  difficulty?: string;
  techStack?: string[];
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
  social?: {
    facebook?: {
      title?: string;
      description?: string;
      image?: string;
    };
    twitter?: {
      title?: string;
      description?: string;
      image?: string;
    };
  };
  ogImage?: string;
  status?: 'published' | 'draft';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  metadata: {
    videoUrl: string;
    thumbnail: string;
    views: number;
    likes: number;
    publishedAt: string;
    channelTitle: string;
  };
  createdAt: Date;
  savedBy: string[];
  followers: string[];
  pageViews: number;
} 
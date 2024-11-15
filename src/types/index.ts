// Base interfaces
interface Author {
  name: string;
  image?: string;
  bio?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

interface SEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
}

interface Social {
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

interface Series {
  name: string;
  posts: PostData[];
}

interface Resource {
  title: string;
  url: string;
  type: 'article' | 'video' | 'github' | 'docs';
}

interface ChangelogEntry {
  date: string;
  changes: string[];
}

// Main PostData interface
interface PostData {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: Author;
  imageUrl: string;
  ogImage?: string;
  readTime: string;
  wordCount: number;
  tags?: string[];
  category?: string;
  status: 'draft' | 'published' | 'archived';
  seo?: SEO;
  social?: Social;
  series?: Series;
  tableOfContents?: boolean;
  relatedPosts?: PostData[];
  resources?: Resource[];
  changelog?: ChangelogEntry[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  techStack?: string[];
  archived?: boolean;
}

// Component Props
interface PostMetaProps {
  author: Author;
  date: string;
  readTime: string;
  wordCount: number;
}

interface ShareButtonsProps {
  post: PostData;
}

interface TableOfContentsProps {
  content: string;
}

interface AuthorCardProps {
  author: Author;
}

interface RelatedPostsProps {
  post: PostData;
  posts: PostData[];
  maxPosts?: number;
}

interface SeriesNavProps {
  series: Series;
  currentSlug: string;
}

interface ResourceLinksProps {
  resources: Resource[];
}

interface ChangelogSectionProps {
  changelog: ChangelogEntry[];
}

interface DifficultyBadgeProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TechStackListProps {
  stack: string[];
} 
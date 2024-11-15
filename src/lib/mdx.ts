import { glob } from 'glob';
import { join } from 'path';
import fs from 'fs';
import matter from 'gray-matter';

export interface Post {
  seo: any;
  tags: any;
  social: any;
  ogImage: any;
  archived: any;
  tableOfContents: any;
  relatedPosts: any;
  changelog: never[];
  series: any;
  resources: any;
  difficulty: any;
  techStack: any;
  slug: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
  readTime: string;
  content: string;
  categories?: string[];
  featured?: boolean;
  author?: {
    social: { github: string; twitter: string; linkedin: string; };
    bio: string;
    role: string;
    github: string;
    twitter: string;
    linkedin: string;
    name: string;
    avatar: string;
  };
}

const postsDirectory = join(process.cwd(), 'posts');
const cacheFile = join(process.cwd(), '.cache', 'readTimes.json');

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min`;
}

function loadCache(): Record<string, string> {
  if (fs.existsSync(cacheFile)) {
    return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
  }
  return {};
}

function saveCache(cache: Record<string, string>) {
  const cacheDir = join(process.cwd(), '.cache');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
}

function log(message: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message);
  }
}

export function getPostSlugs() {
  return glob.sync('**/*.mdx', { cwd: postsDirectory });
}

export function getPost(filepath: string): Post {
  const fullPath = join(postsDirectory, filepath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  let readTime = data.readTime;
  let updatedFrontMatter = false;

  if (!readTime) {
    log(`Calculating read time for: ${filepath}`);
    const cache = loadCache();
    if (cache[filepath]) {
      readTime = cache[filepath];
      log(`Read time found in cache: ${readTime}`);
    } else {
      readTime = calculateReadTime(content);
      cache[filepath] = readTime;
      saveCache(cache);
      log(`New read time calculated: ${readTime}`);
    }

    // Update front matter
    data.readTime = readTime;
    updatedFrontMatter = true;
  }

  if (updatedFrontMatter) {
    log(`Updating front matter for: ${filepath}`);
    const updatedFileContents = matter.stringify(content, data);
    fs.writeFileSync(fullPath, updatedFileContents);
    log(`Front matter updated for: ${filepath}`);
  }

  return {
    slug: filepath.replace(/\.mdx$/, ''),
    title: data.title,
    date: data.date,
    description: data.description,
    imageUrl: data.imageUrl || '/images/default-post-image.jpg',
    readTime,
    content,
    categories: data.categories || [],
    author: data.author ? {
      name: data.author.name || 'Simpily.AI',
      avatar: data.author.avatar || '/images/simplify.jpg',
      bio: data.author.bio,
      role: data.author.role,
      social: {
        github: data.author.github,
        twitter: data.author.twitter,
        linkedin: data.author.linkedin
      }
    } : undefined
  } as Post;
}

export async function getPosts(): Promise<Post[]> {
  const slugs = getPostSlugs();
  
  const posts = slugs.map((slug) => getPost(slug));

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await getPosts();
    return posts.find(post => post.slug === slug) || null;
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return null;
  }
}

export async function getFeaturedPosts(limit: number = 8): Promise<Post[]> {
  const allPosts = await getPosts();
  const featuredPosts = allPosts.filter((post) => Boolean(post.featured));
  return featuredPosts.slice(0, limit);
}
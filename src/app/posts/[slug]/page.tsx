import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { headers } from 'next/headers';

// Import types
import { 
  PostData, 
  Author, 
  Series, 
  Resource, 
  ChangelogEntry,
  Post,
  PostAuthor
} from '@/types/blog';

// Component imports
import { getPostBySlug } from '@/lib/mdx';
import markdownToHtml from '@/lib/markdownToHTML';
import PostImage from '@/components/PostImage';
import TableOfContents from '@/components/TableOfContents';
import AuthorCard from '@/components/AuthorCard';
import ShareButtons from '@/components/ShareButtons';
import PostMeta from '@/components/PostMeta';
import SeriesNav from '@/components/SeriesNav';
import ResourceLinks from '@/components/ResourceLinks';
import ChangelogSection from '@/components/ChangelogSection';
import DifficultyBadge from '@/components/DifficultyBadge';
import TechStackList from '@/components/TechStackList';
import NewsletterSignup from '@/components/NewsletterSignup';
import ScrollTracker from '@/components/ScrollTracker';
import Navbar from '@/components/navigation/navbar';
import UltraModernSVGGradientBg from '@/components/blogsvg';
import BlogViewsIcon from '@/public/images/svg/BlogViewsIcon.svg';
import ReadTimeIcon from '@/public/images/svg/ReadTimeIcon.svg';
import RelatedPosts from '@/components/RelatedPosts';
import GradientBg from '@/components/blogsvg';
import Sidebar from '@/components/dashboard/sidebar';

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata(
  { params }: PageProps,
): Promise<Metadata> {
  try {
    const slug = params.slug;
    const post = await getPostBySlug(slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested post could not be found.'
      };
    }

    return {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.description,
      keywords: post.seo?.keywords || post.tags,
      openGraph: {
        title: post.social?.facebook?.title || post.title,
        description: post.social?.facebook?.description || post.description,
        images: [post.social?.facebook?.image || post.ogImage || post.imageUrl].filter(Boolean),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.social?.twitter?.title || post.title,
        description: post.social?.twitter?.description || post.description,
        images: [post.social?.twitter?.image || post.ogImage || post.imageUrl].filter(Boolean),
      },
      alternates: {
        canonical: post.seo?.canonicalUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'An error occurred while loading the post.'
    };
  }
}

export default async function PostLayout({ params }: PageProps) {
  try {
    const slug = params.slug;
    const post = await getPostBySlug(slug);
    
    if (!post) {
      notFound();
    }

    const htmlContent = await markdownToHtml(post.content || '');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

    return (
      <div className="relative overflow-x-hidden">
        <ScrollTracker />
        
        <div className="sticky top-0 z-50 transition-all duration-500 backdrop-blur-xl bg-gradient-to-r from-black to-gray-950/70">
          <Navbar />
        </div>
        
        <GradientBg />

        <article className="mx-auto max-w-5xl py-8 text-white px-4 relative">
          {/* Header Section */}
          <div className="relative z-10 mb-8 mt-10 px-2 text-center">
            <h1 className="inline-block bg-gradient-to-r from-blue-600 via-pink-700 to-purple-700 bg-clip-text text-7xl font-extrabold text-transparent lg:text-8xl mt-32 transition-all duration-300 hover:scale-105 hover:from-black  hover:via-purple-700 hover:to-blue-600">
              {post.title}
            </h1>
            
            <p className="mb-10 mt-4 text-lg text-white/90 lg:text-2xl font-semibold tracking-wide leading-relaxed animate-fadeIn delay-200">
              {post.description}
            </p>

            {/* Featured Image with Enhanced Effects */}
            <div className="relative group">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={1000}
                height={1000}
                className="rounded-3xl shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-purple-500/50"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-black/0 via-black/20 to-black/80 opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
              
              {/* Post Meta Info with Hover Effects */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white/90 transition-transform duration-300 group-hover:translate-y-[-8px]">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4 text-sm lg:text-xl">
                    <div className="flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
                      <Image
                        src={ReadTimeIcon}
                        alt="Read Time"
                        width={20}
                        height={20}
                        className="transition-transform hover:scale-110"
                      />
                      <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text font-bold text-transparent">
                        {post.readTime} read
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2 backdrop-blur-sm">
                      <Image
                        src={BlogViewsIcon}
                        alt="Blog Views"
                        width={20}
                        height={20}
                        className="transition-transform hover:scale-110"
                      />
                      <span className="bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text font-bold text-transparent">
                        53,000 views
                      </span>
                    </div>
                  </div>
                  
                  {/* Date Information */}
                  <div className="flex flex-col space-y-2 bg-black/30 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-center space-x-2 text-sm lg:text-lg">
                      <span className="text-gray-300">Written on</span>
                      <time dateTime={post.date} className="font-semibold text-white">
                        {format(parseISO(post.date), 'LLLL d, yyyy')}
                      </time>
                      <span className="font-bold text-purple-300">SIMPLIFY.AI⚡️</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-300">
                      <span>Last updated</span>
                      <time dateTime={post.date} className="font-semibold text-white">
                        {format(parseISO(post.date), 'LLLL d, yyyy')}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="article-content space-y-8 relative z-20">
            {post.archived && (
              <div className="bg-yellow-400/10 backdrop-blur-xl px-8 py-6 text-center rounded-3xl border border-yellow-400/20 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-yellow-400/15">
                <span className="font-extrabold text-xl text-yellow-300">This article is archived</span>
              </div>
            )}

            {/* Table of Contents */}
            {post.tableOfContents && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <TableOfContents content={htmlContent} />
              </div>
            )}

            {/* Main Content */}
            <div 
              className="prose prose-lg prose-invert mx-auto bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.01] hover:bg-white/10 
              prose-headings:text-gradient prose-a:text-blue-400 prose-strong:text-white/90 prose-code:text-pink-300" 
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />

            {/* Additional Components with Enhanced Styling */}
            {post.author && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <AuthorCard 
                  author={{
                    name: post.author.name,
                    avatar: post.author.avatar,
                    bio: post.author.bio || 'AI Developer and Technical Writer',
                    role: post.author.role || 'Content Creator',
                    social: post.author.social || {
                      github: '',
                      twitter: '',
                      linkedin: ''
                    },
                  }} 
                />
              </div>
            )}
          
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
              <ShareButtons 
                post={{ 
                  ...post, 
                  status: 'published', 
                  filepath: post.slug, // Assuming 'slug' can be used as 'filepath'
                  author: {
                    name: post.author?.name || '',
                    avatar: post.author?.avatar || '',
                    bio: post.author?.bio || 'AI Developer and Technical Writer',
                    role: post.author?.role || 'Content Creator',
                    github: undefined
                  }
                }} 
              />
              <ChangelogSection changelog={post.changelog || []} />
            </div>
            {post.series && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <SeriesNav 
                  series={post.series}
                  currentSlug={params.slug}
                />
              </div>
            )}

            {post.resources && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <ResourceLinks resources={post.resources || []} />
              </div>
            )}
            
            {post.changelog && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <ChangelogSection changelog={post.changelog} />
              </div>
            )}
            
            {post.difficulty && (
              <div className="mt-10">
                <DifficultyBadge difficulty={post.difficulty} />
              </div>
            )}
            
            {post.techStack && (
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
                <TechStackList stack={post.techStack || []} />
              </div>
            )}
            
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/10">
              <NewsletterSignup />
            </div>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Error in PostLayout:', error);
    notFound();
  }
}

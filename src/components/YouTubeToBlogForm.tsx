"use client"
import React, { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardIcon, CheckIcon, EyeIcon, HeartIcon, CalendarIcon, UserIcon, LinkIcon } from '@heroicons/react/24/outline';
import Confetti from 'react-confetti';
import { Toaster, toast } from 'react-hot-toast';
import { YouTubeMetadata } from '@/types/youtube';
import { fetchYouTubeMetadata } from '@/utils/youtube';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import slugify from 'slugify';
import Link from 'next/link';

interface BlogPostResponse {
  blogPost: string;
  error?: string;
  slug?: string;
}

const youtubeUrlSchema = z.string().url().refine((url) => {
  return /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/.test(url);
}, "Please enter a valid YouTube URL");

const cleanGeneratedContent = (content: string): string => {
  return content
    .replace(/[#*`]/g, '')  // Remove markdown characters
    .replace(/^\s*[-•]\s*/gm, '') // Remove list markers
    .replace(/\n{3,}/g, '\n\n')  // Normalize line breaks
    .replace(/^(#{1,6})\s/gm, '') // Remove heading markers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markers
    .replace(/^[-+*]\s/gm, '') // Remove list markers
    .trim();
};

const YouTubeToBlogForm = (): JSX.Element => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [blogPost, setBlogPost] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('Generating...');
  const router = useRouter();
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
  const [generatedSlug, setGeneratedSlug] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      const texts = [
        "✨ AI is crafting your blog...",
        "🎥 Analyzing your video...",
        "🪄 Sprinkling some magic...",
        "📝 Almost there...",
        "🎨 Adding final touches..."
      ];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[index % texts.length]);
        index++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    try {
      youtubeUrlSchema.parse(url);
      setIsValidUrl(true);
    } catch {
      setIsValidUrl(false);
    }
  };

  const handleGenerateContent = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoUrl
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        toast.error(data.error);
        return;
      }

      // Clean the content thoroughly before setting it
      const cleanedContent = cleanGeneratedContent(data.blogPost);
      setBlogPost(cleanedContent);
      setGeneratedSlug(data.slug);
      setShowConfetti(true);
      
      // Save to localStorage with cleaned content
      const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
      const newPost = {
        id: nanoid(),
        slug: data.slug,
        title: metadata?.title || 'Untitled',
        content: cleanedContent, // Use cleaned content
        metadata: metadata,
        createdAt: new Date().toISOString(),
        savedBy: [],
        followers: [],
        pageViews: 0
      };
      
      localStorage.setItem('blogPosts', JSON.stringify([...savedPosts, newPost]));
      toast.success('Blog post generated successfully!');
      
    } catch (error) {
      setError('Failed to generate blog post');
      toast.error('Failed to generate blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBlogContent = (content: string): ReactNode[] => {
    return content.split('\n\n').map((block, index) => {
      // Main title (first block)
      if (index === 0) {
        return (
          <motion.h1
            key={`title-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-gray-900 mb-12 leading-tight tracking-tight"
          >
            {block}
          </motion.h1>
        );
      }

      // Section headings (shorter blocks with specific endings)
      if (block.length < 100 && (
        block.endsWith('?') || 
        block.includes('Introduction') || 
        block.includes('Conclusion') ||
        /^[A-Z][^.!?]*[:?]/.test(block)
      )) {
        return (
          <motion.h2
            key={`section-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-800 mt-16 mb-8 flex items-center gap-4 group"
          >
            <div className="flex-shrink-0 w-1.5 h-8 bg-gradient-to-b from-blue-500 via-pink-500 to-cyan-600 rounded-full transform origin-center group-hover:scale-y-125 transition-transform duration-300"/>
            {block}
          </motion.h2>
        );
      }

      // List items (shorter blocks starting with common list indicators)
      if (block.length < 200 && /^[•\-–—]|\d+\./.test(block)) {
        return (
          <motion.div
            key={`list-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 my-6 pl-4 group"
          >
            <span className="flex-shrink-0 w-2 h-2 mt-3 rounded-full bg-purple-600/60 group-hover:bg-purple-600 transition-colors duration-300"/>
            <span className="text-lg text-gray-700 leading-relaxed">
              {block.replace(/^[•\-–—]\s*|\d+\.\s*/, '')}
            </span>
          </motion.div>
        );
      }

      // Regular paragraphs
      return (
        <motion.p
          key={`paragraph-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="text-lg text-gray-700 leading-relaxed my-8 
            first-letter:text-4xl first-letter:font-bold first-letter:text-gray-900
            first-letter:mr-3 first-letter:float-left first-letter:leading-3"
        >
          {block}
        </motion.p>
      );
    });
  };

  const generateUniqueSlug = (title: string): string => {
    const uniqueId = nanoid(8);
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      trim: true,
      replacement: '-'
    });
    return `${baseSlug}-${uniqueId}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    setIsLoading(true);
    setError(null);
    setBlogPost(null);
    setMetadata(null);
    setGeneratedSlug(null);

    try {
      const response = await fetch('/api/generateBlogPost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate blog post...we r sorry');
      }

      setBlogPost(data.blogPost);
      setMetadata(data.metadata);

      if (data.metadata?.title) {
        const slug = generateUniqueSlug(data.metadata.title);
        setGeneratedSlug(slug);

        const blogData = {
          id: nanoid(),
          slug,
          title: data.metadata.title,
          content: data.blogPost,
          metadata: data.metadata,
          createdAt: new Date().toISOString(),
        };

        const savedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        localStorage.setItem('blogPosts', JSON.stringify([...savedPosts, blogData]));
      }

      toast.success('Blog post generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (): Promise<void> => {
    if (blogPost) {
      try {
        await navigator.clipboard.writeText(blogPost);
        setCopied(true);
        setShowConfetti(true);
        toast.success('Copied to clipboard!');
        setTimeout(() => {
          setCopied(false);
          setShowConfetti(false);
        }, 3000);
      } catch (error) {
        toast.error('Failed to copy to clipboard');
      }
    }
  };

  const handleGetUrl = () => {
    if (generatedSlug) {
      const currentPath = window.location.pathname;
      router.push(`${currentPath}/${generatedSlug}`);
    }
  };

  const copyBlogUrl = async () => {
    if (generatedSlug) {
      const baseUrl = window.location.origin;
      const blogUrl = `${baseUrl}/dashboard/youtube-blogs/${generatedSlug}`;
      
      try {
        await navigator.clipboard.writeText(blogUrl);
        toast.success('Blog URL copied to clipboard!', {
          icon: '🔗',
          style: {
            background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
            color: 'white',
            borderRadius: '1rem',
          },
        });
      } catch (error) {
        toast.error('Failed to copy URL');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-blue-800/60 hover:shadow-purple-500/20 transition-all duration-500"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label 
              htmlFor="videoUrl" 
              className="block text-lg font-semibold text-gray-800 mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            >
              YouTube Video URL
            </label>
            <input
              type="url"
              id="videoUrl"
              value={videoUrl}
              onChange={handleUrlChange}
              placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
              className="w-full px-6 py-3 rounded-xl border border-gray-200
                       focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500
                       transition-all duration-300 text-lg shadow-inner
                       bg-white/50 backdrop-blur-sm hover:bg-white/80 text-gray-800"
              required
            />
          </div>
          
          <motion.button
            type="submit"
            disabled={isLoading || !isValidUrl}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full py-4 px-6 rounded-xl
              relative overflow-hidden
              ${!isValidUrl 
                ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                : isLoading 
                  ? 'bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-600'
                  : 'bg-gradient-to-r from-pink-500 via-cyan-400 to-purple-600 hover:from-pink-600 hover:via-cyan-500 hover:to-purple-700'
              }
              text-white font-bold text-lg
              transition-all duration-300
              shadow-xl hover:shadow-2xl
              hover:shadow-cyan-500/30
              before:absolute before:inset-0
              before:bg-gradient-to-r before:from-pink-400/20 before:via-cyan-500/20 before:to-blue-500/20
              before:animate-gradient-shift before:blur-xl
              after:absolute after:inset-0
              after:bg-gradient-to-r after:from-pink-600/50 after:via-cyan-400/50 after:to-blue-600/50
              after:opacity-0 after:hover:opacity-100 after:transition-opacity after:duration-500
              group
              border border-white/20 backdrop-blur-lg
              [text-shadow:_0_1px_10px_rgb(255_255_255_/_40%)]
            `}
          >
            <span className="relative z-10 flex items-center justify-center space-x-3">
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent
                               rounded-full animate-spin
                               shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                  <span className="animate-pulse">
                    {loadingText}
                  </span>
                </>
              ) : (
                <span className="
                  bg-clip-text text-transparent 
                  bg-gradient-to-r from-pink-700 via-cyan-100 to-blue-200
                  animate-gradient-text
                  group-hover:from-pink-100 group-hover:via-cyan-100 group-hover:to-blue-200
                ">
                  Generate Blog Post
                </span>
              )}
            
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-cyan-500/20 to-blue-600/20 blur-2xl animate-pulse" />
          </motion.button>
        </form>

        {isLoading && (
          <div className="mt-8">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500
                         transition-all duration-500 ease-out animate-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-base text-gray-500 mt-3 text-center font-medium">
              {progress}% complete
            </p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-700 font-medium shadow-xl"
          >
            {error}
          </motion.div>
        )}

        {blogPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl shadow-lg overflow-hidden"
          >
            <div className="flex justify-between items-center px-8 py-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                Generated Blog Post
              </h2>
              <div className="flex space-x-4">
                <motion.button
                  onClick={copyToClipboard}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg
                    ${copied ? 'bg-green-500' : 'bg-cyan-600'} 
                    text-white font-medium transition-colors
                  `}
                >
                  {copied ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <ClipboardIcon className="h-5 w-5" />
                  )}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </motion.button>

                <motion.button
                  onClick={copyBlogUrl}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    flex items-center space-x-2 px-4 py-2 rounded-lg
                    bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700
                    hover:from-indigo-700 hover:via-purple-700 hover:to-purple-800
                    text-white font-medium
                    transition-all duration-300
                    border border-purple-400/30
                    shadow-lg shadow-purple-500/30
                    backdrop-blur-sm
                    relative overflow-hidden
                    group
                  "
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-fuchsia-500/20 to-pink-500/20 blur-xl group-hover:opacity-75 transition-opacity duration-300" />
                  <LinkIcon className="h-5 w-5 relative z-10 animate-pulse" />
                  <span className="relative z-10">Copy URL</span>
                  <div className="absolute -inset-px bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl" />
                </motion.button>

                <motion.button
                  onClick={handleGetUrl}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-purple-600 text-white font-medium"
                >
                  <LinkIcon className="h-5 w-5" />
                  <span>View Blog</span>
                </motion.button>
              </div>
            </div>
            
            {metadata && (
              <div className="relative h-[400px]">
                <img 
                  src={metadata.thumbnail}
                  alt={metadata.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h1 className="text-3xl font-bold mb-4">{metadata.title}</h1>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <EyeIcon className="h-4 w-4" />
                        <span>{metadata.views} views</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HeartIcon className="h-4 w-4" />
                        <span>{metadata.likes} likes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{metadata.publishedAt}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <UserIcon className="h-4 w-4" />
                        <span>{metadata.channelTitle}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <article className="px-8 py-12 max-w-4xl mx-auto">
              <div className="space-y-6 [&>*:first-child]:mt-0">
                {formatBlogContent(blogPost)}
              </div>
            </article>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
          colors={['#8B5CF6', '#6366F1', '#4F46E5', '#7C3AED']}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        />
      )}
    </div>
  );
};

export default YouTubeToBlogForm;

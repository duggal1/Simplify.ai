'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronRightIcon, SparklesIcon, FireIcon, BookmarkIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navigation/navbar';
import Sidebar from '@/components/dashboard/sidebar';
import { Post } from '@/lib/mdx';
import toast, { Toaster } from 'react-hot-toast';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { z } from 'zod';


interface SearchResultsProps {
  filteredPosts: Post[];
  searchQuery: string;
  onClose: () => void;
}

const SearchResults = ({ filteredPosts, searchQuery, onClose }: SearchResultsProps) => {
  if (!searchQuery) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-auto rounded-2xl border border-purple-500/20 bg-white/10 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex justify-between items-center p-4 border-b border-purple-500/20">
          <span className="text-gray-900">Found {filteredPosts.length} results</span>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XCircleIcon className="h-5 w-5" />
          </button>
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="p-4 space-y-4">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="block transform transition-all duration-300 hover:scale-[1.02]"
              >
                <motion.div
                  layout
                  className="flex items-center space-x-4 rounded-xl bg-white/5 p-4 hover:bg-white/10"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={post.imageUrl || '/images/default-post-image.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {highlightMatch(post.title, searchQuery)}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                      {highlightMatch(post.description, searchQuery)}
                    </p>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mx-auto mb-4 h-16 w-16 rounded-full bg-purple-900/50 p-4"
            >
              <SparklesIcon className="h-8 w-8 text-purple-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white">No results found</h3>
            <p className="mt-1 text-gray-400">
              Try adjusting your search to find what you&apos;re looking for
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

const highlightMatch = (text: string, query: string) => {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} className="bg-purple-500/30 px-1 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

const emailSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email is too short')
    .max(100, 'Email is too long'),
});

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = !searchQuery || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || 
        post.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const categories = ['AI & ML', 'Web3', 'DevOps', 'Cloud'];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = emailSchema.parse({ email });
      
      setIsSubmitting(true);
      setInputDisabled(true);

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: validatedData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      toast.success(
        <div className="flex flex-col gap-1">
          <p className="font-semibold">Welcome to our community! 🎉</p>
          <p className="text-sm">We&apos;ll be in touch soon at {email}</p>
        </div>,
        {
          duration: 6000,
          style: {
            background: 'linear-gradient(to right, #4F46E5, #7C3AED)',
            color: 'white',
          },
        }
      );

      setIsSubscribed(true);
      setEmail('');

    } catch (error) {
      setInputDisabled(false);
      
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-black">
        <Navbar/>
      </div>
      <div className="flex min-h-screen bg-white">
        <Sidebar/>
        <div>
        
          <div className="relative z-10 min-h-screen px-6 py-24">
     
            {/* Animated Background Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            
            <div className="relative z-10 px-6 py-24">
              <div className="mx-auto max-w-[1440px] animate-fade-in space-y-16">
                {/* Header Section */}
                <div className="space-y-8">
                  <h1 className="animate-text bg-gradient-to-r from-emerald-400 via-fuchsia-500 to-amber-500 bg-clip-text text-center text-7xl font-black tracking-tighter text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]">
                    Latest Posts
                  </h1>
                  
                  {/* Featured Categories */}
                  <div className="flex flex-wrap justify-center gap-6">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={`group relative overflow-hidden rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 px-6 py-2 transition-all duration-300 hover:scale-110 hover:shadow-[0_0_2rem_-0.5rem_#8b5cf6] hover:shadow-purple-500 ${
                          selectedCategory === category ? 'ring-2 ring-purple-500' : ''
                        }`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-70" />
                        <div className="absolute -inset-x-2 -inset-y-2 hidden animate-[spin_4s_linear_infinite] rounded-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 group-hover:block" />
                        <div className="absolute inset-0.5 rounded-full bg-white group-hover:bg-opacity-90" />
                        <span className="relative z-10 text-sm font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-300 group-hover:text-lg">
                          {category}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Search and Filter Section */}
                  <div className="mx-auto max-w-2xl relative">
                    <div className="relative group">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search articles..."
                        className="w-full rounded-2xl text-slate-900 outline-none ring-2 ring-pink-400 bg-white/5 px-6 py-4 pl-12 placeholder-gray-900 backdrop-blur-xl transition-all duration-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 transform">
                        <SparklesIcon className="h-5 w-5 text-purple-400" />
                      </div>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 transform"
                        >
                          <XCircleIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                    
                    {/* Search Results */}
                    <SearchResults 
                      filteredPosts={filteredPosts}
                      searchQuery={searchQuery}
                      onClose={() => setSearchQuery('')}
                    />
                  </div>
                </div>
              </div>

              {/* Featured Post */}
              {posts[0] && (
                <Link href={`/posts/${posts[0].slug}`}>
                  <div className="group relative overflow-hidden mt-24 rounded-3xl bg-gradient-to-br from-rose-600 via-blue-600 to-purple-600  p-1">
                    <div className="absolute inset-0 " />
                    <div className="relative flex flex-col lg:flex-row">
                      <div className="relative aspect-video w-full lg:w-2/3">
                        <Image
                          src={posts[0].imageUrl || '/images/default-post-image.jpg'}
                          alt={posts[0].title}
                          fill
                          className="rounded-t-2xl object-cover lg:rounded-l-2xl lg:rounded-tr-none"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-8">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <FireIcon className="h-5 w-5 text-amber-500" />
                            <span className="text-sm font-medium text-amber-400">Featured Post</span>
                          </div>
                          <h2 className="text-3xl font-bold text-white">{posts[0].title}</h2>
                          <p className="text-gray-300">{posts[0].description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Posts Grid */}
              <div className="grid grid-cols-1 mt-20 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.slice(1).map((post) => (
                  <Link 
                    key={post.slug} 
                    href={`/posts/${post.slug}`} 
                    className="group relative block transform transition-all duration-700 hover:scale-[1.02]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-900/90 to-black/95 shadow-[0_8px_32px_rgba(31,41,55,0.2)] backdrop-blur-xl transition-all duration-700 hover:shadow-[0_20px_60px_rgba(168,85,247,0.3)]">
                      <div className="relative h-full w-full overflow-hidden">
                        <Image
                          src={post.imageUrl || '/images/default-post-image.jpg'}
                          alt={post.title}
                          fill
                          className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:blur-[1px]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent backdrop-blur-sm transition-all duration-700 group-hover:from-black/90" />
                        
                        {/* Bookmark Button */}
                        <button className="absolute right-4 top-4 rounded-full bg-black/20 p-2 backdrop-blur-xl transition-all duration-300 hover:bg-black/40">
                          <BookmarkIcon className="h-5 w-5 text-white" />
                        </button>
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-end p-10">
                        <div className="transform space-y-6 transition-all duration-500 group-hover:translate-y-[-8px]">
                          {/* Author Info */}
                          <div className="flex items-center space-x-4">
                            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-purple-500/40 ring-offset-2 ring-offset-black/50 transition-all duration-300 group-hover:ring-purple-400/60">
                              <Image
                                src="/images/simplify.jpg"
                                alt="Author avatar"
                                fill
                                className="rounded-full bg-white/10 object-cover backdrop-blur-xl"
                              />
                            </div>
                            <span className=" font-bold text-xl text-gray-200 backdrop-blur-sm">
                              Written by{" "}
                              <span className="bg-gradient-to-r  text-xl from-blue-600 via-purple-600 to-pink-500 bg-clip-text font-extrabold text-transparent">
                                Simpily.AI
                              </span>
                            </span>
                          </div>

                          {/* Post Title */}
                          <h3 className="text-3xl font-bold leading-tight tracking-tight text-white transition-colors duration-500 group-hover:text-purple-400/90">
                            {post.title}
                          </h3>

                          {/* Post Meta */}
                          <div className="flex items-center space-x-4 text-sm text-gray-400/80">
                            <span className="rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-xl transition-colors duration-300 group-hover:bg-purple-500/20">
                              {post.readTime}
                            </span>
                            <time dateTime={post.date} className="font-light tracking-wider">
                              {post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : 'Date not available'}
                            </time>
                          </div>

                          {/* Post Description */}
                          <p className="line-clamp-2 text-base leading-relaxed text-gray-300/70 backdrop-blur-sm">
                            {post.description}
                          </p>

                          {/* Read More Link */}
                          <div className="inline-flex items-center space-x-2 text-purple-400/90 transition-all duration-500 group-hover:translate-x-3">
                            <span className="font-medium tracking-wide">Read article</span>
                            <ChevronRightIcon className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Newsletter Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden mt-20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 opacity-90" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
                
                <div className="relative p-12 text-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {isSubscribed ? (
                      <>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mx-auto mb-6 h-16 w-16 rounded-full bg-green-500/20 p-3"
                        >
                          <svg
                            className="h-full w-full text-green-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                        <h3 className="text-4xl font-bold text-white mb-4">
                          Thank You for Subscribing!
                        </h3>
                        <p className="text-lg text-gray-200 max-w-md mx-auto">
                          We&apos;ll be in touch soon with exciting updates and exclusive content.
                          Check your inbox for a welcome message!
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-xl mb-4">
                          <EnvelopeIcon className="h-6 w-6 text-white" />
                        </span>
                        <h3 className="text-4xl font-bold text-white mb-4">
                          Stay Updated
                        </h3>
                        <p className="text-lg text-gray-200 max-w-md mx-auto">
                          Join our newsletter for the latest updates and exclusive content.
                          No spam, unsubscribe at any time.
                        </p>
                      </>
                    )}
                  </motion.div>

                  {!isSubscribed && (
                    <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-8 max-w-md">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={inputDisabled}
                            className="w-full h-14 rounded-xl bg-white/10 px-6 pl-12 text-white 
                                     placeholder-gray-300 backdrop-blur-xl transition-all duration-300 
                                     border border-white/10 focus:border-white/20
                                     focus:outline-none focus:ring-2 focus:ring-purple-500/50
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-gray-300" />
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={isSubmitting}
                          className={`h-14 rounded-xl px-8 font-medium text-white transition-all duration-300
                                   ${isSubmitting 
                                     ? 'bg-purple-400 cursor-not-allowed' 
                                     : 'bg-purple-500 hover:bg-purple-600 hover:shadow-lg hover:shadow-purple-500/30'
                                   }
                                   disabled:opacity-70`}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                              <span>Subscribing...</span>
                            </div>
                          ) : (
                            'Subscribe Now'
                          )}
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '1rem',
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: '#9333EA',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
}

'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { ChevronRightIcon, SparklesIcon, FireIcon, BookmarkIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/sidebar';
import { Post } from '@/lib/mdx';


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
          <span className="text-gray-200">Found {filteredPosts.length} results</span>
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

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <>
   
        <div className=" min-h-screen bg-transparent">
          <div className="relative z-10 px-6 py-24">
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
              <div className="grid grid-cols-4 mt-20 gap-12 md:grid-cols-6 lg:grid-cols-3">
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
              <div className="rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 p-12 text-center mt-20">
                <h3 className="text-3xl font-bold text-white">Stay Updated</h3>
                <p className="mt-4 text-gray-300">Get the latest articles delivered right to your inbox</p>
                <div className="mx-auto mt-8 max-w-md">
                  <div className="flex space-x-4">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full rounded-xl bg-white/5 px-6 py-3 text-white placeholder-gray-400 backdrop-blur-xl transition-all duration-300 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <button className="rounded-xl bg-purple-500 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-purple-600">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

    </div>
    </>
  );
}

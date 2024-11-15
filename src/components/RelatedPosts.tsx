'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PostData } from '@/types/post';
import { useEffect, useState } from 'react';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4
    }
  }
};

interface RelatedPostsProps {
  post: PostData;
  posts: PostData[];
  maxPosts?: number;
}

export default function RelatedPosts({ 
  post, 
  posts,
  maxPosts = 3 
}: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const findRelatedPosts = () => {
      const otherPosts = posts.filter(p => p.slug !== post.slug);

      const scoredPosts = otherPosts.map(p => {
        let score = 0;

        if (p.category === post.category) {
          score += 10;
        }

        const commonTags = p.tags?.filter(tag => 
          post.tags?.includes(tag)
        ) || [];
        score += commonTags.length * 5;

        if (p.author.name === post.author.name) {
          score += 3;
        }

        const postDate = new Date(p.date);
        const currentDate = new Date(post.date);
        const daysDifference = Math.abs(
          (postDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
        );
        score += Math.max(0, 5 - daysDifference / 30);

        if (p.series?.name === post.series?.name) {
          score += 8;
        }

        const commonTech = p.techStack?.filter(tech => 
          post.techStack?.includes(tech)
        ) || [];
        score += commonTech.length * 2;

        return { post: p, score };
      });

      const topPosts = scoredPosts
        .sort((a, b) => b.score - a.score)
        .slice(0, maxPosts)
        .map(item => item.post);

      setRelatedPosts(topPosts);
      setIsLoading(false);
    };

    findRelatedPosts();
  }, [post, posts, maxPosts]);

  if (isLoading) {
    return (
      <div className="my-16 px-4">
        <h2 className="mb-8 text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Related Articles</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(maxPosts)].map((_, i) => (
            <div 
              key={i}
              className="animate-pulse rounded-2xl bg-gradient-to-r from-purple-100/80 via-pink-100/80 to-blue-100/80 shadow-2xl backdrop-blur-xl p-1"
            >
              <div className="h-[400px] rounded-xl bg-white/80" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="my-16 px-4">
      <h2 className="mb-8 text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">Related Articles</h2>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        {relatedPosts.map((post) => (
          <motion.div
            key={post.slug}
            variants={item}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-100/80 via-pink-100/80 to-blue-100/80 p-1 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:shadow-purple-500/20 backdrop-blur-xl"
          >
            <Link href={`/posts/${post.slug}`} className="block h-full rounded-xl bg-white/80 backdrop-blur-2xl">
              <div className="relative h-52 overflow-hidden rounded-t-xl">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
                
                <div className="absolute left-4 top-4 flex gap-3">
                  {post.category && (
                    <span className="rounded-full bg-gradient-to-r from-purple-600/90 to-pink-600/90 px-4 py-1.5 text-sm font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:shadow-xl">
                      {post.category}
                    </span>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map(tag => (
                      <span 
                        key={tag}
                        className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:bg-black/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover:bg-black/50">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex h-[calc(100%-13rem)] flex-col justify-between p-6">
                <div>
                  <h3 className="mb-3 text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-700 group-hover:to-pink-700">
                    {post.title}
                  </h3>
                  
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600/90">
                    {post.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full ring-2 ring-purple-200/50 transition-all duration-300 group-hover:ring-purple-300/80">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700/90">
                      {post.author.name}
                    </span>
                  </div>

                  <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1.5 text-sm font-semibold text-purple-700 transition-all duration-300 group-hover:from-purple-200 group-hover:to-pink-200">
                    Read more
                    <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
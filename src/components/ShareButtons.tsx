'use client';

import { motion } from 'framer-motion';
import { Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import { useState } from 'react';
import { PostData } from '@/types/post';

export default function ShareButtons({ post }: { post: PostData }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out "${post?.title || ''}" by ${post?.author?.name || ''}`;

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'from-blue-400 to-sky-500',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'Facebook',
      icon: Facebook, 
      color: 'from-blue-600 to-indigo-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'from-blue-700 to-blue-900',
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        shareUrl
      )}&title=${encodeURIComponent(post?.title || '')}`,
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      className="my-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] backdrop-blur-xl border border-purple-500/20 hover:shadow-[0_0_80px_rgba(139,92,246,0.4)] transition-all duration-500 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500" />
      
      <div className="relative">
        <h3 className="mb-8 text-2xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
          Share this article
        </h3>
        
        <div className="flex justify-center gap-6">
          {shareLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur opacity-60 group-hover:opacity-100 animate-pulse transition-all duration-500" />
              <div className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${link.color} p-0.5 shadow-lg shadow-purple-500/30 backdrop-blur-xl border border-white/10 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300`}>
                <link.icon className="h-6 w-6 text-white/90 group-hover:text-white transition-colors duration-300" />
              </div>
            </motion.a>
          ))}
          
          <motion.button
            onClick={copyToClipboard}
            className="group relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur opacity-60 group-hover:opacity-100 animate-pulse transition-all duration-500" />
            <div className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${copied ? 'from-green-400 to-emerald-600' : 'from-gray-600 to-gray-800'} p-0.5 shadow-lg shadow-purple-500/30 backdrop-blur-xl border border-white/10 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300`}>
              <Link2 className="h-6 w-6 text-white/90 group-hover:text-white transition-colors duration-300" />
            </div>
          </motion.button>
        </div>

        {copied && (
          <motion.div
            className="mt-6 text-center"
          >
            <span className="rounded-full bg-gradient-to-r from-green-400/90 to-emerald-600/90 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-green-500/30 backdrop-blur-md">
              Link copied to clipboard!
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
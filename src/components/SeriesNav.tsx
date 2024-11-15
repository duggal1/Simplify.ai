'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PostSeries } from '@/types/post';

interface SeriesNavProps {
  series: PostSeries;
  currentSlug: string;
}

export default function SeriesNav({ series }: SeriesNavProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollTop / documentHeight) * 100);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 p-8 shadow-lg backdrop-blur-xl border border-purple-500/20 group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500" />
      
      <div className="relative">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">
            Part {series.order} of {series.totalParts}
          </h3>
          <div className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200">
            {series.name}
          </div>
        </div>

        <div className="mb-8 h-4 rounded-full bg-gradient-to-r from-purple-900/50 via-indigo-900/50 to-blue-900/50 backdrop-blur-xl overflow-hidden border border-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-lg"
            style={{ width: `${progress}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="flex justify-between gap-8">
          {series.order > 1 && (
            <motion.div whileHover={{ scale: 1.05, x: -5 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href={`/posts/${series.previousSlug}`}
                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-3 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <ChevronLeft className="h-5 w-5 text-purple-300 transition-transform group-hover:-translate-x-1" />
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 group-hover:from-white group-hover:to-purple-100">
                  Previous Part
                </span>
              </Link>
            </motion.div>
          )}
          {series.order < series.totalParts && (
            <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }} className="ml-auto">
              <Link 
                href={`/posts/${series.nextSlug}`}
                className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-pink-500/20 to-blue-500/20 px-6 py-3 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-blue-200 group-hover:from-white group-hover:to-blue-100">
                  Next Part
                </span>
                <ChevronRight className="h-5 w-5 text-blue-300 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
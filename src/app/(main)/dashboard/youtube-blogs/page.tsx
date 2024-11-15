'use client';

import React from 'react';
import YouTubeToBlogForm from '@/components/YouTubeToBlogForm';
import { motion } from 'framer-motion';
import FeatureCard from '@/components/FeatureCard';
import { Sparkles, Search, LayoutTemplate } from 'lucide-react';
import Navbar from '@/components/navigation/navbar';
import ModernSidebar from '@/components/SideBar/page';

export default function HomePage() {
  return (
    <div className="sticky top-0 z-50 bg-black">
    <Navbar/>
<div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <ModernSidebar/>
    <div className="min-h-screen bg-white/95 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <main className="relative container mx-auto px-6 py-16 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20 space-y-8"
        >
          <div className="inline-block p-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl backdrop-blur-lg">
            <h1 className="text-7xl font-black tracking-tight bg-clip-text text-transparent bg-[linear-gradient(135deg,#FF0080,#7928CA,#FF0080,#4F46E5,#FF0080)] bg-[length:300%_auto] animate-gradient">
              YouTube to Blog Converter
            </h1>
          </div>
          <p className="text-4xl max-w-3xl mx-auto leading-relaxed font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 px-6 py-3 rounded-2xl border-2 border-white/20 shadow-lg backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200">
            Transform any YouTube video into a well-structured
            <br/> blog post using AI
          </p>
          <div className="flex justify-center gap-6 items-center">
            <div className="h-[2px] w-52 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 text-sm font-medium text-slate-700 backdrop-blur-lg border border-slate-200/50">AI-Powered</span>
            <div className="h-[2px] w-52 bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative mb-20"
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50"></div>
          <div className="border border-slate-200/60 rounded-3xl bg-white/90 backdrop-blur-lg p-10 shadow-lg">
            <YouTubeToBlogForm />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            title="Instant Conversion"
            description="Convert any YouTube video to a blog post in seconds with our AI technology"
            icon={<Sparkles className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />}
            gradient="bg-gradient-to-r from-purple-600 to-pink-600"
            bgColor="bg-purple-500/10"
            hoverBgColor="group-hover:bg-purple-500/20"
          />
          
          <FeatureCard
            title="SEO Optimized"
            description="Generated blog posts are optimized for search engines automatically"
            icon={<Search className="w-6 h-6 text-pink-600 group-hover:text-pink-700" />}
            gradient="bg-gradient-to-r from-pink-600 to-purple-600"
            bgColor="bg-pink-500/10"
            hoverBgColor="group-hover:bg-pink-500/20"
          />
          
          <FeatureCard
            title="Smart Formatting"
            description="Maintains proper structure with headings, paragraphs, and key points"
            icon={<LayoutTemplate className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />}
            gradient="bg-gradient-to-r from-blue-600 to-purple-600"
            bgColor="bg-blue-500/10"
            hoverBgColor="group-hover:bg-blue-500/20"
          />
        </div>
      </main>
    </div>
    </div>
    </div>
  );
}

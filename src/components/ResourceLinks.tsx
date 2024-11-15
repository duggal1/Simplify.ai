'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Youtube, Book, Link } from 'lucide-react';

interface Resource {
  type: string;
  url: string;
  title: string;
}

const resourceIcons: Record<string, any> = {
  github: Github,
  youtube: Youtube,
  documentation: Book,
  link: Link,
};

export default function ResourceLinks({ resources }: { resources: Resource[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="my-12 rounded-3xl bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-blue-900/90 p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] backdrop-blur-xl border border-purple-500/20 hover:shadow-[0_0_80px_rgba(139,92,246,0.4)] transition-all duration-500"
    >
      <h2 className="mb-8 text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-center">
        Additional Resources
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => {
          const Icon = resourceIcons[resource.type.toLowerCase()] || ExternalLink;
          
          return (
            <motion.a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-transparent p-0.5 shadow-2xl backdrop-blur-md hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500"
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-5 backdrop-blur-xl border border-white/10 group-hover:border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 animate-pulse transition-opacity duration-500" />
                
                <div className="relative flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-xl group-hover:shadow-purple-500/50 transition-all duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="flex-1 text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 group-hover:from-white group-hover:to-purple-100 transition-all duration-300">
                    {resource.title}
                  </span>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <ExternalLink className="h-5 w-5 text-purple-300" />
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>
    </motion.div>
  );
}
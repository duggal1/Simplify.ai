
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function VideoDialog() {
  return (
    <div className="w-full min-h-screen  flex items-center justify-center p-8">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Video Section with Ultra Modern Effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          {/* Multi-layered gradient borders and glow effects */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75 group-hover:opacity-100 animate-gradient-xy"></div>
          <div className="absolute -inset-2 bg-gradient-conic from-violet-600/30 via-cyan-500/30 to-emerald-400/30 animate-spin-slow blur-2xl"></div>
          <div className="absolute -inset-3 bg-gradient-to-r from-fuchsia-500/20 via-cyan-400/20 to-purple-600/20 blur-3xl animate-pulse"></div>
          <div className="absolute -inset-4 bg-gradient-radial from-blue-500/30 via-purple-500/20 to-transparent blur-2xl animate-pulse"></div>
          <div className="absolute -inset-5 bg-gradient-conic from-pink-500/20 via-blue-500/20 to-green-500/20 animate-spin-slow blur-3xl"></div>
          
          <div className="relative scale-110">
            <div className="absolute inset-0 bg-gradient-radial from-violet-500/30 via-transparent to-transparent animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/50 via-purple-500/50 to-pink-500/50 blur-md animate-gradient-xy"></div>
            <video 
              src="/videos/ai-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-[120%] aspect-video object-cover rounded-xl shadow-[0_0_70px_rgba(139,92,246,0.7)] border-2 border-white/30 backdrop-blur-3xl relative z-10 hover:shadow-[0_0_90px_rgba(139,92,246,0.9)] transition-all duration-500"
            />
            {/* Additional ultra-modern decorative elements */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 to-cyan-400/30 blur-3xl -z-10 animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-conic from-purple-900/40 via-cyan-500/40 to-emerald-400/40 animate-spin-slow blur-2xl -z-10"></div>
            <div className="absolute -inset-6 bg-gradient-radial from-fuchsia-500/20 via-blue-500/20 to-transparent blur-3xl animate-pulse"></div>
          </div>
        </motion.div>

        {/* Text Section with Enhanced Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          <motion.h2 
            className="text-7xl md:text-7xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white via-neautral-200 to-gray-300/20 "
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            Next-Gen AI Revolution
          </motion.h2>
          
          <motion.p 
            className="text-2xl md:text-3xl text-gray-400 leading-relaxed"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, type: "spring" }}
          >
            Take a look at our most advanced AI models transforming YouTube URLs into
            <motion.span 
              className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-fuchsia-600 to-purple-600 animate-gradient-x font-semibold hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
            >
              beautifully crafted cinematic vlogs
            </motion.span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

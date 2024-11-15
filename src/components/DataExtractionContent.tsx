'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navigation/navbar';
import ModernSidebar from "@/components/SideBar/page";
import FileProcessor from '@/components/FileProcessor';
import { 
  Rocket, 
  Zap, 
  Brain, 
  FileSpreadsheet,
  BarChart2,
  Network,
  Sparkles,
  ArrowRight
} from 'lucide-react';
//ENHANCED UI
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8,
      staggerChildren: 0.15
    }
  }
};

const FeatureCard = ({ icon: Icon, title, description, gradient }: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -8 }}
    whileTap={{ scale: 0.98 }}
    className={`relative overflow-hidden rounded-[2.5rem] ${gradient} p-10 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] transition-all duration-500 backdrop-blur-3xl hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4)] group`}
  >
    <div className="absolute top-0 right-0 p-6">
      <Icon className="w-10 h-10 text-white/70 group-hover:scale-110 transition-all duration-300" />
    </div>
    <h3 className="text-2xl font-black group-hover:scale-105 transition-transform duration-300">{title}</h3>
    <p className="mt-4 text-white/90 backdrop-blur-xl bg-white/20 rounded-2xl p-6 shadow-inner">{description}</p>
    <motion.div
      className="absolute bottom-0 right-0 p-6"
      whileHover={{ scale: 1.3, rotate: 90 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <ArrowRight className="w-8 h-8 text-white/50" />
    </motion.div>
  </motion.div>
);

export default function DataExtractionContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white"
    >
      <div className="sticky top-0 z-50 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 shadow-2xl">
        <Navbar />
      </div>

      <div className="flex backdrop-filter backdrop-blur-3xl">
        <ModernSidebar />
        
        <main className="flex-1 px-6 sm:px-8 lg:px-12">
          <div className="py-12 space-y-16 animate-fade-in">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative isolate overflow-hidden rounded-[3rem] bg-clip-padding backdrop-filter backdrop-blur-3xl bg-white shadow-[0_35px_100px_-15px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(100rem_75rem_at_top,theme(colors.violet.100),white)] opacity-30 animate-pulse" />
              <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-35deg] bg-white/90 shadow-2xl shadow-violet-600/10 ring-1 ring-violet-50 backdrop-blur-3xl" />
              
              <div className="mx-auto max-w-7xl px-8 py-24 sm:py-32 lg:px-12">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                  <motion.h1 
                    className="text-8xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent sm:text-9xl drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                    animate={{ backgroundPosition: ["0%", "200%"] }}
                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                  >
                    Excel to JSON Analytics!!
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="mt-8 text-xl leading-8 max-w-3xl mx-auto backdrop-blur-xl bg-white/90 rounded-full px-12 py-6 shadow-2xl ring-2 ring-violet-600 transition-all duration-500 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent font-bold">
                      Transform your Excel data into actionable insights with AI-powered analytics
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="overflow-hidden rounded-[3rem] bg-white shadow-2xl ring-2 ring-violet-100/50 backdrop-blur-3xl hover:shadow-violet-200/30 transition-all duration-500"
            >
              <div className="p-12 bg-gradient-to-br from-white via-white/95 to-violet-50/20">
                <FileProcessor />
              </div>
            </motion.div>

            <motion.div 
              className="mt-20 grid grid-cols-1 gap-2 overflow-hidden rounded-[3rem] text-center sm:grid-cols-2 lg:grid-cols-4 bg-white backdrop-blur-3xl shadow-2xl ring-2 ring-violet-100/50"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {[
                { icon: FileSpreadsheet, label: 'Files Processed', value: '100K+', countUp: true },
                { icon: BarChart2, label: 'Data Points Analyzed', value: '50M+', countUp: true },
                { icon: Brain, label: 'AI Models', value: '5+', countUp: true },
                { icon: Zap, label: 'Success Rate', value: '99.9%', countUp: true },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-3xl p-10 group hover:bg-violet-50/30 transition-all duration-500"
                >
                  <stat.icon className="w-12 h-12 mx-auto text-violet-500/70 group-hover:text-violet-600 transition-colors duration-300" />
                  <dt className="mt-6 text-lg font-bold leading-6 text-gray-800 group-hover:text-violet-700 transition-colors duration-300">{stat.label}</dt>
                  <dd className="mt-4 text-5xl font-black tracking-tight bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent group-hover:from-fuchsia-600 group-hover:to-pink-600 transition-all duration-500">{stat.value}</dd>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="mt-32 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FeatureCard
                icon={Brain}
                title="Advanced AI Analysis"
                description="Our AI models analyze your data patterns and provide detailed insights automatically."
                gradient="bg-gradient-to-br from-violet-500/95 via-violet-600/95 to-fuchsia-700/95"
              />
              <FeatureCard
                icon={Zap}
                title="Real-time Processing"
                description="Process large Excel files instantly with our optimized conversion engine."
                gradient="bg-gradient-to-br from-fuchsia-500/95 via-fuchsia-600/95 to-pink-700/95"
              />
              <FeatureCard
                icon={Sparkles}
                title="Smart Analytics"
                description="Get intelligent insights and visualizations from your Excel data."
                gradient="bg-gradient-to-br from-pink-500/95 via-pink-600/95 to-rose-700/95"
              />
            </motion.div>

            <motion.div 
              className="mt-32 grid grid-cols-1 gap-10 sm:grid-cols-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                className="rounded-[3rem] bg-gradient-to-br from-white/95 to-white/80 p-12 backdrop-blur-3xl ring-2 ring-violet-100/50 shadow-2xl hover:shadow-violet-200/30 transition-all duration-500 group"
              >
                <Network className="w-14 h-14 text-violet-500/70 group-hover:text-violet-600 transition-colors duration-300" />
                <h3 className="mt-6 text-3xl font-black bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Batch Processing</h3>
                <p className="mt-6 text-gray-800 backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-inner">Upload multiple Excel files at once and process them in parallel.</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -8 }}
                className="rounded-[3rem] bg-gradient-to-br from-white/95 to-white/80 p-12 backdrop-blur-3xl ring-2 ring-violet-100/50 shadow-2xl hover:shadow-violet-200/30 transition-all duration-500 group"
              >
                <Rocket className="w-14 h-14 text-fuchsia-500/70 group-hover:text-fuchsia-600 transition-colors duration-300" />
                <h3 className="mt-6 text-3xl font-black bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent">Custom Mapping</h3>
                <p className="mt-6 text-gray-800 backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-inner">Define custom field mappings and transformations for your data.</p>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
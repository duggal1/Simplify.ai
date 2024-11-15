"use client"

import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
  hoverBgColor: string;
}

const FeatureCard = ({
  title,
  description,
  icon,
  gradient,
  bgColor,
  hoverBgColor
}: FeatureCardProps): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative overflow-hidden p-6 h-full bg-white/80 backdrop-blur-lg border border-slate-200/60 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group rounded-2xl">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-white/50 via-transparent to-purple-500/5 transition-opacity duration-500" />

        {/* Icon Container */}
        <div className={`${bgColor} ${hoverBgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
          {icon}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className={`text-xl font-semibold mb-3 bg-clip-text text-transparent ${gradient}`}>
            {title}
          </h3>
          
          <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-1 -right-1 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 blur-2xl" />
      </div>
    </motion.div>
  );
};

export default FeatureCard;
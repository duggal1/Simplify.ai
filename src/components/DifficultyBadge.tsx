'use client';

import { motion } from 'framer-motion';
import { Zap, Book, Beaker, Brain } from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface DifficultyConfig {
  icon: typeof Zap;
  label: string;
  gradients: {
    text: string;
    bg: string;
    border: string;
    glow: string;
  };
}

const difficultyConfigs: Record<Difficulty, DifficultyConfig> = {
  beginner: {
    icon: Book,
    label: 'Beginner Friendly',
    gradients: {
      text: 'bg-gradient-to-r from-emerald-500 to-green-500',
      bg: 'bg-gradient-to-br from-emerald-50/80 via-green-50/50 to-teal-50/30',
      border: 'border-emerald-200/50',
      glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]'
    }
  },
  intermediate: {
    icon: Beaker,
    label: 'Intermediate Level',
    gradients: {
      text: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      bg: 'bg-gradient-to-br from-blue-50/80 via-cyan-50/50 to-sky-50/30',
      border: 'border-blue-200/50',
      glow: 'shadow-[0_0_25px_rgba(59,130,246,0.25)]'
    }
  },
  advanced: {
    icon: Brain,
    label: 'Advanced Topic',
    gradients: {
      text: 'bg-gradient-to-r from-violet-500 to-purple-500',
      bg: 'bg-gradient-to-br from-violet-50/80 via-purple-50/50 to-fuchsia-50/30',
      border: 'border-violet-200/50',
      glow: 'shadow-[0_0_25px_rgba(139,92,246,0.25)]'
    }
  },
  expert: {
    icon: Zap,
    label: 'Expert Level',
    gradients: {
      text: 'bg-gradient-to-r from-rose-500 to-red-500',
      bg: 'bg-gradient-to-br from-rose-50/80 via-red-50/50 to-orange-50/30',
      border: 'border-rose-200/50',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.25)]'
    }
  },
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfigs[difficulty];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className={`
        inline-flex items-center gap-3 rounded-2xl border px-6 py-3
        backdrop-blur-xl backdrop-filter
        ${config.gradients.bg}
        ${config.gradients.border}
        ${config.gradients.glow}
        hover:scale-105 hover:shadow-2xl
        transform transition-all duration-300
        hover:-translate-y-1
        group
      `}
    >
      <motion.div
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.6 }}
        className={`
          p-2 rounded-xl
          ${config.gradients.bg}
          shadow-lg backdrop-blur-lg
          group-hover:shadow-xl
          transition-all duration-300
        `}
      >
        <Icon className={`h-5 w-5 ${config.gradients.text} transition-colors duration-300`} />
      </motion.div>
      <span className={`
        text-sm font-bold tracking-wide
        ${config.gradients.text}
        bg-clip-text text-transparent
        group-hover:scale-105
        transition-transform duration-300
      `}>
        {config.label}
      </span>
    </motion.div>
  );
}
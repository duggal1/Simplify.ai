'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/Icons';
import React from 'react';

export const useIconAnimation = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const AnimatedIcon = ({ 
    icon: Icon, 
    animation = "pulse",
    ...props 
  }: { 
    icon: any;
    animation?: "pulse" | "bounce" | "spin" | "shake";
    [key: string]: any;
  }) => {
    const animations = {
      pulse: {
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
      },
      bounce: {
        y: [0, -8, 0],
        transition: { duration: 0.5 }
      },
      spin: {
        rotate: 360,
        transition: { duration: 0.5 }
      },
      shake: {
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.4 }
      }
    };
    const animationProps = {
      animate: isAnimating ? animations[animation] : {},
      onHoverStart: () => setIsAnimating(true),
      onHoverEnd: () => setIsAnimating(false),
      onClick: () => setIsAnimating(true)
    };

    return React.createElement(AnimatePresence, null,
      // eslint-disable-next-line react/no-children-prop
      React.createElement(motion.div, {
        ...animationProps,
        children: React.createElement(Icon, props)
      })
    );
  };
  return { AnimatedIcon, isAnimating };
};
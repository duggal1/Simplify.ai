'use client';

import { Archive } from 'lucide-react';

interface IconWrapperProps {
  name: string;
  className?: string;
}

export default function IconWrapper({ name, className }: IconWrapperProps) {
  const icons = {
    archive: Archive,
  };

  const Icon = icons[name as keyof typeof icons];
  
  if (!Icon) {
    return null;
  }

  return <Icon className={className} />;
} 
'use client';

import { Check, Archive, type LucideIcon } from 'lucide-react';

export const Icons = {
  check: Check,
  archive: Archive,
} as const;

export type Icon = keyof typeof Icons; 
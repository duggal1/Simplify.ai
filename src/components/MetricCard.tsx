'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: number;
}

export function MetricCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend 
}: MetricCardProps) {
  return (
    <div className="p-4 rounded-lg bg-white/5 backdrop-blur-lg border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      )}
      {trend !== undefined && (
        <div className={`mt-2 flex items-center text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  );
} 
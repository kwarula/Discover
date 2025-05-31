import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  type: 'message' | 'card' | 'map';
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, className }) => {
  if (type === 'message') {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="glass rounded-2xl p-5 max-w-[75%]">
          <div className="space-y-3">
            <div className="h-4 bg-gray-300/50 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300/50 rounded w-full"></div>
            <div className="h-4 bg-gray-300/50 rounded w-5/6"></div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-3 bg-gray-300/50 rounded w-16"></div>
            <div className="h-3 bg-gray-300/50 rounded w-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className={cn("animate-pulse glass rounded-2xl p-4", className)}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-300/50 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300/50 rounded w-24"></div>
              <div className="h-3 bg-gray-300/50 rounded w-20"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-300/50 rounded w-12"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-300/50 rounded w-32"></div>
          <div className="h-3 bg-gray-300/50 rounded w-28"></div>
          <div className="h-3 bg-gray-300/50 rounded w-24"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-300/50 rounded-lg flex-1"></div>
          <div className="h-10 bg-gray-300/50 rounded-lg flex-1"></div>
        </div>
      </div>
    );
  }

  if (type === 'map') {
    return (
      <div className={cn("animate-pulse w-full h-[400px] rounded-2xl bg-gray-300/30 relative overflow-hidden", className)}>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-400/20"></div>
        <div className="absolute bottom-4 left-4 glass rounded-lg p-3 w-32 h-24 bg-gray-300/50"></div>
      </div>
    );
  }

  return null;
};

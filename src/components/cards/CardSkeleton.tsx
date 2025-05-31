import React from 'react';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
  type?: 'hotel' | 'activity' | 'restaurant' | 'transport';
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ 
  className,
  type = 'hotel' 
}) => {
  return (
    <div className={cn(
      "glass rounded-2xl overflow-hidden shadow-lg animate-pulse",
      className
    )}>
      {/* Image skeleton */}
      <div className="h-48 bg-gray-300" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-300 rounded w-1/2" />
        </div>

        {/* Rating or details */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-300 rounded w-24" />
          <div className="h-4 bg-gray-300 rounded w-16" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-full" />
          <div className="h-3 bg-gray-300 rounded w-5/6" />
        </div>

        {/* Tags/Amenities */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-300 rounded-full w-16" />
          <div className="h-6 bg-gray-300 rounded-full w-20" />
          <div className="h-6 bg-gray-300 rounded-full w-16" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-gray-300 rounded-lg flex-1" />
          <div className="h-9 bg-gray-300 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveCardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  children,
  className,
  columns = {
    default: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  }
}) => {
  const gridClasses = cn(
    "grid gap-4 md:gap-6",
    {
      [`grid-cols-${columns.default}`]: columns.default,
      [`sm:grid-cols-${columns.sm}`]: columns.sm,
      [`md:grid-cols-${columns.md}`]: columns.md,
      [`lg:grid-cols-${columns.lg}`]: columns.lg,
      [`xl:grid-cols-${columns.xl}`]: columns.xl,
    },
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Card container that ensures consistent sizing
export const CardContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("w-full h-full", className)}>
      {children}
    </div>
  );
};

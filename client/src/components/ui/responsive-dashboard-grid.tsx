/**
 * Responsive Dashboard Grid Component
 * 
 * Advanced grid system specifically designed for dashboard layouts with
 * automatic responsive behavior, content-visibility optimization, and
 * performance enhancements for displaying large amounts of data.
 */

import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveDashboardGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Grid configuration for different breakpoints */
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
    '3xl'?: number;
  };
  
  /** Gap size between grid items */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** Auto-sizing behavior */
  autoFit?: boolean;
  minItemWidth?: string;
  
  /** Performance optimizations */
  enableVirtualization?: boolean;
  enableContentVisibility?: boolean;
  
  /** Layout density */
  density?: 'compact' | 'normal' | 'comfortable';
  
  children: ReactNode;
}

const gapSizes = {
  xs: 'gap-2 xs:gap-3',
  sm: 'gap-3 xs:gap-4 sm:gap-5',
  md: 'gap-4 xs:gap-5 sm:gap-6 md:gap-7',
  lg: 'gap-6 xs:gap-7 sm:gap-8 md:gap-9 lg:gap-10',
  xl: 'gap-8 xs:gap-9 sm:gap-10 md:gap-11 lg:gap-12 xl:gap-14'
};

const densityConfig = {
  compact: {
    padding: 'p-2 xs:p-3 sm:p-4',
    spacing: 'space-y-2 xs:space-y-3'
  },
  normal: {
    padding: 'p-4 xs:p-5 sm:p-6 md:p-7',
    spacing: 'space-y-4 xs:space-y-5 sm:space-y-6'
  },
  comfortable: {
    padding: 'p-6 xs:p-7 sm:p-8 md:p-9 lg:p-10',
    spacing: 'space-y-6 xs:space-y-7 sm:space-y-8 md:space-y-9'
  }
};

export const ResponsiveDashboardGrid = forwardRef<HTMLDivElement, ResponsiveDashboardGridProps>(
  ({
    className,
    columns = {
      xs: 1,
      sm: 2, 
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6,
      '3xl': 8
    },
    gap = 'md',
    autoFit = false,
    minItemWidth = '280px',
    enableVirtualization = false,
    enableContentVisibility = true,
    density = 'normal',
    children,
    ...props
  }, ref) => {
    
    // Generate responsive grid classes
    const getGridClasses = () => {
      if (autoFit) {
        return `grid-cols-[repeat(auto-fit,minmax(min(100%,${minItemWidth}),1fr))]`;
      }
      
      return Object.entries(columns)
        .map(([breakpoint, cols]) => {
          if (breakpoint === 'xs') return `grid-cols-${cols}`;
          return `${breakpoint}:grid-cols-${cols}`;
        })
        .join(' ');
    };

    const gridClasses = cn(
      // Base grid setup
      'grid',
      getGridClasses(),
      gapSizes[gap],
      
      // Performance optimizations
      enableContentVisibility && 'content-visibility-auto',
      enableVirtualization && 'will-change-scroll contain-paint',
      
      // Layout density
      densityConfig[density].padding,
      
      // Responsive behavior
      'transition-all duration-300 ease-in-out',
      
      className
    );

    return (
      <div
        ref={ref}
        className={gridClasses}
        style={{
          // Content visibility optimization
          ...(enableContentVisibility && {
            contentVisibility: 'auto',
            containIntrinsicSize: '0 400px'
          })
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveDashboardGrid.displayName = "ResponsiveDashboardGrid";

/**
 * Dashboard Card Component
 * Optimized for dashboard grid layouts with responsive behavior
 */
interface DashboardCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card variant */
  variant?: 'default' | 'featured' | 'compact' | 'wide';
  
  /** Responsive behavior */
  responsive?: boolean;
  
  /** Performance optimizations */
  enableHover?: boolean;
  lazy?: boolean;
}

const cardVariants = {
  default: 'col-span-1',
  featured: 'col-span-1 xs:col-span-2 md:col-span-2',
  compact: 'col-span-1 row-span-1',
  wide: 'col-span-1 xs:col-span-full sm:col-span-2 lg:col-span-3'
};

export const DashboardCard = forwardRef<HTMLDivElement, DashboardCardProps>(
  ({
    className,
    variant = 'default',
    responsive = true,
    enableHover = true,
    lazy = true,
    children,
    ...props
  }, ref) => {
    
    const cardClasses = cn(
      // Base styling
      'bg-card rounded-lg border border-border shadow-sm',
      
      // Responsive grid behavior
      responsive && cardVariants[variant],
      
      // Hover effects
      enableHover && cn(
        'hover:shadow-md hover:border-primary/20',
        'transition-all duration-300 ease-in-out',
        'hover:scale-[1.02]'
      ),
      
      // Performance optimizations
      lazy && 'content-visibility-auto',
      'transform-gpu',
      
      className
    );

    return (
      <div
        ref={ref}
        className={cardClasses}
        style={{
          ...(lazy && {
            contentVisibility: 'auto',
            containIntrinsicSize: '0 300px'
          })
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DashboardCard.displayName = "DashboardCard";

/**
 * Responsive Stats Grid
 * Specialized grid for dashboard statistics
 */
interface StatsGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of stat cards */
  count?: number;
  
  /** Responsive configuration */
  adaptive?: boolean;
}

export const StatsGrid = forwardRef<HTMLDivElement, StatsGridProps>(
  ({
    className,
    count = 4,
    adaptive = true,
    children,
    ...props
  }, ref) => {
    
    const getStatsGridClasses = () => {
      if (!adaptive) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      
      // Adaptive grid based on number of items
      if (count <= 2) return 'grid-cols-1 sm:grid-cols-2';
      if (count <= 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      if (count <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      if (count <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6';
      return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8';
    };

    const statsClasses = cn(
      'grid',
      getStatsGridClasses(),
      'gap-4 xs:gap-5 sm:gap-6 lg:gap-7 xl:gap-8',
      'transition-all duration-300',
      className
    );

    return (
      <div
        ref={ref}
        className={statsClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatsGrid.displayName = "StatsGrid";
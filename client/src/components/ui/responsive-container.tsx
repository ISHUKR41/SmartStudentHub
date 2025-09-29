/**
 * Responsive Container Component
 * 
 * Advanced responsive layout system with content-visibility optimization
 * and breakpoint-aware rendering for optimal performance across all devices.
 */

import { forwardRef, HTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Enable content-visibility optimization */
  contentVisibility?: boolean;
  /** Grid layout configuration for different breakpoints */
  gridConfig?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
    '3xl'?: number;
  };
  /** Container variant for different use cases */
  variant?: 'default' | 'dashboard' | 'content' | 'hero' | 'form';
  /** Responsive spacing configuration */
  spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
  /** Enable advanced grid layouts */
  advancedGrid?: boolean;
  /** Safe area handling for mobile devices */
  safeArea?: boolean;
}

const containerVariants = {
  default: "w-full mx-auto",
  dashboard: "w-full max-w-none xl:max-w-7xl 2xl:max-w-full 3xl:max-w-screen-3xl mx-auto",
  content: "w-full max-w-4xl mx-auto",
  hero: "w-full min-h-screen flex flex-col",
  form: "w-full max-w-2xl mx-auto"
};

const spacingVariants = {
  tight: "p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-7 3xl:p-8",
  normal: "p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-10 3xl:p-12",
  relaxed: "p-6 sm:p-7 md:p-8 lg:p-10 xl:p-12 2xl:p-14 3xl:p-16",
  loose: "p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16 2xl:p-20 3xl:p-24"
};

function useBreakpointDetector() {
  const [breakpoint, setBreakpoint] = useState<string>('xs');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1920) setBreakpoint('3xl');
      else if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else if (width >= 640) setBreakpoint('sm');
      else setBreakpoint('xs');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

export const ResponsiveContainer = forwardRef<HTMLDivElement, ResponsiveContainerProps>(
  ({ 
    className, 
    contentVisibility = false,
    gridConfig,
    variant = 'default',
    spacing = 'normal',
    advancedGrid = false,
    safeArea = false,
    children,
    ...props 
  }, ref) => {
    const currentBreakpoint = useBreakpointDetector();

    // Generate grid classes based on configuration
    const getGridClasses = () => {
      if (!gridConfig) return "";

      const gridClasses = Object.entries(gridConfig)
        .map(([breakpoint, cols]) => {
          if (breakpoint === 'xs') return `grid-cols-${cols}`;
          return `${breakpoint}:grid-cols-${cols}`;
        })
        .join(' ');

      return `grid ${gridClasses} gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 2xl:gap-10 3xl:gap-12`;
    };

    // Advanced grid layout with masonry-like behavior
    const getAdvancedGridClasses = () => {
      if (!advancedGrid) return "";
      
      return cn(
        "grid auto-rows-min",
        // Responsive column counts with optimal spacing
        "grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8",
        // Advanced gap system
        "gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10"
      );
    };

    const containerClass = cn(
      // Base container styling
      containerVariants[variant],
      spacingVariants[spacing],
      
      // Content visibility optimization
      contentVisibility && "content-visibility-auto contain-intrinsic-size-auto",
      
      // Grid configuration
      gridConfig && getGridClasses(),
      advancedGrid && getAdvancedGridClasses(),
      
      // Safe area support for mobile devices
      safeArea && cn(
        "pb-safe-area-inset-bottom",
        "pt-safe-area-inset-top",
        "pl-safe-area-inset-left",
        "pr-safe-area-inset-right"
      ),
      
      // Responsive enhancements
      "transition-all duration-300 ease-in-out",
      
      // Performance optimizations
      "will-change-auto",
      "transform-gpu",
      
      className
    );

    return (
      <div
        ref={ref}
        className={containerClass}
        style={{
          // Content visibility API for performance
          ...(contentVisibility && {
            contentVisibility: 'auto',
            containIntrinsicSize: '0 500px'
          })
        }}
        data-breakpoint={currentBreakpoint}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = "ResponsiveContainer";

/**
 * Responsive Grid Component
 * Advanced grid system with dynamic column allocation
 */
interface ResponsiveGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
    '3xl'?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  autoFit?: boolean;
  minItemWidth?: string;
}

export const ResponsiveGrid = forwardRef<HTMLDivElement, ResponsiveGridProps>(
  ({ 
    className, 
    columns = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6, '3xl': 8 },
    gap = 'md',
    autoFit = false,
    minItemWidth = '280px',
    children,
    ...props 
  }, ref) => {
    const gapClasses = {
      xs: 'gap-2',
      sm: 'gap-3 sm:gap-4',
      md: 'gap-4 sm:gap-5 md:gap-6',
      lg: 'gap-6 sm:gap-7 md:gap-8 lg:gap-10',
      xl: 'gap-8 sm:gap-10 md:gap-12 lg:gap-14 xl:gap-16'
    };

    const gridClasses = cn(
      "grid",
      gapClasses[gap],
      
      // Auto-fit grid with minimum width
      autoFit ? `grid-cols-[repeat(auto-fit,minmax(${minItemWidth},1fr))]` : 
      // Responsive column configuration
      Object.entries(columns)
        .map(([breakpoint, cols]) => {
          if (breakpoint === 'xs') return `grid-cols-${cols}`;
          return `${breakpoint}:grid-cols-${cols}`;
        })
        .join(' '),
      
      className
    );

    return (
      <div
        ref={ref}
        className={gridClasses}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = "ResponsiveGrid";

/**
 * Responsive Typography Component
 * Fluid typography that scales smoothly across breakpoints
 */
interface ResponsiveTextProps extends HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  variant?: 'display' | 'headline' | 'title' | 'subtitle' | 'body' | 'caption';
  responsive?: boolean;
}

const typographyVariants = {
  display: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold",
  headline: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold",
  title: "text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold",
  subtitle: "text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium",
  body: "text-base sm:text-lg md:text-xl font-normal",
  caption: "text-sm sm:text-base font-normal text-muted-foreground"
};

export const ResponsiveText = forwardRef<HTMLElement, ResponsiveTextProps>(
  ({ 
    as: Component = 'div', 
    variant = 'body',
    responsive = true,
    className, 
    children, 
    ...props 
  }, ref) => {
    const textClasses = cn(
      responsive ? typographyVariants[variant] : '',
      "leading-tight tracking-tight",
      className
    );

    return (
      <Component
        ref={ref as any}
        className={textClasses}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ResponsiveText.displayName = "ResponsiveText";
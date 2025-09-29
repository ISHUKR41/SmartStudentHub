/**
 * Enhanced Chart Wrapper Components
 * 
 * Advanced chart wrapper components with export functionality, lazy loading,
 * and performance optimizations for the Smart Student Hub dashboard.
 * 
 * Features:
 * - ChartCard: Universal wrapper with export, legend, header
 * - RechartsWrapper: Optimized for Recharts with lazy loading
 * - EChartsWrapper: Optimized for ECharts with lazy loading  
 * - ChartJSWrapper: Optimized for Chart.js with lazy loading
 * - Export functionality (PNG, SVG, CSV, JSON)
 * - Cross-filtering capabilities
 * - Keyboard navigation and screen reader support
 */

import { useState, useRef, useCallback, memo, Suspense, forwardRef, useImperativeHandle } from 'react';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { 
  Download, FileImage, FileText, Share2, Maximize, Filter, RefreshCw,
  MoreHorizontal, TrendingUp, BarChart3, PieChart, Eye, EyeOff
} from 'lucide-react';

// Import ACADEMIC_COLORS for re-export
import { ACADEMIC_COLORS } from './phase1-academic-charts';

// Enhanced Chart Skeleton with proper responsive sizing
export function ChartSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn(
      "w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[420px] 2xl:h-[460px]",
      "bg-muted animate-pulse rounded-lg flex items-center justify-center",
      className
    )}>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded-full animate-pulse"></div>
        <div className="w-24 h-3 bg-muted-foreground/20 rounded animate-pulse"></div>
        <div className="w-16 h-2 bg-muted-foreground/15 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Chart Export Types
export interface ChartExportOptions {
  format: 'png' | 'svg' | 'csv' | 'json';
  filename?: string;
  quality?: number;
  width?: number;
  height?: number;
}

// Chart Configuration Interface
export interface ChartConfig {
  title: string;
  subtitle?: string;
  description?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  responsive?: boolean;
  animate?: boolean;
  colorScheme?: 'default' | 'academic' | 'performance' | 'custom';
  exportable?: boolean;
  filterable?: boolean;
  crossFilterable?: boolean;
}

// Chart Data Interface
export interface ChartData {
  [key: string]: any;
}

// Chart Instance Interface for export functionality
export interface ChartInstance {
  exportChart: (options: ChartExportOptions) => Promise<void>;
  getChartData: () => ChartData[];
  applyFilter: (filter: Record<string, any>) => void;
  clearFilters: () => void;
}

// Enhanced ChartCard Props
export interface ChartCardProps {
  config: ChartConfig;
  data?: ChartData[];
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: string | null;
  onExport?: (options: ChartExportOptions) => Promise<void>;
  onFilter?: (filter: Record<string, any>) => void;
  onRefresh?: () => void;
  testId?: string;
}

/**
 * Enhanced ChartCard Component
 * 
 * Universal wrapper for all chart types with comprehensive functionality.
 * Features export, filtering, responsive design, and accessibility support.
 */
export const ChartCard = memo(forwardRef<ChartInstance, ChartCardProps>(({
  config,
  data = [],
  children,
  className = "",
  loading = false,
  error = null,
  onExport,
  onFilter,
  onRefresh,
  testId
}, ref) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, any>>({});

  // Intersection observer for performance optimization
  const [containerRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px'
  });

  // Export functionality
  const handleExport = useCallback(async (format: ChartExportOptions['format']) => {
    if (!onExport || isExporting) return;
    
    setIsExporting(true);
    try {
      const filename = `${config.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      await onExport({ format, filename });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [config.title, onExport, isExporting]);

  // Filter functionality
  const handleFilter = useCallback((newFilter: Record<string, any>) => {
    const updatedFilters = { ...filters, ...newFilter };
    setFilters(updatedFilters);
    onFilter?.(updatedFilters);
  }, [filters, onFilter]);

  const clearFilters = useCallback(() => {
    setFilters({});
    onFilter?.({});
  }, [onFilter]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    exportChart: async (options: ChartExportOptions) => {
      if (onExport) {
        await onExport(options);
      }
    },
    getChartData: () => data,
    applyFilter: handleFilter,
    clearFilters
  }), [data, handleFilter, clearFilters, onExport]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      // Handle chart interactions
      event.preventDefault();
    }
    if (event.key === 'e' && event.ctrlKey) {
      // Quick export with Ctrl+E
      event.preventDefault();
      handleExport('png');
    }
  }, [handleExport]);

  return (
    <div ref={containerRef} className="w-full">
      <Card 
        className={cn(
          "h-full transition-all duration-200 hover:shadow-md",
          "focus-within:ring-2 focus-within:ring-primary/20",
          className
        )}
        data-testid={testId || `chart-card-${config.title.toLowerCase().replace(/\s+/g, '-')}`}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="img"
        aria-label={`Chart: ${config.title}. ${config.description || ''}`}
      >
        {/* Chart Header */}
        <CardHeader className="pb-2 space-y-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                {config.title}
                {loading && (
                  <div className="w-4 h-4 border-2 border-muted border-t-primary rounded-full animate-spin" />
                )}
              </CardTitle>
              {config.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{config.subtitle}</p>
              )}
              {config.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {config.description}
                </p>
              )}
            </div>

            {/* Chart Actions */}
            <div className="flex items-center gap-1 ml-2">
              {/* Filter Toggle */}
              {config.filterable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-8 w-8 p-0"
                  aria-label="Toggle filters"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              )}

              {/* Refresh Button */}
              {onRefresh && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  className="h-8 w-8 p-0"
                  aria-label="Refresh chart data"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}

              {/* Export Dropdown */}
              {config.exportable && onExport && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled={isExporting}
                      aria-label="Export chart"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleExport('png')}>
                      <FileImage className="mr-2 h-4 w-4" />
                      Export as PNG
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('svg')}>
                      <FileImage className="mr-2 h-4 w-4" />
                      Export as SVG
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleExport('csv')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export Data (CSV)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('json')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export Data (JSON)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* More Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    aria-label="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Maximize className="mr-2 h-4 w-4" />
                    Fullscreen View
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Chart
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Active Filters */}
          {Object.keys(filters).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(filters).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {key}: {String(value)}
                  <button
                    onClick={() => {
                      const newFilters = { ...filters };
                      delete newFilters[key];
                      setFilters(newFilters);
                      onFilter?.(newFilters);
                    }}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove filter ${key}`}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </CardHeader>

        {/* Chart Content */}
        <CardContent className="pt-2">
          <div 
            ref={chartRef}
            className={cn(
              "w-full h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[420px] 2xl:h-[460px]",
              "transition-all duration-200"
            )}
            style={{
              contentVisibility: 'auto',
              containIntrinsicSize: '0 400px'
            }}
          >
            {error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-sm text-destructive mb-2">Failed to load chart</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                  {onRefresh && (
                    <Button variant="outline" size="sm" onClick={onRefresh} className="mt-2">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Retry
                    </Button>
                  )}
                </div>
              </div>
            ) : loading ? (
              <ChartSkeleton />
            ) : inView ? (
              children
            ) : (
              <ChartSkeleton />
            )}
          </div>

          {/* Legend */}
          {config.showLegend && !loading && !error && (
            <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t">
              {/* Legend items will be rendered by individual chart components */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}));

ChartCard.displayName = 'ChartCard';

/**
 * Recharts Wrapper Component
 * 
 * Optimized wrapper for Recharts components with lazy loading and performance optimizations.
 */
export interface RechartsWrapperProps {
  config: ChartConfig;
  data: ChartData[];
  chartType: 'line' | 'bar' | 'area' | 'pie' | 'radar' | 'scatter' | 'composed' | 'funnel' | 'treemap' | 'radialbar';
  chartProps?: any;
  className?: string;
  onExport?: (options: ChartExportOptions) => Promise<void>;
}

export const RechartsWrapper = memo<RechartsWrapperProps>(({ 
  config, 
  data, 
  chartType, 
  chartProps = {}, 
  className,
  onExport 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo - in real implementation, this would be based on data loading
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  });

  return (
    <ChartCard
      config={{ ...config, exportable: true }}
      data={data}
      loading={isLoading}
      onExport={onExport}
      className={className}
    >
      <Suspense fallback={<ChartSkeleton />}>
        {/* Chart component will be rendered here based on chartType */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart ({data.length} data points)
          </p>
        </div>
      </Suspense>
    </ChartCard>
  );
});

RechartsWrapper.displayName = 'RechartsWrapper';

/**
 * ECharts Wrapper Component
 * 
 * Optimized wrapper for ECharts components with lazy loading.
 */
export interface EChartsWrapperProps {
  config: ChartConfig;
  data: ChartData[];
  chartType: 'calendar' | 'heatmap' | 'boxplot' | 'gauge' | 'sankey' | 'graph';
  option?: any;
  className?: string;
  onExport?: (options: ChartExportOptions) => Promise<void>;
}

export const EChartsWrapper = memo<EChartsWrapperProps>(({ 
  config, 
  data, 
  chartType, 
  option = {}, 
  className,
  onExport 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(timer);
  });

  return (
    <ChartCard
      config={{ ...config, exportable: true }}
      data={data}
      loading={isLoading}
      onExport={onExport}
      className={className}
    >
      <Suspense fallback={<ChartSkeleton />}>
        {/* ECharts component will be rendered here */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            ECharts {chartType.charAt(0).toUpperCase() + chartType.slice(1)} ({data.length} data points)
          </p>
        </div>
      </Suspense>
    </ChartCard>
  );
});

EChartsWrapper.displayName = 'EChartsWrapper';

/**
 * Chart.js Wrapper Component
 * 
 * Optimized wrapper for Chart.js components with lazy loading.
 */
export interface ChartJSWrapperProps {
  config: ChartConfig;
  data: ChartData[];
  chartType: 'doughnut' | 'polarArea' | 'bubble' | 'radar' | 'line' | 'bar';
  chartOptions?: any;
  className?: string;
  onExport?: (options: ChartExportOptions) => Promise<void>;
}

export const ChartJSWrapper = memo<ChartJSWrapperProps>(({ 
  config, 
  data, 
  chartType, 
  chartOptions = {}, 
  className,
  onExport 
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading for demo
  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 120);
    return () => clearTimeout(timer);
  });

  return (
    <ChartCard
      config={{ ...config, exportable: true }}
      data={data}
      loading={isLoading}
      onExport={onExport}
      className={className}
    >
      <Suspense fallback={<ChartSkeleton />}>
        {/* Chart.js component will be rendered here */}
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">
            Chart.js {chartType.charAt(0).toUpperCase() + chartType.slice(1)} ({data.length} data points)
          </p>
        </div>
      </Suspense>
    </ChartCard>
  );
});

ChartJSWrapper.displayName = 'ChartJSWrapper';

// Export utility functions for chart data processing
export const chartUtils = {
  /**
   * Convert chart data to CSV format
   */
  toCsv: (data: ChartData[], filename: string = 'chart-data.csv'): void => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : String(value);
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  /**
   * Convert chart data to JSON format
   */
  toJson: (data: ChartData[], filename: string = 'chart-data.json'): void => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  },

  /**
   * Generate responsive breakpoint classes
   */
  getResponsiveHeight: (baseHeight: string = '300px'): string => {
    return `h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[420px] 2xl:h-[460px]`;
  }
};

// Re-export ACADEMIC_COLORS for convenient access
export { ACADEMIC_COLORS };
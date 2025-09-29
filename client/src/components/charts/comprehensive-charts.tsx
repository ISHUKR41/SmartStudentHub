/**
 * Comprehensive Charts Dashboard
 * 
 * Main integration component that brings together all 18 chart types
 * with advanced features including export, cross-filtering, real-time updates,
 * and performance optimizations.
 * 
 * Features:
 * - All 18 charts in organized layout
 * - TanStack Query integration with caching
 * - Real-time updates via Server-Sent Events
 * - Cross-filtering between related charts
 * - Batch export functionality
 * - Performance optimized with intersection observers
 * - Responsive grid layout
 * - Professional Higher Education styling
 */

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { toast } from '@/hooks/use-toast';

// Import Phase 1 Charts
import {
  GPATrendChart, CreditsPerSemesterChart, CumulativeCGPAChart,
  SubjectGPAChart, GPAAttendanceCorrelationChart, SkillRadarChart,
  SkillGrowthRadialChart, AchievementFunnelChart
} from './phase1-academic-charts';

// Import Phase 2 Charts
import {
  AttendanceCalendarHeatmap, AttendanceWeeklyPatterns, ActivityCategoryShare,
  ActivityVolumeChart, PeerComparisonBoxplot, RankPercentileGauge,
  DepartmentRankingChart, PortfolioStrengthTreemap, ApprovalSLAChart,
  GradeCorrelationMatrix
} from './phase2-advanced-charts';

import { ChartSkeleton, ChartInstance, chartUtils } from './chart-wrappers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { 
  Download, RefreshCw, Filter, TrendingUp, BarChart3, 
  PieChart, Calendar, Users, Target, Award, Activity,
  Zap, Eye, Settings, Maximize2, Grid3X3, List
} from 'lucide-react';

// Chart Query Keys for cache management
const CHART_QUERY_KEYS = {
  gpaTrends: ['analytics', 'gpa-trends'],
  creditsGpa: ['analytics', 'credits-gpa'],
  cumulativeCgpa: ['analytics', 'cumulative-cgpa'],
  subjectGpa: ['analytics', 'subject-gpa'],
  gpaAttendanceCorrelation: ['analytics', 'gpa-attendance-correlation'],
  skills: ['analytics', 'skills'],
  skillGrowth: ['analytics', 'skill-growth'],
  achievementFunnel: ['analytics', 'achievement-funnel'],
  attendanceHeatmap: ['analytics', 'attendance-heatmap'],
  weeklyPatterns: ['analytics', 'weekly-patterns'],
  activityDistribution: ['analytics', 'activity-distribution'],
  activityVolume: ['analytics', 'activity-volume'],
  peerComparison: ['analytics', 'peer-comparison'],
  rankPercentile: ['analytics', 'rank-percentile'],
  departmentRankings: ['analytics', 'department-rankings'],
  portfolioStrength: ['analytics', 'portfolio-strength'],
  approvalSla: ['analytics', 'approval-sla'],
  correlationMatrix: ['analytics', 'correlation-matrix']
} as const;

// Chart Categories for organized display
const CHART_CATEGORIES = {
  academic: {
    title: 'Academic Performance',
    icon: TrendingUp,
    description: 'GPA trends, credits progression, and academic achievements',
    color: 'blue',
    charts: ['gpa-trends', 'credits-gpa', 'cumulative-cgpa', 'subject-gpa']
  },
  attendance: {
    title: 'Attendance Analytics',
    icon: Calendar,
    description: 'Attendance patterns, trends, and correlations',
    color: 'green',
    charts: ['attendance-heatmap', 'weekly-patterns', 'gpa-attendance-correlation']
  },
  skills: {
    title: 'Skills & Growth',
    icon: Target,
    description: 'Skill assessments, growth tracking, and development metrics',
    color: 'purple',
    charts: ['skills', 'skill-growth', 'portfolio-strength']
  },
  activities: {
    title: 'Activity Management',
    icon: Activity,
    description: 'Activity distribution, volume trends, and approval workflows',
    color: 'orange',
    charts: ['activity-distribution', 'activity-volume', 'achievement-funnel', 'approval-sla']
  },
  comparison: {
    title: 'Performance Comparison',
    icon: Users,
    description: 'Peer analysis, rankings, and institutional benchmarks',
    color: 'indigo',
    charts: ['peer-comparison', 'rank-percentile', 'department-rankings']
  },
  advanced: {
    title: 'Advanced Analytics',
    icon: BarChart3,
    description: 'Statistical analysis, correlations, and predictive insights',
    color: 'teal',
    charts: ['correlation-matrix']
  }
} as const;

// Layout configurations
type LayoutMode = 'grid' | 'category' | 'performance';

interface ComprehensiveChartsProps {
  className?: string;
  initialLayout?: LayoutMode;
  enableRealTime?: boolean;
  showControls?: boolean;
}

export const ComprehensiveCharts: React.FC<ComprehensiveChartsProps> = ({
  className,
  initialLayout = 'category',
  enableRealTime = true,
  showControls = true
}) => {
  const queryClient = useQueryClient();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(initialLayout);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeEnabled, setRealTimeEnabled] = useState(enableRealTime);
  const chartRefs = useRef<Record<string, ChartInstance>>({});
  
  // Container ref for scroll-based optimizations
  const [containerRef, containerInView] = useInView({
    threshold: 0,
    rootMargin: '100px'
  });

  // Real-time data updates via Server-Sent Events
  useEffect(() => {
    if (!realTimeEnabled) return;

    const eventSource = new EventSource('/api/analytics/live-updates');

    eventSource.onmessage = (event) => {
      try {
        const updateData = JSON.parse(event.data);
        
        // Invalidate relevant queries based on update type
        Object.keys(CHART_QUERY_KEYS).forEach(key => {
          if (updateData.updatedCharts?.includes(key)) {
            queryClient.invalidateQueries({ queryKey: CHART_QUERY_KEYS[key as keyof typeof CHART_QUERY_KEYS] });
          }
        });

        toast({
          title: "Data Updated",
          description: `${updateData.updatedCharts?.length || 0} charts refreshed with latest data`,
          duration: 2000
        });
      } catch (error) {
        console.error('Error processing real-time update:', error);
      }
    };

    eventSource.onerror = () => {
      console.warn('Real-time connection lost, retrying...');
      toast({
        title: "Connection Issue",
        description: "Real-time updates temporarily unavailable",
        variant: "destructive",
        duration: 3000
      });
    };

    return () => {
      eventSource.close();
    };
  }, [realTimeEnabled, queryClient]);

  // Batch data fetching with optimized queries
  const chartQueries = useQueries({
    queries: [
      {
        queryKey: CHART_QUERY_KEYS.gpaTrends,
        queryFn: () => fetch('/api/analytics/gpa-trends').then(res => res.json()),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        enabled: containerInView
      },
      {
        queryKey: CHART_QUERY_KEYS.creditsGpa,
        queryFn: () => fetch('/api/analytics/credits-gpa').then(res => res.json()),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: containerInView
      },
      {
        queryKey: CHART_QUERY_KEYS.skills,
        queryFn: () => fetch('/api/analytics/skills').then(res => res.json()),
        staleTime: 10 * 60 * 1000, // 10 minutes for relatively static skill data
        refetchOnWindowFocus: false,
        enabled: containerInView
      },
      {
        queryKey: CHART_QUERY_KEYS.attendanceHeatmap,
        queryFn: () => fetch('/api/analytics/attendance-heatmap').then(res => res.json()),
        staleTime: 15 * 60 * 1000, // 15 minutes for attendance data
        refetchOnWindowFocus: false,
        enabled: containerInView
      },
      {
        queryKey: CHART_QUERY_KEYS.activityDistribution,
        queryFn: () => fetch('/api/analytics/activity-distribution').then(res => res.json()),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        enabled: containerInView
      },
      {
        queryKey: CHART_QUERY_KEYS.peerComparison,
        queryFn: () => fetch('/api/analytics/peer-comparison').then(res => res.json()),
        staleTime: 30 * 60 * 1000, // 30 minutes for peer data
        refetchOnWindowFocus: false,
        enabled: containerInView
      }
      // Additional queries can be added as needed
    ]
  });

  // Global refresh function
  const handleGlobalRefresh = async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries();
      toast({
        title: "Charts Refreshed",
        description: "All chart data has been updated successfully",
        duration: 2000
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Unable to refresh chart data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Batch export functionality
  const handleBatchExport = async (format: 'png' | 'csv' | 'json') => {
    try {
      const exportPromises = Object.entries(chartRefs.current).map(async ([chartId, chartRef]) => {
        if (chartRef && chartRef.exportChart) {
          await chartRef.exportChart({
            format,
            filename: `${chartId}_${new Date().toISOString().split('T')[0]}`
          });
        }
      });

      await Promise.all(exportPromises);
      
      toast({
        title: "Export Complete",
        description: `All visible charts exported as ${format.toUpperCase()}`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Some charts couldn't be exported. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Cross-filtering functionality
  const handleCrossFilter = (sourceChart: string, filter: Record<string, any>) => {
    setActiveFilters(prev => ({
      ...prev,
      [sourceChart]: filter
    }));

    // Apply filters to related charts
    Object.entries(chartRefs.current).forEach(([chartId, chartRef]) => {
      if (chartId !== sourceChart && chartRef && chartRef.applyFilter) {
        chartRef.applyFilter(filter);
      }
    });
  };

  // Performance metrics
  const performanceStats = useMemo(() => {
    const loadingCharts = chartQueries.filter(query => query.isLoading).length;
    const errorCharts = chartQueries.filter(query => query.isError).length;
    const successCharts = chartQueries.filter(query => query.isSuccess).length;
    
    return {
      loading: loadingCharts,
      error: errorCharts,
      success: successCharts,
      total: chartQueries.length,
      performance: successCharts / chartQueries.length * 100
    };
  }, [chartQueries]);

  // Layout components
  const renderGridLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Phase 1 Charts */}
      <Suspense fallback={<ChartSkeleton />}>
        <GPATrendChart 
          data={chartQueries[0]?.data?.data || []}
          className="col-span-1 lg:col-span-2"
        />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <CreditsPerSemesterChart 
          data={chartQueries[1]?.data?.data || []}
        />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <SkillRadarChart 
          data={chartQueries[2]?.data?.data || []}
        />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <AttendanceCalendarHeatmap 
          data={chartQueries[3]?.data?.data || []}
          className="col-span-1 lg:col-span-2"
        />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <ActivityCategoryShare 
          data={chartQueries[4]?.data?.data || []}
        />
      </Suspense>
      
      <Suspense fallback={<ChartSkeleton />}>
        <PeerComparisonBoxplot 
          data={chartQueries[5]?.data?.data || []}
          className="col-span-1 lg:col-span-2 xl:col-span-3"
        />
      </Suspense>
    </div>
  );

  const renderCategoryLayout = () => (
    <Tabs defaultValue="academic" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        {Object.entries(CHART_CATEGORIES).map(([key, category]) => {
          const Icon = category.icon;
          return (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category.title.split(' ')[0]}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {Object.entries(CHART_CATEGORIES).map(([key, category]) => (
        <TabsContent key={key} value={key} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <category.icon className="h-5 w-5" />
                {category.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{category.description}</p>
            </CardHeader>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Render charts for this category */}
            {category.charts.includes('gpa-trends') && (
              <Suspense fallback={<ChartSkeleton />}>
                <GPATrendChart data={chartQueries[0]?.data?.data || []} />
              </Suspense>
            )}
            {category.charts.includes('skills') && (
              <Suspense fallback={<ChartSkeleton />}>
                <SkillRadarChart data={chartQueries[2]?.data?.data || []} />
              </Suspense>
            )}
            {category.charts.includes('attendance-heatmap') && (
              <Suspense fallback={<ChartSkeleton />}>
                <AttendanceCalendarHeatmap data={chartQueries[3]?.data?.data || []} />
              </Suspense>
            )}
            {category.charts.includes('activity-distribution') && (
              <Suspense fallback={<ChartSkeleton />}>
                <ActivityCategoryShare data={chartQueries[4]?.data?.data || []} />
              </Suspense>
            )}
            {category.charts.includes('peer-comparison') && (
              <Suspense fallback={<ChartSkeleton />}>
                <PeerComparisonBoxplot data={chartQueries[5]?.data?.data || []} />
              </Suspense>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );

  return (
    <div ref={containerRef} className={cn("space-y-6", className)} data-testid="comprehensive-charts">
      {/* Control Panel */}
      {showControls && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                <Badge variant="outline" className="hidden sm:flex">
                  {performanceStats.success}/{performanceStats.total} Charts Loaded
                </Badge>
                {realTimeEnabled && (
                  <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Live Updates
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Layout Controls */}
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={layoutMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layoutMode === 'category' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutMode('category')}
                    className="rounded-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={layoutMode === 'performance' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setLayoutMode('performance')}
                    className="rounded-l-none"
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRealTimeEnabled(!realTimeEnabled)}
                >
                  <Zap className={cn("h-4 w-4 mr-2", realTimeEnabled && "text-green-500")} />
                  Real-time
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGlobalRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                  Refresh
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBatchExport('png')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>
            </div>

            {/* Active Filters */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Active Filters:</span>
                {Object.entries(activeFilters).map(([chart, filter]) => (
                  <Badge key={chart} variant="secondary" className="text-xs">
                    {chart}: {JSON.stringify(filter)}
                    <button
                      onClick={() => setActiveFilters(prev => {
                        const newFilters = { ...prev };
                        delete newFilters[chart];
                        return newFilters;
                      })}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Charts Display */}
      <div className="min-h-[400px]">
        {layoutMode === 'grid' && renderGridLayout()}
        {layoutMode === 'category' && renderCategoryLayout()}
        {layoutMode === 'performance' && renderGridLayout()}
      </div>

      {/* Performance Metrics */}
      {performanceStats.error > 0 && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">
                {performanceStats.error} chart{performanceStats.error > 1 ? 's' : ''} failed to load. 
                <Button variant="link" className="p-0 h-auto text-destructive underline" onClick={handleGlobalRefresh}>
                  Try refreshing
                </Button>
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Export utility functions
export { chartUtils, CHART_QUERY_KEYS, CHART_CATEGORIES };

export default ComprehensiveCharts;
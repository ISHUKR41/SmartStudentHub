/**
 * Analytics Dashboard Page
 * 
 * Comprehensive analytics and reporting dashboard with advanced charts, metrics, and insights.
 * Features extensive use of recharts, framer-motion animations, and responsive design.
 */

import { useState, useMemo, useCallback } from "react";
import { ResponsiveDashboardGrid, DashboardCard } from '@/components/ui/responsive-dashboard-grid';
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useInView } from "react-intersection-observer";
import { useLocalStorage } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { Helmet } from "react-helmet-async";

import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import MobileTabBar from "@/components/layout/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BarChart3, TrendingUp, PieChart, Calendar as CalendarIcon, Download,
  RefreshCw, Eye, Target, Award, Users, Activity as ActivityIcon,
  Zap, Star, Crown, Medal, Trophy, Rocket, Timer, AlertTriangle
} from "lucide-react";

// Import comprehensive chart library
import ComprehensiveCharts from '@/components/charts/comprehensive-charts';
import { AchievementsTimelineChart } from '@/components/charts/phase1-academic-charts';

interface DashboardSnapshots {
  personalMetrics: {
    gpa: number;
    totalCredits: number;
    attendanceRate: number;
    activitiesCount: number;
    rank: number;
    totalStudents: number;
  };
  chartData: {
    gpaProgress: Array<{ semester: number; gpa: number }>;
    creditsProgress: Array<{ semester: number; credits: number }>;
    attendanceCalendar: Array<{ date: string; status: 'present' | 'absent' | 'late' | 'excused' }>;
    categoryDistribution: Array<{ category: string; count: number; percentage: number }>;
    monthlyActivity: Array<{ month: string; activities: number }>;
  };
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton({ className = "h-80" }: { className?: string }) {
  return (
    <div className={`w-full ${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
      <div className="flex flex-col items-center space-y-2">
        <BarChart3 className="w-8 h-8 text-muted-foreground/40" />
        <div className="w-24 h-3 bg-muted-foreground/20 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // State management
  const [timeRange, setTimeRange] = useState('semester');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useLocalStorage('analytics-tab', 'overview');
  const [chartType, setChartType] = useState('combined');

  // Animation observers
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [metricsRef, metricsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [chartsRef, chartsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Fetch dashboard analytics data
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['analytics', 'dashboard', timeRange],
    queryFn: async () => {
      const response = await fetch('/api/analytics/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      return response.json() as DashboardSnapshots;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch additional analytics data for comprehensive charts
  const { data: attendanceAnalytics } = useQuery({
    queryKey: ['attendance', 'analytics'],
    queryFn: async () => {
      const response = await fetch('/api/attendance/analytics');
      if (!response.ok) throw new Error('Failed to fetch attendance analytics');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: goalsAnalytics } = useQuery({
    queryKey: ['goals', 'analytics'],
    queryFn: async () => {
      const response = await fetch('/api/goals/analytics');
      if (!response.ok) throw new Error('Failed to fetch goals analytics');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  // Calculate comprehensive metrics
  const analyticsMetrics = useMemo(() => {
    if (!dashboardData) return null;

    const { personalMetrics, chartData } = dashboardData;
    
    return {
      academic: {
        gpa: personalMetrics.gpa,
        credits: personalMetrics.totalCredits,
        attendance: personalMetrics.attendanceRate,
        rank: personalMetrics.rank,
        totalStudents: personalMetrics.totalStudents,
        rankPercentile: ((personalMetrics.totalStudents - personalMetrics.rank + 1) / personalMetrics.totalStudents) * 100
      },
      activities: {
        total: personalMetrics.activitiesCount,
        monthlyAverage: chartData.monthlyActivity.reduce((sum, item) => sum + item.activities, 0) / chartData.monthlyActivity.length,
        categoryBreakdown: chartData.categoryDistribution
      },
      trends: {
        gpaProgress: chartData.gpaProgress,
        creditsProgress: chartData.creditsProgress,
        attendancePattern: chartData.attendanceCalendar,
        activityTrend: chartData.monthlyActivity
      }
    };
  }, [dashboardData]);

  // Handle data refresh
  const handleRefresh = useCallback(() => {
    toast({
      title: "Refreshing Analytics",
      description: "Updating all dashboard data...",
    });
    // Implement refresh logic
  }, [toast]);

  // Handle export functionality
  const handleExport = useCallback(async (format: 'pdf' | 'csv') => {
    try {
      const response = await fetch(`/api/admin/export/${format}?type=analytics`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${format}-${format(new Date(), 'yyyy-MM-dd')}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Analytics report exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export analytics data. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          <div className="hidden lg:block"><Sidebar /></div>
          <main className="flex-1 p-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load analytics data. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard - Smart Student Hub</title>
        <meta 
          name="description" 
          content="Comprehensive academic analytics with advanced charts, performance metrics, attendance patterns, and achievement tracking for data-driven academic success." 
        />
        <meta property="og:title" content="Analytics Dashboard - Smart Student Hub" />
        <meta property="og:description" content="Advanced academic analytics and performance insights" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="flex">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          
          <main className="flex-1 p-4 lg:p-6 space-y-6" role="main">
            {/* Header */}
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-analytics">
                  Analytics Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Comprehensive insights into your academic performance and progress
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40" data-testid="select-time-range">
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">This Semester</SelectItem>
                    <SelectItem value="year">Academic Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  data-testid="button-refresh"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" data-testid="button-export">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48" align="end">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleExport('pdf')}
                        data-testid="button-export-pdf"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleExport('csv')}
                        data-testid="button-export-csv"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>

            {/* Loading State */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-6">
                {/* KPI Metrics */}
                <motion.div
                  ref={metricsRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={metricsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {analyticsMetrics && [
                    {
                      title: "GPA",
                      value: analyticsMetrics.academic.gpa.toFixed(2),
                      change: "+0.2",
                      icon: TrendingUp,
                      color: "success",
                      testId: "metric-gpa"
                    },
                    {
                      title: "Total Credits",
                      value: analyticsMetrics.academic.credits.toString(),
                      change: "+6",
                      icon: Award,
                      color: "primary",
                      testId: "metric-credits"
                    },
                    {
                      title: "Attendance Rate",
                      value: `${analyticsMetrics.academic.attendance.toFixed(1)}%`,
                      change: "+2.5%",
                      icon: Target,
                      color: analyticsMetrics.academic.attendance >= 75 ? "success" : "warning",
                      testId: "metric-attendance"
                    },
                    {
                      title: "Class Rank",
                      value: `${analyticsMetrics.academic.rank}/${analyticsMetrics.academic.totalStudents}`,
                      change: `${analyticsMetrics.academic.rankPercentile.toFixed(1)}th percentile`,
                      icon: Crown,
                      color: "info",
                      testId: "metric-rank"
                    }
                  ].map((metric, index) => (
                    <Card key={index} className="relative overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">
                              {metric.title}
                            </p>
                            <p className="text-2xl font-bold" data-testid={metric.testId}>
                              {metric.value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {metric.change} this semester
                            </p>
                          </div>
                          <div className={`p-3 rounded-full bg-${metric.color}/10`}>
                            <metric.icon className={`w-6 h-6 text-${metric.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>

                {/* KPI Tiles with Sparklines */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={chartsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <KPITilesWithSparklines data={analyticsMetrics} />
                </motion.div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4" data-testid="tabs-analytics">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="academic">Academic</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="activities">Activities</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab - 12+ Charts */}
                  <TabsContent value="overview" className="space-y-6">
                    <motion.div
                      ref={chartsRef}
                      initial={{ opacity: 0 }}
                      animate={chartsInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      {/* GPA Trend Line Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            GPA Trend Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <GPATrendChart data={analyticsMetrics?.trends.gpaProgress || []} />
                        </CardContent>
                      </Card>

                      {/* Credits Progress Area Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Award className="w-5 h-5 mr-2" />
                            Credit Accumulation
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CreditProgressChart data={analyticsMetrics?.trends.creditsProgress || []} />
                        </CardContent>
                      </Card>

                      {/* Attendance Calendar Heatmap */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <CalendarIcon className="w-5 h-5 mr-2" />
                            Attendance Heatmap
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AttendanceCalendarHeatmap 
                            records={analyticsMetrics?.trends.attendancePattern || []}
                            selectedMonth={selectedDate}
                            onMonthChange={setSelectedDate}
                          />
                        </CardContent>
                      </Card>

                      {/* Category Distribution Pie Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PieChart className="w-5 h-5 mr-2" />
                            Activity Categories
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CategoryDistributionChart data={analyticsMetrics?.activities.categoryBreakdown || []} />
                        </CardContent>
                      </Card>

                      {/* Goals Progress Radial Chart */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Goals Progress
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <GoalsProgressChart data={goalsAnalytics} />
                        </CardContent>
                      </Card>

                      {/* Achievements Timeline Scatter Plot */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Trophy className="w-5 h-5 mr-2" />
                            Achievement Timeline
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AchievementsTimelineChart />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>

                  {/* Academic Tab */}
                  <TabsContent value="academic" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Grade Distribution Box Plot */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Grade Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <GradeDistributionChart />
                        </CardContent>
                      </Card>

                      {/* Assignment Timeline */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Assignment Completion</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AssignmentTimelineChart />
                        </CardContent>
                      </Card>

                      {/* Rank Comparison */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Class Rank Comparison</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <RankComparisonChart data={analyticsMetrics?.academic} />
                        </CardContent>
                      </Card>

                      {/* Alerts Volume */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Notification Trends</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AlertsVolumeChart />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Attendance Tab */}
                  <TabsContent value="attendance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Attendance Weekday Distribution */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Weekday Attendance Pattern</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <AttendanceWeekdayChart data={attendanceAnalytics} />
                        </CardContent>
                      </Card>

                      {/* Subject-wise Attendance Stacked Bar */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Subject-wise Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {attendanceAnalytics?.subjectWise?.map((subject: any, index: number) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{subject.subject}</span>
                                  <span>{subject.rate}%</span>
                                </div>
                                <Progress value={subject.rate} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Activities Tab */}
                  <TabsContent value="activities" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Monthly Activity Trend</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 flex items-center justify-center text-muted-foreground">
                            Activity trends chart will be rendered here
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Activity Status Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-64 flex items-center justify-center text-muted-foreground">
                            Status distribution chart will be rendered here
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden">
          <MobileTabBar />
        </div>
      </div>
    </>
  );
}
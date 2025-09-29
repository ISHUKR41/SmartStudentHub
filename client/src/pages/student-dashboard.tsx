import { useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useInView } from "react-intersection-observer";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocalStorage } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { format } from "date-fns";
import toast from 'react-hot-toast';

import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import MobileTabBar from "@/components/layout/mobile-tab-bar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StatCard from "@/components/custom/stat-card";
import ActivityList from "@/components/custom/activity-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Legend, RadialBarChart, RadialBar, RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Treemap, FunnelChart, Funnel, ScatterChart, Scatter, ComposedChart
} from "recharts";

// Create proper chart skeleton component for loading states
function ChartSkeleton({ className = "h-[300px]" }: { className?: string }) {
  return (
    <div className={`w-full ${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
      <div className="flex flex-col items-center space-y-2">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded-full animate-pulse"></div>
        <div className="w-24 h-3 bg-muted-foreground/20 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

import {
  GraduationCap, ClipboardList, Star, Clock, Trophy, Download, Plus, Bell, Filter, RefreshCw,
  Users, Calendar, MapPin, Target, Award, CheckCircle, AlertCircle, TrendingUp, BarChart3,
  BookOpen, Heart, Crown, Shield, Medal, Rocket, User, Eye, Send, Zap, Activity as ActivityIcon,
  FileText, Code, Timer, Search, Settings, Moon, Sun, Maximize, Upload, Mail, Menu
} from "lucide-react";

import { Activity } from "@shared/schema";

// Lazy load heavy components for better performance
const VirtualActivityList = lazy(() => import("@/components/features/virtual-activity-list"));
const ActivitySearchFilter = lazy(() => import("@/components/features/activity-search-filter"));

// Real lazy loading with dynamic imports for true code-splitting
const ChartsSection = lazy(() => import("@/components/features/charts-section"));

interface StudentStats {
  totalActivities: number;
  skillCredits: number;
  pendingApprovals: number;
}

interface DashboardData {
  personalInfo: {
    name: string;
    rollNumber: string;
    department: string;
    currentSemester: number;
    cgpa: number;
    totalCredits: number;
    totalActivities: number;
    pendingApprovals: number;
    rank: number;
    totalStudents: number;
    attendance: number;
  };
  chartData: {
    semesterProgress: Array<{ semester: number; gpa: number; credits: number }>;
    skillProgress: Array<{ month: string; credits: number }>;
    categoryDistribution: Array<{ category: string; value: number; color: string }>;
    skillMatrix: Array<{ skill: string; level: number; category: string }>;
  };
}

export default function StudentDashboard() {
  const { toast: shadcnToast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloadingPortfolio, setIsDownloadingPortfolio] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useLocalStorage('dashboard-search', '');
  const [theme, setTheme] = useLocalStorage('dashboard-theme', 'light');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Intersection observers for animations and lazy loading
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [chartsRef, chartsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  // Enhanced reduced motion detection with runtime change listener
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Add listener for runtime changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Animation settings based on user preference with runtime updates
  const animationSettings = useMemo(() => {
    return {
      duration: prefersReducedMotion ? 0.1 : 0.6,
      initial: prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 },
      animate: prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
    };
  }, [prefersReducedMotion]);

  // Custom debounce hook for search term
  const useDebounceValue = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => clearTimeout(handler);
    }, [value, delay]);
    
    return debouncedValue;
  };
  
  const debouncedSearchTerm = useDebounceValue(searchTerm || '', 300);

  // Data queries
  const { data: studentStats, isLoading: statsLoading } = useQuery<StudentStats>({
    queryKey: ["/api/students/stats"],
    retry: false,
    enabled: isAuthenticated && !!user,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/students/activities"],
    retry: false,
    enabled: isAuthenticated && !!user,
  });

  // Dashboard data computation
  const dashboardData = useMemo<DashboardData>(() => ({
    personalInfo: {
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      rollNumber: user?.rollNumber || 'N/A',
      department: user?.department || 'Computer Science',
      currentSemester: user?.currentSemester || 6,
      cgpa: typeof user?.cgpa === 'number' ? user.cgpa : parseFloat(user?.cgpa || '8.75'),
      totalCredits: studentStats?.skillCredits || 191,
      totalActivities: studentStats?.totalActivities || activities?.length || 17,
      pendingApprovals: studentStats?.pendingApprovals || 3,
      rank: 12,
      totalStudents: 180,
      attendance: 94.5
    },
    chartData: {
      semesterProgress: [
        { semester: 1, gpa: 8.2, credits: 22 },
        { semester: 2, gpa: 8.5, credits: 24 },
        { semester: 3, gpa: 8.8, credits: 26 },
        { semester: 4, gpa: 8.6, credits: 25 },
        { semester: 5, gpa: 8.9, credits: 27 },
        { semester: 6, gpa: 8.75, credits: 26 }
      ],
      skillProgress: [
        { month: 'Aug', credits: 45 },
        { month: 'Sep', credits: 67 },
        { month: 'Oct', credits: 89 },
        { month: 'Nov', credits: 124 },
        { month: 'Dec', credits: 156 },
        { month: 'Jan', credits: 191 }
      ],
      categoryDistribution: [
        { category: 'Academic', value: 35, color: '#3b82f6' },
        { category: 'Technical', value: 25, color: '#10b981' },
        { category: 'Leadership', value: 20, color: '#f59e0b' },
        { category: 'Community', value: 12, color: '#ef4444' },
        { category: 'Research', value: 8, color: '#8b5cf6' }
      ],
      skillMatrix: [
        { skill: 'Machine Learning', level: 95, category: 'Technical' },
        { skill: 'Software Development', level: 92, category: 'Technical' },
        { skill: 'Research & Analysis', level: 88, category: 'Academic' },
        { skill: 'Team Leadership', level: 85, category: 'Soft Skills' },
        { skill: 'Communication', level: 90, category: 'Soft Skills' },
        { skill: 'Problem Solving', level: 93, category: 'Technical' }
      ]
    }
  }), [user, studentStats, activities]);

  // Filtered activities based on search and category
  const filteredActivities = useMemo(() => {
    if (!activities) return [];
    return activities.filter(activity => {
      const title = activity.title || '';
      const description = activity.description || '';
      const searchTerm = debouncedSearchTerm.toLowerCase();
      const matchesSearch = title.toLowerCase().includes(searchTerm) ||
                           description.toLowerCase().includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activities, debouncedSearchTerm, selectedCategory]);

  // Keyboard shortcuts
  useHotkeys('ctrl+f, cmd+f', (e) => {
    e.preventDefault();
    (document.querySelector('[data-testid="input-search"]') as HTMLInputElement)?.focus();
  }, { enableOnFormTags: false });

  useHotkeys('ctrl+n, cmd+n', (e) => {
    e.preventDefault();
    setLocation('/upload');
  });

  useHotkeys('ctrl+p, cmd+p', (e) => {
    e.preventDefault();
    handleDownloadPortfolio();
  });

  useHotkeys('ctrl+shift+d', () => setTheme(theme === 'light' ? 'dark' : 'light'));

  // Portfolio download handler
  const handleDownloadPortfolio = useCallback(async () => {
    if (isDownloadingPortfolio) return;
    
    setIsDownloadingPortfolio(true);
    
    try {
      const response = await fetch('/api/students/portfolio.pdf', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/pdf' },
      });

      if (!response.ok) throw new Error('Failed to generate portfolio');

      const pdfBlob = await response.blob();
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user?.firstName || 'Student'}_Portfolio_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);

      shadcnToast({
        title: "Portfolio Downloaded",
        description: "Your digital portfolio has been successfully generated.",
      });

    } catch (error) {
      shadcnToast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingPortfolio(false);
    }
  }, [isDownloadingPortfolio, user?.firstName, shadcnToast]);

  // Export data handler
  const handleExport = useCallback(async (exportType: 'csv' | 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/api/students/export/${exportType}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activities: filteredActivities, studentInfo: dashboardData.personalInfo })
      });

      if (!response.ok) throw new Error(`Failed to export ${exportType.toUpperCase()}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `student_data_${format(new Date(), 'yyyy-MM-dd')}.${exportType}`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`Data exported as ${exportType.toUpperCase()}`);
    } catch (error) {
      toast.error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [filteredActivities, dashboardData.personalInfo]);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, [theme, setTheme]);

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="flex min-h-[calc(100vh-72px)]">
          {/* Desktop Sidebar */}
          <Sidebar />
          
          {/* Mobile Sidebar Drawer */}
          <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-sm border border-border shadow-sm h-11 w-11 transition-all duration-200 hover:bg-accent active:scale-95"
                data-testid="button-mobile-sidebar"
                aria-label="Open sidebar menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="lg:hidden w-80 p-0">
              <div className="h-full overflow-y-auto">
                <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
          
          <main className="flex-1 min-w-0 pb-20 lg:pb-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6 space-y-4 lg:space-y-6 max-w-7xl">
            {/* Header */}
            <motion.div 
              ref={headerRef}
              initial={animationSettings.initial}
              animate={headerInView ? animationSettings.animate : animationSettings.initial}
              transition={{ duration: animationSettings.duration }}
              className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="flex-1">
                <h1 className="font-bold text-foreground" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}>
                  Academic Excellence Dashboard
                </h1>
                <p className="text-muted-foreground mt-1" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                  Welcome back, {dashboardData.personalInfo.name}
                </p>
                <div className="flex flex-wrap gap-3 mt-2 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                    <span>NIT Delhi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Academic Year 2024-25</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                    <span>NAAC A++</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleTheme}
                  className="min-w-[44px] min-h-[44px]"
                  aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                  data-testid="button-theme-toggle"
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="min-w-[44px] min-h-[44px]"
                  aria-label="Toggle notifications"
                  data-testid="button-notifications"
                >
                  <Bell className="w-4 h-4" />
                  <Badge className="ml-1 bg-red-500 text-white text-xs">3</Badge>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadPortfolio}
                  disabled={isDownloadingPortfolio}
                  className="min-w-[44px] min-h-[44px]"
                  aria-label="Download academic portfolio"
                  data-testid="button-download-portfolio"
                >
                  {isDownloadingPortfolio ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Portfolio
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={() => setLocation('/upload')}
                  className="min-w-[44px] min-h-[44px]"
                  aria-label="Add new activity"
                  data-testid="button-add-activity"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Activity
                </Button>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search activities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/80 dark:bg-gray-800/80"
                        data-testid="input-search"
                      />
                    </div>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-800/80">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-800/80">
                        <SelectValue placeholder="Export Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Export</SelectItem>
                        <SelectItem value="excel">Excel Export</SelectItem>
                        <SelectItem value="csv">CSV Export</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExport(exportFormat as any)}>
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}>
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Charts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards - Mobile-first responsive grid */}
            <motion.div 
              ref={statsRef}
              initial={animationSettings.initial}
              animate={statsInView ? animationSettings.animate : animationSettings.initial}
              transition={{ duration: animationSettings.duration }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              <StatCard
                title="Current CGPA"
                value={dashboardData.personalInfo.cgpa.toFixed(2)}
                icon={<GraduationCap className="w-6 h-6" />}
                color="success"
                subtitle={`Semester ${dashboardData.personalInfo.currentSemester}`}
                progress={(dashboardData.personalInfo.cgpa / 10) * 100}
              />

              <StatCard
                title="Total Activities"
                value={<CountUp end={dashboardData.personalInfo.totalActivities} duration={2} />}
                icon={<ClipboardList className="w-6 h-6" />}
                color="primary"
                subtitle="This academic year"
              />

              <StatCard
                title="Skill Credits"
                value={<CountUp end={dashboardData.personalInfo.totalCredits} duration={2.5} />}
                icon={<Star className="w-6 h-6" />}
                color="info"
                subtitle={`Target: 250 (${((dashboardData.personalInfo.totalCredits / 250) * 100).toFixed(1)}%)`}
                progress={(dashboardData.personalInfo.totalCredits / 250) * 100}
              />

              <StatCard
                title="Pending Approvals"
                value={<CountUp end={dashboardData.personalInfo.pendingApprovals} duration={1.5} />}
                icon={<Clock className="w-6 h-6" />}
                color="warning"
                subtitle="Awaiting faculty review"
              />

              <StatCard
                title="Academic Rank"
                value={`${dashboardData.personalInfo.rank}th`}
                icon={<Trophy className="w-6 h-6" />}
                color="success"
                subtitle={`Out of ${dashboardData.personalInfo.totalStudents}`}
                progress={(1 - (dashboardData.personalInfo.rank / dashboardData.personalInfo.totalStudents)) * 100}
              />
            </motion.div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Charts Section with Proper Parent-Level Code-Splitting Gating */}
                <motion.div 
                  ref={chartsRef}
                  initial={animationSettings.initial}
                  animate={chartsInView ? animationSettings.animate : animationSettings.initial}
                  transition={{ duration: animationSettings.duration }}
                >
                  {chartsInView ? (
                    <Suspense fallback={<ChartSkeleton className="w-full h-96" />}>
                      <ChartsSection 
                        dashboardData={dashboardData}
                        showAdvancedCharts={showAdvancedCharts}
                        animationSettings={animationSettings}
                      />
                    </Suspense>
                  ) : (
                    <ChartSkeleton className="w-full h-96" />
                  )}
                </motion.div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span>NAAC Compliance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">92%</div>
                          <div className="text-sm text-muted-foreground">Compliance Score</div>
                        </div>
                        <Progress value={92} className="h-2" />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">Academic</div>
                            <div className="text-blue-600">45 verified</div>
                          </div>
                          <div>
                            <div className="font-medium">Co-curricular</div>
                            <div className="text-green-600">32 verified</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Medal className="w-5 h-5 text-purple-600" />
                        <span>Skill Credits</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {dashboardData.personalInfo.totalCredits}
                          </div>
                          <div className="text-sm text-muted-foreground">Credits Earned</div>
                        </div>
                        <Progress value={(dashboardData.personalInfo.totalCredits / 250) * 100} className="h-2" />
                        <div className="text-sm text-muted-foreground text-center">
                          {250 - dashboardData.personalInfo.totalCredits} credits to target
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        <span>Performance</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">Top 10%</div>
                          <div className="text-sm text-muted-foreground">Class Rank</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="font-medium">CGPA</div>
                            <div className="text-green-600">{dashboardData.personalInfo.cgpa}</div>
                          </div>
                          <div>
                            <div className="font-medium">Attendance</div>
                            <div className="text-blue-600">{dashboardData.personalInfo.attendance}%</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base lg:text-lg">Credit Accumulation Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{ credits: { label: "Credits", color: "hsl(142, 76%, 36%)" } }}
                        className="aspect-[4/3] lg:aspect-[16/9] w-full"
                      >
                        <Suspense fallback={
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        }>
                          <AreaChart data={dashboardData.chartData.skillProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area type="monotone" dataKey="credits" stroke="hsl(142, 76%, 36%)" fill="hsl(142, 76%, 36%)" fillOpacity={0.6} />
                          </AreaChart>
                        </Suspense>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base lg:text-lg">Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer
                        config={{ value: { label: "Percentage", color: "hsl(221, 83%, 53%)" } }}
                        className="aspect-[4/3] lg:aspect-[16/9] w-full"
                      >
                        <Suspense fallback={
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          </div>
                        }>
                          <PieChart>
                            <Pie
                              data={dashboardData.chartData.categoryDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ category, value }) => `${category}: ${value}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {dashboardData.chartData.categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </Suspense>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Faculty Approval Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-green-500 text-white">PS</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">Dr. Priya Sharma</div>
                            <div className="text-sm text-muted-foreground">Computer Science HOD</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">2 pending</div>
                          <div className="text-xs text-muted-foreground">Avg: 1.5 days</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activities" className="space-y-6">
                <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading activities...</div>}>
                  {filteredActivities.length > 20 ? (
                    <VirtualActivityList
                      activities={filteredActivities}
                      height={600}
                      isLoading={activitiesLoading}
                    />
                  ) : (
                    <ActivityList
                      activities={filteredActivities}
                      isLoading={activitiesLoading}
                      showActions={true}
                    />
                  )}
                </Suspense>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.chartData.skillMatrix.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{skill.skill}</span>
                              <span className="text-sm text-primary">{skill.level}%</span>
                            </div>
                            <Progress value={skill.level} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Achievement Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent"></div>
                          <div className="space-y-6">
                            {activities?.slice(0, 5).map((activity, index) => (
                              <div key={activity.id} className="relative flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <ActivityIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 bg-card p-4 rounded-lg border">
                                  <div className="font-medium">{activity.title}</div>
                                  <div className="text-sm text-muted-foreground mt-1">{activity.organization}</div>
                                  <div className="flex items-center justify-between mt-2">
                                    <Badge variant={activity.status === 'approved' ? 'default' : 'secondary'}>
                                      {activity.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(activity.activityDate), 'MMM dd, yyyy')}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Achievement Summary */}
            <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-500/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Rocket className="w-5 h-5 text-primary" />
                  <span>Achievement Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {dashboardData.personalInfo.totalActivities}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {dashboardData.personalInfo.totalCredits}
                    </div>
                    <div className="text-sm text-muted-foreground">Skill Credits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {dashboardData.personalInfo.cgpa}
                    </div>
                    <div className="text-sm text-muted-foreground">Current CGPA</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-card rounded-lg border">
                  <div className="text-sm font-medium mb-2">Next Milestone</div>
                  <div className="text-sm text-muted-foreground">
                    You're <span className="font-bold text-primary">{250 - dashboardData.personalInfo.totalCredits} credits away</span> from 
                    reaching the NAAC excellence threshold. Keep up the outstanding work!
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </main>
        </div>
        
        {/* Mobile Tab Bar - Conditionally rendered for small screens only */}
        <div className="lg:hidden">
          <MobileTabBar />
        </div>
      </div>
    </TooltipProvider>
  );
}
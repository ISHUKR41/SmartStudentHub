import { useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useInView } from "react-intersection-observer";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocalStorage, useMedia, useWindowSize } from "react-use";
import { motion, AnimatePresence, useSpring, animated } from "framer-motion";
import CountUp from "react-countup";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO } from "date-fns";
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import * as echarts from 'echarts';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip as ChartTooltipPlugin, 
  Legend, 
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Line as LineChartJS, Bar as BarChartJS, Pie as PieChartJS, Doughnut, Radar as RadarChartJS, PolarArea } from 'react-chartjs-2';
import { VictoryChart, VictoryLine, VictoryArea, VictoryBar, VictoryTheme, VictoryPie, VictoryScatter } from 'victory';
import moment from 'moment';
import _ from 'lodash';

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
  ResponsiveContainer, Legend as RechartsLegend, RadialBarChart, RadialBar, RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Treemap, FunnelChart, Funnel, ScatterChart, Scatter, ComposedChart
} from "recharts";

// Create proper chart skeleton component for loading states
function ChartSkeleton({ className = "h-[260px] sm:h-[300px] md:h-[340px] lg:h-[380px] xl:h-[420px] 2xl:h-[460px]" }: { className?: string }) {
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

import { activities } from "@shared/schema";

// Type for activity based on the activities table
type Activity = typeof activities.$inferSelect;

// Register Chart.js components for comprehensive charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltipPlugin,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Lazy load heavy components for better performance
const VirtualActivityList = lazy(() => import("@/components/features/virtual-activity-list"));
const ActivitySearchFilter = lazy(() => import("@/components/features/activity-search-filter"));

// Real lazy loading with dynamic imports for true code-splitting
const ChartsSection = lazy(() => import("@/components/features/charts-section"));

// Advanced responsive breakpoints for all device types
const BREAKPOINTS = {
  xs: 320,    // Small phones
  sm: 576,    // Large phones
  md: 768,    // Tablets
  lg: 992,    // Small laptops
  xl: 1200,   // Desktops
  xxl: 1400,  // Large desktops
  xxxl: 1920, // 4K monitors
  xxxxl: 2560 // Ultra-wide monitors
} as const;

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
    academicYear: string;
    profileCompleteness: number;
    lastActivityDate: string;
    upcomingDeadlines: number;
    monthlyCredits: number;
    skillsAcquired: number;
    certificationsEarned: number;
    projectsCompleted: number;
    internshipsCompleted: number;
    leadershipRoles: number;
    volunteeringHours: number;
    researchPapers: number;
    competitionsWon: number;
  };
  chartData: {
    semesterProgress: Array<{ semester: number; gpa: number; credits: number; subjects: number }>;
    skillProgress: Array<{ month: string; credits: number; activities: number; achievements: number }>;
    categoryDistribution: Array<{ category: string; value: number; color: string; percentage: number }>;
    skillMatrix: Array<{ skill: string; level: number; category: string; priority: string }>;
    attendanceTrends: Array<{ date: string; present: number; absent: number; late: number; total: number }>;
    performanceMetrics: Array<{ metric: string; current: number; target: number; trend: string }>;
    weeklyActivity: Array<{ day: string; activities: number; hours: number }>;
    monthlyGrowth: Array<{ month: string; skills: number; credits: number; achievements: number }>;
    competitiveAnalysis: Array<{ peer: string; credits: number; activities: number; rank: number }>;
    goalProgress: Array<{ goal: string; progress: number; target: number; deadline: string }>;
    technologyStack: Array<{ technology: string; proficiency: number; projects: number; hours: number }>;
    industryRelevance: Array<{ industry: string; relevance: number; opportunities: number }>;
    certificationProgress: Array<{ certification: string; completed: number; total: number; priority: string }>;
    networkGrowth: Array<{ month: string; connections: number; mentors: number; collaborations: number }>;
    timeAllocation: Array<{ category: string; hours: number; percentage: number; efficiency: number }>;
  };
  realTimeMetrics: {
    currentStreak: number;
    weeklyProgress: number;
    monthlyGrowth: number;
    yearlyImprovement: number;
    peakPerformanceDay: string;
    averageWeeklyHours: number;
    productivityScore: number;
    focusAreas: string[];
    upcomingMilestones: Array<{ title: string; date: string; progress: number }>;
    recentAchievements: Array<{ title: string; date: string; category: string; impact: string }>;
  };
}

export default function StudentDashboard() {
  const { toast: shadcnToast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Comprehensive responsive design hooks
  const windowSize = useWindowSize();
  const isMobile = useMedia('(max-width: 767px)');
  const isTablet = useMedia('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMedia('(min-width: 1024px)');
  const isLargeScreen = useMedia('(min-width: 1400px)');
  const isUltraWide = useMedia('(min-width: 1920px)');
  const is4K = useMedia('(min-width: 2560px)');
  
  // State management with enhanced features
  const [activeTab, setActiveTab] = useState('overview');
  const [activeChartSection, setActiveChartSection] = useState('performance');
  const [isDownloadingPortfolio, setIsDownloadingPortfolio] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useLocalStorage('dashboard-search', '');
  const [theme, setTheme] = useLocalStorage('dashboard-theme', 'light');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [showAdvancedCharts, setShowAdvancedCharts] = useState(false);
  const [showRealTimeUpdates, setShowRealTimeUpdates] = useState(true);
  const [chartLibrary, setChartLibrary] = useState('recharts');
  const [dashboardLayout, setDashboardLayout] = useState('grid');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);
  const [enableAnimations, setEnableAnimations] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [pinnedMetrics, setPinnedMetrics] = useLocalStorage<string[]>('pinned-metrics', []);

  // Advanced intersection observers for comprehensive lazy loading
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [chartsRef, chartsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [analyticsRef, analyticsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [goalsRef, goalsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [achievementsRef, achievementsInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [timelineRef, timelineInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
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

  // Comprehensive dashboard data computation with extensive metrics
  const dashboardData = useMemo<DashboardData>(() => ({
    personalInfo: {
      name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      rollNumber: user?.rollNumber || 'N/A',
      department: user?.department || 'Computer Science & Engineering',
      currentSemester: user?.currentSemester || 6,
      cgpa: typeof user?.cgpa === 'number' ? user.cgpa : parseFloat(user?.cgpa || '8.75'),
      totalCredits: studentStats?.skillCredits || 378,
      totalActivities: studentStats?.totalActivities || activities?.length || 17,
      pendingApprovals: studentStats?.pendingApprovals || 0,
      rank: 12,
      totalStudents: 180,
      attendance: 94.5,
      academicYear: '2024-25',
      profileCompleteness: 95,
      lastActivityDate: '2024-09-25',
      upcomingDeadlines: 3,
      monthlyCredits: 45,
      skillsAcquired: 24,
      certificationsEarned: 8,
      projectsCompleted: 12,
      internshipsCompleted: 2,
      leadershipRoles: 4,
      volunteeringHours: 156,
      researchPapers: 3,
      competitionsWon: 5
    },
    chartData: {
      semesterProgress: [
        { semester: 1, gpa: 8.2, credits: 22, subjects: 6 },
        { semester: 2, gpa: 8.5, credits: 24, subjects: 6 },
        { semester: 3, gpa: 8.8, credits: 26, subjects: 7 },
        { semester: 4, gpa: 8.6, credits: 25, subjects: 6 },
        { semester: 5, gpa: 8.9, credits: 27, subjects: 7 },
        { semester: 6, gpa: 8.75, credits: 26, subjects: 6 }
      ],
      skillProgress: [
        { month: 'Apr', credits: 67, activities: 3, achievements: 1 },
        { month: 'May', credits: 89, activities: 4, achievements: 2 },
        { month: 'Jun', credits: 124, activities: 5, achievements: 1 },
        { month: 'Jul', credits: 156, activities: 3, achievements: 3 },
        { month: 'Aug', credits: 198, activities: 6, achievements: 2 },
        { month: 'Sep', credits: 245, activities: 4, achievements: 1 },
        { month: 'Oct', credits: 289, activities: 5, achievements: 2 },
        { month: 'Nov', credits: 334, activities: 3, achievements: 1 },
        { month: 'Dec', credits: 356, activities: 2, achievements: 1 },
        { month: 'Jan', credits: 378, activities: 4, achievements: 2 }
      ],
      categoryDistribution: [
        { category: 'Academic', value: 35, color: '#3b82f6', percentage: 30.4 },
        { category: 'Technical', value: 28, color: '#10b981', percentage: 24.3 },
        { category: 'Leadership', value: 22, color: '#f59e0b', percentage: 19.1 },
        { category: 'Co-curricular', value: 18, color: '#ef4444', percentage: 15.7 },
        { category: 'Research', value: 12, color: '#8b5cf6', percentage: 10.4 }
      ],
      skillMatrix: [
        { skill: 'Machine Learning', level: 95, category: 'Technical', priority: 'high' },
        { skill: 'Software Development', level: 92, category: 'Technical', priority: 'high' },
        { skill: 'Data Science', level: 88, category: 'Technical', priority: 'medium' },
        { skill: 'Cloud Computing', level: 85, category: 'Technical', priority: 'high' },
        { skill: 'Research & Analysis', level: 88, category: 'Academic', priority: 'medium' },
        { skill: 'Team Leadership', level: 85, category: 'Soft Skills', priority: 'high' },
        { skill: 'Communication', level: 90, category: 'Soft Skills', priority: 'high' },
        { skill: 'Problem Solving', level: 93, category: 'Technical', priority: 'high' },
        { skill: 'Project Management', level: 82, category: 'Management', priority: 'medium' },
        { skill: 'Innovation', level: 87, category: 'Creative', priority: 'medium' }
      ],
      attendanceTrends: _.range(30).map(i => {
        const date = moment().subtract(29 - i, 'days').format('YYYY-MM-DD');
        const isWeekend = moment(date).day() === 0 || moment(date).day() === 6;
        return {
          date,
          present: isWeekend ? 0 : Math.floor(Math.random() * 8) + 1,
          absent: isWeekend ? 0 : Math.floor(Math.random() * 2),
          late: isWeekend ? 0 : Math.floor(Math.random() * 1),
          total: isWeekend ? 0 : 8
        };
      }),
      performanceMetrics: [
        { metric: 'Academic Performance', current: 8.75, target: 9.0, trend: 'up' },
        { metric: 'Skill Development', current: 378, target: 400, trend: 'up' },
        { metric: 'Attendance Rate', current: 94.5, target: 95.0, trend: 'stable' },
        { metric: 'Project Completion', current: 92, target: 95, trend: 'up' },
        { metric: 'Industry Relevance', current: 88, target: 90, trend: 'up' },
        { metric: 'Peer Collaboration', current: 85, target: 88, trend: 'up' }
      ],
      weeklyActivity: [
        { day: 'Mon', activities: 3, hours: 6.5 },
        { day: 'Tue', activities: 4, hours: 7.2 },
        { day: 'Wed', activities: 2, hours: 5.8 },
        { day: 'Thu', activities: 5, hours: 8.1 },
        { day: 'Fri', activities: 3, hours: 6.9 },
        { day: 'Sat', activities: 2, hours: 4.5 },
        { day: 'Sun', activities: 1, hours: 3.2 }
      ],
      monthlyGrowth: _.range(12).map(i => {
        const month = moment().subtract(11 - i, 'months').format('MMM');
        return {
          month,
          skills: Math.floor(Math.random() * 5) + i * 2,
          credits: Math.floor(Math.random() * 30) + i * 15,
          achievements: Math.floor(Math.random() * 3) + 1
        };
      }),
      competitiveAnalysis: [
        { peer: 'Top 10%', credits: 420, activities: 22, rank: 1 },
        { peer: 'Top 25%', credits: 360, activities: 18, rank: 2 },
        { peer: 'You', credits: 378, activities: 17, rank: 12 },
        { peer: 'Average', credits: 280, activities: 14, rank: 90 },
        { peer: 'Bottom 25%', credits: 200, activities: 10, rank: 135 }
      ],
      goalProgress: [
        { goal: 'Complete AWS Certification', progress: 85, target: 100, deadline: '2024-12-31' },
        { goal: 'Publish Research Paper', progress: 65, target: 100, deadline: '2024-11-30' },
        { goal: 'Reach 400 Skill Credits', progress: 95, target: 100, deadline: '2024-12-15' },
        { goal: 'Master React & Node.js', progress: 78, target: 100, deadline: '2024-10-31' },
        { goal: 'Complete Internship Project', progress: 92, target: 100, deadline: '2024-10-15' }
      ],
      technologyStack: [
        { technology: 'Python', proficiency: 95, projects: 12, hours: 450 },
        { technology: 'JavaScript', proficiency: 88, projects: 8, hours: 320 },
        { technology: 'React', proficiency: 85, projects: 6, hours: 280 },
        { technology: 'Node.js', proficiency: 82, projects: 5, hours: 240 },
        { technology: 'Machine Learning', proficiency: 92, projects: 7, hours: 380 },
        { technology: 'AWS', proficiency: 78, projects: 4, hours: 180 },
        { technology: 'Docker', proficiency: 75, projects: 3, hours: 120 },
        { technology: 'PostgreSQL', proficiency: 80, projects: 6, hours: 160 }
      ],
      industryRelevance: [
        { industry: 'Software Development', relevance: 95, opportunities: 45 },
        { industry: 'Data Science', relevance: 92, opportunities: 38 },
        { industry: 'AI/ML Engineering', relevance: 90, opportunities: 42 },
        { industry: 'Cloud Computing', relevance: 85, opportunities: 35 },
        { industry: 'Product Management', relevance: 78, opportunities: 28 },
        { industry: 'Research & Development', relevance: 88, opportunities: 22 }
      ],
      certificationProgress: [
        { certification: 'AWS Solutions Architect', completed: 8, total: 10, priority: 'high' },
        { certification: 'Google Cloud Professional', completed: 6, total: 12, priority: 'medium' },
        { certification: 'Microsoft Azure Fundamentals', completed: 4, total: 8, priority: 'medium' },
        { certification: 'Deep Learning Specialization', completed: 5, total: 5, priority: 'completed' },
        { certification: 'React Developer Certification', completed: 7, total: 9, priority: 'high' }
      ],
      networkGrowth: _.range(12).map(i => {
        const month = moment().subtract(11 - i, 'months').format('MMM');
        return {
          month,
          connections: Math.floor(Math.random() * 15) + i * 8,
          mentors: Math.floor(Math.random() * 3) + 1,
          collaborations: Math.floor(Math.random() * 5) + i * 2
        };
      }),
      timeAllocation: [
        { category: 'Academic Study', hours: 35, percentage: 41.2, efficiency: 88 },
        { category: 'Project Work', hours: 20, percentage: 23.5, efficiency: 92 },
        { category: 'Skill Development', hours: 15, percentage: 17.6, efficiency: 85 },
        { category: 'Research', hours: 8, percentage: 9.4, efficiency: 90 },
        { category: 'Networking', hours: 5, percentage: 5.9, efficiency: 78 },
        { category: 'Extracurricular', hours: 2, percentage: 2.4, efficiency: 82 }
      ]
    },
    realTimeMetrics: {
      currentStreak: 15,
      weeklyProgress: 87,
      monthlyGrowth: 12.5,
      yearlyImprovement: 34.8,
      peakPerformanceDay: 'Thursday',
      averageWeeklyHours: 42.3,
      productivityScore: 89,
      focusAreas: ['Machine Learning', 'Cloud Computing', 'Full Stack Development'],
      upcomingMilestones: [
        { title: 'Complete Internship Project', date: '2024-10-15', progress: 92 },
        { title: 'AWS Certification Exam', date: '2024-10-25', progress: 85 },
        { title: 'Research Paper Submission', date: '2024-11-30', progress: 65 }
      ],
      recentAchievements: [
        { title: 'Best Paper Award - Technical Symposium', date: '2024-09-20', category: 'Academic', impact: 'High' },
        { title: 'Google Summer of Code Completion', date: '2024-09-15', category: 'Technical', impact: 'Very High' },
        { title: 'Team Leadership in Hackathon', date: '2024-09-10', category: 'Leadership', impact: 'Medium' },
        { title: 'Open Source Contribution', date: '2024-09-05', category: 'Technical', impact: 'Medium' }
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

  // Responsive grid configuration based on device type
  const getResponsiveConfig = () => {
    if (is4K) return { columns: 5, gap: 8, padding: 8 };
    if (isUltraWide) return { columns: 4, gap: 6, padding: 6 };
    if (isLargeScreen) return { columns: 3, gap: 6, padding: 6 };
    if (isDesktop) return { columns: 2, gap: 4, padding: 4 };
    if (isTablet) return { columns: 2, gap: 3, padding: 4 };
    return { columns: 1, gap: 3, padding: 3 };
  };

  const responsiveConfig = getResponsiveConfig();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Ultra-Responsive Container System */}
        <div 
          className={`
            container mx-auto max-w-none
            px-${responsiveConfig.padding} 
            pb-16 sm:pb-4 lg:pb-6 xl:pb-8
            ${isMobile ? 'pt-2' : 'pt-4'}
            ${isTablet ? 'max-w-7xl' : ''}
            ${isDesktop ? 'max-w-screen-xl' : ''}
            ${isLargeScreen ? 'max-w-screen-2xl' : ''}
            ${isUltraWide ? 'max-w-screen-3xl' : ''}
            ${is4K ? 'max-w-none' : ''}
          `}
          style={{
            maxWidth: is4K ? '95vw' : isUltraWide ? '90vw' : undefined
          }}
        >
          
          {/* Advanced Responsive Grid Layout */}
          <div className={`
            grid gap-${responsiveConfig.gap}
            ${isMobile ? 'grid-cols-1' : ''}
            ${isTablet ? 'grid-cols-12' : ''}
            ${isDesktop ? 'grid-cols-12' : ''}
            ${isLargeScreen ? 'grid-cols-16' : ''}
            ${isUltraWide ? 'grid-cols-20' : ''}
            ${is4K ? 'grid-cols-24' : ''}
          `}>
            
            {/* Main Content Area with Adaptive Spans */}
            <main className={`
              min-w-0 relative
              ${isMobile ? 'col-span-1' : ''}
              ${isTablet ? 'col-span-8' : ''}
              ${isDesktop ? 'col-span-8' : ''}
              ${isLargeScreen ? 'col-span-11' : ''}
              ${isUltraWide ? 'col-span-14' : ''}
              ${is4K ? 'col-span-17' : ''}
            `}>
              <div className={`space-y-${responsiveConfig.gap} py-${responsiveConfig.padding}`}>
              {/* Mobile Sidebar Drawer */}
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-sm border border-border shadow-sm min-h-[44px] min-w-[44px] transition-all duration-200 hover:bg-accent active:scale-95"
                    style={{
                      paddingTop: 'max(16px, env(safe-area-inset-top))',
                      paddingLeft: 'max(16px, env(safe-area-inset-left))'
                    }}
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

              {/* Comprehensive Dashboard Header */}
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
                      <span>Academic Year {dashboardData.personalInfo.academicYear}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-3 h-3 md:w-4 md:h-4" />
                      <span>NAAC A++ Institution</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Rank {dashboardData.personalInfo.rank} of {dashboardData.personalInfo.totalStudents}</span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Action Buttons */}
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
                    onClick={() => setShowRealTimeUpdates(!showRealTimeUpdates)}
                    className="min-w-[44px] min-h-[44px]"
                    aria-label="Toggle real-time updates"
                    data-testid="button-realtime-toggle"
                  >
                    <RefreshCw className={`w-4 h-4 ${showRealTimeUpdates ? 'animate-spin' : ''}`} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="min-w-[44px] min-h-[44px] relative"
                    aria-label="Toggle notifications"
                    data-testid="button-notifications"
                  >
                    <Bell className="w-4 h-4" />
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {dashboardData.personalInfo.upcomingDeadlines}
                    </Badge>
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

                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowAdvancedCharts(!showAdvancedCharts)}
                    className="min-w-[44px] min-h-[44px]"
                    aria-label="Toggle advanced charts"
                    data-testid="button-advanced-charts"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    {showAdvancedCharts ? 'Simple' : 'Advanced'}
                  </Button>
                </div>
              </motion.div>

            {/* Enhanced Search and Filters Section */}
            <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-200/50 dark:border-blue-800/50">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className={`
                    flex-1 grid gap-3
                    ${isMobile ? 'grid-cols-1' : ''}
                    ${isTablet ? 'grid-cols-2' : ''}
                    ${isDesktop ? 'grid-cols-3' : ''}
                    ${isLargeScreen ? 'grid-cols-4' : ''}
                    ${isUltraWide ? 'grid-cols-5' : ''}
                  `}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search activities, skills, achievements..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/80 dark:bg-gray-800/80 border-blue-200/50 focus:border-blue-400 transition-colors"
                        data-testid="input-search"
                      />
                    </div>
                    
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-blue-200/50">
                        <SelectValue placeholder="Category Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="co-curricular">Co-curricular</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-blue-200/50">
                        <SelectValue placeholder="Time Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1month">Last Month</SelectItem>
                        <SelectItem value="3months">Last 3 Months</SelectItem>
                        <SelectItem value="6months">Last 6 Months</SelectItem>
                        <SelectItem value="1year">Last Year</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={chartLibrary} onValueChange={setChartLibrary}>
                      <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-blue-200/50">
                        <SelectValue placeholder="Chart Library" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recharts">Recharts</SelectItem>
                        <SelectItem value="chartjs">Chart.js</SelectItem>
                        <SelectItem value="echarts">ECharts</SelectItem>
                        <SelectItem value="victory">Victory</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {(isLargeScreen || isUltraWide) && (
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger className="bg-white/80 dark:bg-gray-800/80 border-blue-200/50">
                          <SelectValue placeholder="Export Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF Report</SelectItem>
                          <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                          <SelectItem value="csv">CSV Data</SelectItem>
                          <SelectItem value="json">JSON Data</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExport(exportFormat as any)} className="bg-white/80 dark:bg-gray-800/80">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowDetailedMetrics(!showDetailedMetrics)} className="bg-white/80 dark:bg-gray-800/80">
                      <Eye className="w-4 h-4 mr-1" />
                      {showDetailedMetrics ? 'Simple' : 'Detailed'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setDashboardLayout(dashboardLayout === 'grid' ? 'list' : 'grid')} className="bg-white/80 dark:bg-gray-800/80">
                      <Settings className="w-4 h-4 mr-1" />
                      Layout
                    </Button>
                    {isLargeScreen && (
                      <Button variant="outline" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className="bg-white/80 dark:bg-gray-800/80">
                        <RefreshCw className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                        Auto-Refresh
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comprehensive Stats Cards - Ultra-Responsive Grid */}
            <motion.div 
              ref={statsRef}
              initial={animationSettings.initial}
              animate={statsInView ? animationSettings.animate : animationSettings.initial}
              transition={{ duration: animationSettings.duration }}
              className={`
                grid gap-3 sm:gap-4 lg:gap-6
                ${isMobile ? 'grid-cols-1' : ''}
                ${isTablet ? 'grid-cols-2' : ''}
                ${isDesktop ? 'grid-cols-4' : ''}
                ${isLargeScreen ? 'grid-cols-5' : ''}
                ${isUltraWide ? 'grid-cols-6' : ''}
                ${is4K ? 'grid-cols-8' : ''}
              `}
            >
              {/* Primary Academic Metrics */}
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
                subtitle="Completed & Verified"
                progress={(dashboardData.personalInfo.totalActivities / 25) * 100}
              />

              <StatCard
                title="Skill Credits"
                value={<CountUp end={dashboardData.personalInfo.totalCredits} duration={2} />}
                icon={<Star className="w-6 h-6" />}
                color="warning"
                subtitle="Academic Excellence"
                progress={(dashboardData.personalInfo.totalCredits / 400) * 100}
              />

              <StatCard
                title="Academic Rank"
                value={<CountUp end={dashboardData.personalInfo.rank} duration={2} />}
                icon={<Trophy className="w-6 h-6" />}
                color="success"
                subtitle={`of ${dashboardData.personalInfo.totalStudents} students`}
                progress={100 - (dashboardData.personalInfo.rank / dashboardData.personalInfo.totalStudents) * 100}
              />

              {/* Extended Metrics for Larger Screens */}
              {(isLargeScreen || isUltraWide || is4K) && (
                <>
                  <StatCard
                    title="Attendance Rate"
                    value={`${dashboardData.personalInfo.attendance}%`}
                    icon={<Calendar className="w-6 h-6" />}
                    color={dashboardData.personalInfo.attendance >= 95 ? "success" : dashboardData.personalInfo.attendance >= 90 ? "warning" : "destructive"}
                    subtitle="This Semester"
                    progress={dashboardData.personalInfo.attendance}
                  />

                  <StatCard
                    title="Profile Complete"
                    value={`${dashboardData.personalInfo.profileCompleteness}%`}
                    icon={<User className="w-6 h-6" />}
                    color="primary"
                    subtitle="Academic Profile"
                    progress={dashboardData.personalInfo.profileCompleteness}
                  />
                </>
              )}

              {/* Ultra-Wide Screen Additional Metrics */}
              {(isUltraWide || is4K) && (
                <>
                  <StatCard
                    title="Monthly Credits"
                    value={<CountUp end={dashboardData.personalInfo.monthlyCredits} duration={2} />}
                    icon={<TrendingUp className="w-6 h-6" />}
                    color="primary"
                    subtitle="This Month"
                    progress={(dashboardData.personalInfo.monthlyCredits / 60) * 100}
                  />

                  <StatCard
                    title="Certifications"
                    value={<CountUp end={dashboardData.personalInfo.certificationsEarned} duration={2} />}
                    icon={<Award className="w-6 h-6" />}
                    color="warning"
                    subtitle="Earned"
                    progress={(dashboardData.personalInfo.certificationsEarned / 12) * 100}
                  />
                </>
              )}

              {/* 4K Screen Ultra-Detailed Metrics */}
              {is4K && (
                <>
                  <StatCard
                    title="Research Papers"
                    value={<CountUp end={dashboardData.personalInfo.researchPapers} duration={2} />}
                    icon={<BookOpen className="w-6 h-6" />}
                    color="success"
                    subtitle="Published"
                    progress={(dashboardData.personalInfo.researchPapers / 5) * 100}
                  />

                  <StatCard
                    title="Leadership Roles"
                    value={<CountUp end={dashboardData.personalInfo.leadershipRoles} duration={2} />}
                    icon={<Crown className="w-6 h-6" />}
                    color="primary"
                    subtitle="Active"
                    progress={(dashboardData.personalInfo.leadershipRoles / 6) * 100}
                  />

                  <StatCard
                    title="Volunteer Hours"
                    value={<CountUp end={dashboardData.personalInfo.volunteeringHours} duration={2} />}
                    icon={<Heart className="w-6 h-6" />}
                    color="success"
                    subtitle="Community Service"
                    progress={(dashboardData.personalInfo.volunteeringHours / 200) * 100}
                  />

                  <StatCard
                    title="Competitions Won"
                    value={<CountUp end={dashboardData.personalInfo.competitionsWon} duration={2} />}
                    icon={<Medal className="w-6 h-6" />}
                    color="warning"
                    subtitle="Victory Count"
                    progress={(dashboardData.personalInfo.competitionsWon / 8) * 100}
                  />
                </>
              )}

              {/* Pending Reviews Card */}
              <StatCard
                title="Pending Reviews"
                value={<CountUp end={dashboardData.personalInfo.pendingApprovals} duration={1} />}
                icon={<Clock className="w-6 h-6" />}
                color={dashboardData.personalInfo.pendingApprovals > 0 ? "destructive" : "success"}
                subtitle="Awaiting Approval"
                progress={100 - (dashboardData.personalInfo.pendingApprovals / 5) * 100}
              />
            </motion.div>

            {/* Real-Time Metrics Dashboard */}
            {showRealTimeUpdates && (
              <motion.div
                initial={animationSettings.initial}
                animate={animationSettings.animate}
                transition={{ duration: animationSettings.duration, delay: 0.2 }}
                className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg border border-green-200/50 dark:border-green-800/50"
              >
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <Zap className="w-5 h-5" />
                      Real-Time Performance Metrics
                      <Badge variant="outline" className="ml-auto bg-green-100 text-green-700 border-green-300">
                        Live
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`
                      grid gap-4
                      ${isMobile ? 'grid-cols-2' : ''}
                      ${isTablet ? 'grid-cols-3' : ''}
                      ${isDesktop ? 'grid-cols-4' : ''}
                      ${isLargeScreen ? 'grid-cols-5' : ''}
                      ${isUltraWide ? 'grid-cols-6' : ''}
                      ${is4K ? 'grid-cols-7' : ''}
                    `}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          <CountUp end={dashboardData.realTimeMetrics.currentStreak} duration={2} />
                        </div>
                        <div className="text-xs text-muted-foreground">Day Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {dashboardData.realTimeMetrics.weeklyProgress}%
                        </div>
                        <div className="text-xs text-muted-foreground">Weekly Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {dashboardData.realTimeMetrics.productivityScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Productivity Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {dashboardData.realTimeMetrics.averageWeeklyHours}h
                        </div>
                        <div className="text-xs text-muted-foreground">Avg Weekly Hours</div>
                      </div>
                      {(isLargeScreen || isUltraWide || is4K) && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {dashboardData.realTimeMetrics.monthlyGrowth}%
                          </div>
                          <div className="text-xs text-muted-foreground">Monthly Growth</div>
                        </div>
                      )}
                      {(isUltraWide || is4K) && (
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">
                            {dashboardData.realTimeMetrics.yearlyImprovement}%
                          </div>
                          <div className="text-xs text-muted-foreground">Yearly Improvement</div>
                        </div>
                      )}
                      {is4K && (
                        <div className="text-center">
                          <div className="text-lg font-bold text-teal-600">
                            {dashboardData.realTimeMetrics.peakPerformanceDay}
                          </div>
                          <div className="text-xs text-muted-foreground">Peak Day</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Enhanced Comprehensive Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className={`
                grid w-full
                ${isMobile ? 'grid-cols-2' : ''}
                ${isTablet ? 'grid-cols-4' : ''}
                ${isDesktop ? 'grid-cols-4' : ''}
                ${isLargeScreen ? 'grid-cols-6' : ''}
                ${isUltraWide ? 'grid-cols-8' : ''}
                ${is4K ? 'grid-cols-10' : ''}
              `}>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                {(isLargeScreen || isUltraWide || is4K) && (
                  <>
                    <TabsTrigger value="charts">Charts</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                  </>
                )}
                {(isUltraWide || is4K) && (
                  <>
                    <TabsTrigger value="insights">AI Insights</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </>
                )}
                {is4K && (
                  <>
                    <TabsTrigger value="predictions">Predictions</TabsTrigger>
                    <TabsTrigger value="research">Research</TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Comprehensive Multi-Library Charts Section */}
                <motion.div 
                  ref={chartsRef}
                  initial={animationSettings.initial}
                  animate={chartsInView ? animationSettings.animate : animationSettings.initial}
                  transition={{ duration: animationSettings.duration }}
                  className="space-y-8"
                >
                  {/* Skills Development Progress - Recharts */}
                  <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        Skills Development Progress
                        <Badge variant="outline" className="ml-auto bg-purple-100 text-purple-700">
                          Recharts
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`
                        ${isMobile ? 'h-64' : ''}
                        ${isTablet ? 'h-80' : ''}
                        ${isDesktop ? 'h-96' : ''}
                        ${isLargeScreen ? 'h-[28rem]' : ''}
                        ${isUltraWide ? 'h-[32rem]' : ''}
                        ${is4K ? 'h-[36rem]' : ''}
                      `}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dashboardData.chartData.skillsProgress}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fontSize: isMobile ? 10 : isTablet ? 11 : 12 }}
                              interval={isMobile ? 1 : 0}
                            />
                            <YAxis 
                              tick={{ fontSize: isMobile ? 10 : isTablet ? 11 : 12 }}
                            />
                            <ChartTooltip 
                              content={<ChartTooltipContent />}
                              cursor={{ strokeDasharray: '5 5' }}
                            />
                            <RechartsLegend />
                            <Area
                              type="monotone"
                              dataKey="technical"
                              stackId="1"
                              stroke="#8b5cf6"
                              fill="#8b5cf6"
                              fillOpacity={0.8}
                              name="Technical Skills"
                            />
                            <Area
                              type="monotone"
                              dataKey="leadership"
                              stackId="1"
                              stroke="#f59e0b"
                              fill="#f59e0b"
                              fillOpacity={0.8}
                              name="Leadership"
                            />
                            <Area
                              type="monotone"
                              dataKey="communication"
                              stackId="1"
                              stroke="#10b981"
                              fill="#10b981"
                              fillOpacity={0.8}
                              name="Communication"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Grade Distribution & Performance Metrics Grid */}
                  <div className={`
                    grid gap-6
                    ${isMobile ? 'grid-cols-1' : ''}
                    ${isTablet ? 'grid-cols-1' : ''}
                    ${isDesktop ? 'grid-cols-2' : ''}
                    ${isLargeScreen ? 'grid-cols-2' : ''}
                    ${isUltraWide ? 'grid-cols-3' : ''}
                    ${is4K ? 'grid-cols-4' : ''}
                  `}>
                    
                    {/* Grade Distribution - Chart.js Doughnut */}
                    <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-blue-600" />
                          Grade Distribution
                          <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-700">
                            Chart.js
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-48' : ''}
                          ${isTablet ? 'h-56' : ''}
                          ${isDesktop ? 'h-64' : ''}
                          ${isLargeScreen ? 'h-72' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                          flex items-center justify-center
                        `}>
                          <Doughnut
                            data={dashboardData.chartData.gradeDistribution}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    usePointStyle: true,
                                    padding: 20,
                                    font: {
                                      size: isMobile ? 10 : isTablet ? 11 : 12
                                    }
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      return `${context.label}: ${context.parsed}%`;
                                    }
                                  }
                                }
                              },
                              cutout: '60%'
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Activity Timeline - Victory Charts */}
                    <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          Activity Timeline
                          <Badge variant="outline" className="ml-auto bg-green-100 text-green-700">
                            Victory
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-48' : ''}
                          ${isTablet ? 'h-56' : ''}
                          ${isDesktop ? 'h-64' : ''}
                          ${isLargeScreen ? 'h-72' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                        `}>
                          <VictoryChart
                            theme={VictoryTheme.material}
                            width={400}
                            height={300}
                            padding={{ left: 60, top: 40, right: 40, bottom: 60 }}
                          >
                            <VictoryLine
                              data={dashboardData.chartData.activityTimeline}
                              x="week"
                              y="activities"
                              style={{
                                data: { stroke: "#10b981", strokeWidth: 3 }
                              }}
                              animate={{
                                duration: 2000,
                                onLoad: { duration: 500 }
                              }}
                            />
                            <VictoryScatter
                              data={dashboardData.chartData.activityTimeline}
                              x="week"
                              y="activities"
                              size={4}
                              style={{
                                data: { fill: "#10b981" }
                              }}
                            />
                          </VictoryChart>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Performance Radar - Chart.js */}
                    <Card className="bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Radar className="w-5 h-5 text-orange-600" />
                          Performance Radar
                          <Badge variant="outline" className="ml-auto bg-orange-100 text-orange-700">
                            Chart.js
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-48' : ''}
                          ${isTablet ? 'h-56' : ''}
                          ${isDesktop ? 'h-64' : ''}
                          ${isLargeScreen ? 'h-72' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                          flex items-center justify-center
                        `}>
                          <RadarChartJS
                            data={dashboardData.chartData.performanceRadar}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    font: {
                                      size: isMobile ? 10 : isTablet ? 11 : 12
                                    }
                                  }
                                }
                              },
                              scales: {
                                r: {
                                  beginAtZero: true,
                                  max: 100,
                                  ticks: {
                                    font: {
                                      size: isMobile ? 8 : 10
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ultra-wide and 4K Additional Charts */}
                    {(isUltraWide || is4K) && (
                      <Card className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                            Monthly Achievements
                            <Badge variant="outline" className="ml-auto bg-indigo-100 text-indigo-700">
                              Recharts
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className={`
                            ${isUltraWide ? 'h-80' : ''}
                            ${is4K ? 'h-96' : ''}
                          `}>
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={dashboardData.chartData.monthlyAchievements}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis 
                                  dataKey="month"
                                  tick={{ fontSize: 12 }}
                                />
                                <YAxis 
                                  tick={{ fontSize: 12 }}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <RechartsLegend />
                                <Bar 
                                  dataKey="achievements" 
                                  fill="#6366f1" 
                                  name="Achievements"
                                  radius={[4, 4, 0, 0]}
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
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
                {/* Advanced Analytics Dashboard */}
                <div className="space-y-8">
                  
                  {/* Performance Trends Analysis */}
                  <Card className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/10 dark:to-blue-900/10">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Performance Trends Analysis
                        <Badge variant="outline" className="ml-auto bg-indigo-100 text-indigo-700">
                          Advanced Analytics
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`
                        ${isMobile ? 'h-72' : ''}
                        ${isTablet ? 'h-80' : ''}
                        ${isDesktop ? 'h-96' : ''}
                        ${isLargeScreen ? 'h-[28rem]' : ''}
                        ${isUltraWide ? 'h-[32rem]' : ''}
                        ${is4K ? 'h-[36rem]' : ''}
                      `}>
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={dashboardData.chartData.performanceTrends}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fontSize: isMobile ? 10 : isTablet ? 11 : 12 }}
                            />
                            <YAxis 
                              yAxisId="left"
                              tick={{ fontSize: isMobile ? 10 : isTablet ? 11 : 12 }}
                            />
                            <YAxis 
                              yAxisId="right" 
                              orientation="right"
                              tick={{ fontSize: isMobile ? 10 : isTablet ? 11 : 12 }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <RechartsLegend />
                            <Bar 
                              yAxisId="left" 
                              dataKey="credits" 
                              fill="#8b5cf6" 
                              name="Credits Earned"
                              radius={[2, 2, 0, 0]}
                            />
                            <Area 
                              yAxisId="left" 
                              type="monotone" 
                              dataKey="cumulative" 
                              fill="#06b6d4" 
                              fillOpacity={0.6}
                              stroke="#06b6d4"
                              name="Cumulative Credits"
                            />
                            <Line 
                              yAxisId="right" 
                              type="monotone" 
                              dataKey="cgpa" 
                              stroke="#f59e0b" 
                              strokeWidth={3}
                              name="CGPA Trend"
                              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Multi-Chart Analytics Grid */}
                  <div className={`
                    grid gap-6
                    ${isMobile ? 'grid-cols-1' : ''}
                    ${isTablet ? 'grid-cols-1' : ''}
                    ${isDesktop ? 'grid-cols-2' : ''}
                    ${isLargeScreen ? 'grid-cols-3' : ''}
                    ${isUltraWide ? 'grid-cols-3' : ''}
                    ${is4K ? 'grid-cols-4' : ''}
                  `}>
                    
                    {/* Credit Distribution Breakdown - Chart.js */}
                    <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-purple-600" />
                          Credit Distribution
                          <Badge variant="outline" className="ml-auto bg-purple-100 text-purple-700">
                            Chart.js
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-56' : ''}
                          ${isTablet ? 'h-64' : ''}
                          ${isDesktop ? 'h-72' : ''}
                          ${isLargeScreen ? 'h-80' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                          flex items-center justify-center
                        `}>
                          <PieChartJS
                            data={dashboardData.chartData.creditDistribution}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    usePointStyle: true,
                                    padding: 15,
                                    font: {
                                      size: isMobile ? 10 : isTablet ? 11 : 12
                                    }
                                  }
                                },
                                tooltip: {
                                  callbacks: {
                                    label: function(context) {
                                      return `${context.label}: ${context.parsed} credits`;
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills Progress Radar - Victory */}
                    <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Radar className="w-5 h-5 text-green-600" />
                          Skills Assessment
                          <Badge variant="outline" className="ml-auto bg-green-100 text-green-700">
                            Victory
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-56' : ''}
                          ${isTablet ? 'h-64' : ''}
                          ${isDesktop ? 'h-72' : ''}
                          ${isLargeScreen ? 'h-80' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                        `}>
                          <VictoryChart
                            theme={VictoryTheme.material}
                            domain={{ y: [0, 100] }}
                            width={350}
                            height={300}
                          >
                            <VictoryPolarAxis dependentAxis
                              tickFormat={() => ""}
                              tickCount={5}
                            />
                            <VictoryPolarAxis/>
                            <VictoryArea
                              data={dashboardData.chartData.skillsRadar}
                              x="skill"
                              y="level"
                              style={{
                                data: { 
                                  fill: "#10b981", 
                                  fillOpacity: 0.6, 
                                  stroke: "#10b981", 
                                  strokeWidth: 2 
                                }
                              }}
                              animate={{
                                duration: 2000,
                                onLoad: { duration: 500 }
                              }}
                            />
                          </VictoryChart>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weekly Activity Patterns - Recharts */}
                    <Card className="bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-900/10 dark:to-red-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-orange-600" />
                          Weekly Patterns
                          <Badge variant="outline" className="ml-auto bg-orange-100 text-orange-700">
                            Recharts
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-56' : ''}
                          ${isTablet ? 'h-64' : ''}
                          ${isDesktop ? 'h-72' : ''}
                          ${isLargeScreen ? 'h-80' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                        `}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dashboardData.chartData.weeklyPatterns}>
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <XAxis 
                                dataKey="day"
                                tick={{ fontSize: isMobile ? 8 : 10 }}
                              />
                              <YAxis 
                                tick={{ fontSize: isMobile ? 8 : 10 }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Bar 
                                dataKey="activities" 
                                fill="#f97316" 
                                name="Activities"
                                radius={[3, 3, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 4K Additional Chart */}
                    {is4K && (
                      <Card className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/10 dark:to-cyan-900/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <LineChart className="w-5 h-5 text-teal-600" />
                            Growth Trajectory
                            <Badge variant="outline" className="ml-auto bg-teal-100 text-teal-700">
                              Recharts
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={dashboardData.chartData.growthTrajectory}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line 
                                  type="monotone" 
                                  dataKey="progress" 
                                  stroke="#14b8a6" 
                                  strokeWidth={3}
                                  dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Faculty Approval & Insights Section */}
                  <div className={`
                    grid gap-6
                    ${isMobile ? 'grid-cols-1' : ''}
                    ${isTablet ? 'grid-cols-1' : ''}
                    ${isDesktop ? 'grid-cols-2' : ''}
                    ${isLargeScreen ? 'grid-cols-2' : ''}
                    ${isUltraWide ? 'grid-cols-3' : ''}
                    ${is4K ? 'grid-cols-3' : ''}
                  `}>
                    
                    {/* Faculty Approval Analytics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          Faculty Approval Analytics
                        </CardTitle>
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
                          
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback className="bg-blue-500 text-white">RK</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">Prof. Rajesh Kumar</div>
                                <div className="text-sm text-muted-foreground">Dean Academic Affairs</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">0 pending</div>
                              <div className="text-xs text-muted-foreground">Avg: 0.8 days</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Performance Insights */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-600" />
                          Performance Insights
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Alert>
                            <TrendingUp className="h-4 w-4" />
                            <AlertTitle>Improvement Trend</AlertTitle>
                            <AlertDescription>
                              Your credits have increased by 35% this semester compared to last.
                            </AlertDescription>
                          </Alert>
                          
                          <Alert>
                            <Target className="h-4 w-4" />
                            <AlertTitle>Goal Progress</AlertTitle>
                            <AlertDescription>
                              You're 78% towards your annual target of 250 credits.
                            </AlertDescription>
                          </Alert>

                          <Alert>
                            <Star className="h-4 w-4" />
                            <AlertTitle>Achievement Unlock</AlertTitle>
                            <AlertDescription>
                              Almost eligible for "Excellence in Leadership" badge!
                            </AlertDescription>
                          </Alert>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional insights for ultra-wide screens */}
                    {(isUltraWide || is4K) && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-purple-600" />
                            AI Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                              <div className="font-medium text-purple-700 dark:text-purple-300">Focus Area</div>
                              <div className="text-sm text-muted-foreground">
                                Consider participating in more technical workshops to balance your skill portfolio.
                              </div>
                            </div>
                            
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div className="font-medium text-blue-700 dark:text-blue-300">Opportunity</div>
                              <div className="text-sm text-muted-foreground">
                                You're eligible for the "Dean's List" with 2 more academic activities.
                              </div>
                            </div>

                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <div className="font-medium text-green-700 dark:text-green-300">Strength</div>
                              <div className="text-sm text-muted-foreground">
                                Your leadership activities are 40% above department average.
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activities" className="space-y-6">
                {/* Comprehensive Activities Dashboard */}
                <div className="space-y-8">
                  
                  {/* Activity Summary Cards */}
                  <div className={`
                    grid gap-4
                    ${isMobile ? 'grid-cols-2' : ''}
                    ${isTablet ? 'grid-cols-3' : ''}
                    ${isDesktop ? 'grid-cols-4' : ''}
                    ${isLargeScreen ? 'grid-cols-5' : ''}
                    ${isUltraWide ? 'grid-cols-6' : ''}
                    ${is4K ? 'grid-cols-8' : ''}
                  `}>
                    <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="text-2xl font-bold text-green-600">
                              {activities?.filter(a => a.status === 'approved').length || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Approved</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <div>
                            <div className="text-2xl font-bold text-yellow-600">
                              {activities?.filter(a => a.status === 'pending').length || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Pending</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="text-2xl font-bold text-blue-600">
                              {activities?.filter(a => a.status === 'draft').length || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Drafts</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="text-2xl font-bold text-purple-600">
                              {activities?.reduce((sum, a) => sum + (a.creditsEarned || 0), 0) || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Credits</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Extended metrics for larger screens */}
                    {(isLargeScreen || isUltraWide || is4K) && (
                      <Card className="bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Award className="w-5 h-5 text-red-600" />
                            <div>
                              <div className="text-2xl font-bold text-red-600">
                                {activities?.filter(a => a.category === 'academic').length || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Academic</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {(isUltraWide || is4K) && (
                      <>
                        <Card className="bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-900/10 dark:to-cyan-900/10">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Users className="w-5 h-5 text-teal-600" />
                              <div>
                                <div className="text-2xl font-bold text-teal-600">
                                  {activities?.filter(a => a.category === 'leadership').length || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">Leadership</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/10 dark:to-blue-900/10">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                              <Code className="w-5 h-5 text-indigo-600" />
                              <div>
                                <div className="text-2xl font-bold text-indigo-600">
                                  {activities?.filter(a => a.category === 'technical').length || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">Technical</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}

                    {is4K && (
                      <Card className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/10 dark:to-green-900/10">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-2">
                            <Heart className="w-5 h-5 text-emerald-600" />
                            <div>
                              <div className="text-2xl font-bold text-emerald-600">
                                {activities?.filter(a => a.category === 'community').length || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Community</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Activity Charts */}
                  <div className={`
                    grid gap-6
                    ${isMobile ? 'grid-cols-1' : ''}
                    ${isTablet ? 'grid-cols-1' : ''}
                    ${isDesktop ? 'grid-cols-2' : ''}
                    ${isLargeScreen ? 'grid-cols-2' : ''}
                    ${isUltraWide ? 'grid-cols-3' : ''}
                    ${is4K ? 'grid-cols-3' : ''}
                  `}>
                    
                    {/* Activity Distribution - Chart.js */}
                    <Card className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="w-5 h-5 text-blue-600" />
                          Activity Distribution
                          <Badge variant="outline" className="ml-auto bg-blue-100 text-blue-700">
                            Chart.js
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-48' : ''}
                          ${isTablet ? 'h-56' : ''}
                          ${isDesktop ? 'h-64' : ''}
                          ${isLargeScreen ? 'h-72' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                          flex items-center justify-center
                        `}>
                          <Doughnut
                            data={dashboardData.chartData.activityDistribution}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  position: 'bottom',
                                  labels: {
                                    usePointStyle: true,
                                    padding: 15,
                                    font: {
                                      size: isMobile ? 10 : isTablet ? 11 : 12
                                    }
                                  }
                                }
                              }
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Monthly Activity Timeline - Recharts */}
                    <Card className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                          Monthly Timeline
                          <Badge variant="outline" className="ml-auto bg-green-100 text-green-700">
                            Recharts
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className={`
                          ${isMobile ? 'h-48' : ''}
                          ${isTablet ? 'h-56' : ''}
                          ${isDesktop ? 'h-64' : ''}
                          ${isLargeScreen ? 'h-72' : ''}
                          ${isUltraWide ? 'h-80' : ''}
                          ${is4K ? 'h-96' : ''}
                        `}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.chartData.monthlyActivities}>
                              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                              <XAxis 
                                dataKey="month"
                                tick={{ fontSize: isMobile ? 8 : 10 }}
                              />
                              <YAxis 
                                tick={{ fontSize: isMobile ? 8 : 10 }}
                              />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                name="Activities"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Victory Chart for Ultra-wide */}
                    {(isUltraWide || is4K) && (
                      <Card className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            Category Progress
                            <Badge variant="outline" className="ml-auto bg-purple-100 text-purple-700">
                              Victory
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className={`
                            ${isUltraWide ? 'h-80' : ''}
                            ${is4K ? 'h-96' : ''}
                          `}>
                            <VictoryChart
                              theme={VictoryTheme.material}
                              width={400}
                              height={300}
                              padding={{ left: 80, top: 40, right: 40, bottom: 60 }}
                            >
                              <VictoryBar
                                data={dashboardData.chartData.categoryProgress}
                                x="category"
                                y="count"
                                style={{
                                  data: { fill: "#8b5cf6" }
                                }}
                                animate={{
                                  duration: 2000,
                                  onLoad: { duration: 500 }
                                }}
                              />
                            </VictoryChart>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Activities List */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        Activity Management
                        <Badge variant="outline" className="ml-auto">
                          {filteredActivities.length} Total
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading activities...</div>}>
                        <div className={`
                          ${isMobile ? 'max-h-96' : ''}
                          ${isTablet ? 'max-h-[28rem]' : ''}
                          ${isDesktop ? 'max-h-[32rem]' : ''}
                          ${isLargeScreen ? 'max-h-[36rem]' : ''}
                          ${isUltraWide ? 'max-h-[40rem]' : ''}
                          ${is4K ? 'max-h-[44rem]' : ''}
                          overflow-y-auto
                        `}>
                          {filteredActivities.length > 20 ? (
                            <VirtualActivityList
                              activities={filteredActivities}
                              height={isMobile ? 384 : isTablet ? 448 : isDesktop ? 512 : isLargeScreen ? 576 : isUltraWide ? 640 : 704}
                              isLoading={activitiesLoading}
                            />
                          ) : (
                            <ActivityList
                              activities={filteredActivities}
                              isLoading={activitiesLoading}
                              showActions={true}
                              variant={isMobile ? "compact" : "default"}
                              maxItems={isMobile ? 10 : isTablet ? 15 : 20}
                            />
                          )}
                        </div>
                      </Suspense>
                    </CardContent>
                  </Card>
                </div>
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

            {/* Desktop Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3 hidden lg:block">
              <Sidebar />
            </aside>
            
          </div>
        </div>
        
        {/* Mobile Tab Bar - Conditionally rendered for small screens only */}
        <div className="lg:hidden">
          <MobileTabBar />
        </div>
      </div>
    </TooltipProvider>
  );
}
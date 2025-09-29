/**
 * Attendance Management Page
 * 
 * Comprehensive attendance tracking with advanced filtering, analytics, and export capabilities.
 * Features real-time data updates, responsive design, and professional academic styling.
 */

import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useInView } from "react-intersection-observer";
import { useLocalStorage } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO } from "date-fns";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Calendar, Download, RefreshCw, Filter, Clock, TrendingUp, BarChart3,
  CheckCircle2, XCircle, AlertCircle, Calendar as CalendarIcon,
  FileSpreadsheet, Eye, ChevronDown, Users, MapPin, Timer
} from "lucide-react";

// Simple placeholder chart components
function AttendanceChart({ data, type }: { data: any[]; type: string }) {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Attendance {type} chart will be rendered here
    </div>
  );
}

function AttendanceHeatmap({ records, selectedMonth, onMonthChange }: { records: any[]; selectedMonth: Date; onMonthChange: (date: Date) => void }) {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Attendance heatmap will be rendered here
    </div>
  );
}

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subjectId: string;
  subjectName?: string;
  subjectCode?: string;
  markedBy?: string;
}

interface AttendanceAnalytics {
  totalClasses: number;
  attendedClasses: number;
  absentClasses: number;
  lateClasses: number;
  attendanceRate: number;
  weeklyTrends: Array<{ week: string; rate: number }>;
  monthlyTrends: Array<{ month: string; rate: number }>;
  subjectWise: Array<{ subject: string; rate: number; total: number; attended: number }>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 w-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
        <div className="h-80 bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  );
}

function AttendanceStatusIcon({ status }: { status: AttendanceRecord['status'] }) {
  const icons = {
    present: <CheckCircle2 className="w-4 h-4 text-success" />,
    absent: <XCircle className="w-4 h-4 text-destructive" />,
    late: <Clock className="w-4 h-4 text-warning" />,
    excused: <AlertCircle className="w-4 h-4 text-info" />
  };
  
  return icons[status];
}

export default function AttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State management
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [viewMode, setViewMode] = useLocalStorage('attendance-view', 'overview');
  const [exportFormat, setExportFormat] = useState('csv');

  // Animation observers
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Fetch attendance data with React Query
  const { data: attendanceRecords, isLoading: recordsLoading, error: recordsError } = useQuery({
    queryKey: ['attendance', 'records', selectedSubject, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') params.append('subjectId', selectedSubject);
      if (dateRange?.from) params.append('dateFrom', dateRange.from.toISOString());
      if (dateRange?.to) params.append('dateTo', dateRange.to.toISOString());
      
      const response = await fetch(`/api/attendance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch attendance');
      return response.json() as AttendanceRecord[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: attendanceAnalytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['attendance', 'analytics', selectedSubject, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSubject !== 'all') params.append('subjectId', selectedSubject);
      if (dateRange?.from) params.append('dateFrom', dateRange.from.toISOString());
      if (dateRange?.to) params.append('dateTo', dateRange.to.toISOString());
      
      const response = await fetch(`/api/attendance/analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json() as AttendanceAnalytics;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await fetch('/api/subjects');
      if (!response.ok) throw new Error('Failed to fetch subjects');
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
  });

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    if (!attendanceAnalytics) return null;
    
    return {
      overall: {
        percentage: attendanceAnalytics.attendanceRate,
        present: attendanceAnalytics.attendedClasses,
        total: attendanceAnalytics.totalClasses,
        absent: attendanceAnalytics.absentClasses,
        late: attendanceAnalytics.lateClasses
      },
      trends: attendanceAnalytics.monthlyTrends,
      subjectWise: attendanceAnalytics.subjectWise
    };
  }, [attendanceAnalytics]);

  // Handle data export
  const handleExport = useCallback(async (format: 'csv' | 'pdf') => {
    try {
      const params = new URLSearchParams();
      params.append('type', 'attendance');
      params.append('format', format);
      if (selectedSubject !== 'all') params.append('subjectId', selectedSubject);
      if (dateRange?.from) params.append('dateFrom', dateRange.from.toISOString());
      if (dateRange?.to) params.append('dateTo', dateRange.to.toISOString());
      
      const response = await fetch(`/api/admin/export/${format}?${params}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance-${format}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Attendance data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to export attendance data. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedSubject, dateRange, toast]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['attendance'] });
    toast({
      title: "Data Refreshed",
      description: "Attendance data has been updated",
    });
  }, [queryClient, toast]);

  const isLoading = recordsLoading || analyticsLoading;

  return (
    <>
      <Helmet>
        <title>Attendance Tracking - Smart Student Hub</title>
        <meta 
          name="description" 
          content="Track and analyze your academic attendance with comprehensive statistics, trends, and insights. View attendance by subject, date range, and export data." 
        />
        <meta property="og:title" content="Attendance Tracking - Smart Student Hub" />
        <meta property="og:description" content="Comprehensive attendance management and analytics for academic success" />
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
                <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-attendance">
                  Attendance Tracking
                </h1>
                <p className="text-muted-foreground mt-2">
                  Monitor your academic attendance and analyze patterns
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
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
                        onClick={() => handleExport('csv')}
                        data-testid="button-export-csv"
                      >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger data-testid="select-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {subjects?.map((subject: any) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Select value={viewMode} onValueChange={setViewMode}>
                      <SelectTrigger data-testid="select-view-mode">
                        <SelectValue placeholder="View mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Overview</SelectItem>
                        <SelectItem value="calendar">Calendar View</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error State */}
            {recordsError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load attendance data. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <Tabs value={viewMode} onValueChange={setViewMode} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3" data-testid="tabs-attendance">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <motion.div
                    ref={statsRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {attendanceStats && [
                      {
                        title: "Overall Attendance",
                        value: `${attendanceStats.overall.percentage.toFixed(1)}%`,
                        icon: BarChart3,
                        color: attendanceStats.overall.percentage >= 75 ? "success" : "warning",
                        testId: "stat-overall-attendance"
                      },
                      {
                        title: "Classes Attended",
                        value: `${attendanceStats.overall.present}/${attendanceStats.overall.total}`,
                        icon: CheckCircle2,
                        color: "success",
                        testId: "stat-classes-attended"
                      },
                      {
                        title: "Absent Days",
                        value: attendanceStats.overall.absent.toString(),
                        icon: XCircle,
                        color: "destructive",
                        testId: "stat-absent-days"
                      },
                      {
                        title: "Late Arrivals",
                        value: attendanceStats.overall.late.toString(),
                        icon: Clock,
                        color: "warning",
                        testId: "stat-late-arrivals"
                      }
                    ].map((stat, index) => (
                      <Card key={index} className="relative overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold" data-testid={stat.testId}>
                                {stat.value}
                              </p>
                            </div>
                            <div className={`p-2 rounded-full bg-${stat.color}/10`}>
                              <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>

                  {/* Recent Attendance Records */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Recent Attendance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {attendanceRecords?.slice(0, 10).map((record) => (
                          <div
                            key={record.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                            data-testid={`attendance-record-${record.id}`}
                          >
                            <div className="flex items-center space-x-4">
                              <AttendanceStatusIcon status={record.status} />
                              <div>
                                <p className="font-medium">{record.subjectName || record.subjectCode}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(parseISO(record.date), 'PPP')}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={record.status === 'present' ? 'default' : 
                                      record.status === 'absent' ? 'destructive' : 
                                      record.status === 'late' ? 'secondary' : 'outline'}
                            >
                              {record.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Calendar Tab */}
                <TabsContent value="calendar" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Calendar</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded" />}>
                        <AttendanceHeatmap 
                          records={attendanceRecords || []}
                          selectedMonth={selectedMonth}
                          onMonthChange={setSelectedMonth}
                        />
                      </Suspense>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Attendance Trends</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Suspense fallback={<div className="h-80 bg-muted animate-pulse rounded" />}>
                          <AttendanceChart 
                            data={attendanceStats?.trends || []}
                            type="trends"
                          />
                        </Suspense>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Subject-wise Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {attendanceStats?.subjectWise.map((subject, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{subject.subject}</span>
                                <span>{subject.rate.toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={subject.rate} 
                                className="h-2"
                                data-testid={`progress-subject-${index}`}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{subject.attended} attended</span>
                                <span>{subject.total} total</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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
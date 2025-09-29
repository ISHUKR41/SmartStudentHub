/**
 * Courses Management Page
 * 
 * Comprehensive course management with grades, credits, assignments, and academic analytics.
 * Features responsive design, advanced filtering, and professional academic interface.
 */

import { useState, useMemo, useCallback, Suspense, lazy } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useInView } from "react-intersection-observer";
import { useLocalStorage } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Helmet } from "react-helmet-async";
import { apiRequest } from "@/lib/queryClient";

import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import MobileTabBar from "@/components/layout/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen, Calculator, TrendingUp, BarChart3, Star, Clock, 
  Plus, Search, Filter, RefreshCw, Download, Eye, Edit,
  GraduationCap, Award, Target, Calendar, Users
} from "lucide-react";

// Simple placeholder chart components
function GradeChart({ data }: { data: any }) {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Grade distribution chart will be rendered here
    </div>
  );
}

function CreditProgressChart({ data }: { data: any }) {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Credit progress chart will be rendered here
    </div>
  );
}

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: number;
  faculty: string;
  department: string;
  grade?: number;
  totalMarks?: number;
  obtainedMarks?: number;
  assignments?: Array<{
    id: string;
    title: string;
    maxMarks: number;
    obtainedMarks: number;
    submissionDate: string;
    status: 'submitted' | 'pending' | 'graded';
  }>;
  attendance?: number;
  createdAt: string;
}

interface SubjectAnalytics {
  totalSubjects: number;
  totalCredits: number;
  avgGrade: number;
  subjectPerformance: Array<{
    subject: string;
    grade: number;
    credits: number;
    attendance: number;
  }>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function GradeIndicator({ grade }: { grade: number }) {
  const getGradeInfo = (grade: number) => {
    if (grade >= 9) return { letter: 'A+', color: 'success', bg: 'bg-success/10' };
    if (grade >= 8) return { letter: 'A', color: 'success', bg: 'bg-success/10' };
    if (grade >= 7) return { letter: 'B+', color: 'info', bg: 'bg-info/10' };
    if (grade >= 6) return { letter: 'B', color: 'info', bg: 'bg-info/10' };
    if (grade >= 5) return { letter: 'C', color: 'warning', bg: 'bg-warning/10' };
    return { letter: 'F', color: 'destructive', bg: 'bg-destructive/10' };
  };

  const gradeInfo = getGradeInfo(grade);

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gradeInfo.bg}`}>
      <span className={`text-${gradeInfo.color}`}>{gradeInfo.letter}</span>
      <span className="ml-1 text-muted-foreground">({grade.toFixed(1)})</span>
    </div>
  );
}

export default function CoursesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'grade' | 'credits' | 'semester'>('semester');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useLocalStorage('courses-view', 'grid');

  // Animation observers
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Fetch subjects with React Query
  const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const response = await fetch('/api/subjects');
      if (!response.ok) throw new Error('Failed to fetch subjects');
      return response.json() as Subject[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['subjects', 'analytics'],
    queryFn: async () => {
      const response = await fetch('/api/subjects/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json() as SubjectAnalytics;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Filter and sort subjects
  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];

    let filtered = subjects.filter(subject => {
      const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subject.faculty.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSemester = selectedSemester === 'all' || 
                             subject.semester.toString() === selectedSemester;

      return matchesSearch && matchesSemester;
    });

    // Sort subjects
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'grade':
          comparison = (a.grade || 0) - (b.grade || 0);
          break;
        case 'credits':
          comparison = a.credits - b.credits;
          break;
        case 'semester':
          comparison = a.semester - b.semester;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [subjects, searchTerm, selectedSemester, sortBy, sortOrder]);

  // Calculate statistics
  const courseStats = useMemo(() => {
    if (!analytics) return null;

    const currentSemesterSubjects = subjects?.filter(s => s.semester === Math.max(...(subjects?.map(sub => sub.semester) || []))) || [];
    
    return {
      totalSubjects: analytics.totalSubjects,
      totalCredits: analytics.totalCredits,
      avgGrade: analytics.avgGrade,
      currentSemesterCredits: currentSemesterSubjects.reduce((sum, s) => sum + s.credits, 0),
      performance: analytics.subjectPerformance
    };
  }, [analytics, subjects]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
    toast({
      title: "Data Refreshed",
      description: "Course data has been updated",
    });
  }, [queryClient, toast]);

  const isLoading = subjectsLoading || analyticsLoading;

  return (
    <>
      <Helmet>
        <title>Course Management - Smart Student Hub</title>
        <meta 
          name="description" 
          content="Manage your academic courses, track grades, monitor credit progress, and analyze performance across all subjects and semesters." 
        />
        <meta property="og:title" content="Course Management - Smart Student Hub" />
        <meta property="og:description" content="Comprehensive academic course management and performance tracking" />
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
                <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-courses">
                  Course Management
                </h1>
                <p className="text-muted-foreground mt-2">
                  Track your academic progress and manage course information
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
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation('/activities')}
                  data-testid="button-view-activities"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Activities
                </Button>
              </div>
            </motion.div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search courses by name, code, or faculty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        data-testid="input-search"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                      <SelectTrigger className="w-40" data-testid="select-semester">
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                          <SelectItem key={sem} value={sem.toString()}>
                            Semester {sem}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-32" data-testid="select-sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semester">Semester</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="grade">Grade</SelectItem>
                        <SelectItem value="credits">Credits</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      data-testid="button-sort-order"
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error State */}
            {subjectsError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load course data. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-6">
                {/* Statistics Cards */}
                <motion.div
                  ref={statsRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {courseStats && [
                    {
                      title: "Total Subjects",
                      value: courseStats.totalSubjects.toString(),
                      icon: BookOpen,
                      color: "primary",
                      testId: "stat-total-subjects"
                    },
                    {
                      title: "Total Credits",
                      value: courseStats.totalCredits.toString(),
                      icon: Calculator,
                      color: "success",
                      testId: "stat-total-credits"
                    },
                    {
                      title: "Average Grade",
                      value: courseStats.avgGrade.toFixed(2),
                      icon: TrendingUp,
                      color: courseStats.avgGrade >= 7 ? "success" : "warning",
                      testId: "stat-avg-grade"
                    },
                    {
                      title: "Current Semester Credits",
                      value: courseStats.currentSemesterCredits.toString(),
                      icon: Award,
                      color: "info",
                      testId: "stat-current-credits"
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

                <Tabs defaultValue="subjects" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3" data-testid="tabs-courses">
                    <TabsTrigger value="subjects">Subjects</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                  </TabsList>

                  {/* Subjects Tab */}
                  <TabsContent value="subjects" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <AnimatePresence>
                        {filteredSubjects.map((subject, index) => (
                          <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card className="h-full hover:shadow-lg transition-shadow">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg font-semibold line-clamp-2">
                                      {subject.name}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {subject.code} • Semester {subject.semester}
                                    </p>
                                  </div>
                                  {subject.grade && (
                                    <GradeIndicator grade={subject.grade} />
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Credits:</span>
                                  <Badge variant="outline">{subject.credits}</Badge>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Faculty:</span>
                                  <span className="font-medium">{subject.faculty}</span>
                                </div>
                                
                                {subject.attendance !== undefined && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-muted-foreground">Attendance:</span>
                                      <span className="font-medium">{subject.attendance}%</span>
                                    </div>
                                    <Progress 
                                      value={subject.attendance} 
                                      className="h-2"
                                      data-testid={`progress-attendance-${index}`}
                                    />
                                  </div>
                                )}

                                {subject.assignments && subject.assignments.length > 0 && (
                                  <div className="pt-2 border-t">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                      <span className="text-muted-foreground">Assignments:</span>
                                      <span className="font-medium">{subject.assignments.length}</span>
                                    </div>
                                    <div className="space-y-1">
                                      {subject.assignments.slice(0, 2).map((assignment, i) => (
                                        <div key={assignment.id} className="flex items-center justify-between text-xs">
                                          <span className="truncate">{assignment.title}</span>
                                          <Badge 
                                            variant={assignment.status === 'graded' ? 'default' : 
                                                    assignment.status === 'submitted' ? 'secondary' : 'outline'}
                                            className="text-xs"
                                          >
                                            {assignment.status}
                                          </Badge>
                                        </div>
                                      ))}
                                      {subject.assignments.length > 2 && (
                                        <p className="text-xs text-muted-foreground">
                                          +{subject.assignments.length - 2} more
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {filteredSubjects.length === 0 && (
                      <Card>
                        <CardContent className="p-8 text-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                          <p className="text-muted-foreground">
                            {searchTerm || selectedSemester !== 'all' 
                              ? "Try adjusting your search or filters" 
                              : "No courses are available"
                            }
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Analytics Tab */}
                  <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Grade Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <GradeChart data={filteredSubjects} />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Credit Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CreditProgressChart data={filteredSubjects} />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Performance Tab */}
                  <TabsContent value="performance" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Subject Performance Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {courseStats?.performance.map((perf, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">{perf.subject}</p>
                                <p className="text-sm text-muted-foreground">{perf.credits} credits</p>
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Grade</span>
                                  <span className="font-medium">{perf.grade.toFixed(1)}</span>
                                </div>
                                <Progress value={perf.grade * 10} className="h-2" />
                              </div>
                              
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>Attendance</span>
                                  <span className="font-medium">{perf.attendance}%</span>
                                </div>
                                <Progress value={perf.attendance} className="h-2" />
                              </div>
                              
                              <div className="flex items-center">
                                <GradeIndicator grade={perf.grade} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
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
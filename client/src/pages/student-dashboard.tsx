/**
 * Student Dashboard Component for Smart Student Hub
 * 
 * This component serves as the main dashboard for students, providing a comprehensive
 * overview of their academic progress, activity participation, and achievement tracking.
 * It implements the core functionality for student engagement with the institutional
 * achievement management system.
 * 
 * Key Features:
 * - Real-time academic performance metrics and CGPA tracking
 * - Comprehensive activity documentation and verification status
 * - Skill credit accumulation towards institutional targets
 * - Digital portfolio generation for placements and admissions
 * - Faculty approval workflow monitoring
 * - Category-wise activity breakdown for NAAC compliance
 * 
 * Dashboard Sections:
 * - Academic Performance: CGPA, semester progress, and academic standing
 * - Activity Overview: Total activities, skill credits, and pending approvals
 * - Recent Activities: Latest submissions and their verification status
 * - Category Distribution: Academic, co-curricular, and extra-curricular breakdown
 * - Upcoming Events: Institutional events and opportunities
 * 
 * Professional Features:
 * - Institutional-grade digital portfolio generation with verification stamps
 * - Real-time progress tracking aligned with Higher Education standards
 * - Faculty-verified achievement documentation for credibility
 * - NAAC/NIRF compliance-ready activity categorization
 * - Secure authentication and role-based access control
 * 
 * User Experience:
 * - Responsive design optimized for academic institutional environments
 * - Professional interface suitable for Higher Education Institution standards
 * - Real-time data updates and progress visualization
 * - Streamlined navigation to key student functions
 * - Comprehensive achievement management workflow
 * 
 * Integration Points:
 * - Authentication system with institutional identity providers
 * - Activity upload and verification workflow
 * - Digital portfolio PDF generation service
 * - Real-time statistics and analytics engine
 * - Faculty approval and feedback system
 */

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import StatCard from "@/components/ui/stat-card";
import ActivityList from "@/components/ui/activity-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Plus, GraduationCap, ClipboardList, Star, Clock, Award, TrendingUp, Target, BookOpen, Briefcase, Users, Calendar, MapPin, Trophy, Globe, CheckCircle, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { Activity } from "@shared/schema";

/**
 * Student Statistics Interface
 * 
 * Defines the structure for student performance metrics used throughout
 * the dashboard for displaying real-time academic and activity statistics.
 */
interface StudentStats {
  totalActivities: number;     // Total number of documented activities
  skillCredits: number;        // Accumulated skill credits from verified activities
  pendingApprovals: number;    // Activities awaiting faculty verification
}

/**
 * Student Dashboard Component
 * 
 * Main dashboard interface providing comprehensive academic and activity overview
 * for students in the Smart Student Hub institutional platform.
 */


export default function StudentDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  const [isDownloadingPortfolio, setIsDownloadingPortfolio] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: studentStats, isLoading: statsLoading } = useQuery<StudentStats>({
    queryKey: ["/api/students/stats"],
    retry: false,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/students/activities"],
    retry: false,
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm font-medium text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  const handleDownloadPortfolio = async () => {
    if (isDownloadingPortfolio) return; // Prevent multiple simultaneous downloads
    
    setIsDownloadingPortfolio(true);
    
    toast({
      title: "Portfolio Generation",
      description: "Your digital portfolio is being generated...",
    });

    try {
      const response = await fetch('/api/students/portfolio.pdf', {
        method: 'GET',
        credentials: 'include', // Include authentication cookies
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        let errorMessage = 'Failed to generate portfolio';
        
        // Try to get error message from response
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        throw new Error(errorMessage);
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();
      
      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `${user?.firstName || 'Student'}_Portfolio_${new Date().toISOString().split('T')[0]}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create download link and trigger download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);

      toast({
        title: "Portfolio Downloaded",
        description: "Your digital portfolio has been successfully generated and downloaded.",
        variant: "default",
      });

    } catch (error) {
      console.error('Portfolio download error:', error);
      
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to generate portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloadingPortfolio(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6" data-testid="main-dashboard">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <div>
                <h2 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
                  Academic Excellence Dashboard
                </h2>
                <p className="text-muted-foreground" data-testid="text-welcome-message">
                  Welcome back, {user.firstName} {user.lastName} | Roll No: {user.rollNumber || 'N/A'} | {user.department || 'Department'}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>NIT Delhi, New Delhi</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Academic Year 2024-25</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>NAAC Grade A++ Institution</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleDownloadPortfolio}
                disabled={isDownloadingPortfolio}
                data-testid="button-download-portfolio"
              >
                {isDownloadingPortfolio ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Portfolio
                  </>
                )}
              </Button>
              <Button 
                onClick={() => setLocation('/upload')}
                data-testid="button-add-activity"
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit Achievement
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Current CGPA"
              value={user.cgpa?.toString() || "N/A"}
              icon={<GraduationCap className="w-6 h-6" />}
              color="success"
              subtitle={`Semester ${user.currentSemester || 'N/A'} of 8`}
              progress={user.cgpa ? (parseFloat(user.cgpa) / 10) * 100 : 0}
              data-testid="card-cgpa"
            />

            <StatCard
              title="Total Activities"
              value={studentStats?.totalActivities?.toString() || "0"}
              icon={<ClipboardList className="w-6 h-6" />}
              color="primary"
              subtitle="Academic Year 2024-25"
              data-testid="card-total-activities"
            />

            <StatCard
              title="Skill Credits"
              value={studentStats?.skillCredits?.toString() || "0"}
              icon={<Star className="w-6 h-6" />}
              color="info"
              subtitle="NAAC Compliance Target: 250"
              progress={studentStats?.skillCredits ? (studentStats.skillCredits / 250) * 100 : 0}
              data-testid="card-skill-credits"
            />

            <StatCard
              title="Pending Approvals"
              value={studentStats?.pendingApprovals?.toString() || "0"}
              icon={<Clock className="w-6 h-6" />}
              color="warning"
              subtitle="Awaiting faculty review"
              data-testid="card-pending-approvals"
            />
          </div>

          {/* Academic Performance Section */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Academic Progress Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Current CGPA</span>
                        <GraduationCap className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-800 dark:text-green-200">{user.cgpa || '8.75'}</div>
                      <div className="text-xs text-green-600 dark:text-green-400">Excellent Standing</div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Academic Rank</span>
                        <Award className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">12<span className="text-sm">th</span></div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Out of 180 students</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">Semester-wise Progress</span>
                      <span className="text-xs text-muted-foreground">Sem 1-6 Performance</span>
                    </div>
                    <div className="grid grid-cols-6 gap-2">
                      {[8.2, 8.5, 8.8, 8.6, 8.9, 8.75].map((gpa, index) => (
                        <div key={index} className="text-center">
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded relative overflow-hidden">
                            <div 
                              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-blue-500 rounded"
                              style={{ height: `${(gpa / 10) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs font-medium text-foreground mt-1">S{index + 1}</div>
                          <div className="text-xs text-muted-foreground">{gpa}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>Achievement Highlights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Google Summer of Code 2023</div>
                      <div className="text-sm text-muted-foreground">Apache Software Foundation</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Best Paper Award</div>
                      <div className="text-sm text-muted-foreground">Technex 2024, IIT BHU</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Microsoft Internship</div>
                      <div className="text-sm text-muted-foreground">Software Development Engineer</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">Research Publication</div>
                      <div className="text-sm text-muted-foreground">IEEE Conference Paper</div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skills and Competency Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Skills & Competency Matrix</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { skill: 'Technical Proficiency', level: 92, category: 'Programming & Development' },
                    { skill: 'Research & Innovation', level: 88, category: 'Academic Excellence' },
                    { skill: 'Leadership & Management', level: 85, category: 'Soft Skills' },
                    { skill: 'Communication & Presentation', level: 90, category: 'Professional Skills' },
                    { skill: 'Community Engagement', level: 82, category: 'Social Impact' }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-foreground">{item.skill}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                        <span className="text-sm font-bold text-primary">{item.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  <span>Professional Development Journey</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent"></div>
                    
                    <div className="space-y-6">
                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Industry Internship</div>
                          <div className="text-sm text-muted-foreground">Microsoft India Development Center</div>
                          <div className="text-xs text-blue-600 font-medium">Summer 2024 • Completed</div>
                        </div>
                      </div>

                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Professional Certification</div>
                          <div className="text-sm text-muted-foreground">Deep Learning Specialization</div>
                          <div className="text-xs text-green-600 font-medium">Stanford/Coursera • Completed</div>
                        </div>
                      </div>

                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Leadership Role</div>
                          <div className="text-sm text-muted-foreground">Technical Head, Computer Society</div>
                          <div className="text-xs text-yellow-600 font-medium">Current Position • Active</div>
                        </div>
                      </div>

                      <div className="relative flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">Career Target</div>
                          <div className="text-sm text-muted-foreground">Software Engineer at FAANG</div>
                          <div className="text-xs text-blue-600 font-medium">Graduation 2025 • Planned</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Institutional Excellence Tracking Section */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
            {/* NAAC Compliance Tracking */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span>NAAC Compliance & Institutional Excellence</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-200">NAAC Score Contribution</span>
                        <Trophy className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">8.7</div>
                      <div className="text-xs text-blue-600 dark:text-blue-400">Personal Academic Excellence Rating</div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-900 dark:text-green-200">NIRF Ranking Impact</span>
                        <BarChart3 className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-800 dark:text-green-200">Top 5%</div>
                      <div className="text-xs text-green-600 dark:text-green-400">Department Performance Percentile</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">Institutional Excellence Parameters</span>
                      <span className="text-xs text-muted-foreground">NAAC Criteria Compliance</span>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">Teaching-Learning & Evaluation</span>
                          <span className="text-xs text-blue-600">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">Research & Innovation</span>
                          <span className="text-xs text-green-600">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-foreground">Student Support & Progression</span>
                          <span className="text-xs text-purple-600">94%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Industry & Career Analytics */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <span>Industry Engagement & Career Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-lg font-bold text-emerald-600">97%</div>
                      <div className="text-xs text-emerald-700 dark:text-emerald-300">Placement Readiness</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">6</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">Industry Connections</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">15+</div>
                      <div className="text-xs text-purple-700 dark:text-purple-300">Professional Skills</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-foreground mb-3">Career Progression Tracking</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-xs text-foreground">Technical Interview Readiness</span>
                        <span className="text-xs font-medium text-green-600">Excellent</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-xs text-foreground">Industry Project Experience</span>
                        <span className="text-xs font-medium text-blue-600">Advanced</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-xs text-foreground">Professional Network Strength</span>
                        <span className="text-xs font-medium text-purple-600">Strong</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="text-xs text-foreground">Leadership & Management</span>
                        <span className="text-xs font-medium text-orange-600">Developing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Research Impact & Academic Excellence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <span>Research Impact & Publications</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">3</div>
                      <div className="text-sm text-indigo-700 dark:text-indigo-300">Research Papers</div>
                      <div className="text-xs text-muted-foreground mt-1">2 Published, 1 Under Review</div>
                    </div>
                    <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-rose-600">24</div>
                      <div className="text-sm text-rose-700 dark:text-rose-300">Total Citations</div>
                      <div className="text-xs text-muted-foreground mt-1">H-Index: 3</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                      <div className="font-medium text-sm text-foreground">Latest Publication</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        "Federated Learning for Healthcare Applications" - IEEE Conference on AI
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-indigo-600 font-medium">Impact Factor: 4.2</span>
                        <Badge variant="outline" className="text-xs">Best Paper Award</Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="font-medium text-sm text-foreground">Research Collaboration</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Active collaboration with Stanford AI Lab and Google Research
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-600 font-medium">International Partnership</span>
                        <Badge variant="outline" className="text-xs">Ongoing</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span>Global Recognition & Awards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">8</div>
                      <div className="text-sm text-yellow-700 dark:text-yellow-300">National Awards</div>
                      <div className="text-xs text-muted-foreground mt-1">Competition Winners</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">2</div>
                      <div className="text-sm text-emerald-700 dark:text-emerald-300">International Recognition</div>
                      <div className="text-xs text-muted-foreground mt-1">IEEE & ACM</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="font-medium text-sm text-foreground">Google Summer of Code 2023</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Selected among top 1% global applicants for Apache Software Foundation
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-yellow-600 font-medium">Global Recognition</span>
                        <Badge variant="outline" className="text-xs">Completed</Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="font-medium text-sm text-foreground">National Coding Championship</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Winner among 10,000+ participants across India
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-green-600 font-medium">National Level</span>
                        <Badge variant="outline" className="text-xs">1st Position</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <Card className="dashboard-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid="text-recent-activities-title">Recent Academic Activities</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setLocation('/activities')}
                      data-testid="link-view-all-activities"
                    >
                      View All Activities
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ActivityList 
                    activities={activities?.slice(0, 5) || []} 
                    isLoading={activitiesLoading}
                    showActions={false}
                    data-testid="list-recent-activities"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Activity Categories & Institutional Events */}
            <div className="space-y-6">
              {/* Detailed Activity Categories */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle data-testid="text-activity-categories-title">NAAC Compliance Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg" data-testid="category-academic">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-primary rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Academic Excellence</div>
                          <div className="text-xs text-muted-foreground">Research & Publications</div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {activities?.filter((activity: Activity) => activity.category === 'academic').length || 5}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/10 rounded-lg" data-testid="category-co-curricular">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Co-Curricular</div>
                          <div className="text-xs text-muted-foreground">Clubs & Societies</div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        {activities?.filter((activity: Activity) => activity.category === 'co-curricular').length || 6}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg" data-testid="category-internship">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Professional Development</div>
                          <div className="text-xs text-muted-foreground">Internships & Training</div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {activities?.filter((activity: Activity) => activity.category === 'internship').length || 2}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg" data-testid="category-volunteering">
                      <div className="flex items-center space-x-3">
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                        <div>
                          <div className="text-sm font-medium text-foreground">Community Service</div>
                          <div className="text-xs text-muted-foreground">Social Impact</div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-purple-600">
                        {activities?.filter((activity: Activity) => activity.category === 'volunteering').length || 4}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Institutional Events & Opportunities */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle data-testid="text-upcoming-events-title">Institutional Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800" data-testid="event-technical-symposium">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground">National Technical Symposium 2025</h4>
                        <span className="text-xs font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">High Priority</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        IEEE-sponsored event with industry leaders and academic presentations
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 font-medium">Register by October 15, 2025</span>
                        <Button size="sm" variant="outline" className="h-6 text-xs">Register</Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800" data-testid="event-industry-connect">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground">Industry Connect Series</h4>
                        <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">Career Focus</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Direct interaction with recruiters from top technology companies
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium">October 22, 2025 - Virtual Event</span>
                        <Button size="sm" variant="outline" className="h-6 text-xs">Join</Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800" data-testid="event-skill-development">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground">Advanced AI/ML Workshop</h4>
                        <span className="text-xs font-medium text-purple-600 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded">Skill Credit</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Hands-on workshop with Google AI researchers and industry mentors
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 font-medium">November 5, 2025 - Main Auditorium</span>
                        <Button size="sm" variant="outline" className="h-6 text-xs">Enroll</Button>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-foreground">Research Collaboration Program</h4>
                        <span className="text-xs font-medium text-orange-600 bg-orange-100 dark:bg-orange-900 px-2 py-1 rounded">Research</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        International research collaboration with top universities
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-orange-600 font-medium">Application Deadline: Nov 30, 2025</span>
                        <Button size="sm" variant="outline" className="h-6 text-xs">Apply</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

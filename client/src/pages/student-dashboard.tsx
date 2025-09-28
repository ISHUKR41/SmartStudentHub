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
import { Download, Plus, GraduationCap, ClipboardList, Star, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { Activity } from "@shared/schema";

// Define API response types for type safety
interface StudentStats {
  totalActivities: number;
  skillCredits: number;
  pendingApprovals: number;
}

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
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
                Dashboard
              </h2>
              <p className="text-muted-foreground" data-testid="text-welcome-message">
                Welcome back, {user.firstName} {user.lastName}
              </p>
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
                    Download Portfolio
                  </>
                )}
              </Button>
              <Button 
                onClick={() => setLocation('/upload')}
                data-testid="button-add-activity"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
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
              subtitle="+3 this month"
              data-testid="card-total-activities"
            />

            <StatCard
              title="Skill Credits"
              value={studentStats?.skillCredits?.toString() || "0"}
              icon={<Star className="w-6 h-6" />}
              color="info"
              subtitle="Goal: 250 credits"
              progress={studentStats?.skillCredits ? (studentStats.skillCredits / 250) * 100 : 0}
              data-testid="card-skill-credits"
            />

            <StatCard
              title="Pending Approvals"
              value={studentStats?.pendingApprovals?.toString() || "0"}
              icon={<Clock className="w-6 h-6" />}
              color="warning"
              subtitle="Awaiting review"
              data-testid="card-pending-approvals"
            />
          </div>

          {/* Dashboard Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <div className="lg:col-span-2">
              <Card className="dashboard-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle data-testid="text-recent-activities-title">Recent Activities</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setLocation('/activities')}
                      data-testid="link-view-all-activities"
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ActivityList 
                    activities={activities?.slice(0, 5).map(activity => ({
                      ...activity,
                      description: activity.description || undefined,
                      activityDate: activity.activityDate ? activity.activityDate.toISOString() : '',
                      createdAt: activity.createdAt ? activity.createdAt.toISOString() : '',
                      skillCredits: activity.skillCredits || undefined,
                      feedback: activity.feedback || undefined
                    })) || []} 
                    isLoading={activitiesLoading}
                    showActions={false}
                    data-testid="list-recent-activities"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Activity Categories & Upcoming Events */}
            <div className="space-y-6">
              {/* Activity Categories */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle data-testid="text-activity-categories-title">Activity Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Activity category breakdown would be calculated from activities */}
                    <div className="flex items-center justify-between" data-testid="category-academic">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span className="text-sm text-foreground">Academic</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {activities?.filter((activity: Activity) => activity.category === 'academic').length || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between" data-testid="category-co-curricular">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Co-Curricular</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {activities?.filter((activity: Activity) => activity.category === 'co-curricular').length || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between" data-testid="category-extra-curricular">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Extra-Curricular</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {activities?.filter((activity: Activity) => activity.category === 'extra-curricular').length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle data-testid="text-upcoming-events-title">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/20 rounded-lg" data-testid="event-ai-symposium">
                      <h4 className="text-sm font-medium text-foreground">AI Research Symposium</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        March 15, 2024
                      </p>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-lg" data-testid="event-career-fair">
                      <h4 className="text-sm font-medium text-foreground">Career Fair 2024</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        March 22, 2024
                      </p>
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

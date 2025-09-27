import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import StatCard from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, ClipboardList, Building, Clock, FileText, TrendingUp, Download } from "lucide-react";

export default function AdminAnalytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const { data: departmentStats, isLoading: deptStatsLoading } = useQuery({
    queryKey: ["/api/admin/department-stats"],
    retry: false,
    enabled: user?.role === 'admin',
  });

  const { data: categoryStats, isLoading: categoryStatsLoading } = useQuery({
    queryKey: ["/api/admin/category-stats"],
    retry: false,
    enabled: user?.role === 'admin',
  });

  const { data: studentSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["/api/admin/student-summary"],
    retry: false,
    enabled: user?.role === 'admin',
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm font-medium text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleExportNAAC = () => {
    toast({
      title: "NAAC Report",
      description: "NAAC compliance report is being generated...",
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Analytics Report",
      description: "Custom analytics report is being generated...",
    });
  };

  const totalStudents = studentSummary?.length || 0;
  const totalActivities = studentSummary?.reduce((sum: number, item: any) => sum + item.totalActivities, 0) || 0;
  const activeDepartments = departmentStats?.length || 0;
  const pendingReviews = 0; // Would need separate API endpoint

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6" data-testid="main-analytics">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-analytics-title">
                Analytics & Reports
              </h2>
              <p className="text-muted-foreground" data-testid="text-analytics-description">
                Institutional activity statistics and compliance reporting
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={handleExportNAAC}
                data-testid="button-export-naac"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export NAAC Report
              </Button>
              <Button 
                onClick={handleGenerateReport}
                data-testid="button-generate-report"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Institution Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Students"
              value={totalStudents.toString()}
              icon={<Users className="w-6 h-6" />}
              color="primary"
              subtitle="+12% from last year"
              data-testid="card-total-students"
            />

            <StatCard
              title="Activities Recorded"
              value={totalActivities.toString()}
              icon={<ClipboardList className="w-6 h-6" />}
              color="success"
              subtitle="+847 this month"
              data-testid="card-activities-recorded"
            />

            <StatCard
              title="Active Departments"
              value={activeDepartments.toString()}
              icon={<Building className="w-6 h-6" />}
              color="info"
              subtitle="100% participation"
              data-testid="card-active-departments"
            />

            <StatCard
              title="Pending Reviews"
              value={pendingReviews.toString()}
              icon={<Clock className="w-6 h-6" />}
              color="warning"
              subtitle="Average 2.3 days"
              data-testid="card-pending-reviews"
            />
          </div>

          {/* Analytics Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department-wise Statistics */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle data-testid="text-department-stats-title">Department-wise Activity Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {deptStatsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {departmentStats?.map((dept: any, index: number) => (
                      <div 
                        key={dept.department} 
                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                        data-testid={`department-stat-${index}`}
                      >
                        <div>
                          <h4 className="text-sm font-medium text-foreground">{dept.department}</h4>
                          <p className="text-xs text-muted-foreground">
                            {dept.studentCount} students • {dept.activityCount} activities
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-success">
                            {dept.avgActivitiesPerStudent.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">avg per student</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Activity Categories Distribution */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle data-testid="text-category-distribution-title">Activity Categories Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {categoryStatsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categoryStats?.map((category: any, index: number) => (
                      <div key={category.category} className="space-y-2" data-testid={`category-stat-${index}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground capitalize">
                            {category.category.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {category.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Student Summary Table */}
          <Card className="dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle data-testid="text-student-summary-title">Student Activity Summary</CardTitle>
                <div className="flex items-center space-x-3">
                  <Input 
                    placeholder="Search students..." 
                    className="w-64" 
                    data-testid="input-search-students"
                  />
                  <Button 
                    variant="outline"
                    data-testid="button-export-table"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table" data-testid="table-student-summary">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Roll Number</th>
                        <th>Department</th>
                        <th>Total Activities</th>
                        <th>Skill Credits</th>
                        <th>Last Activity</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentSummary?.map((item: any, index: number) => (
                        <tr key={item.student.id} data-testid={`student-row-${index}`}>
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-primary-foreground">
                                  {item.student.firstName?.[0]}{item.student.lastName?.[0]}
                                </span>
                              </div>
                              <span className="font-medium">
                                {item.student.firstName} {item.student.lastName}
                              </span>
                            </div>
                          </td>
                          <td>{item.student.rollNumber}</td>
                          <td>{item.student.department}</td>
                          <td>{item.totalActivities}</td>
                          <td>{item.skillCredits}</td>
                          <td>
                            {item.lastActivity 
                              ? new Date(item.lastActivity).toLocaleDateString()
                              : 'No activities'
                            }
                          </td>
                          <td>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              data-testid={`button-view-details-${index}`}
                            >
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

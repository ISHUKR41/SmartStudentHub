import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import ApprovalQueue from "@/components/ui/approval-queue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Eye, Check, X } from "lucide-react";

export default function FacultyApprovals() {
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();

  // Redirect if not authenticated or not faculty/admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || (user?.role !== 'faculty' && user?.role !== 'admin'))) {
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

  const { data: pendingActivities, isLoading: activitiesLoading, error } = useQuery({
    queryKey: ["/api/faculty/pending-activities"],
    retry: false,
    enabled: user?.role === 'faculty' || user?.role === 'admin',
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ activityId, status, feedback, skillCredits }: {
      activityId: string;
      status: 'approved' | 'rejected';
      feedback?: string;
      skillCredits?: number;
    }) => {
      const response = await apiRequest(
        'PATCH',
        `/api/faculty/activities/${activityId}/status`,
        { status, feedback, skillCredits }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: "Activity status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/faculty/pending-activities"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
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

  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    return null;
  }

  const handleApprove = (activityId: string) => {
    updateStatusMutation.mutate({
      activityId,
      status: 'approved',
      skillCredits: 10, // Default skill credits, could be customizable
    });
  };

  const handleReject = (activityId: string, feedback?: string) => {
    updateStatusMutation.mutate({
      activityId,
      status: 'rejected',
      feedback: feedback || 'Activity did not meet the required criteria.',
    });
  };

  const filteredActivities = pendingActivities?.filter((activity: any) => {
    if (filterCategory && activity.category !== filterCategory) return false;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6" data-testid="main-approvals">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-approvals-title">
                Pending Approvals
              </h2>
              <p className="text-muted-foreground" data-testid="text-approvals-description">
                Review and approve student activity submissions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Filter Controls */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40" data-testid="select-filter-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="co-curricular">Co-Curricular</SelectItem>
                  <SelectItem value="extra-curricular">Extra-Curricular</SelectItem>
                  <SelectItem value="volunteering">Volunteering</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="mooc">MOOC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Approval Queue */}
          <Card className="dashboard-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle data-testid="text-submission-queue-title">Submission Queue</CardTitle>
                <Badge variant="secondary" data-testid="badge-pending-count">
                  {filteredActivities.length} pending submissions
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : filteredActivities.length === 0 ? (
                <div className="text-center py-8" data-testid="text-no-submissions">
                  <p className="text-muted-foreground">No pending submissions found.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredActivities.map((activity: any) => (
                    <div key={activity.id} className="py-6" data-testid={`submission-${activity.id}`}>
                      <div className="flex items-start space-x-4">
                        {/* Student Avatar */}
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-foreground">
                            {activity.student?.firstName?.[0]}{activity.student?.lastName?.[0]}
                          </span>
                        </div>

                        {/* Submission Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-base font-medium text-foreground" data-testid={`text-activity-title-${activity.id}`}>
                                {activity.title}
                              </h4>
                              <p className="text-sm text-muted-foreground" data-testid={`text-student-info-${activity.id}`}>
                                Submitted by <span className="font-medium">
                                  {activity.student?.firstName} {activity.student?.lastName}
                                </span> ({activity.student?.rollNumber}) • {new Date(activity.createdAt).toLocaleDateString()}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge className="status-pending" data-testid={`badge-category-${activity.id}`}>
                                  {activity.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground" data-testid={`text-organization-${activity.id}`}>
                                  {activity.organization}
                                </span>
                                <span className="text-xs text-muted-foreground" data-testid={`text-date-${activity.id}`}>
                                  {new Date(activity.activityDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                data-testid={`button-view-details-${activity.id}`}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleReject(activity.id)}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-reject-${activity.id}`}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                              <Button 
                                className="bg-green-600 hover:bg-green-700 text-white" 
                                size="sm"
                                onClick={() => handleApprove(activity.id)}
                                disabled={updateStatusMutation.isPending}
                                data-testid={`button-approve-${activity.id}`}
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                            </div>
                          </div>

                          {/* Description Preview */}
                          {activity.description && (
                            <div className="mt-3 p-3 bg-muted/20 rounded-lg" data-testid={`text-description-${activity.id}`}>
                              <p className="text-sm text-foreground">
                                {activity.description.length > 200 
                                  ? `${activity.description.substring(0, 200)}...`
                                  : activity.description
                                }
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

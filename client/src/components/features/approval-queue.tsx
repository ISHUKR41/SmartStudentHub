import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Eye, 
  Check, 
  X, 
  Download, 
  User, 
  Calendar, 
  Building2, 
  FileText,
  Star,
  AlertCircle 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  department: string;
  email: string;
}

interface Activity {
  id: string;
  title: string;
  description?: string;
  category: string;
  organization: string;
  activityDate: string;
  status: 'pending' | 'approved' | 'rejected';
  skillCredits?: number;
  createdAt: string;
  student: Student;
  feedback?: string;
}

interface ApprovalQueueProps {
  activities: Activity[];
  isLoading?: boolean;
  onApprove: (activityId: string, skillCredits?: number) => void;
  onReject: (activityId: string, feedback: string) => void;
  onViewDetails?: (activity: Activity) => void;
  isProcessing?: boolean;
  className?: string;
}

interface ApprovalDialogState {
  isOpen: boolean;
  activity: Activity | null;
  action: 'approve' | 'reject' | 'view' | null;
}

export default function ApprovalQueue({
  activities,
  isLoading = false,
  onApprove,
  onReject,
  onViewDetails,
  isProcessing = false,
  className
}: ApprovalQueueProps) {
  const [dialogState, setDialogState] = useState<ApprovalDialogState>({
    isOpen: false,
    activity: null,
    action: null
  });
  const [feedback, setFeedback] = useState("");
  const [skillCredits, setSkillCredits] = useState("10");
  const [searchQuery, setSearchQuery] = useState("");

  const handleApprove = (activity: Activity) => {
    setDialogState({
      isOpen: true,
      activity,
      action: 'approve'
    });
    setSkillCredits("10"); // Default skill credits
  };

  const handleReject = (activity: Activity) => {
    setDialogState({
      isOpen: true,
      activity,
      action: 'reject'
    });
    setFeedback("");
  };

  const handleViewDetails = (activity: Activity) => {
    setDialogState({
      isOpen: true,
      activity,
      action: 'view'
    });
    onViewDetails?.(activity);
  };

  const confirmApproval = () => {
    if (dialogState.activity) {
      onApprove(dialogState.activity.id, parseInt(skillCredits) || 0);
      closeDialog();
    }
  };

  const confirmRejection = () => {
    if (dialogState.activity && feedback.trim()) {
      onReject(dialogState.activity.id, feedback.trim());
      closeDialog();
    }
  };

  const closeDialog = () => {
    setDialogState({
      isOpen: false,
      activity: null,
      action: null
    });
    setFeedback("");
    setSkillCredits("10");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStudentInitials = (student: Student) => {
    return (student.firstName?.[0] || '') + (student.lastName?.[0] || '');
  };

  // Filter activities based on search query
  const filteredActivities = activities.filter(activity => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      activity.title.toLowerCase().includes(query) ||
      activity.organization.toLowerCase().includes(query) ||
      activity.student.firstName.toLowerCase().includes(query) ||
      activity.student.lastName.toLowerCase().includes(query) ||
      activity.student.rollNumber.toLowerCase().includes(query) ||
      activity.category.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <Card className={cn("dashboard-card", className)}>
        <CardHeader>
          <CardTitle>Loading Submissions...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-center space-x-4 p-4">
                  <div className="w-12 h-12 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-20 h-8 bg-muted rounded"></div>
                    <div className="w-20 h-8 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={cn("dashboard-card", className)} data-testid="approval-queue">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle data-testid="approval-queue-title">
              Submission Queue
            </CardTitle>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                data-testid="search-submissions"
              />
              <Badge variant="secondary" data-testid="pending-count">
                {filteredActivities.length} pending
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8" data-testid="no-submissions">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'No Matching Submissions' : 'No Pending Submissions'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? 'Try adjusting your search criteria.'
                  : 'All submissions have been reviewed.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className="py-6" data-testid={`submission-${index}`}>
                  <div className="flex items-start space-x-4">
                    {/* Student Avatar */}
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary-foreground">
                        {getStudentInitials(activity.student)}
                      </span>
                    </div>

                    {/* Submission Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Activity Title and Student Info */}
                          <h4 className="text-base font-medium text-foreground" data-testid={`activity-title-${index}`}>
                            {activity.title}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center" data-testid={`student-info-${index}`}>
                              <User className="w-4 h-4 mr-1" />
                              {activity.student.firstName} {activity.student.lastName} ({activity.student.rollNumber})
                            </span>
                            <span data-testid={`submission-time-${index}`}>
                              {getTimeAgo(activity.createdAt)}
                            </span>
                          </div>

                          {/* Activity Metadata */}
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge 
                              className="status-pending" 
                              data-testid={`category-badge-${index}`}
                            >
                              {formatCategory(activity.category)}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center" data-testid={`organization-${index}`}>
                              <Building2 className="w-3 h-3 mr-1" />
                              {activity.organization}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center" data-testid={`activity-date-${index}`}>
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(activity.activityDate)}
                            </span>
                          </div>

                          {/* Description Preview */}
                          {activity.description && (
                            <div className="mt-3 p-3 bg-muted/20 rounded-lg" data-testid={`description-${index}`}>
                              <p className="text-sm text-foreground">
                                {activity.description.length > 200 
                                  ? `${activity.description.substring(0, 200)}...`
                                  : activity.description
                                }
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(activity)}
                            data-testid={`button-view-details-${index}`}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(activity)}
                            disabled={isProcessing}
                            data-testid={`button-reject-${index}`}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            className="bg-green-600 hover:bg-green-700 text-white" 
                            size="sm"
                            onClick={() => handleApprove(activity)}
                            disabled={isProcessing}
                            data-testid={`button-approve-${index}`}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={dialogState.isOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md" data-testid="approval-dialog">
          <DialogHeader>
            <DialogTitle>
              {dialogState.action === 'approve' && 'Approve Activity'}
              {dialogState.action === 'reject' && 'Reject Activity'}
              {dialogState.action === 'view' && 'Activity Details'}
            </DialogTitle>
          </DialogHeader>

          {dialogState.activity && (
            <div className="space-y-4">
              {/* Activity Summary */}
              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-medium text-foreground">{dialogState.activity.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {dialogState.activity.student.firstName} {dialogState.activity.student.lastName} • {dialogState.activity.organization}
                </p>
              </div>

              {/* Action-specific content */}
              {dialogState.action === 'approve' && (
                <div className="space-y-4">
                  <Alert>
                    <Star className="h-4 w-4" />
                    <AlertDescription>
                      This activity will be marked as approved and added to the student's verified record.
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <Label htmlFor="skillCredits">Skill Credits to Award</Label>
                    <Input
                      id="skillCredits"
                      type="number"
                      value={skillCredits}
                      onChange={(e) => setSkillCredits(e.target.value)}
                      min="0"
                      max="50"
                      className="mt-1"
                      data-testid="input-skill-credits"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Typically 5-15 credits based on activity significance
                    </p>
                  </div>
                </div>
              )}

              {dialogState.action === 'reject' && (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This activity will be rejected and the student will be notified with your feedback.
                    </AlertDescription>
                  </Alert>
                  
                  <div>
                    <Label htmlFor="feedback">Rejection Reason</Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Please provide specific feedback about why this activity is being rejected..."
                      className="mt-1"
                      rows={4}
                      data-testid="textarea-feedback"
                    />
                  </div>
                </div>
              )}

              {dialogState.action === 'view' && dialogState.activity.description && (
                <div>
                  <Label>Activity Description</Label>
                  <div className="mt-1 p-3 bg-muted/20 rounded-lg text-sm">
                    {dialogState.activity.description}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} data-testid="button-cancel-dialog">
              Cancel
            </Button>
            
            {dialogState.action === 'approve' && (
              <Button 
                onClick={confirmApproval}
                disabled={isProcessing || !skillCredits}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-confirm-approve"
              >
                {isProcessing ? 'Processing...' : 'Approve Activity'}
              </Button>
            )}
            
            {dialogState.action === 'reject' && (
              <Button 
                variant="destructive"
                onClick={confirmRejection}
                disabled={isProcessing || !feedback.trim()}
                data-testid="button-confirm-reject"
              >
                {isProcessing ? 'Processing...' : 'Reject Activity'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

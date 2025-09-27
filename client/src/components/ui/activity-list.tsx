import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Download, Calendar, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
  feedback?: string;
}

interface ActivityListProps {
  activities: Activity[];
  isLoading?: boolean;
  showActions?: boolean;
  onViewActivity?: (activity: Activity) => void;
  onDownloadCertificate?: (activity: Activity) => void;
  className?: string;
}

export default function ActivityList({
  activities,
  isLoading = false,
  showActions = true,
  onViewActivity,
  onDownloadCertificate,
  className
}: ActivityListProps) {
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { className: "status-pending", label: "Pending" },
      approved: { className: "status-approved", label: "Approved" },
      rejected: { className: "status-rejected", label: "Rejected" }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <Badge className={config.className} data-testid={`status-badge-${status}`}>
        {config.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons = {
      academic: "🎓",
      "co-curricular": "🏆",
      "extra-curricular": "🎯",
      volunteering: "❤️",
      internship: "💼",
      leadership: "👑",
      mooc: "💻"
    };
    
    return categoryIcons[category as keyof typeof categoryIcons] || "📝";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCategory = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)} data-testid="activity-list-loading">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="dashboard-card">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-6 bg-muted rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={cn("text-center py-8", className)} data-testid="activity-list-empty">
        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No Activities Found</h3>
        <p className="text-muted-foreground text-sm">
          Start by uploading your achievements and certificates to build your portfolio.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)} data-testid="activity-list">
      {activities.map((activity, index) => (
        <Card key={activity.id} className="dashboard-card hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start space-x-4" data-testid={`activity-item-${index}`}>
              {/* Activity Icon */}
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-xl">
                {getCategoryIcon(activity.category)}
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate" data-testid={`activity-title-${index}`}>
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center" data-testid={`activity-organization-${index}`}>
                        <Building2 className="w-3 h-3 mr-1" />
                        {activity.organization}
                      </span>
                      <span className="flex items-center" data-testid={`activity-date-${index}`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(activity.activityDate)}
                      </span>
                    </div>
                    
                    {/* Description Preview */}
                    {activity.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2" data-testid={`activity-description-${index}`}>
                        {activity.description.length > 100 
                          ? `${activity.description.substring(0, 100)}...`
                          : activity.description
                        }
                      </p>
                    )}

                    {/* Category and Credits */}
                    <div className="flex items-center space-x-3 mt-3">
                      <Badge variant="outline" className="text-xs" data-testid={`activity-category-${index}`}>
                        {formatCategory(activity.category)}
                      </Badge>
                      {activity.skillCredits && activity.status === 'approved' && (
                        <span className="text-xs text-success font-medium" data-testid={`activity-credits-${index}`}>
                          +{activity.skillCredits} credits
                        </span>
                      )}
                    </div>

                    {/* Feedback for rejected activities */}
                    {activity.status === 'rejected' && activity.feedback && (
                      <div className="mt-2 p-2 bg-destructive/5 border border-destructive/20 rounded text-xs">
                        <p className="text-destructive" data-testid={`activity-feedback-${index}`}>
                          <strong>Feedback:</strong> {activity.feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center space-x-3 ml-4">
                    {getStatusBadge(activity.status)}
                    
                    {showActions && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewActivity?.(activity)}
                          data-testid={`button-view-activity-${index}`}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {activity.status === 'approved' && onDownloadCertificate && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDownloadCertificate(activity)}
                            data-testid={`button-download-certificate-${index}`}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

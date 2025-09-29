/**
 * Activity List Component for Smart Student Hub
 * 
 * A comprehensive activity display component designed for showcasing student
 * achievements, faculty verification queues, and administrative analytics.
 * Provides professional formatting suitable for institutional environments.
 * 
 * Key Features:
 * - NAAC-compliant activity categorization with visual indicators
 * - Professional status badges for verification workflow
 * - Category-specific icons for immediate visual identification
 * - Interactive actions for viewing details and downloading certificates
 * - Loading states for enhanced user experience
 * - Responsive design optimized for various screen sizes
 * 
 * Activity Categories (NAAC Compliant):
 * - Academic: Research, publications, academic competitions
 * - Co-curricular: Technical events, skill development programs
 * - Extra-curricular: Cultural activities, social engagement
 * - Volunteering: Community service, social responsibility
 * - Internship: Industry experience, professional development
 * - Leadership: Student government, organizational roles
 * - MOOC: Online courses, professional certifications
 * 
 * Status Management:
 * - Pending: Awaiting faculty verification
 * - Approved: Faculty-verified and portfolio-ready
 * - Rejected: Requires revision or additional documentation
 * 
 * Professional Features:
 * - Institutional verification badges
 * - Date formatting with consistent standards
 * - Professional color coding for status and categories
 * - Certificate download capabilities for verified activities
 * - Detailed activity metadata display
 * 
 * Integration Points:
 * - Student dashboard activity feeds
 * - Faculty approval and verification interfaces
 * - Digital portfolio generation systems
 * - Administrative analytics and reporting tools
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Eye, 
  Download, 
  Calendar, 
  Building2, 
  GraduationCap, 
  Trophy, 
  Target, 
  Heart, 
  Briefcase, 
  Crown, 
  Monitor,
  FileText 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Activity } from "@shared/schema";

/**
 * Activity List Component Props
 * 
 * Configuration interface for the activity list component,
 * enabling flexible display across different institutional contexts.
 */
interface ActivityListProps {
  activities: Activity[];                                    // Array of activities to display
  isLoading?: boolean;                                       // Loading state indicator
  showActions?: boolean;                                     // Whether to show action buttons
  onViewActivity?: (activity: Activity) => void;            // Callback for viewing activity details
  onDownloadCertificate?: (activity: Activity) => void;     // Callback for certificate download
  className?: string;                                        // Additional CSS classes
}

/**
 * Activity List Component
 * 
 * Professional activity display component for institutional activity
 * management and student achievement showcase interfaces.
 */

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
      academic: <GraduationCap className="w-5 h-5 text-blue-600" />,
      "co-curricular": <Trophy className="w-5 h-5 text-amber-600" />,
      "extra-curricular": <Target className="w-5 h-5 text-green-600" />,
      volunteering: <Heart className="w-5 h-5 text-red-600" />,
      internship: <Briefcase className="w-5 h-5 text-purple-600" />,
      leadership: <Crown className="w-5 h-5 text-yellow-600" />,
      mooc: <Monitor className="w-5 h-5 text-indigo-600" />
    };
    
    return categoryIcons[category as keyof typeof categoryIcons] || <FileText className="w-5 h-5 text-gray-600" />;
  };

  const formatDate = (dateValue: string | Date) => {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    return date.toLocaleDateString('en-US', {
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
      <div className={cn("space-y-3 lg:space-y-4", className)} data-testid="activity-list-loading">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="dashboard-card">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="w-16 sm:w-20 h-6 bg-muted rounded flex-shrink-0"></div>
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
    <div className={cn("space-y-3 lg:space-y-4", className)} data-testid="activity-list">
      {activities.map((activity, index) => (
        <Card key={activity.id} className="dashboard-card hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4" data-testid={`activity-item-${index}`}>
              {/* Activity Icon - Responsive sizing */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 self-start sm:self-center">
                <div className="w-5 h-5 sm:w-6 sm:h-6">
                  {getCategoryIcon(activity.category)}
                </div>
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0 space-y-2 sm:space-y-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground line-clamp-2 sm:line-clamp-1" data-testid={`activity-title-${index}`}>
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
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 self-start sm:self-center">
                <div className="flex items-center gap-2">
                  {getStatusBadge(activity.status)}
                </div>
                
                {showActions && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewActivity?.(activity)}
                      className="min-h-[44px] min-w-[44px] h-10 w-10 p-0 sm:h-9 sm:w-9 sm:p-2 touch-manipulation"
                      data-testid={`button-view-activity-${index}`}
                      aria-label="View activity details"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {activity.status === 'approved' && onDownloadCertificate && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadCertificate(activity)}
                        className="min-h-[44px] min-w-[44px] h-10 w-10 p-0 sm:h-9 sm:w-9 sm:p-2 touch-manipulation"
                        data-testid={`button-download-certificate-${index}`}
                        aria-label="Download certificate"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

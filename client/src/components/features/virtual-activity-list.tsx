import { forwardRef } from "react";
import { useSpring, animated } from "react-spring";
// Temporary fix: Create a simple List component to replace react-window until build issue is resolved
const List = forwardRef<HTMLDivElement, any>(({ height, itemSize, itemCount, children: ItemComponent, itemData, ...props }, ref) => {
  const items = Array.from({ length: itemCount }, (_, index) => (
    <ItemComponent key={index} index={index} style={{ height: itemSize }} data={itemData} />
  ));
  
  return (
    <div ref={ref} style={{ height, overflowY: 'auto' }} {...props}>
      {items}
    </div>
  );
});
import { Activity } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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
  Clock,
  CheckCircle,
  XCircle,
  Award
} from "lucide-react";

interface VirtualActivityListProps {
  activities: Activity[];
  height: number;
  isLoading?: boolean;
  onViewActivity?: (activity: Activity) => void;
  onDownloadCertificate?: (activity: Activity) => void;
  className?: string;
}

interface ActivityItemProps {
  index: number;
  style: React.CSSProperties;
  data: {
    activities: Activity[];
    onViewActivity?: (activity: Activity) => void;
    onDownloadCertificate?: (activity: Activity) => void;
  };
}

const getStatusConfig = (status: string) => {
  const configs = {
    pending: {
      variant: "secondary" as const,
      className: "status-pending bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
      icon: Clock,
      label: "Pending Review"
    },
    approved: {
      variant: "secondary" as const,
      className: "status-approved bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      icon: CheckCircle,
      label: "Faculty Approved"
    },
    rejected: {
      variant: "secondary" as const,
      className: "status-rejected bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      icon: XCircle,
      label: "Needs Revision"
    }
  };
  
  return configs[status as keyof typeof configs] || configs.pending;
};

const getCategoryConfig = (category: string) => {
  const configs = {
    academic: { icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    "co-curricular": { icon: Trophy, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    "extra-curricular": { icon: Target, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
    volunteering: { icon: Heart, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
    internship: { icon: Briefcase, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    leadership: { icon: Crown, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    mooc: { icon: Monitor, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" }
  };
  
  return configs[category as keyof typeof configs] || configs.academic;
};

const ActivityItem = forwardRef<HTMLDivElement, ActivityItemProps>(
  ({ index, style, data }, ref) => {
    const activity = data.activities[index];
    const statusConfig = getStatusConfig(activity.status);
    const categoryConfig = getCategoryConfig(activity.category);
    const StatusIcon = statusConfig.icon;
    const CategoryIcon = categoryConfig.icon;

    const springProps = useSpring({
      from: { opacity: 0, transform: 'translateX(-20px)' },
      to: { opacity: 1, transform: 'translateX(0px)' },
      config: { tension: 200, friction: 25 },
      delay: index * 50
    });

    const formatActivityDate = (dateValue: Date | string | null): string => {
      if (!dateValue) return 'Date not specified';
      try {
        const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        return date instanceof Date && !isNaN(date.getTime()) 
          ? format(date, 'MMM dd, yyyy')
          : 'Invalid date';
      } catch {
        return 'Invalid date';
      }
    };

    return (
      <animated.div ref={ref} style={{ ...style, ...springProps }} className="px-4 py-2">
        <Card className="h-full hover:shadow-md transition-all duration-200 border border-border hover:border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between space-x-4">
              
              {/* Activity Information */}
              <div className="flex-1 min-w-0 space-y-3">
                
                {/* Header with Category and Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={cn("p-1.5 rounded-lg", categoryConfig.bg)}>
                      <CategoryIcon className={cn("w-4 h-4", categoryConfig.color)} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {activity.category.replace(/[_-]/g, ' ')}
                    </span>
                  </div>
                  
                  <Badge className={cn("flex items-center space-x-1 px-2 py-1", statusConfig.className)}>
                    <StatusIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">{statusConfig.label}</span>
                  </Badge>
                </div>

                {/* Activity Title and Description */}
                <div>
                  <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
                    {activity.title}
                  </h3>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                  )}
                </div>

                {/* Activity Details */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Building2 className="w-3 h-3" />
                    <span>{activity.organization}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatActivityDate(activity.activityDate)}</span>
                  </div>
                  {activity.skillCredits && activity.skillCredits > 0 && (
                    <div className="flex items-center space-x-1">
                      <Award className="w-3 h-3 text-primary" />
                      <span className="font-medium text-primary">
                        {activity.skillCredits} credit{activity.skillCredits !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2">
                {data.onViewActivity && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => data.onViewActivity!(activity)}
                    className="flex items-center space-x-1 h-8 px-3"
                    data-testid={`button-view-activity-${activity.id}`}
                  >
                    <Eye className="w-3 h-3" />
                    <span className="text-xs">View</span>
                  </Button>
                )}
                
                {data.onDownloadCertificate && activity.status === 'approved' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => data.onDownloadCertificate!(activity)}
                    className="flex items-center space-x-1 h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                    data-testid={`button-download-certificate-${activity.id}`}
                  >
                    <Download className="w-3 h-3" />
                    <span className="text-xs">Download</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </animated.div>
    );
  }
);

ActivityItem.displayName = "ActivityItem";

const ActivityListSkeleton = ({ height }: { height: number }) => {
  const skeletonCount = Math.floor(height / 120); // Estimate items that would fit

  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex items-start justify-between space-x-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-6 h-6 rounded-lg" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                  <Skeleton className="w-24 h-5 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-full h-3" />
                  <Skeleton className="w-2/3 h-3" />
                </div>
                <div className="flex space-x-4">
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-20 h-3" />
                  <Skeleton className="w-16 h-3" />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Skeleton className="w-16 h-8" />
                <Skeleton className="w-16 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function VirtualActivityList({
  activities,
  height,
  isLoading = false,
  onViewActivity,
  onDownloadCertificate,
  className
}: VirtualActivityListProps) {
  
  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.98)' },
    to: { opacity: isLoading ? 0.7 : 1, transform: 'scale(1)' },
    config: { tension: 300, friction: 30 }
  });

  // Loading state
  if (isLoading) {
    return (
      <animated.div style={{...containerSpring, height}} className={cn("border border-border rounded-lg bg-card", className)}>
        <ActivityListSkeleton height={height} />
      </animated.div>
    );
  }

  // Empty state
  if (activities.length === 0) {
    return (
      <animated.div 
        style={{...containerSpring, height}}
        className={cn("border border-border rounded-lg bg-card flex items-center justify-center", className)}
        data-testid="empty-activity-list"
      >
        <div className="text-center space-y-3 p-8">
          <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-foreground">No Activities Found</h3>
            <p className="text-sm text-muted-foreground">
              Start documenting your academic achievements and activities
            </p>
          </div>
        </div>
      </animated.div>
    );
  }

  // Item height for consistent virtualization
  const ITEM_HEIGHT = 140;

  return (
    <animated.div style={containerSpring} className={cn("border border-border rounded-lg bg-card overflow-hidden", className)}>
      <List
        height={height}
        itemCount={activities.length}
        itemSize={ITEM_HEIGHT}
        itemData={{
          activities,
          onViewActivity,
          onDownloadCertificate
        }}
        className="scrollbar-thin scrollbar-track-muted scrollbar-thumb-muted-foreground/30"
        data-testid="virtual-activity-list"
      >
        {ActivityItem}
      </List>
    </animated.div>
  );
}
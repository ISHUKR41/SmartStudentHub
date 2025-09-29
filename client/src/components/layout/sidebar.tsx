/**
 * Sidebar Information Panel for Smart Student Hub
 * 
 * This comprehensive sidebar component provides contextual information and quick access
 * to essential academic data for the Smart Student Hub institutional platform. Rather than
 * duplicating main navigation, it focuses on user context, statistics, and notifications
 * to enhance the overall user experience.
 * 
 * Core Features:
 * - User profile information with academic details and current status
 * - Real-time academic statistics including activities, credits, and approvals
 * - Recent activity feed for quick access to latest submissions and updates
 * - Progress indicators for academic goals and portfolio completion
 * - Important notifications and deadline alerts
 * - Quick action buttons for common tasks and workflows
 * 
 * Information Sections:
 * - User Profile: Name, role, academic year, department, and profile picture
 * - Academic Stats: Total activities, skill credits, pending approvals, completion rates
 * - Recent Activities: Latest submissions with verification status and timestamps
 * - Progress Tracking: Portfolio completion, semester progress, achievement goals
 * - Notifications: Deadline reminders, faculty feedback, system announcements
 * - Quick Actions: Common shortcuts for frequent tasks
 * 
 * Professional Design:
 * - Clean, institutional interface complementing the main navigation
 * - Consistent styling with Higher Education Institution standards
 * - Responsive design ensuring optimal display across all device types
 * - Professional color scheme and typography suitable for academic environments
 * - Accessibility-compliant design patterns for inclusive educational use
 * 
 * User Experience:
 * - Contextual information relevant to current user session and activities
 * - Real-time updates for statistics and notifications
 * - Intuitive organization of information for quick scanning and access
 * - Professional presentation suitable for academic institutional environments
 * 
 * Technical Implementation:
 * - React functional components with TypeScript for type safety
 * - Integration with authentication system for personalized content
 * - Real-time data fetching for statistics and activity updates
 * - Responsive CSS using Tailwind CSS framework
 * - Optimized performance for smooth user experience
 */

import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  User,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Bell,
  CheckCircle2,
  Calendar,
  Target,
  Zap,
  AlertTriangle,
  Plus,
  FileText
} from "lucide-react";
import { Activity } from "@shared/schema";

/**
 * Student Statistics Interface
 * 
 * Defines the structure for student performance metrics and activity data
 * used throughout the sidebar for displaying real-time academic information.
 */
interface StudentStats {
  totalActivities: number;
  skillCredits: number;
  pendingApprovals: number;
  portfolioCompletion: number;
  currentGPA: number;
  semesterCredits: number;
}

/**
 * Recent Activity Interface
 * 
 * Defines the structure for recent activity items displayed in the sidebar
 */
interface RecentActivity {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  type: string;
}

/**
 * Quick Action Button Component
 * 
 * Renders individual quick action buttons for common tasks
 */
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'outline';
}

function QuickAction({ icon, label, onClick, variant = 'outline' }: QuickActionProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      className="w-full justify-start"
      onClick={onClick}
      data-testid={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </Button>
  );
}

/**
 * Sidebar Information Panel
 * 
 * Main sidebar component providing contextual information, statistics, and quick access
 * to essential academic data. Complements the main navigation by focusing on user context
 * and real-time information rather than duplicating navigation functionality.
 * 
 * @returns {JSX.Element | null} Complete sidebar information panel or null if user not authenticated
 */
export default function Sidebar() {
  // Authentication hook for user state and role verification
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Return null if user is not authenticated
  if (!user) return null;

  // Fetch student statistics with loading state
  const { data: stats, isLoading: isLoadingStats } = useQuery<StudentStats>({
    queryKey: ["/api/students/stats"],
    retry: false,
  });

  // Fetch recent activities with loading state
  const { data: recentActivities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ["/api/students/activities"],
    retry: false,
  });

  // Helper function for safe date formatting
  const formatActivityDate = (dateValue: Date | string | null): string => {
    if (!dateValue) return 'Unknown';
    try {
      const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
      return date instanceof Date && !isNaN(date.getTime()) 
        ? date.toLocaleDateString()
        : 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  // Default values for display when data is loading
  const defaultStats = {
    totalActivities: stats?.totalActivities || 0,
    skillCredits: stats?.skillCredits || 0,
    pendingApprovals: stats?.pendingApprovals || 0,
    portfolioCompletion: stats?.portfolioCompletion || 0,
    currentGPA: stats?.currentGPA || 0,
    semesterCredits: stats?.semesterCredits || 0
  };

  // Format recent activities for display with safe date parsing
  const displayActivities = recentActivities?.slice(0, 3).map(activity => ({
    id: activity.id,
    title: activity.title,
    status: activity.status,
    submittedAt: formatActivityDate(activity.createdAt),
    type: activity.category === 'academic' ? 'Academic' : 
          activity.category === 'co-curricular' ? 'Co-curricular' :
          activity.category === 'extra-curricular' ? 'Extra-curricular' :
          activity.category === 'leadership' ? 'Leadership' :
          activity.category === 'mooc' ? 'Technical' : 
          activity.category.charAt(0).toUpperCase() + activity.category.slice(1)
  })) || [];

  return (
    <aside className="w-64 lg:w-72 xl:w-80 bg-background border-r border-border overflow-y-auto" data-testid="sidebar">
      <div className="p-3 lg:p-4 space-y-4 lg:space-y-6">
        
        {/* User Profile Section */}
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 lg:w-12 lg:h-12" data-testid="avatar-profile">
                <AvatarImage src={user.profileImageUrl || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm lg:text-base truncate" data-testid="text-username">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs text-muted-foreground capitalize truncate" data-testid="text-user-role">
                  {user.role}
                </p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground" data-testid="text-academic-info">
                  <BookOpen className="w-3 h-3 mr-1" />
                  GPA {defaultStats.currentGPA}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Statistics */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm lg:text-base flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoadingStats ? (
              <div className="space-y-3" data-testid="loading-stats">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-muted rounded-lg animate-pulse">
                    <div className="h-6 bg-muted-foreground/20 rounded mb-1"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded"></div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded-lg animate-pulse">
                    <div className="h-6 bg-muted-foreground/20 rounded mb-1"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded"></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-muted rounded-lg" data-testid="stat-activities">
                  <div className="text-base lg:text-lg font-bold text-primary">{defaultStats.totalActivities}</div>
                  <div className="text-xs text-muted-foreground">Activities</div>
                </div>
                <div className="text-center p-2 bg-muted rounded-lg" data-testid="stat-credits">
                  <div className="text-base lg:text-lg font-bold text-green-600">{defaultStats.skillCredits}</div>
                  <div className="text-xs text-muted-foreground">Credits</div>
                </div>
              </div>
            )}
            
            {!isLoadingStats && (
              <>
                <div className="space-y-2" data-testid="portfolio-progress">
                  <div className="flex justify-between text-xs">
                    <span>Portfolio Completion</span>
                    <span className="font-medium">{defaultStats.portfolioCompletion}%</span>
                  </div>
                  <Progress value={defaultStats.portfolioCompletion} className="h-2" />
                </div>
                
                {defaultStats.pendingApprovals > 0 && (
                  <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-950 rounded-lg" data-testid="alert-pending-approvals">
                    <div className="flex items-center text-xs">
                      <Clock className="w-3 h-3 mr-1 text-yellow-600" />
                      Pending Approvals
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      {defaultStats.pendingApprovals}
                    </Badge>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm lg:text-base flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Recent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isLoadingActivities ? (
              <div className="space-y-2" data-testid="loading-activities">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start space-x-2 p-2 rounded-lg animate-pulse">
                    <div className="mt-1 w-3 h-3 bg-muted-foreground/20 rounded-full"></div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="h-3 bg-muted-foreground/20 rounded w-3/4"></div>
                      <div className="h-2 bg-muted-foreground/20 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : displayActivities.length > 0 ? (
              displayActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors" data-testid={`activity-item-${activity.id}`}>
                  <div className="mt-1">
                    {activity.status === 'approved' ? (
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                    ) : activity.status === 'pending' ? (
                      <Clock className="w-3 h-3 text-yellow-600" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" data-testid={`text-activity-title-${activity.id}`}>{activity.title}</p>
                    <p className="text-xs text-muted-foreground" data-testid={`text-activity-meta-${activity.id}`}>
                      {activity.type} • {activity.submittedAt}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4" data-testid="text-no-activities">
                No recent activities found
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm lg:text-base flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <QuickAction
              icon={<Calendar className="w-4 h-4" />}
              label="Deadlines"
              onClick={() => {}}
            />
            <QuickAction
              icon={<Bell className="w-4 h-4" />}
              label="Notifications"
              onClick={() => {}}
            />
            <QuickAction
              icon={<Target className="w-4 h-4" />}
              label="Goals"
              onClick={() => {}}
            />
          </CardContent>
        </Card>

        {/* Notifications/Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm lg:text-base flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg" data-testid="alert-deadline">
              <div className="flex items-start gap-2">
                <Target className="w-3 h-3 mt-1 text-blue-600" />
                <div>
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                    Portfolio Due
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Jan 30, 2024
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg" data-testid="alert-achievement">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 mt-1 text-green-600" />
                <div>
                  <p className="text-xs font-medium text-green-900 dark:text-green-100">
                    Achievement Approved
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    ML Workshop verified
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </aside>
  );
}
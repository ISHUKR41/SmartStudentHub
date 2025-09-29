/**
 * Stat Card Component for Smart Student Hub
 * 
 * A professional statistical display component designed for institutional dashboards
 * and analytics interfaces. Provides visual representation of key metrics with
 * professional styling suitable for academic environments.
 * 
 * Key Features:
 * - Professional card-based design with hover effects
 * - Color-coded theming for different metric types
 * - Icon integration for visual context
 * - Optional progress indicators for goal tracking
 * - Responsive design optimized for various screen sizes
 * - Subtitle support for additional context or trends
 * 
 * Design System Integration:
 * - Consistent with Smart Student Hub design language
 * - Uses institutional color palette and typography
 * - Professional shadows and spacing for depth
 * - Accessible contrast ratios for institutional compliance
 * 
 * Usage Context:
 * - Student dashboard metrics (activities, credits, achievements)
 * - Faculty analytics (approval counts, department statistics)
 * - Administrative dashboards (institutional performance indicators)
 * - Compliance reporting interfaces (NAAC/NIRF metrics)
 * 
 * Visual Features:
 * - Gradient hover effects for interactive feedback
 * - Color-coded icons for immediate visual identification
 * - Progress bars for percentage-based metrics
 * - Professional typography hierarchy
 * - Consistent spacing and alignment
 */

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Stat Card Component Props
 * 
 * Configuration interface for the statistical card component,
 * enabling flexible display of institutional metrics and indicators.
 */
interface StatCardProps {
  title: string;                // Metric title/label (e.g., "Total Students")
  value: string | React.ReactNode; // Primary metric value (e.g., "1,247") or JSX element
  icon: React.ReactNode;        // Icon component for visual context
  color: 'primary' | 'success' | 'warning' | 'info'; // Theme color variant
  subtitle?: string;            // Optional subtitle for trends or context
  progress?: number;            // Optional progress percentage (0-100)
  className?: string;           // Additional CSS classes for customization
}

/**
 * Stat Card Component
 * 
 * Professional statistical display component for institutional metrics
 * and key performance indicators in academic dashboard interfaces.
 */

export default function StatCard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  progress, 
  className 
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <Card className={cn("stat-card", className)} data-testid="stat-card">
      <CardContent className="p-4 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate" data-testid="stat-title">
              {title}
            </p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground" data-testid="stat-value">
              {value}
            </p>
          </div>
          <div className={cn(
            "w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-lg flex items-center justify-center flex-shrink-0 ml-3",
            colorClasses[color]
          )}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
              {icon}
            </div>
          </div>
        </div>
        
        {(progress !== undefined || subtitle) && (
          <div className="mt-3">
            {progress !== undefined && (
              <div className="progress-bar" data-testid="stat-progress">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1" data-testid="stat-subtitle">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

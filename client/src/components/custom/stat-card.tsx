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
  value: string;                // Primary metric value (e.g., "1,247")
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
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground" data-testid="stat-title">
              {title}
            </p>
            <p className="text-2xl font-bold text-foreground" data-testid="stat-value">
              {value}
            </p>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            colorClasses[color]
          )}>
            {icon}
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

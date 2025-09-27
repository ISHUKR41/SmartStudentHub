import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'warning' | 'info';
  subtitle?: string;
  progress?: number;
  className?: string;
}

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

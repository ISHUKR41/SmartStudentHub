import { ReactNode, Component, ErrorInfo } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
  height?: number | string;
  width?: number | string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ChartErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Chart rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chart Error</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || "Failed to render chart. Please try again."}
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

export function ChartLoadingSkeleton({ height = 300 }: { height?: number | string }) {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton 
        className="w-full rounded-lg" 
        style={{ height: typeof height === 'number' ? `${height}px` : height }} 
      />
    </div>
  );
}

export function ChartContainer({
  children,
  title,
  description,
  isLoading = false,
  className,
  height = 300,
  width = "100%",
}: ChartContainerProps) {
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <ChartLoadingSkeleton height={height} />
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)} data-testid="chart-container">
      {(title || description) && (
        <div className="border-b border-border p-4 space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-foreground" data-testid="chart-title">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground" data-testid="chart-description">
              {description}
            </p>
          )}
        </div>
      )}
      <div 
        className="p-4"
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width 
        }}
      >
        <ChartErrorBoundary>
          <div className="w-full h-full">{children}</div>
        </ChartErrorBoundary>
      </div>
    </Card>
  );
}

export function ResponsiveChartContainer({
  children,
  title,
  description,
  isLoading = false,
  className,
}: Omit<ChartContainerProps, "height" | "width">) {
  if (isLoading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <ChartLoadingSkeleton height="100%" />
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)} data-testid="responsive-chart-container">
      {(title || description) && (
        <div className="border-b border-border p-4 space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-foreground" data-testid="chart-title">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground" data-testid="chart-description">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="p-4">
        <ChartErrorBoundary>
          <div className="w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1]">
            {children}
          </div>
        </ChartErrorBoundary>
      </div>
    </Card>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import StudentDashboard from "@/pages/student-dashboard";
import ActivityUpload from "@/pages/activity-upload";
import FacultyApprovals from "@/pages/faculty-approvals";
import AdminAnalytics from "@/pages/admin-analytics";
import DigitalPortfolio from "@/pages/digital-portfolio";
import { useAuth } from "@/hooks/useAuth";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

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

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={StudentDashboard} />
          <Route path="/upload" component={ActivityUpload} />
          <Route path="/portfolio" component={DigitalPortfolio} />
          {(user?.role === 'faculty' || user?.role === 'admin') && (
            <Route path="/approvals" component={FacultyApprovals} />
          )}
          {user?.role === 'admin' && (
            <Route path="/analytics" component={AdminAnalytics} />
          )}
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

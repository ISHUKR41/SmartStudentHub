/**
 * Main Application Component
 * 
 * This is the root component that sets up the application structure,
 * routing, and global providers. It handles authentication state and
 * provides role-based route access.
 * 
 * Features:
 * - Role-based routing (student, faculty, admin)
 * - Authentication state management
 * - Global providers (React Query, Toast, Tooltip)
 * - Loading states during authentication checks
 * 
 * Route Protection:
 * - Unauthenticated: Only Landing route available, other paths show NotFound
 * - Student routes: Dashboard, upload, portfolio
 * - Faculty routes: Approvals (faculty + admin)
 * - Admin routes: Analytics (admin only)
 */

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import StudentDashboard from "@/pages/student-dashboard";
import Activities from "@/pages/activities";
import ActivityUpload from "@/pages/activity-upload";
import FacultyApprovals from "@/pages/faculty-approvals";
import AdminAnalytics from "@/pages/admin-analytics";
import DigitalPortfolio from "@/pages/digital-portfolio";
import { useAuth } from "@/hooks/useAuth";
import { SignupDataHandler } from "@/components/SignupDataHandler";

/**
 * Application Router Component
 * 
 * Manages application routing based on authentication state and user roles.
 * Renders different route sets based on whether the user is authenticated
 * and their role within the system.
 * 
 * Route Logic:
 * - Unauthenticated: Only Landing route available, other paths show NotFound
 * - Students: Dashboard, upload, portfolio
 * - Faculty: Student routes + approvals
 * - Admin: All routes including analytics
 */
function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading spinner while authentication state is being determined
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
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
        </>
      ) : (
        <>
          <Route path="/" component={StudentDashboard} />
          <Route path="/activities" component={Activities} />
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

/**
 * Main App Component
 * 
 * Sets up the application with all necessary providers and global components.
 * 
 * Providers:
 * - QueryClientProvider: React Query for server state management
 * - TooltipProvider: Radix UI tooltips throughout the app
 * - Toaster: Global toast notifications
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <SignupDataHandler />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

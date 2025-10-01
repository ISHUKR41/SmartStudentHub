import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as HotToaster } from 'react-hot-toast';
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import FirebaseSignin from "@/pages/firebase-signin";
import FirebaseSignup from "@/pages/firebase-signup";
import EmailVerification from "@/pages/email-verification";
import Dashboard from "@/pages/dashboard";
import Schedule from "@/pages/schedule";
import Attendance from "@/pages/attendance";
import Assignments from "@/pages/assignments";
import Exams from "@/pages/exams";
import Resources from "@/pages/resources";
import Events from "@/pages/events";
import Notices from "@/pages/notices";
import QRScanner from "@/pages/qr-scanner";
import LostFound from "@/pages/lost-found";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
          <Route path="/firebase-signin" component={FirebaseSignin} />
          <Route path="/firebase-signup" component={FirebaseSignup} />
          <Route path="/email-verification" component={EmailVerification} />
        </>
      ) : (
        <>
          <Route path="/" component={Landing} />
          <Route path="/email-verification" component={EmailVerification} />
          <Route path="/dashboard">
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </Route>
          <Route path="/schedule">
            <DashboardLayout>
              <Schedule />
            </DashboardLayout>
          </Route>
          <Route path="/attendance">
            <DashboardLayout>
              <Attendance />
            </DashboardLayout>
          </Route>
          <Route path="/assignments">
            <DashboardLayout>
              <Assignments />
            </DashboardLayout>
          </Route>
          <Route path="/exams">
            <DashboardLayout>
              <Exams />
            </DashboardLayout>
          </Route>
          <Route path="/resources">
            <DashboardLayout>
              <Resources />
            </DashboardLayout>
          </Route>
          <Route path="/events">
            <DashboardLayout>
              <Events />
            </DashboardLayout>
          </Route>
          <Route path="/notices">
            <DashboardLayout>
              <Notices />
            </DashboardLayout>
          </Route>
          <Route path="/qr-scanner">
            <DashboardLayout>
              <QRScanner />
            </DashboardLayout>
          </Route>
          <Route path="/lost-found">
            <DashboardLayout>
              <LostFound />
            </DashboardLayout>
          </Route>
          <Route path="/profile">
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </Route>
          <Route path="/settings">
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </Route>
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
        <HotToaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--card-foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              padding: '12px 16px',
              boxShadow: '0 4px 12px hsl(var(--shadow) / 0.15)',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--success))',
                secondary: 'hsl(var(--success-foreground))'
              }
            },
            error: {
              iconTheme: {
                primary: 'hsl(var(--destructive))',
                secondary: 'hsl(var(--destructive-foreground))'
              }
            }
          }}
        />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

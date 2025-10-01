import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as HotToaster } from 'react-hot-toast';
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/firebase-signin');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <PulseLoader color="hsl(var(--primary))" size={15} margin={4} />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-foreground"
          >
            Loading Smart Student Hub...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <PulseLoader color="hsl(var(--primary))" size={15} margin={4} />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium text-foreground"
          >
            Loading Smart Student Hub...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/firebase-signin" component={FirebaseSignin} />
      <Route path="/firebase-signup" component={FirebaseSignup} />
      <Route path="/email-verification" component={EmailVerification} />
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/schedule">
        <ProtectedRoute>
          <DashboardLayout>
            <Schedule />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/attendance">
        <ProtectedRoute>
          <DashboardLayout>
            <Attendance />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/assignments">
        <ProtectedRoute>
          <DashboardLayout>
            <Assignments />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/exams">
        <ProtectedRoute>
          <DashboardLayout>
            <Exams />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/resources">
        <ProtectedRoute>
          <DashboardLayout>
            <Resources />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/events">
        <ProtectedRoute>
          <DashboardLayout>
            <Events />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/notices">
        <ProtectedRoute>
          <DashboardLayout>
            <Notices />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/qr-scanner">
        <ProtectedRoute>
          <DashboardLayout>
            <QRScanner />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/lost-found">
        <ProtectedRoute>
          <DashboardLayout>
            <LostFound />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute>
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>
      
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

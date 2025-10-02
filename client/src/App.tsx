import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as HotToaster } from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PulseLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useEffect } from "react";

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
import Alumni from "@/pages/alumni";
import ActivityTracker from "@/pages/activity-tracker";
import FacultyApprovals from "@/pages/faculty-approvals";
import DigitalPortfolio from "@/pages/digital-portfolio";
import Analytics from "@/pages/analytics";
import AchievementsGoals from "@/pages/achievements-goals";
// New Academic Management Pages
import CoursesManagement from "@/pages/courses-management";
import Timetable from "@/pages/timetable";
import GradeBook from "@/pages/grade-book";
import StudyMaterials from "@/pages/study-materials";
// New Financial Pages
import FeesPayments from "@/pages/fees-payments";
import Scholarships from "@/pages/scholarships";
// Data Isolation Demo
import DataIsolationDemo from "@/pages/data-isolation-demo";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isLoggedIn, emailVerified } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // Strictly enforce authentication and email verification
      if (!isLoggedIn) {
        // User is not logged in - redirect to sign in
        setLocation("/firebase-signin");
      } else if (isLoggedIn && !emailVerified) {
        // User is logged in but email is NOT verified - strictly redirect to verification page
        setLocation("/email-verification");
      }
      // Only allow access if both isLoggedIn AND emailVerified are true
    }
  }, [isAuthenticated, isLoading, isLoggedIn, emailVerified, setLocation]);

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

  // Strictly enforce: user must be authenticated (logged in AND email verified)
  if (!isAuthenticated || !emailVerified) {
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

      <Route path="/alumni">
        <ProtectedRoute>
          <DashboardLayout>
            <Alumni />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/activity-tracker">
        <ProtectedRoute>
          <DashboardLayout>
            <ActivityTracker />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/faculty-approvals">
        <ProtectedRoute>
          <DashboardLayout>
            <FacultyApprovals />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/digital-portfolio">
        <ProtectedRoute>
          <DashboardLayout>
            <DigitalPortfolio />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/analytics">
        <ProtectedRoute>
          <DashboardLayout>
            <Analytics />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/achievements-goals">
        <ProtectedRoute>
          <DashboardLayout>
            <AchievementsGoals />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      {/* Academic Management Routes */}
      <Route path="/courses-management">
        <ProtectedRoute>
          <DashboardLayout>
            <CoursesManagement />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/timetable">
        <ProtectedRoute>
          <DashboardLayout>
            <Timetable />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/grade-book">
        <ProtectedRoute>
          <DashboardLayout>
            <GradeBook />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/study-materials">
        <ProtectedRoute>
          <DashboardLayout>
            <StudyMaterials />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      {/* Financial Routes */}
      <Route path="/fees-payments">
        <ProtectedRoute>
          <DashboardLayout>
            <FeesPayments />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/scholarships">
        <ProtectedRoute>
          <DashboardLayout>
            <Scholarships />
          </DashboardLayout>
        </ProtectedRoute>
      </Route>

      <Route path="/data-isolation-demo">
        <ProtectedRoute>
          <DashboardLayout>
            <DataIsolationDemo />
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
              background: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              padding: "12px 16px",
              boxShadow: "0 4px 12px hsl(var(--shadow) / 0.15)",
            },
            success: {
              iconTheme: {
                primary: "hsl(var(--success))",
                secondary: "hsl(var(--success-foreground))",
              },
            },
            error: {
              iconTheme: {
                primary: "hsl(var(--destructive))",
                secondary: "hsl(var(--destructive-foreground))",
              },
            },
          }}
        />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

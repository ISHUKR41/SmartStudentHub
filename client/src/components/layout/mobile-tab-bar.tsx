/**
 * Mobile Tab Bar Component for Smart Student Hub
 * 
 * A responsive bottom navigation tab bar designed specifically for mobile devices.
 * Provides quick access to main sections of the application with touch-optimized
 * interface elements and professional styling suitable for academic environments.
 * 
 * Key Features:
 * - Touch-optimized tab buttons with minimum 44x44px touch targets
 * - Professional icon set with academic context
 * - Active state management with visual feedback
 * - Accessibility-compliant design with proper ARIA labels
 * - Smooth animations and transitions
 * - Fixed positioning for persistent navigation
 * 
 * Usage Context:
 * - Mobile devices (<lg screens) only
 * - Hidden on larger screens where main navigation is available
 * - Persistent bottom navigation for quick section switching
 * - Professional academic environment styling
 */

import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Calendar,
  BookOpen,
  Bell,
  Target,
  User
} from "lucide-react";

/**
 * Mobile Tab Navigation Items Configuration
 * 
 * Defines the main navigation tabs available on mobile devices.
 * Each tab includes routing information, display text, and iconography.
 */
const mobileTabItems = [
  {
    href: "/",
    label: "Home",
    icon: LayoutDashboard,
    testId: "mobile-tab-home"
  },
  {
    href: "/activities",
    label: "Activities",
    icon: ClipboardList,
    testId: "mobile-tab-activities"
  },
  {
    href: "/courses", 
    label: "Courses",
    icon: BookOpen,
    testId: "mobile-tab-courses"
  },
  {
    href: "/analytics", 
    label: "Analytics",
    icon: BarChart3,
    testId: "mobile-tab-analytics"
  }
];

/**
 * Mobile Tab Item Component
 * 
 * Renders individual tab navigation items with proper styling and active state management.
 * Provides touch-optimized interface with accessibility features.
 */
interface MobileTabItemProps {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  testId: string;
  isActive: boolean;
}

function MobileTabItem({ href, label, icon: Icon, testId, isActive }: MobileTabItemProps) {
  return (
    <Link href={href} className={cn(
      "flex flex-col items-center justify-center min-h-[60px] min-w-[60px] flex-1 relative transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg",
      "hover:bg-accent/50 active:scale-95 touch-manipulation",
      "min-h-[44px] min-w-[44px]", // Ensure minimum touch target size
      isActive ? "text-primary" : "text-muted-foreground"
    )} 
    data-testid={testId}
    aria-label={`Navigate to ${label}`}>
      <div className={cn(
        "flex items-center justify-center w-6 h-6 mb-1 transition-all duration-200",
        isActive ? "scale-110" : "scale-100"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className={cn(
        "text-xs font-medium transition-all duration-200",
        isActive ? "opacity-100" : "opacity-70"
      )}>
        {label}
      </span>
      {isActive && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
      )}
    </Link>
  );
}

/**
 * Mobile Tab Bar Component
 * 
 * Main mobile navigation component providing bottom tab bar for quick access
 * to essential sections of the Smart Student Hub application.
 * 
 * Features:
 * - Fixed bottom positioning for persistent navigation
 * - Touch-optimized interface elements
 * - Professional styling with institutional branding
 * - Active state management and visual feedback
 * - Accessible design with proper ARIA labels
 * - Hidden on larger screens (lg+) where main navigation is used
 * 
 * @returns {JSX.Element} Mobile tab bar navigation component
 */
export default function MobileTabBar() {
  const [location] = useLocation();

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg"
      role="navigation"
      aria-label="Mobile bottom navigation"
      data-testid="mobile-tab-bar"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-1 max-w-md mx-auto" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
        {mobileTabItems.map((item) => (
          <MobileTabItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            testId={item.testId}
            isActive={location === item.href}
          />
        ))}
      </div>
    </nav>
  );
}
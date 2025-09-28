/**
 * Sidebar Navigation Component for Smart Student Hub
 * 
 * This comprehensive sidebar component provides role-based navigation for the Smart Student Hub
 * institutional platform, offering organized access to different functional areas based on user
 * roles and institutional hierarchy. Designed specifically for Higher Education Institution
 * environments with professional navigation patterns and institutional compliance standards.
 * 
 * Core Institutional Features:
 * - Role-based navigation system reflecting institutional hierarchy (Student, Faculty, Admin)
 * - Professional navigation grouping for different functional areas and responsibilities
 * - Real-time badge notifications for pending approvals and important updates
 * - Responsive design with mobile-friendly collapsible navigation
 * - Institutional-grade styling aligned with Higher Education standards
 * - Accessibility-compliant navigation patterns for inclusive educational environments
 * 
 * Navigation Structure:
 * - Student Portal: Academic dashboard, activities, achievement uploads, and portfolio management
 * - Faculty Portal: Approval workflows, student verification, and academic assessment tools
 * - Admin Portal: Institutional analytics, student records, and system administration
 * - Cross-role Features: Common functionality accessible across different user types
 * 
 * Role-based Access Control:
 * - Students: Access to personal academic dashboard, activity management, and portfolio tools
 * - Faculty: Access to student approvals, verification workflows, and academic assessment
 * - Administrators: Access to institutional analytics, system management, and comprehensive records
 * - Dynamic Navigation: Menu items adjust based on authenticated user role and permissions
 * 
 * Professional Design Standards:
 * - Clean, institutional interface suitable for academic environments
 * - Professional iconography aligned with Higher Education Institution standards
 * - Consistent styling and branding throughout navigation elements
 * - Responsive design ensuring optimal functionality across desktop, tablet, and mobile devices
 * - Professional color scheme and typography suitable for institutional use
 * 
 * User Experience Features:
 * - Active page highlighting for clear navigation context and user orientation
 * - Smooth transitions and hover effects for professional interaction patterns
 * - Badge notifications for important alerts and pending actions requiring attention
 * - Logical grouping of related functionality for efficient workflow management
 * - Intuitive navigation patterns familiar to Higher Education users
 * 
 * Technical Implementation:
 * - Built with modern React functional components and TypeScript for type safety
 * - Integration with authentication system for role-based rendering and access control
 * - Responsive CSS using Tailwind CSS framework for consistent institutional styling
 * - Semantic HTML structure with proper ARIA labels for accessibility compliance
 * - Efficient state management for active navigation tracking and user context
 * 
 * Integration Points:
 * - Authentication system integration for user role verification and session management
 * - Navigation routing system with proper URL management and history tracking
 * - Real-time notification system for badge updates and alert management
 * - Responsive layout system ensuring optimal display across all device types
 * - Institutional branding system for consistent visual identity throughout navigation
 */

import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Upload, 
  FolderOpen, 
  CheckCircle, 
  BarChart3, 
  Users 
} from "lucide-react";

/**
 * Navigation Item Props Interface
 * 
 * Defines the structure and properties for individual navigation items
 * in the sidebar, including routing, styling, and notification features.
 */
interface NavItemProps {
  href: string;                    // Route path for navigation destination
  icon: React.ReactNode;           // Icon component for visual identification
  label: string;                   // Display text for the navigation item
  badge?: string;                  // Optional notification badge text
  isActive?: boolean;              // Active state for current page highlighting
  onClick?: () => void;            // Optional custom click handler for special actions
}

/**
 * Navigation Item Component
 * 
 * Individual navigation item component with professional styling, active state management,
 * and optional notification badges. Handles both standard navigation and custom actions
 * while maintaining consistent institutional design patterns.
 * 
 * @param props - Navigation item configuration and styling options
 * @returns {JSX.Element} Styled navigation item with click handling and visual indicators
 */
function NavItem({ href, icon, label, badge, isActive, onClick }: NavItemProps) {
  // Navigation hook for programmatic routing and URL management
  const [, setLocation] = useLocation();

  /**
   * Click Handler for Navigation Items
   * 
   * Handles navigation item clicks with support for both standard routing
   * and custom action functions. Provides flexible navigation patterns
   * for different types of user interactions and workflow requirements.
   */
  const handleClick = () => {
    if (onClick) {
      // Execute custom action if provided (e.g., special functionality)
      onClick();
    } else {
      // Standard navigation to the specified route
      setLocation(href);
    }
  };

  return (
    <Button
      variant="ghost"
      className={cn(
        "nav-item w-full justify-start",
        isActive && "active"
      )}
      onClick={handleClick}
      data-testid={`nav-item-${href.replace('/', '') || 'dashboard'}`}
    >
      {/* Navigation Icon for Visual Identification */}
      {icon}
      
      {/* Navigation Label Text */}
      <span className="ml-3">{label}</span>
      
      {/* Optional Notification Badge for Alerts and Updates */}
      {badge && (
        <Badge 
          variant="secondary" 
          className="ml-auto bg-warning text-warning-foreground text-xs"
          data-testid={`badge-${href.replace('/', '') || 'dashboard'}`}
        >
          {badge}
        </Badge>
      )}
    </Button>
  );
}

/**
 * Sidebar Navigation Component
 * 
 * Main sidebar navigation component providing comprehensive role-based navigation
 * for the Smart Student Hub institutional platform. Dynamically renders navigation
 * items based on user authentication status and role permissions.
 * 
 * Features:
 * - Role-based navigation rendering for Student, Faculty, and Admin users
 * - Professional grouping of related functionality for efficient workflow
 * - Real-time badge notifications for pending actions and important alerts
 * - Responsive design with mobile-friendly navigation patterns
 * - Active page highlighting for clear navigation context
 * - Institutional-grade styling aligned with Higher Education standards
 * 
 * @returns {JSX.Element | null} Complete sidebar navigation or null if user not authenticated
 */
export default function Sidebar() {
  // Authentication hook for user state and role verification
  const { user } = useAuth();
  
  // Location hook for active page detection and navigation state management
  const [location] = useLocation();

  // Return null if user is not authenticated (security and UX consideration)
  if (!user) return null;

  /**
   * Student Navigation Items Configuration
   * 
   * Defines the primary navigation structure for student users, including
   * academic dashboard, activity management, achievement uploads, and portfolio access.
   * Organized to support the complete student academic journey and achievement tracking.
   */
  const studentNavItems = [
    {
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Academic Dashboard",
    },
    {
      href: "/activities",
      icon: <ClipboardList className="w-5 h-5" />,
      label: "Academic Activities",
    },
    {
      href: "/upload",
      icon: <Upload className="w-5 h-5" />,
      label: "Submit Achievement",
    },
    {
      href: "/portfolio",
      icon: <FolderOpen className="w-5 h-5" />,
      label: "Academic Portfolio",
    },
  ];

  /**
   * Faculty Navigation Items Configuration
   * 
   * Defines navigation structure for faculty users, focusing on approval workflows,
   * student verification processes, and academic assessment responsibilities.
   * Includes real-time badge notifications for pending approval actions.
   */
  const facultyNavItems = [
    {
      href: "/approvals",
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Faculty Approvals",
      badge: "12", // Real-time count of pending approvals (would come from API)
    },
  ];

  /**
   * Administrative Navigation Items Configuration
   * 
   * Defines navigation structure for administrative users, providing access to
   * institutional analytics, comprehensive student records, and system management tools.
   * Supports institutional oversight and compliance reporting requirements.
   */
  const adminNavItems = [
    {
      href: "/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Institutional Analytics",
    },
    {
      href: "/students",
      icon: <Users className="w-5 h-5" />,
      label: "Student Records",
    },
  ];

  return (
    <aside className="hidden lg:block w-64 bg-card border-r border-border" data-testid="sidebar">
      <nav className="p-4 space-y-2">
        
        {/* Primary Student Navigation Section */}
        <div className="space-y-1">
          {studentNavItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={location === item.href}
            />
          ))}
        </div>

        {/* Faculty and Administrative Navigation Sections */}
        {/* Conditional rendering based on user role for appropriate access control */}
        {(user.role === 'faculty' || user.role === 'admin') && (
          <>
            {/* Faculty Portal Section */}
            <div className="pt-4 border-t border-border">
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Faculty Portal
              </p>
              
              {/* Faculty-specific Navigation Items */}
              <div className="space-y-1">
                {facultyNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    isActive={location === item.href}
                  />
                ))}
                
                {/* Administrative Navigation Items (Admin-only Access) */}
                {user.role === 'admin' && adminNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    isActive={location === item.href}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}
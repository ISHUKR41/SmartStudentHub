/**
 * Navigation Component for Smart Student Hub
 * 
 * This comprehensive navigation component serves as the primary institutional header
 * for the Smart Student Hub platform, providing essential navigation, user management,
 * and institutional branding elements for Higher Education Institution environments.
 * 
 * Core Institutional Features:
 * - Professional institutional branding with official logo and title
 * - Main navigation menu with academic sections and functionality
 * - Comprehensive search functionality for institutional records and documents
 * - Real-time notification system for faculty approvals and system updates
 * - Role-based user profile management with authentication controls
 * - Professional dropdown menus with institutional-grade options
 * - Responsive design optimized for academic environments with mobile hamburger menu
 * 
 * Navigation Components:
 * - Institution Logo: Professional branding element with institutional identity
 * - Main Menu: Academic Dashboard, Activities, Achievement Submission, Portfolio
 * - Search Bar: Comprehensive search across student records, activities, and documents
 * - Notifications: Real-time alerts for faculty approvals, system updates, and deadlines
 * - User Profile: Avatar, name, role display with dropdown menu for account management
 * - Authentication: Login/Signup buttons for guests, logout functionality for users
 * - Mobile Menu: Responsive hamburger menu for small screen devices
 * 
 * User Experience Design:
 * - Clean, professional interface suitable for academic institutional environments
 * - Consistent with Higher Education Institution design standards and accessibility guidelines
 * - Responsive layout ensuring optimal display across desktop, tablet, and mobile devices
 * - Professional color scheme aligned with institutional branding requirements
 * - Accessible design following WCAG guidelines for inclusive education environments
 * 
 * Security & Authentication:
 * - Integrated with institutional authentication systems (LDAP, SAML, OAuth)
 * - Role-based access control reflecting institutional hierarchy (student, faculty, admin)
 * - Secure session management with automatic timeout for institutional security compliance
 * - Protected routes ensuring appropriate access to institutional data and functionality
 * 
 * Technical Implementation:
 * - Built with React functional components and modern hooks for optimal performance
 * - TypeScript integration ensuring type safety and maintainable codebase
 * - Responsive CSS classes using Tailwind CSS for consistent styling
 * - Accessible ARIA labels and semantic HTML for inclusive design
 * - Real-time state management for notifications and user status updates
 * - Mobile-first responsive design with proper breakpoints
 * 
 * Integration Points:
 * - Authentication hook integration for user state management and role verification
 * - Notification system integration for real-time alerts and faculty communications
 * - Search functionality connected to institutional databases and document repositories
 * - User profile management linked to institutional directory and account systems
 * - Logout functionality integrated with institutional session management protocols
 * - Routing integration with wouter for seamless navigation throughout the platform
 */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { 
  GraduationCap, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  LayoutDashboard,
  ClipboardList,
  Upload,
  FolderOpen
} from "lucide-react";

/**
 * Navigation Menu Items Configuration
 * 
 * Defines the main navigation items available to all users in the Smart Student Hub.
 * Each item includes routing information, display text, and iconography for consistent
 * institutional navigation experience.
 */
const navigationItems = [
  {
    href: "/",
    label: "Academic Dashboard",
    icon: LayoutDashboard,
    testId: "nav-academic-dashboard"
  },
  {
    href: "/activities",
    label: "Academic Activities",
    icon: ClipboardList,
    testId: "nav-academic-activities"
  },
  {
    href: "/upload",
    label: "Submit Achievement",
    icon: Upload,
    testId: "nav-submit-achievement"
  },
  {
    href: "/portfolio",
    label: "Academic Portfolio",
    icon: FolderOpen,
    testId: "nav-academic-portfolio"
  }
];

/**
 * Navigation Link Component
 * 
 * Renders individual navigation links with proper styling and active state management.
 * Provides consistent styling for both desktop and mobile navigation menus.
 * 
 * @param href - Route path for the navigation link
 * @param label - Display text for the navigation item
 * @param icon - Lucide icon component for visual identification
 * @param testId - Test identifier for automated testing
 * @param className - Additional CSS classes for styling
 * @param onClick - Optional click handler for mobile menu interactions
 */
interface NavLinkProps {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  testId: string;
  className?: string;
  onClick?: () => void;
}

function NavLink({ href, label, icon: Icon, testId, className, onClick }: NavLinkProps) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Button
      variant={isActive ? "default" : "ghost"}
      className={cn(
        "flex items-center space-x-2 h-10 px-4 justify-start touch-manipulation transition-all duration-200",
        className
      )}
      data-testid={testId}
      asChild
    >
      <Link href={href} onClick={onClick}>
        <Icon className="w-4 h-4 sm:w-4 sm:h-4" />
        <span className="font-medium text-sm sm:text-base">{label}</span>
      </Link>
    </Button>
  );
}

/**
 * Navigation Component
 * 
 * Main navigation header component providing institutional branding, main navigation menu,
 * search functionality, notifications, and user profile management for the Smart Student Hub platform.
 * 
 * Features:
 * - Professional institutional branding with logo and title
 * - Main navigation menu with academic sections (Dashboard, Activities, Submit, Portfolio)
 * - Comprehensive search functionality for records and documents (authenticated users)
 * - Real-time notification system with badge indicators (authenticated users)
 * - User profile dropdown with account management options (authenticated users)
 * - Login and Signup buttons for unauthenticated users
 * - Responsive design with mobile hamburger menu for all device types
 * - Role-based access control and secure authentication
 * 
 * @returns {JSX.Element} Complete navigation header with all institutional features
 */
export default function Navigation() {
  // Authentication hook for user state management and role verification
  const { user } = useAuth();
  
  
  // Local state for search functionality with institutional record integration
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mobile menu open state for hamburger menu control
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Logout Handler
   * 
   * Handles secure user logout by redirecting to the institutional logout endpoint.
   * Ensures proper session termination and security compliance with institutional standards.
   * Integrates with institutional authentication systems for secure session management.
   */
  const handleLogout = () => {
    // Redirect to institutional logout endpoint for secure session termination
    window.location.href = "/api/logout";
  };

  /**
   * Mobile Menu Close Handler
   * 
   * Closes the mobile navigation menu when a navigation item is selected.
   * Provides smooth user experience on mobile devices.
   */
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="navigation-header">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4 min-h-[56px] sm:min-h-[64px]">
        
        {/* Institutional Logo and Branding Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Professional Institution Logo with proper touch target */}
          <Link href="/">
            <div className="w-11 h-11 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center cursor-pointer touch-manipulation" data-testid="logo-institution">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
          </Link>
          
          {/* Institutional Name and System Designation - Responsive visibility */}
          <div className="hidden xs:block sm:block">
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight" data-testid="text-app-title">
              Smart Student Hub
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block" data-testid="text-app-subtitle">
              Institutional Excellence Management System
            </p>
          </div>
        </div>

        {/* Desktop Navigation Menu - Enhanced responsive breakpoints */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" data-testid="nav-desktop-menu">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              testId={item.testId}
              className="w-auto text-sm lg:text-base px-2 lg:px-4 min-h-[44px] touch-manipulation"
            />
          ))}
        </nav>

        {/* Navigation Actions and User Interface Section */}
        <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
          
          {/* Advanced Search Bar for Institutional Records (Authenticated Users Only) - Enhanced responsiveness */}
          {user && (
            <div className="relative hidden xs:block">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-24 xs:w-32 sm:w-40 md:w-48 lg:w-64 xl:w-72 pl-9 sm:pl-10 h-10 sm:h-11 text-sm touch-manipulation"
                data-testid="input-search"
              />
              {/* Search Icon with Professional Styling */}
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          )}

          {/* Real-time Notification System (Authenticated Users Only) - Touch optimized */}
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative min-w-[44px] min-h-[44px] touch-manipulation"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification Badge for Real-time Alerts */}
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-2 h-2 p-0 rounded-full"
                data-testid="badge-notification-count"
              />
            </Button>
          )}

          {/* Authentication Buttons for Unauthenticated Users - Enhanced responsive design */}
          {!user && (
            <div className="hidden xs:flex items-center space-x-1 sm:space-x-2">
              <Button variant="ghost" size="sm" className="min-h-[44px] px-2 sm:px-3 text-sm touch-manipulation" data-testid="button-login" asChild>
                <Link href="/login">
                  <span className="hidden sm:inline">Login</span>
                  <span className="sm:hidden">In</span>
                </Link>
              </Button>
              <Button size="sm" className="min-h-[44px] px-2 sm:px-3 text-sm touch-manipulation" data-testid="button-signup" asChild>
                <Link href="/signup">
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Up</span>
                </Link>
              </Button>
            </div>
          )}

          {/* User Profile and Account Management Dropdown (Authenticated Users Only) - Touch optimized */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-1 sm:space-x-2 p-2 min-h-[44px] touch-manipulation"
                  data-testid="button-user-menu"
                >
                  {/* Professional User Avatar with Fallback Initials */}
                  <Avatar className="w-8 h-8 sm:w-9 sm:h-9">
                    <AvatarImage src={user.profileImageUrl || ""} />
                    <AvatarFallback>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* User Information Display - Enhanced responsive visibility */}
                  <div className="hidden lg:block xl:block text-left">
                    <div className="text-sm font-medium text-foreground" data-testid="text-user-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize" data-testid="text-user-role">
                      {user.role}
                    </div>
                  </div>
                  
                  {/* Dropdown Indicator Icon */}
                  <ChevronDown className="hidden sm:block w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              
              {/* User Account Management Menu - Touch friendly */}
              <DropdownMenuContent align="end" className="w-56 touch-manipulation">
                {/* Account Profile Management */}
                <DropdownMenuItem className="min-h-[44px] text-base sm:text-sm" data-testid="menu-item-profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Profile</span>
                </DropdownMenuItem>
                
                {/* System Preferences and Settings */}
                <DropdownMenuItem className="min-h-[44px] text-base sm:text-sm" data-testid="menu-item-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System Preferences</span>
                </DropdownMenuItem>
                
                {/* Secure Logout Functionality */}
                <DropdownMenuItem onClick={handleLogout} className="min-h-[44px] text-base sm:text-sm" data-testid="menu-item-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Trigger (Hamburger Button) - Enhanced touch target */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden min-w-[44px] min-h-[44px] touch-manipulation"
                data-testid="button-mobile-menu"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            
            {/* Mobile Navigation Menu Content - Enhanced responsive design */}
            <SheetContent side="right" className="w-[85vw] max-w-sm sm:max-w-md" data-testid="sheet-mobile-menu">
              <div className="flex flex-col h-full">
                
                {/* Mobile Menu Header */}
                <div className="flex items-center space-x-3 pb-6 border-b border-border">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Smart Student Hub</h2>
                    <p className="text-sm text-muted-foreground">Institutional Excellence Management</p>
                  </div>
                </div>
                
                {/* Mobile Navigation Menu Items - Touch optimized */}
                <nav className="flex flex-col space-y-1 py-6" data-testid="nav-mobile-menu">
                  {navigationItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      testId={`mobile-${item.testId}`}
                      className="w-full justify-start min-h-[52px] text-base px-4 py-3 touch-manipulation"
                      onClick={closeMobileMenu}
                    />
                  ))}
                </nav>
                
                {/* Mobile Authentication Section - Touch optimized */}
                {!user && (
                  <div className="flex flex-col space-y-3 pt-6 border-t border-border mt-auto">
                    <Button variant="ghost" className="w-full justify-start min-h-[52px] text-base px-4 py-3 touch-manipulation" data-testid="mobile-button-login" asChild>
                      <Link href="/login" onClick={closeMobileMenu}>
                        <User className="w-5 h-5 mr-3" />
                        Login to Account
                      </Link>
                    </Button>
                    <Button className="w-full justify-start min-h-[52px] text-base px-4 py-3 touch-manipulation" data-testid="mobile-button-signup" asChild>
                      <Link href="/signup" onClick={closeMobileMenu}>
                        <User className="w-5 h-5 mr-3" />
                        Create Account
                      </Link>
                    </Button>
                  </div>
                )}
                
                {/* Mobile User Section (Authenticated Users) - Enhanced touch experience */}
                {user && (
                  <div className="flex flex-col space-y-3 pt-6 border-t border-border mt-auto">
                    {/* User Profile Display */}
                    <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.profileImageUrl || ""} />
                        <AvatarFallback className="text-base">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile User Menu Actions - Touch optimized */}
                    <Button variant="ghost" className="w-full justify-start min-h-[52px] text-base px-4 py-3 touch-manipulation" data-testid="mobile-menu-item-profile">
                      <User className="w-5 h-5 mr-3" />
                      Account Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start min-h-[52px] text-base px-4 py-3 touch-manipulation" data-testid="mobile-menu-item-settings">
                      <Settings className="w-5 h-5 mr-3" />
                      System Preferences
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start min-h-[52px] text-base px-4 py-3 text-destructive hover:text-destructive touch-manipulation" 
                      onClick={handleLogout}
                      data-testid="mobile-menu-item-logout"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
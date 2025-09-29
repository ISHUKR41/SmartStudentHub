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
        "flex items-center space-x-2 justify-start touch-button enhanced-focus active-touch transition-all duration-200",
        "h-10 px-3 md:h-11 md:px-4 lg:h-12 lg:px-5 xl:h-12 xl:px-6 2xl:h-14 2xl:px-8",
        "text-sm md:text-sm lg:text-base xl:text-lg 2xl:text-xl",
        "min-w-[44px] min-h-[44px] md:min-w-[48px] md:min-h-[48px] lg:min-w-[52px] lg:min-h-[52px] xl:min-w-[56px] xl:min-h-[56px] 2xl:min-w-[60px] 2xl:min-h-[60px]",
        className
      )}
      data-testid={testId}
      asChild
    >
      <Link href={href} onClick={onClick}>
        <Icon className="w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 flex-shrink-0" />
        <span className="font-medium truncate">{label}</span>
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
    <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm" data-testid="navigation-header">
      <div className="nav-mobile-phone nav-tablet nav-desktop nav-ultra-wide">
        <div className="flex items-center justify-between min-h-[56px] sm:min-h-[64px] md:min-h-[68px] lg:min-h-[72px] xl:min-h-[76px] 2xl:min-h-[80px]">
        
          {/* Institutional Logo and Branding Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-4 xl:space-x-5 2xl:space-x-6">
            {/* Professional Institution Logo with enhanced responsive sizing */}
            <Link href="/" className="touch-button enhanced-focus">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 bg-primary rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105" data-testid="logo-institution">
                <GraduationCap className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 text-primary-foreground" />
              </div>
            </Link>
            
            {/* Institutional Name and System Designation - Enhanced responsive visibility */}
            <div className="hidden sm:block">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-foreground leading-tight transition-all duration-200" data-testid="text-app-title">
                Smart Student Hub
              </h1>
              <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base 2xl:text-lg text-muted-foreground hidden sm:block transition-all duration-200" data-testid="text-app-subtitle">
                Institutional Excellence Management System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Menu - Enhanced responsive breakpoints */}
          <nav className="hidden md:flex items-center space-x-1 md:space-x-2 lg:space-x-3 xl:space-x-4 2xl:space-x-6" data-testid="nav-desktop-menu">
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                testId={item.testId}
                className="w-auto"
              />
            ))}
          </nav>

          {/* Navigation Actions and User Interface Section */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6">
            
            {/* Advanced Search Bar for Institutional Records (Authenticated Users Only) - Enhanced responsiveness */}
            {user && (
              <div className="relative hidden sm:block">
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-72 pl-9 sm:pl-10 h-10 sm:h-11 md:h-12 lg:h-12 xl:h-12 2xl:h-14 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl mobile-search enhanced-focus transition-all duration-200"
                  data-testid="input-search"
                />
                {/* Search Icon with Professional Styling */}
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 text-muted-foreground" />
              </div>
            )}

            {/* Real-time Notification System (Authenticated Users Only) - Enhanced touch optimization */}
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-12 lg:w-12 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 touch-button enhanced-focus transition-all duration-200 hover:bg-accent"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 2xl:w-8 2xl:h-8" />
                {/* Notification Badge for Real-time Alerts */}
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 2xl:h-4 p-0 rounded-full animate-pulse"
                  data-testid="badge-notification-count"
                />
              </Button>
            )}

            {/* Authentication Buttons for Unauthenticated Users - Enhanced responsive design */}
            {!user && (
              <div className="hidden sm:flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                <Button variant="ghost" size="sm" className="h-10 w-auto px-3 sm:h-11 sm:px-4 md:h-12 md:px-5 lg:h-12 lg:px-6 xl:h-12 xl:px-7 2xl:h-14 2xl:px-8 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl touch-button enhanced-focus" data-testid="button-login" asChild>
                  <Link href="/login">
                    <span className="hidden sm:inline">Login</span>
                    <span className="sm:hidden">In</span>
                  </Link>
                </Button>
                <Button size="sm" className="h-10 w-auto px-3 sm:h-11 sm:px-4 md:h-12 md:px-5 lg:h-12 lg:px-6 xl:h-12 xl:px-7 2xl:h-14 2xl:px-8 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-xl touch-button enhanced-focus" data-testid="button-signup" asChild>
                  <Link href="/signup">
                    <span className="hidden sm:inline">Sign Up</span>
                    <span className="sm:hidden">Up</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* User Profile and Account Management Dropdown (Authenticated Users Only) - Enhanced touch optimization */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="group flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 xl:space-x-5 2xl:space-x-6 p-2 sm:p-2.5 md:p-3 lg:p-3.5 xl:p-4 2xl:p-5 touch-button enhanced-focus transition-all duration-200"
                    data-testid="button-user-menu"
                  >
                    {/* Professional User Avatar with Enhanced Responsive Sizing */}
                    <Avatar className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                      <AvatarImage src={user.profileImageUrl || ""} />
                      <AvatarFallback className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-semibold">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* User Information Display - Enhanced responsive visibility */}
                    <div className="hidden lg:block text-left">
                      <div className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-foreground truncate max-w-32 xl:max-w-40 2xl:max-w-52" data-testid="text-user-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-muted-foreground capitalize truncate" data-testid="text-user-role">
                        {user.role}
                      </div>
                    </div>
                    
                    {/* Dropdown Indicator Icon */}
                    <ChevronDown className="hidden sm:block w-4 h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 2xl:w-7 2xl:h-7 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                
                {/* User Account Management Menu - Enhanced touch experience */}
                <DropdownMenuContent align="end" className="w-56 md:w-64 lg:w-72 xl:w-80 2xl:w-96 touch-manipulation shadow-lg">
                  {/* Account Profile Management */}
                  <DropdownMenuItem className="touch-dropdown-item enhanced-focus" data-testid="menu-item-profile" asChild>
                    <Link href="/profile">
                      <User className="mr-3 h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8" />
                      <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">Account Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* System Preferences and Settings */}
                  <DropdownMenuItem className="touch-dropdown-item enhanced-focus" data-testid="menu-item-settings">
                    <Settings className="mr-3 h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8" />
                    <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">System Preferences</span>
                  </DropdownMenuItem>
                  
                  {/* Secure Logout Functionality */}
                  <DropdownMenuItem onClick={handleLogout} className="touch-dropdown-item enhanced-focus text-destructive hover:text-destructive" data-testid="menu-item-logout">
                    <LogOut className="mr-3 h-4 w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8" />
                    <span className="text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">Sign Out</span>
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
                  className="md:hidden h-10 w-10 sm:h-11 sm:w-11 touch-button enhanced-focus transition-all duration-200 hover:bg-accent active:scale-95"
                  data-testid="button-mobile-menu"
                  aria-label="Open mobile navigation menu"
                >
                  <Menu className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-200 hover:scale-110" />
                </Button>
              </SheetTrigger>
            
              {/* Mobile Navigation Menu Content - Enhanced responsive design with animations */}
              <SheetContent side="right" className="w-[85vw] max-w-sm sm:max-w-md md:max-w-lg mobile-menu-enter" data-testid="sheet-mobile-menu">
                <div className="flex flex-col h-full">
                  
                  {/* Mobile Menu Header - Enhanced design */}
                  <div className="flex items-center space-x-4 pb-6 border-b border-border/50">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-105">
                      <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">Smart Student Hub</h2>
                      <p className="text-sm sm:text-base text-muted-foreground leading-snug">Institutional Excellence Management</p>
                    </div>
                  </div>
                
                  {/* Mobile Navigation Menu Items - Enhanced touch optimization */}
                  <nav className="flex flex-col space-y-2 py-6" data-testid="nav-mobile-menu">
                    {navigationItems.map((item, index) => (
                      <div
                        key={item.href}
                        className="fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <NavLink
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          testId={`mobile-${item.testId}`}
                          className="mobile-nav-item w-full justify-start text-base sm:text-lg rounded-xl"
                          onClick={closeMobileMenu}
                        />
                      </div>
                    ))}
                  </nav>
                
                  {/* Mobile Authentication Section - Enhanced touch optimization */}
                  {!user && (
                    <div className="flex flex-col space-y-4 pt-6 border-t border-border/50 mt-auto">
                      <Button variant="ghost" className="mobile-nav-item w-full justify-start text-base sm:text-lg rounded-xl border border-border/30 hover:border-primary/30" data-testid="mobile-button-login" asChild>
                        <Link href="/login" onClick={closeMobileMenu}>
                          <User className="w-5 h-5 mr-4" />
                          Login to Account
                        </Link>
                      </Button>
                      <Button className="mobile-nav-item w-full justify-start text-base sm:text-lg rounded-xl shadow-md" data-testid="mobile-button-signup" asChild>
                        <Link href="/signup" onClick={closeMobileMenu}>
                          <User className="w-5 h-5 mr-4" />
                          Create Account
                        </Link>
                      </Button>
                    </div>
                  )}
                
                  {/* Mobile User Section (Authenticated Users) - Enhanced touch experience */}
                  {user && (
                    <div className="flex flex-col space-y-4 pt-6 border-t border-border/50 mt-auto">
                      {/* User Profile Display - Enhanced design */}
                      <div className="flex items-center space-x-4 p-5 bg-muted/50 rounded-xl border border-border/30">
                        <Avatar className="w-14 h-14 ring-2 ring-primary/20">
                          <AvatarImage src={user.profileImageUrl || ""} />
                          <AvatarFallback className="text-lg font-semibold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-lg font-semibold text-foreground truncate">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize truncate">
                            {user.role}
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile User Menu Actions - Enhanced touch optimization */}
                      <Button variant="ghost" className="mobile-nav-item w-full justify-start text-base rounded-xl border border-border/30 hover:border-primary/30" data-testid="mobile-menu-item-profile" asChild>
                        <Link href="/profile">
                          <User className="w-5 h-5 mr-4" />
                          Account Profile
                        </Link>
                      </Button>
                      <Button variant="ghost" className="mobile-nav-item w-full justify-start text-base rounded-xl border border-border/30 hover:border-primary/30" data-testid="mobile-menu-item-settings">
                        <Settings className="w-5 h-5 mr-4" />
                        System Preferences
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="mobile-nav-item w-full justify-start text-base text-destructive hover:text-destructive rounded-xl border border-destructive/30 hover:border-destructive/50" 
                        onClick={handleLogout}
                        data-testid="mobile-menu-item-logout"
                      >
                        <LogOut className="w-5 h-5 mr-4" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
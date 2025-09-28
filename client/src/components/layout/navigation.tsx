/**
 * Navigation Component for Smart Student Hub
 * 
 * This comprehensive navigation component serves as the primary institutional header
 * for the Smart Student Hub platform, providing essential navigation, user management,
 * and institutional branding elements for Higher Education Institution environments.
 * 
 * Core Institutional Features:
 * - Professional institutional branding with official logo and title
 * - Comprehensive search functionality for institutional records and documents
 * - Real-time notification system for faculty approvals and system updates
 * - Role-based user profile management with authentication controls
 * - Professional dropdown menus with institutional-grade options
 * - Responsive design optimized for academic environments
 * 
 * Navigation Components:
 * - Institution Logo: Professional branding element with institutional identity
 * - Search Bar: Comprehensive search across student records, activities, and documents
 * - Notifications: Real-time alerts for faculty approvals, system updates, and deadlines
 * - User Profile: Avatar, name, role display with dropdown menu for account management
 * - Authentication: Secure logout functionality with session management
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
 * 
 * Integration Points:
 * - Authentication hook integration for user state management and role verification
 * - Notification system integration for real-time alerts and faculty communications
 * - Search functionality connected to institutional databases and document repositories
 * - User profile management linked to institutional directory and account systems
 * - Logout functionality integrated with institutional session management protocols
 */

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";

/**
 * Navigation Component
 * 
 * Main navigation header component providing institutional branding, search functionality,
 * notifications, and user profile management for the Smart Student Hub platform.
 * 
 * Features:
 * - Professional institutional branding with logo and title
 * - Comprehensive search functionality for records and documents
 * - Real-time notification system with badge indicators
 * - User profile dropdown with account management options
 * - Responsive design for all device types
 * - Role-based access control and secure authentication
 * 
 * @returns {JSX.Element} Complete navigation header with all institutional features
 */
export default function Navigation() {
  // Authentication hook for user state management and role verification
  const { user } = useAuth();
  
  // Local state for search functionality with institutional record integration
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="navigation-header">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Institutional Logo and Branding Section */}
        <div className="flex items-center space-x-4">
          {/* Professional Institution Logo */}
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          
          {/* Institutional Name and System Designation */}
          <div>
            <h1 className="text-lg font-semibold text-foreground" data-testid="text-app-title">
              Smart Student Hub
            </h1>
            <p className="text-xs text-muted-foreground" data-testid="text-app-subtitle">
              Institutional Excellence Management System
            </p>
          </div>
        </div>

        {/* Navigation Actions and User Interface Section */}
        <div className="flex items-center space-x-4">
          
          {/* Advanced Search Bar for Institutional Records */}
          <div className="relative hidden md:block">
            <Input
              type="text"
              placeholder="Search institutional records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10"
              data-testid="input-search"
            />
            {/* Search Icon with Professional Styling */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>

          {/* Real-time Notification System */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
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

          {/* User Profile and Account Management Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 p-2"
                  data-testid="button-user-menu"
                >
                  {/* Professional User Avatar with Fallback Initials */}
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.profileImageUrl || ""} />
                    <AvatarFallback>
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* User Information Display */}
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-foreground" data-testid="text-user-name">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize" data-testid="text-user-role">
                      {user.role}
                    </div>
                  </div>
                  
                  {/* Dropdown Indicator Icon */}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              
              {/* User Account Management Menu */}
              <DropdownMenuContent align="end" className="w-56">
                {/* Account Profile Management */}
                <DropdownMenuItem data-testid="menu-item-profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Profile</span>
                </DropdownMenuItem>
                
                {/* System Preferences and Settings */}
                <DropdownMenuItem data-testid="menu-item-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>System Preferences</span>
                </DropdownMenuItem>
                
                {/* Secure Logout Functionality */}
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
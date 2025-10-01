import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { signOutUser } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckCircle, 
  FileText, 
  BookOpen, 
  FolderOpen,
  Bell,
  Megaphone,
  QrCode,
  Package,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const menuSections = [
  {
    title: 'Main',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/schedule', icon: Calendar, label: 'Schedule' },
      { href: '/attendance', icon: CheckCircle, label: 'Attendance' },
    ]
  },
  {
    title: 'Academic',
    items: [
      { href: '/assignments', icon: FileText, label: 'Assignments' },
      { href: '/exams', icon: BookOpen, label: 'Exams' },
      { href: '/resources', icon: FolderOpen, label: 'Resources' },
    ]
  },
  {
    title: 'Campus',
    items: [
      { href: '/events', icon: Calendar, label: 'Events' },
      { href: '/notices', icon: Megaphone, label: 'Notices' },
      { href: '/qr-scanner', icon: QrCode, label: 'QR Scanner' },
      { href: '/lost-found', icon: Package, label: 'Lost & Found' },
    ]
  },
  {
    title: 'Account',
    items: [
      { href: '/profile', icon: User, label: 'Profile' },
      { href: '/settings', icon: Settings, label: 'Settings' },
    ]
  }
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      setLocation('/firebase-signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg ring-2 ring-primary/20">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base sm:text-lg truncate bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Student Hub</h2>
              <p className="text-xs text-muted-foreground truncate">Smart Learning Platform</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 sm:p-4">
        {isCollapsed ? (
          <div className="space-y-2">
            {menuSections.flatMap(section => section.items).map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-200",
                      "hover:bg-primary/10 hover:text-primary hover:scale-105",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-md",
                      !isActive && "text-muted-foreground"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  </button>
                </Link>
              );
            })}
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={menuSections.map(s => s.title)} className="space-y-2">
            {menuSections.map((section) => (
              <AccordionItem key={section.title} value={section.title} className="border-none">
                <AccordionTrigger className="py-2 px-3 hover:no-underline hover:bg-muted/50 rounded-lg transition-all duration-200 text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{section.title}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-1 pt-1">
                    {section.items.map((item) => {
                      const isActive = location === item.href;
                      const Icon = item.icon;
                      
                      return (
                        <Link key={item.href} href={item.href}>
                          <button
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-lg transition-all duration-200",
                              "hover:bg-primary/10 hover:text-primary hover:translate-x-1",
                              isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-md",
                              !isActive && "text-muted-foreground"
                            )}
                            data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                            <span className="font-medium text-sm truncate">{item.label}</span>
                          </button>
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </nav>

      <div className="p-3 sm:p-4 border-t bg-gradient-to-r from-muted/30 to-muted/50">
        <div className={cn(
          "flex items-center gap-2 sm:gap-3",
          isCollapsed && "justify-center"
        )}>
          {!isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 sm:gap-3 w-full p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:shadow-md" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-xs sm:text-sm truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setLocation('/profile'); setIsMobileOpen(false); }} data-testid="menu-profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLocation('/settings'); setIsMobileOpen(false); }} data-testid="menu-settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="menu-logout" className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg hover:bg-muted transition-all duration-200 hover:shadow-md" data-testid="button-user-menu-collapsed">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setLocation('/profile'); setIsMobileOpen(false); }} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLocation('/settings'); setIsMobileOpen(false); }} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card/50 backdrop-blur-sm transition-all duration-300 shadow-lg",
          isCollapsed ? "w-16 xl:w-20" : "w-64 xl:w-72"
        )}
        data-testid="sidebar-desktop"
      >
        <SidebarContent />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 z-50 h-7 w-7 rounded-full border-2 border-primary/20 bg-card p-0 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
          data-testid="button-toggle-sidebar"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-primary" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-primary" />
          )}
        </Button>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b shadow-md">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg ring-2 ring-primary/20">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Student Hub</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">Smart Learning</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            data-testid="button-mobile-menu"
            className="hover:bg-primary/10 transition-all duration-200"
          >
            {isMobileOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-card border-r flex flex-col"
              data-testid="sidebar-mobile"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto",
        "lg:mt-0 mt-[73px]" // Add top margin on mobile for fixed header
      )}>
        {children}
      </main>
    </div>
  );
}

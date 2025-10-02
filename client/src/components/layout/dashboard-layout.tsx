import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { signOutUser } from '@/firebase/auth';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
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
  ChevronDown,
  Users,
  Activity,
  Target,
  BarChart3,
  Award,
  UserCheck
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
      { href: '/analytics', icon: BarChart3, label: 'Analytics' },
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
    title: 'Progress',
    items: [
      { href: '/activity-tracker', icon: Activity, label: 'Activity Tracker' },
      { href: '/achievements-goals', icon: Target, label: 'Achievements & Goals' },
      { href: '/digital-portfolio', icon: Award, label: 'Digital Portfolio' },
    ]
  },
  {
    title: 'Faculty',
    items: [
      { href: '/faculty-approvals', icon: UserCheck, label: 'Approvals' },
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
    title: 'Network',
    items: [
      { href: '/alumni', icon: Users, label: 'Alumni' },
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
  
  // Initialize collapsed state from localStorage with smart defaults
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) return JSON.parse(saved);
    
    // Default based on screen size
    return window.innerWidth < 1440 && window.innerWidth >= 1024;
  });
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Persist sidebar collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Smart responsive behavior for different screen sizes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Large Desktop/TV: 1920px+ - respect user preference or default expanded
      if (width >= 1920) {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved === null) setIsCollapsed(false);
      }
      // Desktop: 1440-1920px - respect user preference or default expanded
      else if (width >= 1440) {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved === null) setIsCollapsed(false);
      }
      // Small Desktop: 1024-1440px - auto-collapse for better space usage
      else if (width >= 1024 && width < 1440) {
        const saved = localStorage.getItem('sidebar-collapsed');
        // Auto-collapse if no saved preference, otherwise respect user choice
        if (saved === null) setIsCollapsed(true);
      }
      // Tablet/Mobile: < 1024px - uses mobile sidebar, collapse state irrelevant
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      setIsMobileOpen(false);
      
      await signOutUser();
      
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to log out. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-5 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg ring-2 ring-primary/20 flex-shrink-0">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <h2 className="font-bold text-base md:text-lg truncate bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Student Hub</h2>
                <p className="text-xs text-muted-foreground truncate">Smart Learning Platform</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 md:p-4">
        {isCollapsed ? (
          <div className="space-y-2">
            {menuSections.flatMap(section => section.items).map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.button
                    onClick={() => setIsMobileOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "w-full flex items-center justify-center min-h-[44px] p-3 rounded-lg transition-all duration-200",
                      "hover:bg-primary/10 hover:text-primary",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-md",
                      !isActive && "text-muted-foreground"
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                  </motion.button>
                </Link>
              );
            })}
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={menuSections.map(s => s.title)} className="space-y-2">
            {menuSections.map((section) => (
              <AccordionItem key={section.title} value={section.title} className="border-none">
                <AccordionTrigger className="py-2.5 px-3 hover:no-underline hover:bg-muted/50 rounded-lg transition-all duration-200 text-sm font-semibold">
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
                          <motion.button
                            onClick={() => setIsMobileOpen(false)}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-3 min-h-[44px] rounded-lg transition-all duration-200",
                              "hover:bg-primary/10 hover:text-primary",
                              isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-md",
                              !isActive && "text-muted-foreground"
                            )}
                            data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium text-sm truncate">{item.label}</span>
                          </motion.button>
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

      <div className="p-4 md:p-5 border-t bg-gradient-to-r from-muted/30 to-muted/50">
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center"
        )}>
          {!isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 w-full p-2.5 min-h-[48px] rounded-lg hover:bg-muted transition-all duration-200 hover:shadow-md" 
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20 flex-shrink-0">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold text-sm">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setLocation('/profile'); setIsMobileOpen(false); }} data-testid="menu-profile" className="cursor-pointer min-h-[40px]">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLocation('/settings'); setIsMobileOpen(false); }} data-testid="menu-settings" className="cursor-pointer min-h-[40px]">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  data-testid="menu-logout" 
                  className="cursor-pointer text-destructive focus:text-destructive min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className={cn("mr-2 h-4 w-4", isLoggingOut && "animate-spin")} />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 min-h-[44px] min-w-[44px] rounded-lg hover:bg-muted transition-all duration-200 hover:shadow-md flex items-center justify-center" 
                  data-testid="button-user-menu-collapsed"
                >
                  <Avatar className="h-9 w-9 ring-2 ring-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-sm bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-semibold">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { setLocation('/profile'); setIsMobileOpen(false); }} className="cursor-pointer min-h-[40px]">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setLocation('/settings'); setIsMobileOpen(false); }} className="cursor-pointer min-h-[40px]">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="cursor-pointer text-destructive focus:text-destructive min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <LogOut className={cn("mr-2 h-4 w-4", isLoggingOut && "animate-spin")} />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
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
      <motion.aside
        animate={{
          width: isCollapsed ? "4.5rem" : "18rem"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden lg:flex flex-col border-r bg-card/50 backdrop-blur-sm shadow-lg relative"
        )}
        data-testid="sidebar-desktop"
      >
        <SidebarContent />
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 z-50 h-9 w-9 min-h-[36px] min-w-[36px] rounded-full border-2 border-primary/30 bg-card p-0 shadow-lg hover:shadow-xl hover:border-primary transition-all duration-200"
            data-testid="button-toggle-sidebar"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronRight className="h-4 w-4 text-primary" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.aside>

      {/* Mobile Header */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b shadow-md"
      >
        <div className="flex items-center justify-between p-3 md:p-4 min-h-[64px]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg ring-2 ring-primary/20 flex-shrink-0">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-sm md:text-base bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Student Hub</h2>
              <p className="text-xs text-muted-foreground hidden sm:block">Smart Learning</p>
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              data-testid="button-mobile-menu"
              className="hover:bg-primary/10 transition-all duration-200 min-h-[44px] min-w-[44px] p-2"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait">
                {isMobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-primary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </motion.div>

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
              data-testid="mobile-overlay"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 sm:w-80 max-w-[85vw] bg-card border-r flex flex-col shadow-2xl"
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
        "lg:mt-0 pt-[64px] lg:pt-0" // Responsive top padding for mobile header
      )}>
        {children}
      </main>
    </div>
  );
}

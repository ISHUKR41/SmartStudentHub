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

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  isActive?: boolean;
  onClick?: () => void;
}

function NavItem({ href, icon, label, badge, isActive, onClick }: NavItemProps) {
  const [, setLocation] = useLocation();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
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
      {icon}
      <span className="ml-3">{label}</span>
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

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const studentNavItems = [
    {
      href: "/",
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: "Dashboard",
    },
    {
      href: "/activities",
      icon: <ClipboardList className="w-5 h-5" />,
      label: "My Activities",
    },
    {
      href: "/upload",
      icon: <Upload className="w-5 h-5" />,
      label: "Upload Achievement",
    },
    {
      href: "/portfolio",
      icon: <FolderOpen className="w-5 h-5" />,
      label: "Digital Portfolio",
    },
  ];

  const facultyNavItems = [
    {
      href: "/approvals",
      icon: <CheckCircle className="w-5 h-5" />,
      label: "Pending Approvals",
      badge: "12", // This would come from an API
    },
  ];

  const adminNavItems = [
    {
      href: "/analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      label: "Analytics & Reports",
    },
    {
      href: "/students",
      icon: <Users className="w-5 h-5" />,
      label: "Student Management",
    },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border" data-testid="sidebar">
      <nav className="p-4 space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {studentNavItems.map((item) => (
            <NavItem
              key={item.href}
              {...item}
              isActive={location === item.href}
            />
          ))}
        </div>

        {/* Faculty/Admin Sections */}
        {(user.role === 'faculty' || user.role === 'admin') && (
          <>
            <div className="pt-4 border-t border-border">
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Administration
              </p>
              
              <div className="space-y-1">
                {facultyNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    {...item}
                    isActive={location === item.href}
                  />
                ))}
                
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

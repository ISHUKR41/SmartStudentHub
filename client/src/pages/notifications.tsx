/**
 * Notifications Management Page
 * 
 * Comprehensive notification center with real-time updates, filtering, and management capabilities.
 * Features responsive design, professional styling, and accessibility compliance.
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useInView } from "react-intersection-observer";
import { useLocalStorage } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, formatDistanceToNow } from "date-fns";
import { Helmet } from "react-helmet-async";
import { apiRequest } from "@/lib/queryClient";

import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import MobileTabBar from "@/components/layout/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, BellRing, Check, CheckCheck, Trash2, Search, Filter,
  RefreshCw, AlertCircle, Info, CheckCircle2, Clock, Star,
  Eye, EyeOff, Settings, Calendar, User, BookOpen, Trophy,
  Target, Award, Users, Zap, AlertTriangle, MessageCircle
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'academic' | 'administrative' | 'social' | 'system' | 'achievement' | 'reminder';
  isRead: boolean;
  studentId: string;
  relatedId?: string;
  relatedType?: string;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
          <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
            <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NotificationIcon({ type, priority }: { type: Notification['type']; priority: Notification['priority'] }) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Info className="w-5 h-5 text-info" />;
    }
  };

  return (
    <div className={`p-2 rounded-full ${
      priority === 'urgent' ? 'bg-destructive/10 animate-pulse' :
      priority === 'high' ? 'bg-warning/10' :
      priority === 'medium' ? 'bg-info/10' : 'bg-muted'
    }`}>
      {getIcon()}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Notification['priority'] }) {
  const variants = {
    urgent: { variant: 'destructive' as const, text: 'Urgent' },
    high: { variant: 'secondary' as const, text: 'High' },
    medium: { variant: 'outline' as const, text: 'Medium' },
    low: { variant: 'outline' as const, text: 'Low' }
  };

  const config = variants[priority];

  return (
    <Badge variant={config.variant} className="text-xs">
      {config.text}
    </Badge>
  );
}

function CategoryBadge({ category }: { category: Notification['category'] }) {
  const categoryIcons = {
    academic: BookOpen,
    administrative: Settings,
    social: Users,
    system: Zap,
    achievement: Trophy,
    reminder: Clock
  };

  const CategoryIcon = categoryIcons[category];

  return (
    <Badge variant="outline" className="text-xs">
      <CategoryIcon className="w-3 h-3 mr-1" />
      {category}
    </Badge>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [viewMode, setViewMode] = useLocalStorage('notifications-view', 'all');

  // Animation observers
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Fetch notifications with React Query
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications', viewMode],
    queryFn: async () => {
      const response = await fetch('/api/students/notifications');
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return response.json() as Notification[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for real-time feel
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await fetch('/api/notifications/unread-count');
      if (!response.ok) throw new Error('Failed to fetch unread count');
      return response.json();
    },
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000,
  });

  // Mark notification as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiRequest('PATCH', `/api/notifications/${notificationId}/read`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('PATCH', '/api/notifications/mark-all-read', {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count'] });
      toast({
        title: "All Notifications Read",
        description: "All notifications have been marked as read",
      });
    },
  });

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];

    let filtered = notifications.filter(notification => {
      const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'all' || notification.type === selectedType;
      const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory;
      const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority;
      const matchesReadStatus = !showOnlyUnread || !notification.isRead;

      return matchesSearch && matchesType && matchesCategory && matchesPriority && matchesReadStatus;
    });

    // Sort by priority and creation date
    filtered.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // If same priority, sort by read status (unread first) then by date
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [notifications, searchTerm, selectedType, selectedCategory, selectedPriority, showOnlyUnread]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups = filteredNotifications.reduce((acc, notification) => {
      const date = format(parseISO(notification.createdAt), 'yyyy-MM-dd');
      const label = format(parseISO(notification.createdAt), 'MMMM d, yyyy');
      
      if (!acc[date]) {
        acc[date] = { label, notifications: [] };
      }
      acc[date].notifications.push(notification);
      
      return acc;
    }, {} as Record<string, { label: string; notifications: Notification[] }>);

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filteredNotifications]);

  // Handle notification actions
  const handleMarkAsRead = useCallback((notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  }, [markAsReadMutation]);

  const handleMarkAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      setLocation(notification.actionUrl);
    }
  }, [handleMarkAsRead, setLocation]);

  const handleSelectNotification = useCallback((notificationId: string, checked: boolean) => {
    setSelectedNotifications(prev => 
      checked 
        ? [...prev, notificationId]
        : prev.filter(id => id !== notificationId)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setSelectedNotifications(checked ? filteredNotifications.map(n => n.id) : []);
  }, [filteredNotifications]);

  // Bulk actions
  const handleBulkMarkAsRead = useCallback(() => {
    selectedNotifications.forEach(id => {
      const notification = notifications?.find(n => n.id === id);
      if (notification && !notification.isRead) {
        handleMarkAsRead(id);
      }
    });
    setSelectedNotifications([]);
  }, [selectedNotifications, notifications, handleMarkAsRead]);

  return (
    <>
      <Helmet>
        <title>Notifications - Smart Student Hub</title>
        <meta 
          name="description" 
          content="Stay updated with real-time notifications about your academic progress, deadlines, achievements, and important announcements." 
        />
        <meta property="og:title" content="Notifications - Smart Student Hub" />
        <meta property="og:description" content="Real-time academic notifications and alerts management" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        
        <div className="flex">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          
          <main className="flex-1 p-4 lg:p-6 space-y-6" role="main">
            {/* Header */}
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Bell className="w-8 h-8 text-primary" />
                  {unreadCount?.count > 0 && (
                    <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount.count > 99 ? '99+' : unreadCount.count}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-notifications">
                    Notifications
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {unreadCount?.count > 0 
                      ? `${unreadCount.count} unread notifications`
                      : "You're all caught up!"
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['notifications'] })}
                  disabled={isLoading}
                  data-testid="button-refresh"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={!unreadCount?.count || markAllAsReadMutation.isPending}
                  data-testid="button-mark-all-read"
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </motion.div>

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search notifications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        data-testid="input-search"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-32" data-testid="select-type">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-40" data-testid="select-category">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                        <SelectItem value="administrative">Administrative</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                      <SelectTrigger className="w-32" data-testid="select-priority">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-unread"
                        checked={showOnlyUnread}
                        onCheckedChange={setShowOnlyUnread}
                        data-testid="checkbox-unread"
                      />
                      <label htmlFor="show-unread" className="text-sm font-medium">
                        Unread only
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bulk Actions */}
                {selectedNotifications.length > 0 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      {selectedNotifications.length} notifications selected
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkMarkAsRead}
                        data-testid="button-bulk-mark-read"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Mark as Read
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Error State */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load notifications. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            )}

            {/* Notifications List */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="space-y-6">
                {groupedNotifications.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || selectedType !== 'all' || selectedCategory !== 'all' || showOnlyUnread
                          ? "Try adjusting your filters or search terms"
                          : "You don't have any notifications yet"
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Select All */}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={selectedNotifications.length === filteredNotifications.length}
                        onCheckedChange={handleSelectAll}
                        data-testid="checkbox-select-all"
                      />
                      <label htmlFor="select-all" className="text-sm font-medium">
                        Select all notifications
                      </label>
                    </div>

                    <AnimatePresence>
                      {groupedNotifications.map(([date, group]) => (
                        <motion.div
                          key={date}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center space-x-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                              {group.label}
                            </h3>
                            <div className="flex-1 h-px bg-border" />
                          </div>
                          
                          <div className="space-y-2">
                            {group.notifications.map((notification, index) => (
                              <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`p-4 border rounded-lg transition-all hover:shadow-md cursor-pointer ${
                                  notification.isRead ? 'bg-card' : 'bg-card border-primary/20'
                                }`}
                                onClick={() => handleNotificationClick(notification)}
                                data-testid={`notification-${notification.id}`}
                              >
                                <div className="flex items-start space-x-4">
                                  <Checkbox
                                    checked={selectedNotifications.includes(notification.id)}
                                    onCheckedChange={(checked) => handleSelectNotification(notification.id, checked)}
                                    onClick={(e) => e.stopPropagation()}
                                    data-testid={`checkbox-${notification.id}`}
                                  />
                                  
                                  <NotificationIcon type={notification.type} priority={notification.priority} />
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className={`text-base font-semibold ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {notification.title}
                                        {!notification.isRead && (
                                          <span className="inline-block w-2 h-2 bg-primary rounded-full ml-2" />
                                        )}
                                      </h4>
                                      <div className="flex items-center space-x-2 ml-4">
                                        <PriorityBadge priority={notification.priority} />
                                        <CategoryBadge category={notification.category} />
                                      </div>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    
                                    <div className="flex items-center justify-between">
                                      <p className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })}
                                      </p>
                                      
                                      <div className="flex items-center space-x-2">
                                        {notification.actionText && (
                                          <Button variant="ghost" size="sm" className="text-xs">
                                            {notification.actionText}
                                          </Button>
                                        )}
                                        
                                        {!notification.isRead && (
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleMarkAsRead(notification.id);
                                            }}
                                            data-testid={`button-mark-read-${notification.id}`}
                                          >
                                            <Check className="w-4 h-4" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </>
                )}
              </div>
            )}
          </main>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden">
          <MobileTabBar />
        </div>
      </div>
    </>
  );
}
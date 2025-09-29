/**
 * Goals & Achievements Management Page
 * 
 * Comprehensive goal setting, progress tracking, and achievement management with gamification elements.
 * Features CRUD operations, timeline views, progress analytics, and motivational design.
 */

import { useState, useMemo, useCallback, Suspense, lazy } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useInView } from "react-intersection-observer";
import { useLocalStorage } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO, formatDistanceToNow, addDays, startOfWeek, endOfWeek } from "date-fns";
import { Helmet } from "react-helmet-async";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import MobileTabBar from "@/components/layout/mobile-tab-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Target, Trophy, Star, Plus, Calendar as CalendarIcon, TrendingUp, 
  CheckCircle2, Clock, Award, Crown, Medal, Zap, Rocket, Fire,
  Edit, Trash2, Eye, RefreshCw, Filter, Search, BarChart3,
  Flag, User, BookOpen, Users, Globe, Heart, Shield
} from "lucide-react";

// Simple placeholder chart components - will be replaced with actual implementations
function GoalProgressChart({ data }: { data: any }) {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Goal progress chart will be rendered here
    </div>
  );
}

function AchievementTimeline({ achievements }: { achievements: Achievement[] }) {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Achievement timeline will be rendered here
    </div>
  );
}

function GoalAnalyticsChart({ data }: { data: any }) {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      Goal analytics chart will be rendered here
    </div>
  );
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'personal' | 'career' | 'health' | 'skill';
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  progress: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'participation' | 'leadership' | 'skill' | 'special';
  points: number;
  badgeIcon: string;
  badgeColor: string;
  isVerified: boolean;
  dateEarned: string;
  studentId: string;
  createdAt: string;
}

interface GoalAnalytics {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  completionRate: number;
  avgTimeToComplete: number;
}

const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(['academic', 'personal', 'career', 'health', 'skill']),
  priority: z.enum(['low', 'medium', 'high']),
  targetValue: z.number().min(1, "Target value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  targetDate: z.string().min(1, "Target date is required"),
});

type GoalFormData = z.infer<typeof goalSchema>;

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function GoalCard({ goal, onEdit, onDelete }: { 
  goal: Goal; 
  onEdit: (goal: Goal) => void; 
  onDelete: (goalId: string) => void;
}) {
  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'paused': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return <Flag className="w-4 h-4 text-destructive" />;
      case 'medium': return <Flag className="w-4 h-4 text-warning" />;
      default: return <Flag className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'academic': return <BookOpen className="w-4 h-4" />;
      case 'career': return <Rocket className="w-4 h-4" />;
      case 'health': return <Heart className="w-4 h-4" />;
      case 'skill': return <Zap className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const isOverdue = new Date(goal.targetDate) < new Date() && goal.status !== 'completed';

  return (
    <Card className={`h-full transition-all hover:shadow-lg ${isOverdue ? 'border-destructive/50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getCategoryIcon(goal.category)}
              <CardTitle className="text-lg font-semibold line-clamp-2">
                {goal.title}
              </CardTitle>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {goal.description}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {getPriorityIcon(goal.priority)}
            <Badge variant={getStatusColor(goal.status)}>
              {goal.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">
              {goal.currentValue}/{goal.targetValue} {goal.unit}
            </span>
          </div>
          <Progress value={goal.progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{goal.progress.toFixed(1)}% complete</span>
            <span>
              Target: {format(parseISO(goal.targetDate), 'MMM d, yyyy')}
              {isOverdue && <span className="text-destructive ml-1">(Overdue)</span>}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Created {formatDistanceToNow(parseISO(goal.createdAt), { addSuffix: true })}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              data-testid={`button-edit-goal-${goal.id}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal.id)}
              data-testid={`button-delete-goal-${goal.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  const getCategoryGradient = (category: Achievement['category']) => {
    switch (category) {
      case 'academic': return 'bg-gradient-to-br from-blue-500 to-blue-700';
      case 'leadership': return 'bg-gradient-to-br from-purple-500 to-purple-700';
      case 'participation': return 'bg-gradient-to-br from-green-500 to-green-700';
      case 'skill': return 'bg-gradient-to-br from-orange-500 to-orange-700';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-700';
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-0 ${getCategoryGradient(achievement.category)} opacity-10`} />
      <CardContent className="p-6 text-center relative">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${getCategoryGradient(achievement.category)}`}>
          <Trophy className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {achievement.description}
        </p>
        
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {achievement.points} points
          </Badge>
          <div className="flex items-center space-x-1">
            {achievement.isVerified && (
              <Shield className="w-4 h-4 text-success" />
            )}
            <span className="text-xs text-muted-foreground">
              {format(parseISO(achievement.dateEarned), 'MMM yyyy')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function GoalsAchievementsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // State management
  const [activeTab, setActiveTab] = useLocalStorage('goals-tab', 'goals');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // Animation observers
  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // Form handling
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "academic",
      priority: "medium",
      targetValue: 1,
      unit: "",
      targetDate: "",
    },
  });

  // Fetch goals data
  const { data: goals, isLoading: goalsLoading, error: goalsError } = useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const response = await fetch('/api/students/goals');
      if (!response.ok) throw new Error('Failed to fetch goals');
      return response.json() as Goal[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch achievements data
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await fetch('/api/students/achievements');
      if (!response.ok) throw new Error('Failed to fetch achievements');
      return response.json() as Achievement[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch analytics data
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['goals', 'analytics'],
    queryFn: async () => {
      const response = await fetch('/api/goals/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json() as GoalAnalytics;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Create goal mutation
  const createGoalMutation = useMutation({
    mutationFn: async (goalData: GoalFormData) => {
      const response = await apiRequest('POST', '/api/goals', goalData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'analytics'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Goal Created",
        description: "Your goal has been successfully created!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    },
  });

  // Update goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: async ({ goalId, updates }: { goalId: string; updates: Partial<Goal> }) => {
      const response = await apiRequest('PUT', `/api/goals/${goalId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'analytics'] });
      setEditingGoal(null);
      form.reset();
      toast({
        title: "Goal Updated",
        description: "Your goal has been successfully updated!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    },
  });

  // Delete goal mutation
  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const response = await apiRequest('DELETE', `/api/goals/${goalId}`, {});
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals', 'analytics'] });
      toast({
        title: "Goal Deleted",
        description: "Your goal has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    },
  });

  // Filter goals
  const filteredGoals = useMemo(() => {
    if (!goals) return [];

    return goals.filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || goal.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || goal.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [goals, searchTerm, selectedCategory, selectedStatus]);

  // Handle form submission
  const onSubmit = useCallback((data: GoalFormData) => {
    if (editingGoal) {
      updateGoalMutation.mutate({ goalId: editingGoal.id, updates: data });
    } else {
      createGoalMutation.mutate(data);
    }
  }, [editingGoal, createGoalMutation, updateGoalMutation]);

  // Handle goal edit
  const handleEditGoal = useCallback((goal: Goal) => {
    setEditingGoal(goal);
    form.reset({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      priority: goal.priority,
      targetValue: goal.targetValue,
      unit: goal.unit,
      targetDate: goal.targetDate.split('T')[0], // Convert to date string
    });
    setIsCreateDialogOpen(true);
  }, [form]);

  // Handle goal delete
  const handleDeleteGoal = useCallback((goalId: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoalMutation.mutate(goalId);
    }
  }, [deleteGoalMutation]);

  const isLoading = goalsLoading || achievementsLoading || analyticsLoading;

  return (
    <>
      <Helmet>
        <title>Goals & Achievements - Smart Student Hub</title>
        <meta 
          name="description" 
          content="Set academic goals, track progress, and celebrate achievements. Comprehensive goal management with analytics and gamification elements." 
        />
        <meta property="og:title" content="Goals & Achievements - Smart Student Hub" />
        <meta property="og:description" content="Goal setting and achievement tracking for academic success" />
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
              <div>
                <h1 className="text-3xl font-bold tracking-tight" data-testid="heading-goals-achievements">
                  Goals & Achievements
                </h1>
                <p className="text-muted-foreground mt-2">
                  Set targets, track progress, and celebrate your accomplishments
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['goals', 'achievements'] })}
                  disabled={isLoading}
                  data-testid="button-refresh"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingGoal(null);
                        form.reset();
                      }}
                      data-testid="button-create-goal"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                      </DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Goal title" {...field} data-testid="input-goal-title" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-goal-category">
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="academic">Academic</SelectItem>
                                    <SelectItem value="personal">Personal</SelectItem>
                                    <SelectItem value="career">Career</SelectItem>
                                    <SelectItem value="health">Health</SelectItem>
                                    <SelectItem value="skill">Skill</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your goal..." 
                                  {...field} 
                                  data-testid="textarea-goal-description"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger data-testid="select-goal-priority">
                                      <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="targetValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Target Value</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="100" 
                                    {...field}
                                    onChange={e => field.onChange(Number(e.target.value))}
                                    data-testid="input-goal-target"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="unit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Unit</FormLabel>
                                <FormControl>
                                  <Input placeholder="points, hours, etc." {...field} data-testid="input-goal-unit" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="targetDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-goal-date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end space-x-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setIsCreateDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            disabled={createGoalMutation.isPending || updateGoalMutation.isPending}
                            data-testid="button-submit-goal"
                          >
                            {editingGoal ? 'Update Goal' : 'Create Goal'}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>

            {/* Statistics Cards */}
            {analytics && (
              <motion.div
                ref={statsRef}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[
                  {
                    title: "Total Goals",
                    value: analytics.totalGoals.toString(),
                    icon: Target,
                    color: "primary",
                    testId: "stat-total-goals"
                  },
                  {
                    title: "Completed",
                    value: analytics.completedGoals.toString(),
                    icon: CheckCircle2,
                    color: "success",
                    testId: "stat-completed-goals"
                  },
                  {
                    title: "Completion Rate",
                    value: `${analytics.completionRate.toFixed(1)}%`,
                    icon: TrendingUp,
                    color: analytics.completionRate >= 75 ? "success" : "warning",
                    testId: "stat-completion-rate"
                  },
                  {
                    title: "Achievements",
                    value: achievements?.length.toString() || "0",
                    icon: Trophy,
                    color: "warning",
                    testId: "stat-achievements"
                  }
                ].map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold" data-testid={stat.testId}>
                            {stat.value}
                          </p>
                        </div>
                        <div className={`p-3 rounded-full bg-${stat.color}/10`}>
                          <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            )}

            {/* Error State */}
            {goalsError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load goals data. Please try refreshing the page.
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3" data-testid="tabs-goals-achievements">
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                {/* Goals Tab */}
                <TabsContent value="goals" className="space-y-6">
                  {/* Filters */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                              placeholder="Search goals..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                              data-testid="input-search-goals"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-40" data-testid="select-filter-category">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="academic">Academic</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="career">Career</SelectItem>
                              <SelectItem value="health">Health</SelectItem>
                              <SelectItem value="skill">Skill</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-32" data-testid="select-filter-status">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Goals Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                      {filteredGoals.map((goal, index) => (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <GoalCard
                            goal={goal}
                            onEdit={handleEditGoal}
                            onDelete={handleDeleteGoal}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {filteredGoals.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No goals found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                            ? "Try adjusting your search or filters"
                            : "Create your first goal to get started"
                          }
                        </p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Create Goal
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                      {achievements?.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <AchievementBadge achievement={achievement} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {(!achievements || achievements.length === 0) && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No achievements yet</h3>
                        <p className="text-muted-foreground">
                          Complete goals and participate in activities to earn achievements
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Goal Progress Analytics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <GoalAnalyticsChart data={analytics} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Achievement Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AchievementTimeline achievements={achievements || []} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
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
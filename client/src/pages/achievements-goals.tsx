import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Trophy,
  Target,
  Star,
  Award,
  Flame,
  Zap,
  Crown,
  Medal,
  TrendingUp,
  Plus,
  CheckCircle,
  Clock,
  Calendar,
  Users,
  BookOpen,
  Code,
  Briefcase,
  GraduationCap,
  Sparkles,
  Gift,
  ChevronRight
} from 'lucide-react';
import CountUp from 'react-countup';
import { useToast } from '@/hooks/use-toast';

const ACHIEVEMENT_BADGES = [
  {
    id: 1,
    title: 'Academic Excellence',
    description: 'Maintain 9+ GPA for 2 consecutive semesters',
    icon: GraduationCap,
    color: 'from-blue-500 to-blue-600',
    unlocked: true,
    unlockedDate: '2025-08-15',
    points: 500,
  },
  {
    id: 2,
    title: 'Coding Maestro',
    description: 'Complete 100 coding challenges',
    icon: Code,
    color: 'from-green-500 to-green-600',
    unlocked: true,
    unlockedDate: '2025-07-20',
    points: 300,
  },
  {
    id: 3,
    title: 'Perfect Attendance',
    description: 'Achieve 100% attendance for a month',
    icon: CheckCircle,
    color: 'from-purple-500 to-purple-600',
    unlocked: true,
    unlockedDate: '2025-09-01',
    points: 200,
  },
  {
    id: 4,
    title: 'Leadership Star',
    description: 'Lead 3 successful team projects',
    icon: Star,
    color: 'from-yellow-500 to-yellow-600',
    unlocked: false,
    progress: 66,
    points: 400,
  },
  {
    id: 5,
    title: 'Event Champion',
    description: 'Participate in 10 campus events',
    icon: Trophy,
    color: 'from-orange-500 to-orange-600',
    unlocked: false,
    progress: 80,
    points: 350,
  },
  {
    id: 6,
    title: 'Research Pioneer',
    description: 'Publish a research paper',
    icon: BookOpen,
    color: 'from-red-500 to-red-600',
    unlocked: false,
    progress: 45,
    points: 600,
  },
];

const GOALS = [
  {
    id: 1,
    title: 'Achieve 9.5 GPA this semester',
    category: 'Academic',
    priority: 'high',
    deadline: '2025-12-15',
    progress: 75,
    milestones: [
      { id: 1, title: 'Score 95+ in Algorithms', completed: true },
      { id: 2, title: 'Complete all assignments on time', completed: true },
      { id: 3, title: 'Ace the mid-term exams', completed: true },
      { id: 4, title: 'Excel in final exams', completed: false },
    ],
    icon: GraduationCap,
    color: 'blue',
  },
  {
    id: 2,
    title: 'Complete AWS Certification',
    category: 'Professional',
    priority: 'high',
    deadline: '2025-11-30',
    progress: 60,
    milestones: [
      { id: 1, title: 'Complete online course', completed: true },
      { id: 2, title: 'Practice exams', completed: true },
      { id: 3, title: 'Schedule exam', completed: false },
      { id: 4, title: 'Pass certification', completed: false },
    ],
    icon: Award,
    color: 'green',
  },
  {
    id: 3,
    title: 'Build 5 full-stack projects',
    category: 'Personal',
    priority: 'medium',
    deadline: '2026-01-31',
    progress: 40,
    milestones: [
      { id: 1, title: 'Project 1: E-commerce site', completed: true },
      { id: 2, title: 'Project 2: Social media app', completed: true },
      { id: 3, title: 'Project 3: Task manager', completed: false },
      { id: 4, title: 'Project 4: Weather app', completed: false },
      { id: 5, title: 'Project 5: Portfolio site', completed: false },
    ],
    icon: Code,
    color: 'purple',
  },
  {
    id: 4,
    title: 'Land a summer internship',
    category: 'Career',
    priority: 'high',
    deadline: '2025-03-31',
    progress: 30,
    milestones: [
      { id: 1, title: 'Update resume', completed: true },
      { id: 2, title: 'Build portfolio', completed: false },
      { id: 3, title: 'Apply to 20 companies', completed: false },
      { id: 4, title: 'Prepare for interviews', completed: false },
      { id: 5, title: 'Secure internship offer', completed: false },
    ],
    icon: Briefcase,
    color: 'orange',
  },
];

const LEVELS = [
  { level: 1, title: 'Novice', minPoints: 0, maxPoints: 999, color: 'from-gray-400 to-gray-500', icon: '🌱' },
  { level: 2, title: 'Learner', minPoints: 1000, maxPoints: 2499, color: 'from-green-400 to-green-500', icon: '📚' },
  { level: 3, title: 'Achiever', minPoints: 2500, maxPoints: 4999, color: 'from-blue-400 to-blue-500', icon: '⭐' },
  { level: 4, title: 'Expert', minPoints: 5000, maxPoints: 9999, color: 'from-purple-400 to-purple-500', icon: '🎯' },
  { level: 5, title: 'Master', minPoints: 10000, maxPoints: 19999, color: 'from-orange-400 to-orange-500', icon: '👑' },
  { level: 6, title: 'Legend', minPoints: 20000, maxPoints: Infinity, color: 'from-yellow-400 to-yellow-500', icon: '🏆' },
];

export default function AchievementsGoals() {
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<typeof GOALS[0] | null>(null);
  const { toast } = useToast();

  const currentPoints = 3450;
  const currentStreak = 15;
  const currentLevel = LEVELS.find(l => currentPoints >= l.minPoints && currentPoints <= l.maxPoints) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressToNextLevel = nextLevel 
    ? ((currentPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100 
    : 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/10 text-red-500';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500';
      case 'low': return 'bg-green-500/10 text-green-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleCreateGoal = () => {
    toast({
      title: 'Goal Created!',
      description: 'Your new goal has been added successfully',
    });
    setIsGoalDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="page-title">
                Achievements & Goals 🎯
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Track your progress and unlock achievements
              </p>
            </div>

            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                  data-testid="button-create-goal"
                >
                  <Plus className="h-4 w-4" />
                  Create Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]" data-testid="dialog-create-goal">
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a new goal to track your progress and stay motivated
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-title">Goal Title *</Label>
                    <Input 
                      id="goal-title" 
                      placeholder="e.g., Achieve 9.5 GPA this semester" 
                      data-testid="input-goal-title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select>
                        <SelectTrigger id="category" data-testid="select-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Select>
                        <SelectTrigger id="priority" data-testid="select-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deadline">Deadline *</Label>
                    <Input 
                      id="deadline" 
                      type="date" 
                      data-testid="input-deadline"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your goal and why it's important..."
                      rows={3}
                      data-testid="textarea-description"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsGoalDialogOpen(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateGoal}
                    className="bg-gradient-to-r from-primary to-primary/80"
                    data-testid="button-submit-goal"
                  >
                    Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10" data-testid="card-level">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`text-6xl`}>
                    {currentLevel.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold">Level {currentLevel.level}</h3>
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground font-semibold">{currentLevel.title}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress to Level {currentLevel.level + 1}</span>
                    <span className="font-bold text-primary">
                      <CountUp end={Math.round(progressToNextLevel)} duration={2} />%
                    </span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span><CountUp end={currentPoints} duration={2} /> XP</span>
                    <span>{nextLevel ? nextLevel.minPoints : '∞'} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-500/5 to-orange-500/10" data-testid="card-streak">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-orange-500/10 rounded-full">
                    <Flame className="h-10 w-10 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold">
                      <CountUp end={currentStreak} duration={2} />
                    </h3>
                    <p className="text-sm text-muted-foreground font-semibold">Day Streak 🔥</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Keep logging in daily to maintain your streak!
                  </p>
                  <div className="flex gap-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i}
                        className={`flex-1 h-2 rounded ${i < 6 ? 'bg-orange-500' : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500/5 to-purple-500/10" data-testid="card-points">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-purple-500/10 rounded-full">
                    <Zap className="h-10 w-10 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold">
                      <CountUp end={currentPoints} duration={2} />
                    </h3>
                    <p className="text-sm text-muted-foreground font-semibold">Total Points</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-purple-500" />
                      <span className="text-muted-foreground">This Month</span>
                    </div>
                    <span className="font-bold text-purple-600">+450 XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="achievements" className="space-y-6" data-testid="tabs-main">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="achievements" className="gap-2" data-testid="tab-achievements">
                <Trophy className="h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="goals" className="gap-2" data-testid="tab-goals">
                <Target className="h-4 w-4" />
                Goals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="achievements">
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-achievements-list">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription>
                    Unlock badges by completing challenges and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ACHIEVEMENT_BADGES.map((badge) => (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        className={`relative p-6 rounded-lg border-2 ${
                          badge.unlocked 
                            ? 'border-primary/50 bg-gradient-to-br ' + badge.color + '/10' 
                            : 'border-muted bg-muted/50 grayscale opacity-60'
                        } transition-all`}
                        data-testid={`badge-${badge.id}`}
                      >
                        {badge.unlocked && (
                          <div className="absolute top-2 right-2">
                            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                          </div>
                        )}
                        
                        <div className={`mb-4 p-4 rounded-full w-fit mx-auto bg-gradient-to-br ${badge.color} ${!badge.unlocked && 'grayscale'}`}>
                          <badge.icon className="h-8 w-8 text-white" />
                        </div>
                        
                        <h4 className="font-bold text-center mb-2">{badge.title}</h4>
                        <p className="text-xs text-muted-foreground text-center mb-3">
                          {badge.description}
                        </p>
                        
                        {badge.unlocked ? (
                          <div className="space-y-2">
                            <Badge className="w-full justify-center bg-green-500/10 text-green-500 hover:bg-green-500/20">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Unlocked
                            </Badge>
                            <p className="text-xs text-center text-muted-foreground">
                              {new Date(badge.unlockedDate).toLocaleDateString()}
                            </p>
                            <div className="text-center">
                              <span className="text-sm font-bold text-primary">+{badge.points} XP</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Progress value={badge.progress || 0} className="h-2" />
                            <p className="text-xs text-center text-muted-foreground">
                              {badge.progress || 0}% Complete
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="goals">
              <Accordion type="multiple" defaultValue={GOALS.map(g => g.category)} className="space-y-4">
                {['Academic', 'Professional', 'Personal', 'Career'].map((category) => {
                  const categoryGoals = GOALS.filter(g => g.category === category);
                  if (categoryGoals.length === 0) return null;

                  return (
                    <AccordionItem 
                      key={category} 
                      value={category}
                      className="border rounded-lg px-4"
                      data-testid={`accordion-${category.toLowerCase()}`}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Target className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{category} Goals</p>
                            <p className="text-sm text-muted-foreground">
                              {categoryGoals.length} {categoryGoals.length === 1 ? 'goal' : 'goals'}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {categoryGoals.map((goal) => (
                            <motion.div
                              key={goal.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-6 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                              data-testid={`goal-${goal.id}`}
                            >
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex items-start gap-3 flex-1">
                                  <div className={`p-3 rounded-lg bg-${goal.color}-500/10`}>
                                    <goal.icon className={`h-6 w-6 text-${goal.color}-500`} />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-lg mb-2">{goal.title}</h4>
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                      <Badge className={getPriorityColor(goal.priority)}>
                                        {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)} Priority
                                      </Badge>
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        Due: {new Date(goal.deadline).toLocaleDateString()}
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Overall Progress</span>
                                        <span className="text-primary font-bold">{goal.progress}%</span>
                                      </div>
                                      <Progress value={goal.progress} className="h-2" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <h5 className="text-sm font-semibold flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                                      </h5>
                                      <div className="space-y-1">
                                        {goal.milestones.map((milestone) => (
                                          <div 
                                            key={milestone.id}
                                            className="flex items-center gap-2 text-sm p-2 rounded hover:bg-background/50 transition-colors"
                                          >
                                            {milestone.completed ? (
                                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            ) : (
                                              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                            )}
                                            <span className={milestone.completed ? 'line-through text-muted-foreground' : ''}>
                                              {milestone.title}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedGoal(goal)}
                                  data-testid={`button-view-goal-${goal.id}`}
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              {GOALS.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start setting goals to track your progress and achievements
                    </p>
                    <Button 
                      onClick={() => setIsGoalDialogOpen(true)}
                      className="gap-2"
                      data-testid="button-create-first-goal"
                    >
                      <Plus className="h-4 w-4" />
                      Create Your First Goal
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

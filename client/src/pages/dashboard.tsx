import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle, 
  TrendingUp,
  BookOpen,
  Award,
  Clock,
  Users,
  BarChart3,
  Activity,
  Bell,
  Download,
  Upload,
  FileText,
  Trophy,
  Target,
  Zap,
  TrendingDown,
  BookMarked,
  Library,
  ChevronDown,
  ChevronUp,
  Filter,
  Play,
  Plus,
  Edit,
  Share2,
  Star,
  Flame
} from 'lucide-react';
import CountUp from 'react-countup';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import ReactECharts from 'echarts-for-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const attendanceDataFull = {
  day: [
    { period: 'Mon', attendance: 95 },
    { period: 'Tue', attendance: 92 },
    { period: 'Wed', attendance: 88 },
    { period: 'Thu', attendance: 90 },
    { period: 'Fri', attendance: 94 },
  ],
  week: [
    { period: 'Week 1', attendance: 92 },
    { period: 'Week 2', attendance: 88 },
    { period: 'Week 3', attendance: 95 },
    { period: 'Week 4', attendance: 90 },
  ],
  month: [
    { period: 'Jan', attendance: 92 },
    { period: 'Feb', attendance: 88 },
    { period: 'Mar', attendance: 95 },
    { period: 'Apr', attendance: 90 },
    { period: 'May', attendance: 94 },
    { period: 'Jun', attendance: 96 },
  ],
};

const performanceDataFull = {
  all: [
    { subject: 'Mathematics', score: 85 },
    { subject: 'Physics', score: 78 },
    { subject: 'Chemistry', score: 92 },
    { subject: 'English', score: 88 },
    { subject: 'Computer Sci', score: 95 },
  ],
  science: [
    { subject: 'Physics', score: 78 },
    { subject: 'Chemistry', score: 92 },
    { subject: 'Computer Sci', score: 95 },
  ],
  humanities: [
    { subject: 'English', score: 88 },
    { subject: 'History', score: 82 },
  ],
};

const activityData = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Upcoming', value: 10, color: '#3b82f6' },
];

const studyHoursData = {
  day: [
    { day: 'Mon', hours: 4 },
    { day: 'Tue', hours: 5 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 6 },
    { day: 'Fri', hours: 4 },
  ],
  week: [
    { day: 'W1', hours: 25 },
    { day: 'W2', hours: 28 },
    { day: 'W3', hours: 22 },
    { day: 'W4', hours: 30 },
  ],
  month: [
    { day: 'Jan', hours: 120 },
    { day: 'Feb', hours: 110 },
    { day: 'Mar', hours: 135 },
    { day: 'Apr', hours: 125 },
    { day: 'May', hours: 140 },
    { day: 'Jun', hours: 145 },
  ],
};

const achievements = [
  { id: 1, title: 'Perfect Attendance', description: 'Achieved 100% attendance for 2 weeks', date: '2 days ago', icon: '🎯', type: 'attendance' },
  { id: 2, title: 'Top Score in Math', description: 'Scored 98/100 in Advanced Mathematics', date: '5 days ago', icon: '🏆', type: 'academic' },
  { id: 3, title: 'Club President', description: 'Elected as Computer Science Club President', date: '1 week ago', icon: '⭐', type: 'leadership' },
  { id: 4, title: 'Research Published', description: 'Paper accepted in IEEE conference', date: '2 weeks ago', icon: '📚', type: 'research' },
  { id: 5, title: 'Hackathon Winner', description: 'First place in University Hackathon', date: '3 weeks ago', icon: '💡', type: 'competition' },
];

const notifications = [
  { id: 1, title: 'Assignment Due Tomorrow', message: 'Computer Networks assignment deadline', time: '10 mins ago', type: 'warning' },
  { id: 2, title: 'New Grade Posted', message: 'Your Data Structures exam result is available', time: '1 hour ago', type: 'info' },
  { id: 3, title: 'Event Reminder', message: 'Tech Talk starts in 2 hours', time: '2 hours ago', type: 'info' },
  { id: 4, title: 'Scholarship Opportunity', message: 'Apply for Merit Scholarship by this Friday', time: '1 day ago', type: 'success' },
];

const resourceUsageData = {
  day: { libraryVisits: 2, downloads: 8, uploads: 3 },
  week: { libraryVisits: 12, downloads: 45, uploads: 18 },
  month: { libraryVisits: 48, downloads: 156, uploads: 67 },
};

const peerComparisonData = [
  { metric: 'Attendance', you: 92, average: 85, max: 100 },
  { metric: 'Assignments', you: 88, average: 75, max: 100 },
  { metric: 'Participation', you: 85, average: 70, max: 95 },
  { metric: 'Grades', you: 90, average: 78, max: 98 },
  { metric: 'Activities', you: 95, average: 65, max: 100 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'science' | 'humanities'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ConfettiComponent, setConfettiComponent] = useState<any>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(true);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = useState(true);
  const [isComparisonOpen, setIsComparisonOpen] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsAchievementsOpen(false);
        setIsNotificationsOpen(false);
        setIsQuickActionsOpen(false);
        setIsResourcesOpen(false);
        setIsComparisonOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const attendanceData = attendanceDataFull[selectedPeriod];
  const performanceData = performanceDataFull[subjectFilter];
  const studyData = studyHoursData[selectedPeriod];
  const resourceData = resourceUsageData[selectedPeriod];

  const handleAchievementClick = async () => {
    if (!ConfettiComponent) {
      const module = await import('react-confetti');
      setConfettiComponent(() => module.default);
    }
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const calendarHeatmapData = useMemo(() => {
    const data: [string, number][] = [];
    for (let i = 0; i < 120; i++) {
      const date = new Date(2024, 8, 1);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const value = Math.floor(Math.random() * 8);
      data.push([dateStr, value]);
    }
    return data;
  }, []);

  const calendarHeatmapOption = useMemo(() => {
    const startDate = '2024-09-01';
    const endDate = '2024-12-31';

    return {
      tooltip: {
        position: 'top',
        formatter: (p: any) => {
          const date = p.data[0];
          const hours = p.data[1];
          return `${date}<br/>Study Hours: ${hours}h`;
        }
      },
      visualMap: {
        min: 0,
        max: 8,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 10,
        inRange: {
          color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
        }
      },
      calendar: {
        top: 80,
        left: 40,
        right: 40,
        cellSize: ['auto', 13],
        range: [startDate, endDate],
        itemStyle: {
          borderWidth: 0.5,
          borderColor: '#fff'
        },
        yearLabel: { show: true }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: calendarHeatmapData
      }
    };
  }, [calendarHeatmapData]);

  const gaugeOption = useMemo(() => {
    return {
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          splitNumber: 8,
          axisLine: {
            lineStyle: {
              width: 6,
              color: [
                [0.25, '#FF6E76'],
                [0.5, '#FDDD60'],
                [0.75, '#58D9F9'],
                [1, '#7CFFB2']
              ]
            }
          },
          pointer: {
            icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
            length: '12%',
            width: 20,
            offsetCenter: [0, '-60%'],
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            length: 12,
            lineStyle: {
              color: 'auto',
              width: 2
            }
          },
          splitLine: {
            length: 20,
            lineStyle: {
              color: 'auto',
              width: 5
            }
          },
          axisLabel: {
            color: '#464646',
            fontSize: 12,
            distance: -60,
            formatter: (value: number) => {
              if (value === 100) return 'A+';
              if (value === 75) return 'A';
              if (value === 50) return 'B';
              if (value === 25) return 'C';
              return '';
            }
          },
          title: {
            offsetCenter: [0, '-20%'],
            fontSize: 18
          },
          detail: {
            fontSize: 30,
            offsetCenter: [0, '0%'],
            valueAnimation: true,
            formatter: (value: number) => Math.round(value) + '%',
            color: 'auto'
          },
          data: [
            {
              value: 87,
              name: 'Performance Score'
            }
          ]
        }
      ]
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const quickActions = [
    { icon: Plus, label: 'New Activity', color: 'bg-blue-500', action: () => {} },
    { icon: Upload, label: 'Upload File', color: 'bg-green-500', action: () => {} },
    { icon: Edit, label: 'Edit Profile', color: 'bg-purple-500', action: () => {} },
    { icon: Share2, label: 'Share Progress', color: 'bg-pink-500', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {showConfetti && ConfettiComponent && <ConfettiComponent recycle={false} numberOfPieces={500} data-testid="confetti-animation" />}
      
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="dashboard-title">
                  Welcome back, {user?.firstName || 'Student'}! 👋
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Here's what's happening with your academic journey today
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)} data-testid="period-selector">
                  <TabsList>
                    <TabsTrigger value="day" data-testid="period-day">Day</TabsTrigger>
                    <TabsTrigger value="week" data-testid="period-week">Week</TabsTrigger>
                    <TabsTrigger value="month" data-testid="period-month">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Tabs value={subjectFilter} onValueChange={(v) => setSubjectFilter(v as any)} data-testid="subject-filter">
                  <TabsList>
                    <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
                    <TabsTrigger value="science" data-testid="filter-science">Science</TabsTrigger>
                    <TabsTrigger value="humanities" data-testid="filter-humanities">Humanities</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { title: 'Attendance', value: 92, suffix: '%', icon: CheckCircle, color: 'text-green-500', progress: 92, change: '+3% from last month', testId: 'card-attendance' },
              { title: 'Assignments', value: 8, suffix: '', extra: '/ 12', icon: BookOpen, color: 'text-blue-500', progress: 66, change: '4 pending submissions', testId: 'card-assignments' },
              { title: 'Activities', value: 45, suffix: '', icon: Activity, color: 'text-purple-500', progress: 75, change: '15 pending approvals', testId: 'card-activities' },
              { title: 'Current GPA', value: 3.8, suffix: '', extra: '/ 4.0', icon: TrendingUp, color: 'text-orange-500', progress: 95, change: 'Top 10% in class', testId: 'card-gpa' },
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={cardVariants}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-300" data-testid={stat.testId}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      <CountUp end={stat.value} duration={2} decimals={stat.title === 'Current GPA' ? 1 : 0} suffix={stat.suffix} />
                      {stat.extra && <span className="text-base text-muted-foreground ml-1">{stat.extra}</span>}
                    </div>
                    <Progress value={stat.progress} className="mt-3" data-testid={`progress-${stat.testId}`} />
                    <p className="text-xs text-muted-foreground mt-2">{stat.change}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
              <Card data-testid="card-performance-gauge">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Overall Performance Gauge
                  </CardTitle>
                  <CardDescription>Your comprehensive academic performance score</CardDescription>
                </CardHeader>
                <CardContent>
                  <ReactECharts 
                    option={gaugeOption} 
                    style={{ height: '350px' }}
                    opts={{ renderer: 'canvas' }}
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Collapsible open={isQuickActionsOpen} onOpenChange={setIsQuickActionsOpen}>
                <Card data-testid="card-quick-actions">
                  <CardHeader>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5" />
                          Quick Actions
                        </CardTitle>
                        {isQuickActionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                    <CardDescription>Frequently used actions</CardDescription>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                          <motion.div
                            key={action.label}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="outline"
                              className="w-full h-24 flex flex-col items-center justify-center gap-2"
                              onClick={action.action}
                              data-testid={`button-${action.label.toLowerCase().replace(' ', '-')}`}
                            >
                              <div className={`${action.color} p-3 rounded-lg`}>
                                <action.icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="text-xs font-medium">{action.label}</span>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Card data-testid="card-attendance-trend">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Attendance Trend
                  </CardTitle>
                  <CardDescription>Your attendance for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={attendanceData}>
                      <defs>
                        <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="attendance" stroke="#10b981" fillOpacity={1} fill="url(#colorAttendance)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Card data-testid="card-performance">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Subject Performance
                  </CardTitle>
                  <CardDescription>Filtered by: {subjectFilter}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" angle={-15} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="mb-8">
            <Card data-testid="card-study-hours-victory">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Study Hours Tracker
                </CardTitle>
                <CardDescription>Your daily study hours for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" className="mb-8">
            <Card data-testid="card-calendar-heatmap">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Schedule Heatmap (ECharts)
                </CardTitle>
                <CardDescription>Study activity throughout the semester</CardDescription>
              </CardHeader>
              <CardContent>
                <ReactECharts 
                  option={calendarHeatmapOption} 
                  style={{ height: '250px' }}
                  opts={{ renderer: 'canvas' }}
                />
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Collapsible open={isResourcesOpen} onOpenChange={setIsResourcesOpen}>
                <Card data-testid="card-resource-usage">
                  <CardHeader>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Library className="h-5 w-5" />
                            Resource Usage Stats
                          </CardTitle>
                          <CardDescription className="text-left">Library & digital resources</CardDescription>
                        </div>
                        {isResourcesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900" data-testid="resource-library-visits">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500 rounded-lg">
                              <BookMarked className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Library Visits</p>
                              <p className="text-2xl font-bold">
                                <CountUp end={resourceData.libraryVisits} duration={2} />
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900" data-testid="resource-downloads">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-500 rounded-lg">
                              <Download className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Downloads</p>
                              <p className="text-2xl font-bold">
                                <CountUp end={resourceData.downloads} duration={2} />
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900" data-testid="resource-uploads">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-500 rounded-lg">
                              <Upload className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Uploads</p>
                              <p className="text-2xl font-bold">
                                <CountUp end={resourceData.uploads} duration={2} />
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Card data-testid="card-peer-comparison">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Peer Comparison
                  </CardTitle>
                  <CardDescription>How you compare with classmates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={peerComparisonData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="You" dataKey="you" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                      <Radar name="Average" dataKey="average" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" className="lg:col-span-2">
              <Collapsible open={isAchievementsOpen} onOpenChange={setIsAchievementsOpen}>
                <Card data-testid="card-achievements">
                  <CardHeader>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Recent Achievements
                          </CardTitle>
                          <CardDescription className="text-left">Your latest accomplishments</CardDescription>
                        </div>
                        {isAchievementsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-3">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 10 }}
                            className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all cursor-pointer"
                            onClick={handleAchievementClick}
                            data-testid={`achievement-${achievement.id}`}
                          >
                            <div className="text-4xl">{achievement.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                                    {achievement.title}
                                    {index < 2 && <Flame className="h-4 w-4 text-orange-500" />}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                                </div>
                                <Badge variant="outline" className="ml-2">{achievement.type}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">{achievement.date}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <Collapsible open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                <Card data-testid="card-notifications">
                  <CardHeader>
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notifications
                            <Badge variant="destructive" className="ml-2">4</Badge>
                          </CardTitle>
                          <CardDescription className="text-left">Recent alerts</CardDescription>
                        </div>
                        {isNotificationsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="space-y-3">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              notification.type === 'warning' ? 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800' :
                              notification.type === 'success' ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' :
                              'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
                            }`}
                            data-testid={`notification-${notification.id}`}
                          >
                            <div className="flex items-start gap-2">
                              <Bell className={`h-4 w-4 mt-0.5 ${
                                notification.type === 'warning' ? 'text-orange-500' :
                                notification.type === 'success' ? 'text-green-500' :
                                'text-blue-500'
                              }`} />
                              <div className="flex-1">
                                <h5 className="text-sm font-semibold">{notification.title}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2" data-testid="card-upcoming-classes">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Classes
                </CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: '09:00 AM', subject: 'Advanced Mathematics', room: 'Room 301', status: 'In 30 min', instructor: 'Dr. Smith' },
                    { time: '11:00 AM', subject: 'Physics Lab', room: 'Lab B-2', status: 'In 2 hours', instructor: 'Prof. Johnson' },
                    { time: '02:00 PM', subject: 'Computer Science', room: 'Room 405', status: 'In 5 hours', instructor: 'Dr. Williams' },
                    { time: '04:00 PM', subject: 'English Literature', room: 'Room 201', status: 'In 7 hours', instructor: 'Ms. Brown' },
                  ].map((class_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-all"
                      data-testid={`class-item-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Clock className="h-5 w-5 text-primary mb-1" />
                          <span className="text-xs font-semibold">{class_.time}</span>
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-foreground">{class_.subject}</h4>
                          <p className="text-sm text-muted-foreground">{class_.room}</p>
                          <p className="text-xs text-muted-foreground">{class_.instructor}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{class_.status}</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-activity-distribution">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Activity Status
                </CardTitle>
                <CardDescription>Distribution of your activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {activityData.map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between"
                      whileHover={{ x: 10 }}
                      data-testid={`activity-${item.name.toLowerCase()}`}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                          whileHover={{ scale: 1.5 }}
                        ></motion.div>
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">
                        <CountUp end={item.value} duration={2} />
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

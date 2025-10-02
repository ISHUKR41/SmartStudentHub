import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCcw,
  CheckCircle,
  BookOpen,
  Award,
  Clock,
  Target,
  Users,
  FileText
} from 'lucide-react';
import CountUp from 'react-countup';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import { useToast } from '@/hooks/use-toast';

const attendanceTrendData = [
  { month: 'Jan', attendance: 92, target: 90, classes: 20 },
  { month: 'Feb', attendance: 88, target: 90, classes: 18 },
  { month: 'Mar', attendance: 95, target: 90, classes: 22 },
  { month: 'Apr', attendance: 90, target: 90, classes: 20 },
  { month: 'May', attendance: 94, target: 90, classes: 21 },
  { month: 'Jun', attendance: 96, target: 90, classes: 23 },
];

const performanceData = [
  { subject: 'Mathematics', score: 85, average: 75 },
  { subject: 'Physics', score: 78, average: 70 },
  { subject: 'Chemistry', score: 92, average: 80 },
  { subject: 'English', score: 88, average: 82 },
  { subject: 'Computer Science', score: 95, average: 78 },
];

const activityDistribution = [
  { name: 'Academic', value: 35, color: '#3b82f6' },
  { name: 'Extracurricular', value: 25, color: '#8b5cf6' },
  { name: 'Certifications', value: 20, color: '#10b981' },
  { name: 'Competitions', value: 15, color: '#f59e0b' },
  { name: 'Workshops', value: 5, color: '#ef4444' },
];

const weeklyEngagementData = [
  { day: 'Mon', hours: 6.5, tasks: 8 },
  { day: 'Tue', hours: 7.2, tasks: 10 },
  { day: 'Wed', hours: 5.8, tasks: 7 },
  { day: 'Thu', hours: 8.1, tasks: 12 },
  { day: 'Fri', hours: 6.9, tasks: 9 },
  { day: 'Sat', hours: 4.5, tasks: 5 },
  { day: 'Sun', hours: 3.2, tasks: 3 },
];

const skillProgressData = [
  { skill: 'Programming', current: 90, target: 95 },
  { skill: 'Problem Solving', current: 85, target: 90 },
  { skill: 'Communication', current: 80, target: 85 },
  { skill: 'Leadership', current: 75, target: 85 },
  { skill: 'Teamwork', current: 88, target: 90 },
];

const assignmentStatusData = [
  { status: 'Submitted', count: 45, color: '#10b981' },
  { status: 'In Progress', count: 8, color: '#3b82f6' },
  { status: 'Pending', count: 5, color: '#f59e0b' },
  { status: 'Overdue', count: 2, color: '#ef4444' },
];

const semesterComparisonData = [
  { semester: 'Sem 1', gpa: 8.5, credits: 24, activities: 8 },
  { semester: 'Sem 2', gpa: 8.7, credits: 26, activities: 10 },
  { semester: 'Sem 3', gpa: 9.0, credits: 24, activities: 12 },
  { semester: 'Sem 4', gpa: 8.9, credits: 25, activities: 15 },
  { semester: 'Sem 5', gpa: 9.2, credits: 26, activities: 18 },
];

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('semester');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const { toast } = useToast();

  const handleExportReport = () => {
    toast({
      title: 'Report Exported',
      description: 'Your analytics report has been downloaded successfully',
    });
  };

  const heatmapOption = {
    tooltip: {
      position: 'top'
    },
    grid: {
      height: '70%',
      top: '10%',
      left: '15%'
    },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      splitArea: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%',
      inRange: {
        color: ['#e0f2fe', '#0ea5e9', '#0369a1']
      }
    },
    series: [
      {
        name: 'Attendance',
        type: 'heatmap',
        data: [
          [0, 0, 95], [0, 1, 92], [0, 2, 88], [0, 3, 96],
          [1, 0, 90], [1, 1, 94], [1, 2, 91], [1, 3, 93],
          [2, 0, 87], [2, 1, 89], [2, 2, 95], [2, 3, 92],
          [3, 0, 91], [3, 1, 88], [3, 2, 90], [3, 3, 94],
          [4, 0, 93], [4, 1, 95], [4, 2, 96], [4, 3, 92],
          [5, 0, 85], [5, 1, 87], [5, 2, 89], [5, 3, 91],
          [6, 0, 80], [6, 1, 82], [6, 2, 85], [6, 3, 88]
        ],
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  const gaugeOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: '#3b82f6'
        },
        progress: {
          show: true,
          width: 18
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          distance: -22,
          splitNumber: 5,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          distance: -30,
          length: 14,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: -20,
          color: '#999',
          fontSize: 12
        },
        anchor: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 40,
          fontWeight: 'bolder',
          formatter: '{value}%',
          color: 'inherit'
        },
        data: [
          {
            value: 92
          }
        ]
      }
    ]
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
                Analytics & Reports 📊
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Comprehensive insights into your academic journey
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[150px]" data-testid="select-period">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="semester">This Semester</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" data-testid="button-refresh">
                <RefreshCcw className="h-4 w-4" />
              </Button>

              <Button 
                className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                onClick={handleExportReport}
                data-testid="button-export"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export Report</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { 
                label: 'Overall Performance', 
                value: 92, 
                suffix: '%',
                icon: TrendingUp, 
                color: 'text-green-500', 
                bgColor: 'bg-green-500/10',
                change: '+5.2%',
                trend: 'up'
              },
              { 
                label: 'Average Attendance', 
                value: 94, 
                suffix: '%',
                icon: CheckCircle, 
                color: 'text-blue-500', 
                bgColor: 'bg-blue-500/10',
                change: '+2.8%',
                trend: 'up'
              },
              { 
                label: 'Assignments Completed', 
                value: 45, 
                suffix: '/50',
                icon: FileText, 
                color: 'text-purple-500', 
                bgColor: 'bg-purple-500/10',
                change: '+8',
                trend: 'up'
              },
              { 
                label: 'Study Hours/Week', 
                value: 42, 
                suffix: 'hrs',
                icon: Clock, 
                color: 'text-orange-500', 
                bgColor: 'bg-orange-500/10',
                change: '-3.5%',
                trend: 'down'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow" data-testid={`card-stat-${index}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {stat.change}
                      </Badge>
                    </div>
                    <div className="text-3xl font-bold text-foreground">
                      <CountUp end={stat.value} duration={2} />
                      <span className="text-lg text-muted-foreground ml-1">{stat.suffix}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Accordion type="multiple" defaultValue={['attendance', 'performance']} className="space-y-6" data-testid="accordion-metrics">
            <AccordionItem value="attendance" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-attendance">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Attendance Analysis</p>
                    <p className="text-sm text-muted-foreground">Track your attendance trends and patterns</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <Tabs defaultValue="trend" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="trend" data-testid="tab-attendance-trend">Trend</TabsTrigger>
                    <TabsTrigger value="heatmap" data-testid="tab-attendance-heatmap">Heatmap</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="trend">
                    <Card>
                      <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={350}>
                          <AreaChart data={attendanceTrendData}>
                            <defs>
                              <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                            <XAxis dataKey="month" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }} 
                            />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="attendance" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              fillOpacity={1} 
                              fill="url(#colorAttendance)" 
                              name="Your Attendance"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="target" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              fillOpacity={1} 
                              fill="url(#colorTarget)" 
                              name="Target"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="heatmap">
                    <Card>
                      <CardContent className="pt-6">
                        <ReactECharts option={heatmapOption} style={{ height: '400px' }} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="performance" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-performance">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Academic Performance</p>
                    <p className="text-sm text-muted-foreground">Subject-wise performance analysis</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Subject Performance</CardTitle>
                      <CardDescription>Your scores vs class average</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                          <XAxis dataKey="subject" stroke="#888" angle={-15} textAnchor="end" height={80} />
                          <YAxis stroke="#888" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="score" fill="#3b82f6" name="Your Score" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="average" fill="#10b981" name="Class Average" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overall Progress</CardTitle>
                      <CardDescription>Current semester performance gauge</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ReactECharts option={gaugeOption} style={{ height: '350px' }} />
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="activities" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-activities">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Activity Participation</p>
                    <p className="text-sm text-muted-foreground">Extracurricular and co-curricular activities</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Activity Distribution</CardTitle>
                      <CardDescription>Breakdown by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                          <Pie
                            data={activityDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {activityDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Weekly Engagement</CardTitle>
                      <CardDescription>Study hours and tasks completed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={weeklyEngagementData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                          <XAxis dataKey="day" stroke="#888" />
                          <YAxis yAxisId="left" stroke="#888" />
                          <YAxis yAxisId="right" orientation="right" stroke="#888" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }} 
                          />
                          <Legend />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="hours" 
                            stroke="#8b5cf6" 
                            strokeWidth={3}
                            name="Study Hours"
                            dot={{ r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="tasks" 
                            stroke="#f59e0b" 
                            strokeWidth={3}
                            name="Tasks Completed"
                            dot={{ r: 5 }}
                            activeDot={{ r: 7 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-skills">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Skill Development</p>
                    <p className="text-sm text-muted-foreground">Track your skill growth over time</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <Card>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={skillProgressData}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="skill" stroke="#888" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#888" />
                        <Radar 
                          name="Current Level" 
                          dataKey="current" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.6}
                          strokeWidth={2}
                        />
                        <Radar 
                          name="Target Level" 
                          dataKey="target" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.3}
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="comparison" className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline py-4" data-testid="accordion-comparison">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-pink-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Semester Comparison</p>
                    <p className="text-sm text-muted-foreground">Compare performance across semesters</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 pb-6">
                <Card>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={semesterComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                        <XAxis dataKey="semester" stroke="#888" />
                        <YAxis yAxisId="left" stroke="#888" />
                        <YAxis yAxisId="right" orientation="right" stroke="#888" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="gpa" fill="#3b82f6" name="GPA" radius={[8, 8, 0, 0]} />
                        <Bar yAxisId="right" dataKey="activities" fill="#10b981" name="Activities" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}

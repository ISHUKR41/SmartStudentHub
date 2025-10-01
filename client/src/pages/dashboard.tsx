import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  Activity
} from 'lucide-react';
import CountUp from 'react-countup';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const attendanceData = [
  { month: 'Jan', attendance: 92 },
  { month: 'Feb', attendance: 88 },
  { month: 'Mar', attendance: 95 },
  { month: 'Apr', attendance: 90 },
  { month: 'May', attendance: 94 },
  { month: 'Jun', attendance: 96 },
];

const performanceData = [
  { subject: 'Mathematics', score: 85 },
  { subject: 'Physics', score: 78 },
  { subject: 'Chemistry', score: 92 },
  { subject: 'English', score: 88 },
  { subject: 'Computer Sci', score: 95 },
];

const activityData = [
  { name: 'Completed', value: 45, color: '#10b981' },
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Upcoming', value: 10, color: '#3b82f6' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="dashboard-title">
              Welcome back, {user?.firstName || 'Student'}! 👋
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Here's what's happening with your academic journey today
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-attendance">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Attendance
                    </CardTitle>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={92} duration={2} suffix="%" />
                  </div>
                  <Progress value={92} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-2">+3% from last month</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-assignments">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Assignments
                    </CardTitle>
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={8} duration={2} />
                    <span className="text-base text-muted-foreground ml-1">/ 12</span>
                  </div>
                  <Progress value={66} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-2">4 pending submissions</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-activities">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Activities
                    </CardTitle>
                    <Activity className="h-5 w-5 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={45} duration={2} />
                  </div>
                  <Progress value={75} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-2">15 pending approvals</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-gpa">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Current GPA
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={3.8} decimals={1} duration={2} />
                    <span className="text-base text-muted-foreground ml-1">/ 4.0</span>
                  </div>
                  <Progress value={95} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-2">Top 10% in class</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card data-testid="card-attendance-trend">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Attendance Trend
                </CardTitle>
                <CardDescription>Your attendance over the last 6 months</CardDescription>
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
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="attendance" stroke="#10b981" fillOpacity={1} fill="url(#colorAttendance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card data-testid="card-performance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Subject Performance
                </CardTitle>
                <CardDescription>Your current semester scores</CardDescription>
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
                    { time: '09:00 AM', subject: 'Advanced Mathematics', room: 'Room 301', status: 'In 30 min' },
                    { time: '11:00 AM', subject: 'Physics Lab', room: 'Lab B-2', status: 'In 2 hours' },
                    { time: '02:00 PM', subject: 'Computer Science', room: 'Room 405', status: 'In 5 hours' },
                    { time: '04:00 PM', subject: 'English Literature', room: 'Room 201', status: 'In 7 hours' },
                  ].map((class_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      data-testid={`class-item-${index}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/10">
                          <Clock className="h-5 w-5 text-primary mb-1" />
                          <span className="text-xs font-semibold">{class_.time}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{class_.subject}</h4>
                          <p className="text-sm text-muted-foreground">{class_.room}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-primary">{class_.status}</span>
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
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-semibold">{item.value}</span>
                    </div>
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

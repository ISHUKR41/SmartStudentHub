import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, Download, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';

const monthlyData = [
  { month: 'Jan', present: 18, absent: 2, total: 20 },
  { month: 'Feb', present: 17, absent: 1, total: 18 },
  { month: 'Mar', present: 21, absent: 1, total: 22 },
  { month: 'Apr', present: 19, absent: 2, total: 21 },
  { month: 'May', present: 20, absent: 1, total: 21 },
  { month: 'Jun', present: 22, absent: 0, total: 22 },
];

const subjectAttendance = [
  { subject: 'Mathematics', percentage: 95, present: 19, absent: 1 },
  { subject: 'Physics', percentage: 88, present: 22, absent: 3 },
  { subject: 'Chemistry', percentage: 92, present: 23, absent: 2 },
  { subject: 'Computer Sci', percentage: 96, present: 24, absent: 1 },
  { subject: 'English', percentage: 90, present: 18, absent: 2 },
];

const attendanceHistory = [
  { id: 1, date: '2024-10-01', subject: 'Mathematics', status: 'Present', time: '09:00 AM' },
  { id: 2, date: '2024-10-01', subject: 'Physics', status: 'Present', time: '11:00 AM' },
  { id: 3, date: '2024-10-01', subject: 'Computer Sci', status: 'Present', time: '02:00 PM' },
  { id: 4, date: '2024-09-30', subject: 'Chemistry', status: 'Absent', time: '10:00 AM' },
  { id: 5, date: '2024-09-30', subject: 'English', status: 'Present', time: '03:00 PM' },
  { id: 6, date: '2024-09-29', subject: 'Mathematics', status: 'Present', time: '09:00 AM' },
];

export default function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState('All Time');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');

  const overallAttendance = 92;
  const totalPresent = 123;
  const totalAbsent = 11;
  const totalClasses = totalPresent + totalAbsent;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="attendance-title">
                Attendance Tracker 📊
              </h1>
              <p className="text-muted-foreground">Monitor your class attendance and performance</p>
            </div>
            <Button className="gap-2" data-testid="button-download-report">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-overall">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Overall Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-green-600">
                    <CountUp end={overallAttendance} duration={2} suffix="%" />
                  </div>
                  <Progress value={overallAttendance} className="mt-3" />
                  <p className="text-xs text-muted-foreground mt-2">Target: 75%</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-present">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Classes Present
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground">
                    <CountUp end={totalPresent} duration={2} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Out of {totalClasses} classes</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-absent">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    Classes Absent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground">
                    <CountUp end={totalAbsent} duration={2} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Remaining allowance: 4</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-trend">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-foreground">
                    <CountUp end={96} duration={2} suffix="%" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">+4% from last month</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card data-testid="card-monthly-trend">
              <CardHeader>
                <CardTitle>Monthly Attendance Trend</CardTitle>
                <CardDescription>Your attendance pattern over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="present" stroke="#10b981" fillOpacity={1} fill="url(#colorPresent)" name="Present" />
                    <Area type="monotone" dataKey="absent" stroke="#ef4444" fillOpacity={1} fill="url(#colorAbsent)" name="Absent" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card data-testid="card-subject-wise">
              <CardHeader>
                <CardTitle>Subject-wise Attendance</CardTitle>
                <CardDescription>Attendance percentage by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectAttendance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" angle={-15} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card data-testid="card-history">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Attendance History</CardTitle>
                  <CardDescription>Recent attendance records</CardDescription>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[150px]" data-testid="select-month">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Time">All Time</SelectItem>
                      <SelectItem value="This Month">This Month</SelectItem>
                      <SelectItem value="Last Month">Last Month</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-[150px]" data-testid="select-subject">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Subjects">All Subjects</SelectItem>
                      {subjectAttendance.map(s => (
                        <SelectItem key={s.subject} value={s.subject}>{s.subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attendanceHistory.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    data-testid={`record-${index}`}
                  >
                    <div className="flex items-center gap-4">
                      {record.status === 'Present' ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                      <div>
                        <h4 className="font-semibold text-foreground">{record.subject}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {record.date}
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {record.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`font-semibold ${record.status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                      {record.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

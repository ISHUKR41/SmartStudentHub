import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp, Download, Filter, QrCode, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from 'react-countup';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Attendance, Subject } from '@shared/schema';

export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState('All Time');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [qrSubjectId, setQrSubjectId] = useState('');
  const [qrExpiresAt, setQrExpiresAt] = useState<Date | null>(null);
  const { toast } = useToast();

  const { data: attendanceRecords = [], isLoading: recordsLoading } = useQuery<Attendance[]>({
    queryKey: ['/api/students/attendance'],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    overallPercentage: number;
    totalClasses: number;
    attendedClasses: number;
    missedClasses: number;
    subjectWise: { subject: any; percentage: number; attended: number; total: number }[];
  }>({
    queryKey: ['/api/students/attendance/stats'],
  });

  const { data: trends, isLoading: trendsLoading } = useQuery<{
    weeklyTrends: { week: string; attendance: number; target: number }[];
    monthlyTrends: { month: string; attendance: number }[];
  }>({
    queryKey: ['/api/students/attendance/trends'],
    enabled: true,
  });

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
  });

  const createQRMutation = useMutation({
    mutationFn: async (subjectId: string) => {
      const response = await apiRequest('/api/attendance/qr/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjectId }),
      });
      return response;
    },
    onSuccess: (data) => {
      setQrCodeData(data.token);
      setQrExpiresAt(new Date(data.expiresAt));
      setQrDialogOpen(true);
      
      toast({
        title: "QR Code Generated",
        description: "Students can now scan this QR code to mark their attendance.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateQRCode = () => {
    if (!qrSubjectId) {
      toast({
        title: "Select a Subject",
        description: "Please select a subject to generate QR code for attendance.",
        variant: "destructive",
      });
      return;
    }
    
    createQRMutation.mutate(qrSubjectId);
  };

  const handleDownloadReport = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      toast({
        title: "No Data",
        description: "No attendance records available to download.",
        variant: "destructive",
      });
      return;
    }

    const csvContent = convertAttendanceToCSV(attendanceRecords);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report Downloaded",
      description: "Your attendance report has been downloaded as CSV.",
    });
  };

  const convertAttendanceToCSV = (data: Attendance[]): string => {
    const headers = ['Date', 'Subject', 'Status', 'Remarks', 'Marked At'];
    const rows = data.map(record => {
      const subject = subjects.find(s => s.id === record.subjectId);
      return [
        record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString() : 'N/A',
        subject ? `${subject.name} (${subject.code})` : record.subjectId || 'N/A',
        record.status || 'N/A',
        record.remarks || '',
        record.markedAt ? new Date(record.markedAt).toLocaleString() : 'N/A',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csvContent;
  };

  const processMonthlyData = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return [];
    }

    const monthlyMap = new Map<string, { present: number; absent: number; total: number }>();
    
    attendanceRecords.forEach(record => {
      if (!record.attendanceDate) return;
      
      const date = new Date(record.attendanceDate);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { present: 0, absent: 0, total: 0 });
      }
      
      const monthData = monthlyMap.get(monthKey)!;
      monthData.total++;
      
      if (record.status === 'present') {
        monthData.present++;
      } else if (record.status === 'absent') {
        monthData.absent++;
      }
    });

    return Array.from(monthlyMap.entries()).map(([month, data]) => ({
      month,
      ...data,
    }));
  };

  const processSubjectWiseData = () => {
    if (!attendanceRecords || attendanceRecords.length === 0) {
      return [];
    }

    const subjectMap = new Map<string, { present: number; absent: number; total: number }>();
    
    attendanceRecords.forEach(record => {
      const subjectId = record.subjectId || 'Unknown';
      
      if (!subjectMap.has(subjectId)) {
        subjectMap.set(subjectId, { present: 0, absent: 0, total: 0 });
      }
      
      const subjectData = subjectMap.get(subjectId)!;
      subjectData.total++;
      
      if (record.status === 'present') {
        subjectData.present++;
      } else if (record.status === 'absent') {
        subjectData.absent++;
      }
    });

    return Array.from(subjectMap.entries()).map(([subjectId, data]) => {
      const subject = subjects.find(s => s.id === subjectId);
      const subjectName = subject ? subject.name : subjectId;
      
      return {
        subject: subjectName.substring(0, 20),
        percentage: data.total > 0 ? Math.round((data.present / data.total) * 100) : 0,
        present: data.present,
        absent: data.absent,
      };
    });
  };

  const filterAttendanceHistory = () => {
    let filtered = [...attendanceRecords];

    if (selectedSubject !== 'All Subjects') {
      filtered = filtered.filter(r => r.subjectId === selectedSubject);
    }

    if (selectedMonth === 'This Month') {
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(r => r.attendanceDate && new Date(r.attendanceDate) >= thisMonthStart);
    } else if (selectedMonth === 'Last Month') {
      const now = new Date();
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      filtered = filtered.filter(r => {
        if (!r.attendanceDate) return false;
        const date = new Date(r.attendanceDate);
        return date >= lastMonthStart && date <= lastMonthEnd;
      });
    }

    return filtered.slice(0, 6);
  };

  const monthlyData = processMonthlyData();
  const subjectAttendance = processSubjectWiseData();
  const attendanceHistory = filterAttendanceHistory();

  const overallAttendance = stats?.overallPercentage || 0;
  const totalPresent = stats?.attendedClasses || 0;
  const totalAbsent = stats?.missedClasses || 0;
  const totalClasses = stats?.totalClasses || 0;

  const thisMonthPercentage = monthlyData.length > 0 
    ? Math.round((monthlyData[monthlyData.length - 1].present / monthlyData[monthlyData.length - 1].total) * 100)
    : 0;

  const isLoading = recordsLoading || statsLoading || trendsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading attendance data...</p>
        </div>
      </div>
    );
  }

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
            <div className="flex gap-2">
              <Button onClick={handleGenerateQRCode} className="gap-2" variant="outline" data-testid="button-generate-qr">
                <QrCode className="h-4 w-4" />
                Mark Attendance with QR
              </Button>
              <Button onClick={handleDownloadReport} className="gap-2" data-testid="button-download-report">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            </div>
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
                    <CountUp end={Math.round(overallAttendance)} duration={2} suffix="%" />
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
                  <p className="text-xs text-muted-foreground mt-2">
                    Remaining allowance: {Math.max(0, Math.ceil(totalClasses * 0.25) - totalAbsent)}
                  </p>
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
                    <CountUp end={thisMonthPercentage} duration={2} suffix="%" />
                  </div>
                  <p className="text-xs text-green-600 mt-2">
                    {thisMonthPercentage >= overallAttendance ? '+' : ''}{Math.round(thisMonthPercentage - overallAttendance)}% from overall
                  </p>
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
                {monthlyData.length > 0 ? (
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
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No attendance data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card data-testid="card-subject-wise">
              <CardHeader>
                <CardTitle>Subject-wise Attendance</CardTitle>
                <CardDescription>Attendance percentage by subject</CardDescription>
              </CardHeader>
              <CardContent>
                {subjectAttendance.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectAttendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" angle={-15} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="percentage" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No subject data available
                  </div>
                )}
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
              {attendanceHistory.length > 0 ? (
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
                        {record.status === 'present' ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {subjects.find(s => s.id === record.subjectId)?.name || record.subjectId || 'Unknown Subject'}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {record.attendanceDate ? new Date(record.attendanceDate).toLocaleDateString() : 'N/A'}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {record.markedAt ? new Date(record.markedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`font-semibold capitalize ${record.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                        {record.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance records found
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-qr">
          <DialogHeader>
            <DialogTitle>Attendance QR Code</DialogTitle>
            <DialogDescription>
              {qrCodeData ? "Students can scan this QR code to mark their attendance." : "Select a subject to generate QR code for attendance."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            {!qrCodeData ? (
              <>
                <div className="w-full space-y-2">
                  <label className="text-sm font-medium">Select Subject</label>
                  <Select value={qrSubjectId} onValueChange={setQrSubjectId}>
                    <SelectTrigger data-testid="select-qr-subject">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={handleGenerateQRCode} 
                  disabled={createQRMutation.isPending || !qrSubjectId}
                  className="w-full"
                  data-testid="button-generate-qr-submit"
                >
                  {createQRMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg">
                  <QRCodeSVG
                    value={qrCodeData}
                    size={256}
                    level="H"
                    includeMargin={true}
                    data-testid="qr-code"
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">
                    Valid until {qrExpiresAt ? new Date(qrExpiresAt).toLocaleTimeString() : 'session ends'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    QR code will expire in 10 minutes
                  </p>
                </div>
                <Button 
                  onClick={() => {
                    setQrCodeData('');
                    setQrSubjectId('');
                    setQrExpiresAt(null);
                  }}
                  variant="outline"
                  className="w-full"
                  data-testid="button-generate-new-qr"
                >
                  Generate New QR Code
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, BookOpen, TrendingUp, Download, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import CountUp from 'react-countup';

const exams = [
  {
    id: 1,
    title: 'Mid-Term Examination',
    subject: 'Data Structures',
    date: '2024-10-15',
    time: '10:00 AM - 01:00 PM',
    duration: '3 hours',
    room: 'Hall A',
    type: 'Theory',
    marks: 100,
    syllabus: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees'],
    status: 'upcoming',
    daysLeft: 13,
  },
  {
    id: 2,
    title: 'Unit Test 2',
    subject: 'Calculus',
    date: '2024-10-08',
    time: '02:00 PM - 03:30 PM',
    duration: '1.5 hours',
    room: 'Room 301',
    type: 'Theory',
    marks: 50,
    syllabus: ['Differential Equations', 'Integration', 'Limits'],
    status: 'upcoming',
    daysLeft: 6,
  },
  {
    id: 3,
    title: 'Lab Practical',
    subject: 'Physics',
    date: '2024-09-28',
    time: '09:00 AM - 12:00 PM',
    duration: '3 hours',
    room: 'Lab B-2',
    type: 'Practical',
    marks: 75,
    result: 68,
    status: 'completed',
  },
  {
    id: 4,
    title: 'Semester Final',
    subject: 'Chemistry',
    date: '2024-09-20',
    time: '10:00 AM - 01:00 PM',
    duration: '3 hours',
    room: 'Hall C',
    type: 'Theory',
    marks: 100,
    result: 85,
    status: 'completed',
  },
];

const examStats = [
  { month: 'Jan', score: 78 },
  { month: 'Feb', score: 82 },
  { month: 'Mar', score: 85 },
  { month: 'Apr', score: 88 },
  { month: 'May', score: 90 },
  { month: 'Jun', score: 87 },
];

export default function Exams() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingExams = exams.filter(e => e.status === 'upcoming');
  const completedExams = exams.filter(e => e.status === 'completed');
  const averageScore = completedExams.reduce((acc, e) => acc + (e.result || 0), 0) / completedExams.length;

  const filteredExams = activeTab === 'upcoming' ? upcomingExams : completedExams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="exams-title">
              Exams & Tests 📋
            </h1>
            <p className="text-muted-foreground">Track your examination schedule and results</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-upcoming">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Upcoming</span>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={upcomingExams.length} duration={1.5} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Exams scheduled</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-completed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Completed</span>
                    <FileText className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={completedExams.length} duration={1.5} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Results available</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-average">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Average Score</span>
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={averageScore} decimals={1} duration={2} suffix="%" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Overall performance</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-next">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Next Exam</span>
                    <Calendar className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={upcomingExams[0]?.daysLeft || 0} duration={2} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Days remaining</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6" data-testid="tabs-list">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredExams.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow" data-testid={`exam-card-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-foreground mb-1">{exam.title}</h3>
                              <p className="text-sm text-muted-foreground">{exam.subject}</p>
                            </div>
                            <Badge variant={exam.type === 'Theory' ? 'default' : 'secondary'}>
                              {exam.type}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{exam.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{exam.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              <span>{exam.room}</span>
                            </div>
                          </div>

                          {exam.status === 'upcoming' && exam.syllabus && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-2">Syllabus:</p>
                              <div className="flex flex-wrap gap-2">
                                {exam.syllabus.map((topic, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {exam.status === 'upcoming' && exam.daysLeft !== undefined && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-600">
                                {exam.daysLeft} days remaining - Start preparing!
                              </span>
                            </div>
                          )}

                          {exam.status === 'completed' && exam.result !== undefined && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Your Score</span>
                                <span className="text-sm font-bold">{exam.result}/{exam.marks}</span>
                              </div>
                              <Progress value={(exam.result / exam.marks) * 100} />
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                          {exam.status === 'upcoming' && (
                            <>
                              <Button className="gap-2 flex-1 lg:flex-initial" data-testid={`button-syllabus-${index}`}>
                                <Download className="h-4 w-4" />
                                Syllabus
                              </Button>
                              <Button variant="outline" className="gap-2 flex-1 lg:flex-initial" data-testid={`button-prep-${index}`}>
                                <BookOpen className="h-4 w-4" />
                                Prepare
                              </Button>
                            </>
                          )}
                          {exam.status === 'completed' && (
                            <>
                              <Button className="gap-2 flex-1 lg:flex-initial" data-testid={`button-answer-${index}`}>
                                <Download className="h-4 w-4" />
                                Answer Key
                              </Button>
                              <Button variant="outline" className="gap-2 flex-1 lg:flex-initial" data-testid={`button-analysis-${index}`}>
                                <TrendingUp className="h-4 w-4" />
                                Analysis
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredExams.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Exams Found</h3>
                    <p className="text-muted-foreground text-center">
                      You don't have any {activeTab} exams
                    </p>
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

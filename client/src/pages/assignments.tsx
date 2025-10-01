import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, Upload, Download, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountUp from 'react-countup';

const assignments = [
  {
    id: 1,
    title: 'Data Structures Assignment 3',
    subject: 'Computer Science',
    dueDate: '2024-10-05',
    timeLeft: '3 days',
    status: 'pending',
    marks: 100,
    description: 'Implement binary search tree with insert, delete, and search operations',
    submittedOn: null,
  },
  {
    id: 2,
    title: 'Calculus Problem Set 5',
    subject: 'Mathematics',
    dueDate: '2024-10-07',
    timeLeft: '5 days',
    status: 'pending',
    marks: 50,
    description: 'Solve differential equations and integration problems',
    submittedOn: null,
  },
  {
    id: 3,
    title: 'Newton\'s Laws Lab Report',
    subject: 'Physics',
    dueDate: '2024-09-28',
    timeLeft: 'Overdue',
    status: 'overdue',
    marks: 75,
    description: 'Complete lab report with observations and conclusions',
    submittedOn: null,
  },
  {
    id: 4,
    title: 'Chemical Bonding Essay',
    subject: 'Chemistry',
    dueDate: '2024-09-25',
    timeLeft: 'Submitted',
    status: 'submitted',
    marks: 60,
    score: 55,
    description: 'Write an essay on ionic and covalent bonding',
    submittedOn: '2024-09-24',
  },
  {
    id: 5,
    title: 'Shakespeare Analysis',
    subject: 'English',
    dueDate: '2024-09-20',
    timeLeft: 'Graded',
    status: 'graded',
    marks: 100,
    score: 88,
    description: 'Analyze themes in Hamlet',
    submittedOn: '2024-09-19',
  },
];

export default function Assignments() {
  const [activeTab, setActiveTab] = useState('all');

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const overdueCount = assignments.filter(a => a.status === 'overdue').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;

  const filteredAssignments = activeTab === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'submitted': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'graded': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'overdue': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded': return <CheckCircle className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="assignments-title">
              Assignments 📝
            </h1>
            <p className="text-muted-foreground">Track and manage your course assignments</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-pending">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Pending</span>
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={pendingCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-submitted">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                    <Upload className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={submittedCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-graded">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Graded</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={gradedCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-overdue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Overdue</span>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={overdueCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6" data-testid="tabs-list">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="graded">Graded</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow" data-testid={`assignment-card-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-foreground mb-1">{assignment.title}</h3>
                              <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                            </div>
                            <Badge className={getStatusColor(assignment.status)} variant="outline">
                              <span className="flex items-center gap-1">
                                {getStatusIcon(assignment.status)}
                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                              </span>
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {assignment.dueDate}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{assignment.timeLeft}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>Max Marks: {assignment.marks}</span>
                            </div>
                          </div>

                          {assignment.status === 'graded' && assignment.score !== undefined && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Score</span>
                                <span className="text-sm font-bold">{assignment.score}/{assignment.marks}</span>
                              </div>
                              <Progress value={(assignment.score / assignment.marks) * 100} />
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                          {assignment.status === 'pending' && (
                            <Button className="gap-2 flex-1 lg:flex-initial" data-testid={`button-submit-${index}`}>
                              <Upload className="h-4 w-4" />
                              Submit
                            </Button>
                          )}
                          {assignment.status === 'submitted' && (
                            <Button variant="outline" className="gap-2 flex-1 lg:flex-initial" data-testid={`button-view-${index}`}>
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                          )}
                          {assignment.status === 'graded' && (
                            <>
                              <Button variant="outline" className="gap-2 flex-1 lg:flex-initial" data-testid={`button-download-${index}`}>
                                <Download className="h-4 w-4" />
                                Download
                              </Button>
                              <Button variant="outline" className="gap-2 flex-1 lg:flex-initial" data-testid={`button-feedback-${index}`}>
                                <Eye className="h-4 w-4" />
                                Feedback
                              </Button>
                            </>
                          )}
                          {assignment.status === 'overdue' && (
                            <Button variant="destructive" className="gap-2 flex-1 lg:flex-initial" data-testid={`button-late-submit-${index}`}>
                              <Upload className="h-4 w-4" />
                              Late Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {filteredAssignments.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Assignments Found</h3>
                    <p className="text-muted-foreground text-center">
                      You don't have any {activeTab === 'all' ? '' : activeTab} assignments
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

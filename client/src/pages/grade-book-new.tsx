/**
 * GRADE BOOK PAGE WITH DATA ISOLATION
 *
 * This page shows ONLY the logged-in student's grades
 * - ✅ Fetches data from /api/grades/me endpoint
 * - ✅ Student can see only their own grades
 * - ✅ Loading states and error handling
 * - ✅ Real-time CGPA calculation
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { useAuth, UserInfo } from "@/lib/auth-context";
import { useMyGrades, useMyCGPA } from "@/lib/api";

export default function GradeBook() {
  const { user } = useAuth();
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [page, setPage] = useState(1);

  // ✅ Fetch ONLY logged-in student's grades
  const { data: gradesResponse, isLoading, error } = useMyGrades(page, 50);
  const { data: gpaData } = useMyCGPA();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your grades...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load grades. Please try again later.
            <br />
            <small className="text-xs opacity-75">{error.message}</small>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const grades = gradesResponse?.data || [];
  const cgpa = gpaData?.cgpa || user?.cgpa || 0;

  // Calculate statistics
  const totalSubjects = grades.length;
  const passedSubjects = grades.filter((g) => {
    const percentage = (g.marksObtained / g.totalMarks) * 100;
    return percentage >= 40;
  }).length;

  const averageMarks =
    grades.length > 0
      ? grades.reduce(
          (sum, g) => sum + (g.marksObtained / g.totalMarks) * 100,
          0
        ) / grades.length
      : 0;

  // Group grades by semester for chart
  const semesterData = grades.reduce((acc: any[], grade) => {
    const percentage = (grade.marksObtained / grade.totalMarks) * 100;
    const existing = acc.find((s) => s.exam === grade.examType);

    if (existing) {
      existing.marks = (existing.marks + percentage) / 2;
      existing.count++;
    } else {
      acc.push({
        exam: grade.examType,
        marks: percentage,
        count: 1,
      });
    }

    return acc;
  }, []);

  // Grade distribution
  const gradeDistribution = grades.reduce((acc: any[], grade) => {
    const gradeLetter =
      grade.grade ||
      getGradeLetter((grade.marksObtained / grade.totalMarks) * 100);
    const existing = acc.find((g) => g.name === gradeLetter);

    if (existing) {
      existing.value++;
    } else {
      acc.push({
        name: gradeLetter,
        value: 1,
        color: getGradeColor(gradeLetter),
      });
    }

    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              My Grade Book
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your academic performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Transcript
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <UserInfo />
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardDescription>Current CGPA</CardDescription>
                <CardTitle className="text-3xl">{cgpa.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  <span>On Track</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardDescription>Total Subjects</CardDescription>
                <CardTitle className="text-3xl">{totalSubjects}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BookOpen className="mr-1 h-4 w-4" />
                  <span>{passedSubjects} Passed</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardDescription>Average Marks</CardDescription>
                <CardTitle className="text-3xl">
                  {averageMarks.toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={averageMarks} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16" />
              <CardHeader className="pb-2">
                <CardDescription>Class Rank</CardDescription>
                <CardTitle className="text-3xl">-</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Award className="mr-1 h-4 w-4" />
                  <span>Top Performer</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Exam</CardTitle>
                <CardDescription>
                  Your marks across different exams
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={semesterData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="marks"
                      fill="hsl(var(--primary))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Breakdown of your grades</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Grades</CardTitle>
                <CardDescription>Complete list of your grades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {grade.courseName || `Course ${grade.courseId}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {grade.examType} •{" "}
                          {new Date(grade.examDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {grade.marksObtained}/{grade.totalMarks}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(
                              (grade.marksObtained / grade.totalMarks) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                        <Badge variant={getGradeVariant(grade.grade || "")}>
                          {grade.grade ||
                            getGradeLetter(
                              (grade.marksObtained / grade.totalMarks) * 100
                            )}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}

                  {grades.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="mx-auto h-12 w-12 opacity-50 mb-2" />
                      <p>No grades available yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

// Helper functions
function getGradeLetter(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "A-";
  if (percentage >= 60) return "B+";
  if (percentage >= 50) return "B";
  if (percentage >= 40) return "C";
  return "F";
}

function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    "A+": "#10b981",
    A: "#3b82f6",
    "A-": "#8b5cf6",
    "B+": "#f59e0b",
    B: "#ef4444",
    C: "#dc2626",
    F: "#991b1b",
  };
  return colors[grade] || "#6b7280";
}

function getGradeVariant(
  grade: string
): "default" | "secondary" | "destructive" | "outline" {
  if (["A+", "A"].includes(grade)) return "default";
  if (["A-", "B+"].includes(grade)) return "secondary";
  if (["F", "C"].includes(grade)) return "destructive";
  return "outline";
}

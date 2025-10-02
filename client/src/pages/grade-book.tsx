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
  PieChart as PieChartIcon,
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
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
} from "recharts";

const gradeData = [
  {
    subject: "Computer Science",
    grade: "A",
    marks: 92,
    total: 100,
    credits: 4,
  },
  { subject: "Mathematics", grade: "A-", marks: 88, total: 100, credits: 3 },
  { subject: "Physics", grade: "B+", marks: 82, total: 100, credits: 4 },
  { subject: "English", grade: "A", marks: 90, total: 100, credits: 2 },
  { subject: "Chemistry", grade: "A-", marks: 86, total: 100, credits: 3 },
  { subject: "Biology", grade: "B", marks: 78, total: 100, credits: 3 },
];

const semesterPerformance = [
  { semester: "Sem 1", gpa: 8.2, cgpa: 8.2 },
  { semester: "Sem 2", gpa: 8.5, cgpa: 8.35 },
  { semester: "Sem 3", gpa: 8.8, cgpa: 8.5 },
  { semester: "Sem 4", gpa: 8.6, cgpa: 8.53 },
  { semester: "Sem 5", gpa: 8.9, cgpa: 8.6 },
  { semester: "Sem 6", gpa: 9.0, cgpa: 8.7 },
];

const gradeDistribution = [
  { name: "A+", value: 3, color: "#10b981" },
  { name: "A", value: 5, color: "#3b82f6" },
  { name: "A-", value: 4, color: "#8b5cf6" },
  { name: "B+", value: 2, color: "#f59e0b" },
  { name: "B", value: 1, color: "#ef4444" },
];

export default function GradeBook() {
  const [selectedSemester, setSelectedSemester] = useState("current");

  const currentGPA = 8.9;
  const currentCGPA = 8.7;
  const totalCredits = 19;
  const rank = 12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Grade Book
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your academic performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current GPA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {currentGPA}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600">
                    +0.3 from last sem
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  CGPA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {currentCGPA}
                </div>
                <Progress value={currentCGPA * 10} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Credits Earned
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {totalCredits}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This semester
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Class Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  #{rank}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of 120 students
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Semester-wise Performance</CardTitle>
              <CardDescription>GPA and CGPA trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={semesterPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[7, 10]} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="gpa"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="GPA"
                  />
                  <Area
                    type="monotone"
                    dataKey="cgpa"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="CGPA"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Your grades across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
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
        </div>

        {/* Subject Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Current Semester Grades</CardTitle>
            <CardDescription>
              Detailed marks and grades for each subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {gradeData.map((subject, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {subject.subject}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-muted-foreground">
                          Marks: {subject.marks}/{subject.total}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Credits: {subject.credits}
                        </span>
                      </div>
                      <Progress
                        value={(subject.marks / subject.total) * 100}
                        className="mt-2 h-2"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {subject.grade}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Grade
                        </div>
                      </div>
                      <Badge
                        variant={
                          subject.marks >= 90
                            ? "default"
                            : subject.marks >= 80
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {((subject.marks / subject.total) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance Comparison</CardTitle>
            <CardDescription>
              Visual comparison of marks across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="subject"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="marks" fill="#3b82f6" name="Marks Obtained" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

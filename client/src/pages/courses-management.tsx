import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  Clock,
  Users,
  Award,
  TrendingUp,
  Calendar,
  FileText,
  Video,
  Download,
  Share2,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

// Mock course data
const mockCourses = [
  {
    id: 1,
    code: "CS101",
    name: "Introduction to Computer Science",
    instructor: "Dr. Sarah Johnson",
    credits: 4,
    semester: "Fall 2024",
    progress: 75,
    grade: "A",
    status: "In Progress",
    color: "#3b82f6",
    enrolled: 120,
    capacity: 150,
    assignments: 8,
    completedAssignments: 6,
    nextClass: "2024-10-05 10:00 AM",
    attendance: 92,
    category: "Core",
  },
  {
    id: 2,
    code: "MATH201",
    name: "Advanced Calculus",
    instructor: "Prof. Michael Chen",
    credits: 3,
    semester: "Fall 2024",
    progress: 60,
    grade: "B+",
    status: "In Progress",
    color: "#10b981",
    enrolled: 90,
    capacity: 100,
    assignments: 10,
    completedAssignments: 6,
    nextClass: "2024-10-05 2:00 PM",
    attendance: 88,
    category: "Core",
  },
  {
    id: 3,
    code: "PHY301",
    name: "Quantum Physics",
    instructor: "Dr. Emily Rodriguez",
    credits: 4,
    semester: "Fall 2024",
    progress: 45,
    grade: "A-",
    status: "In Progress",
    color: "#f59e0b",
    enrolled: 60,
    capacity: 80,
    assignments: 6,
    completedAssignments: 3,
    nextClass: "2024-10-06 11:00 AM",
    attendance: 95,
    category: "Elective",
  },
  {
    id: 4,
    code: "ENG102",
    name: "Technical Writing",
    instructor: "Prof. David Williams",
    credits: 2,
    semester: "Fall 2024",
    progress: 80,
    grade: "A",
    status: "In Progress",
    color: "#8b5cf6",
    enrolled: 45,
    capacity: 50,
    assignments: 5,
    completedAssignments: 4,
    nextClass: "2024-10-05 3:00 PM",
    attendance: 100,
    category: "General",
  },
  {
    id: 5,
    code: "BIO201",
    name: "Molecular Biology",
    instructor: "Dr. Lisa Anderson",
    credits: 4,
    semester: "Fall 2024",
    progress: 55,
    grade: "B",
    status: "In Progress",
    color: "#ec4899",
    enrolled: 75,
    capacity: 90,
    assignments: 7,
    completedAssignments: 4,
    nextClass: "2024-10-06 9:00 AM",
    attendance: 85,
    category: "Elective",
  },
  {
    id: 6,
    code: "CHEM101",
    name: "General Chemistry",
    instructor: "Prof. Robert Taylor",
    credits: 3,
    semester: "Fall 2024",
    progress: 70,
    grade: "A-",
    status: "In Progress",
    color: "#14b8a6",
    enrolled: 110,
    capacity: 120,
    assignments: 9,
    completedAssignments: 6,
    nextClass: "2024-10-05 1:00 PM",
    attendance: 90,
    category: "Core",
  },
];

// Performance data for charts
const performanceData = [
  { subject: "CS", marks: 85 },
  { subject: "Math", marks: 78 },
  { subject: "Physics", marks: 82 },
  { subject: "English", marks: 90 },
  { subject: "Biology", marks: 75 },
  { subject: "Chemistry", marks: 88 },
];

const attendanceData = [
  { name: "CS101", attendance: 92 },
  { name: "MATH201", attendance: 88 },
  { name: "PHY301", attendance: 95 },
  { name: "ENG102", attendance: 100 },
  { name: "BIO201", attendance: 85 },
  { name: "CHEM101", attendance: 90 },
];

const creditDistribution = [
  { name: "Core", value: 11, color: "#3b82f6" },
  { name: "Elective", value: 8, color: "#10b981" },
  { name: "General", value: 2, color: "#f59e0b" },
];

export default function CoursesManagement() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<
    (typeof mockCourses)[0] | null
  >(null);

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const totalCredits = mockCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );
  const avgProgress =
    mockCourses.reduce((sum, course) => sum + course.progress, 0) /
    mockCourses.length;
  const avgAttendance =
    mockCourses.reduce((sum, course) => sum + course.attendance, 0) /
    mockCourses.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Courses Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and track all your enrolled courses
            </p>
          </div>
          <Button className="w-full md:w-auto shadow-lg hover:shadow-xl transition-all">
            <Plus className="w-4 h-4 mr-2" />
            Enroll New Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Courses
                  </CardTitle>
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {mockCourses.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enrolled this semester
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Credits
                  </CardTitle>
                  <Award className="w-5 h-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {totalCredits}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Credit hours
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-l-4 border-l-orange-500 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Progress
                  </CardTitle>
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {avgProgress.toFixed(0)}%
                </div>
                <Progress value={avgProgress} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Attendance
                  </CardTitle>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {avgAttendance.toFixed(0)}%
                </div>
                <Progress value={avgAttendance} className="mt-2 h-2" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>
                  Your performance across subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={performanceData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "hsl(var(--foreground))" }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: "hsl(var(--foreground))" }}
                    />
                    <Radar
                      name="Marks"
                      dataKey="marks"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Credit Distribution Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Credit Distribution</CardTitle>
                <CardDescription>
                  Distribution of credits by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={creditDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {creditDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Attendance Analytics</CardTitle>
                <CardDescription>
                  Your attendance across all courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "hsl(var(--foreground))" }}
                    />
                    <YAxis tick={{ fill: "hsl(var(--foreground))" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ color: "hsl(var(--foreground))" }}
                    />
                    <Bar
                      dataKey="attendance"
                      fill="#10b981"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search courses by name, code, or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Core">Core</SelectItem>
                  <SelectItem value="Elective">Elective</SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid/List */}
        <motion.div
          layout
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className="shadow-lg hover:shadow-xl transition-all cursor-pointer border-t-4"
                style={{ borderTopColor: course.color }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.code}</CardTitle>
                      <CardDescription className="mt-1">
                        {course.name}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        course.status === "In Progress"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{course.instructor}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {course.credits}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Credits
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {course.grade}
                      </div>
                      <div className="text-xs text-muted-foreground">Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {course.attendance}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Attendance
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="hidden sm:inline">Next:</span>
                      <span className="text-xs">
                        {course.nextClass.split(" ")[0]}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

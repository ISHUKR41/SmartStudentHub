import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Filter,
  Download,
  Upload,
  BookOpen,
  MapPin,
  Users,
  Bell,
  ChevronRight,
  Grid3x3,
  List,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { enUS } from "date-fns/locale";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Mock timetable data
const events = [
  {
    id: 1,
    title: "Computer Science - CS101",
    start: new Date(2024, 9, 7, 9, 0),
    end: new Date(2024, 9, 7, 10, 30),
    instructor: "Dr. Sarah Johnson",
    room: "Room 301",
    type: "Lecture",
    color: "#3b82f6",
  },
  {
    id: 2,
    title: "Advanced Calculus - MATH201",
    start: new Date(2024, 9, 7, 14, 0),
    end: new Date(2024, 9, 7, 15, 30),
    instructor: "Prof. Michael Chen",
    room: "Room 205",
    type: "Lecture",
    color: "#10b981",
  },
  {
    id: 3,
    title: "Quantum Physics - PHY301",
    start: new Date(2024, 9, 8, 11, 0),
    end: new Date(2024, 9, 8, 12, 30),
    instructor: "Dr. Emily Rodriguez",
    room: "Lab 102",
    type: "Lab",
    color: "#f59e0b",
  },
  {
    id: 4,
    title: "Technical Writing - ENG102",
    start: new Date(2024, 9, 7, 15, 0),
    end: new Date(2024, 9, 7, 16, 0),
    instructor: "Prof. David Williams",
    room: "Room 401",
    type: "Tutorial",
    color: "#8b5cf6",
  },
];

const weeklyStats = [
  { day: "Mon", classes: 4, hours: 5 },
  { day: "Tue", classes: 3, hours: 4 },
  { day: "Wed", classes: 5, hours: 6 },
  { day: "Thu", classes: 3, hours: 4 },
  { day: "Fri", classes: 4, hours: 5 },
  { day: "Sat", classes: 2, hours: 2 },
];

export default function TimetableViewer() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const todayClasses = events.filter((event) => {
    const today = new Date();
    return event.start.getDate() === today.getDate();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Timetable Viewer
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage your class schedule
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">21</div>
                <p className="text-xs text-muted-foreground mt-1">This week</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Today's Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {todayClasses.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled for today
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Weekly Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">26</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact hours
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Free Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Available this week
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Stats Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule Overview</CardTitle>
            <CardDescription>Classes and hours distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="classes" fill="#3b82f6" name="Classes" />
                <Bar dataKey="hours" fill="#10b981" name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* View Toggle */}
        <div className="flex justify-end gap-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>

        {/* Calendar/List View */}
        {view === "calendar" ? (
          <Card className="p-4">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={(event) => setSelectedEvent(event)}
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.color,
                  borderRadius: "5px",
                  opacity: 0.8,
                  color: "white",
                  border: "0px",
                  display: "block",
                },
              })}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="hover:shadow-lg transition-all"
                  style={{ borderLeft: `4px solid ${event.color}` }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {format(event.start, "HH:mm")} -{" "}
                            {format(event.end, "HH:mm")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.instructor}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.room}
                          </div>
                        </div>
                      </div>
                      <Badge>{event.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

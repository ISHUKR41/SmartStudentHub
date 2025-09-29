/**
 * Comprehensive Charts Library
 * 
 * Advanced chart components using recharts with responsive design,
 * professional styling, and comprehensive analytics visualization.
 * Features 12+ chart types for academic dashboard analytics.
 */

import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip,
  RadialBarChart, RadialBar, ScatterChart, Scatter, ComposedChart,
  FunnelChart, Funnel, ReferenceLine, ReferenceArea, Brush
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Professional color palette for academic charts
const CHART_COLORS = {
  primary: ['hsl(var(--primary))', 'hsl(var(--primary-500))', 'hsl(var(--primary-600))'],
  success: ['hsl(var(--success))', 'hsl(var(--success-100))', 'hsl(var(--success-200))'],
  warning: ['hsl(var(--warning))', 'hsl(var(--warning-100))', 'hsl(var(--warning-200))'],
  info: ['hsl(var(--info))', 'hsl(var(--info-100))', 'hsl(var(--info-200))'],
  accent: ['hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--secondary))'],
  gradient: [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff7f', 
    '#ff69b4', '#87ceeb', '#dda0dd', '#98fb98', '#f0e68c'
  ]
};

interface ChartWrapperProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactElement;
  height?: number;
}

const ChartWrapper = ({ title, description, className, children, height = 300 }: ChartWrapperProps) => (
  <Card className={cn("w-full", className)} data-testid={`chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-base sm:text-lg font-semibold">{title}</CardTitle>
      {description && <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>}
    </CardHeader>
    <CardContent className="pt-2">
      <div className="w-full" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

// 1. GPA Trend Line Chart
interface GPATrendData {
  semester: string;
  gpa: number;
  target: number;
  credits: number;
}

export const GPATrendChart = ({ 
  data, 
  className 
}: { 
  data: GPATrendData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="GPA Trend Analysis" 
      description="Academic performance tracking across semesters"
      className={className}
      height={350}
    >
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="semester" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          domain={[0, 4]} 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="gpa" 
          stroke={CHART_COLORS.primary[0]} 
          strokeWidth={3}
          name="Actual GPA"
          dot={{ fill: CHART_COLORS.primary[0], strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="target" 
          stroke={CHART_COLORS.success[0]} 
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Target GPA"
        />
        <ReferenceLine y={3.5} stroke={CHART_COLORS.warning[0]} strokeDasharray="2 2" />
      </LineChart>
    </ChartWrapper>
  );
};

// 2. Credits Over Semesters Area Chart
interface CreditsData {
  semester: string;
  earnedCredits: number;
  totalCredits: number;
  cumulativeCredits: number;
}

export const CreditsProgressChart = ({ 
  data, 
  className 
}: { 
  data: CreditsData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="Credit Progression" 
      description="Credit accumulation and semester-wise progress"
      className={className}
      height={350}
    >
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
          dataKey="cumulativeCredits"
          fill={CHART_COLORS.primary[1]}
          stroke={CHART_COLORS.primary[0]}
          name="Cumulative Credits"
        />
        <Bar 
          dataKey="earnedCredits" 
          fill={CHART_COLORS.success[0]}
          name="Semester Credits"
          opacity={0.7}
        />
      </ComposedChart>
    </ChartWrapper>
  );
};

// 3. Attendance by Subject Stacked Bar Chart
interface AttendanceSubjectData {
  subject: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
}

export const AttendanceBySubjectChart = ({ 
  data, 
  className 
}: { 
  data: AttendanceSubjectData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="Subject-wise Attendance" 
      description="Attendance breakdown across all subjects"
      className={className}
      height={400}
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="subject" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="present" stackId="a" fill={CHART_COLORS.success[0]} name="Present" />
        <Bar dataKey="late" stackId="a" fill={CHART_COLORS.warning[0]} name="Late" />
        <Bar dataKey="excused" stackId="a" fill={CHART_COLORS.info[0]} name="Excused" />
        <Bar dataKey="absent" stackId="a" fill="hsl(var(--destructive))" name="Absent" />
      </BarChart>
    </ChartWrapper>
  );
};

// 4. Attendance Calendar Heatmap (using custom grid)
interface AttendanceDay {
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'holiday';
  percentage?: number;
}

export const AttendanceCalendarHeatmap = ({ 
  data, 
  month, 
  className 
}: { 
  data: AttendanceDay[]; 
  month: string;
  className?: string; 
}) => {
  const getStatusColor = (status: string, percentage?: number) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'absent': return 'bg-red-500';
      case 'late': return 'bg-yellow-500';
      case 'excused': return 'bg-blue-500';
      case 'holiday': return 'bg-gray-300';
      default: return 'bg-gray-100';
    }
  };

  return (
    <ChartWrapper 
      title={`Attendance Calendar - ${month}`} 
      description="Daily attendance visualization"
      className={className}
      height={200}
    >
      <div className="grid grid-cols-7 gap-1 p-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
            {day}
          </div>
        ))}
        {data.map((day, index) => (
          <div
            key={index}
            className={cn(
              'aspect-square rounded-sm transition-colors hover:scale-110 cursor-pointer',
              getStatusColor(day.status, day.percentage)
            )}
            title={`${day.date}: ${day.status}`}
            data-testid={`attendance-day-${day.date}`}
          />
        ))}
      </div>
    </ChartWrapper>
  );
};

// 5. Attendance Weekday Distribution
interface WeekdayData {
  day: string;
  attendance: number;
  classes: number;
}

export const AttendanceWeekdayChart = ({ 
  data, 
  className 
}: { 
  data: WeekdayData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="Weekday Attendance Pattern" 
      description="Attendance distribution across weekdays"
      className={className}
      height={300}
    >
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Bar 
          dataKey="attendance" 
          fill={CHART_COLORS.primary[0]}
          name="Attendance %"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartWrapper>
  );
};

// 6. Grade Distribution Box Plot (using scatter plot approximation)
interface GradeData {
  subject: string;
  grades: number[];
  median: number;
  q1: number;
  q3: number;
  average: number;
}

export const GradeDistributionChart = ({ 
  data, 
  className 
}: { 
  data: GradeData[]; 
  className?: string; 
}) => {
  // Transform data for scatter plot
  const scatterData = data.flatMap(subject => 
    subject.grades.map(grade => ({
      subject: subject.subject,
      grade: grade,
      median: subject.median,
      average: subject.average
    }))
  );

  return (
    <ChartWrapper 
      title="Grade Distribution Analysis" 
      description="Grade spread and performance metrics by subject"
      className={className}
      height={350}
    >
      <ScatterChart data={scatterData} margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="subject" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis 
          domain={[0, 100]} 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Scatter dataKey="grade" fill={CHART_COLORS.primary[0]} name="Grades" />
        <Scatter dataKey="average" fill={CHART_COLORS.success[0]} name="Average" />
      </ScatterChart>
    </ChartWrapper>
  );
};

// 7. Assignment Completion Timeline
interface AssignmentData {
  week: string;
  completed: number;
  pending: number;
  overdue: number;
}

export const AssignmentTimelineChart = ({ 
  data, 
  className 
}: { 
  data: AssignmentData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="Assignment Completion Timeline" 
      description="Weekly assignment progress tracking"
      className={className}
      height={300}
    >
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
          dataKey="completed"
          stackId="1"
          stroke={CHART_COLORS.success[0]}
          fill={CHART_COLORS.success[0]}
          name="Completed"
        />
        <Area
          type="monotone"
          dataKey="pending"
          stackId="1"
          stroke={CHART_COLORS.warning[0]}
          fill={CHART_COLORS.warning[0]}
          name="Pending"
        />
        <Area
          type="monotone"
          dataKey="overdue"
          stackId="1"
          stroke="hsl(var(--destructive))"
          fill="hsl(var(--destructive))"
          name="Overdue"
        />
      </AreaChart>
    </ChartWrapper>
  );
};

// 8. Category Distribution Pie/Donut Chart
interface CategoryData {
  category: string;
  value: number;
  color: string;
}

export const CategoryDistributionChart = ({ 
  data, 
  className,
  type = 'donut'
}: { 
  data: CategoryData[]; 
  className?: string;
  type?: 'pie' | 'donut';
}) => {
  return (
    <ChartWrapper 
      title="Activity Category Distribution" 
      description="Breakdown of activities by category"
      className={className}
      height={350}
    >
      <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={type === 'donut' ? 100 : 120}
          innerRadius={type === 'donut' ? 60 : 0}
          paddingAngle={2}
          label={({ category, value }) => `${category}: ${value}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || CHART_COLORS.gradient[index]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend />
      </PieChart>
    </ChartWrapper>
  );
};

// 9. Goals Progress Radial Chart
interface GoalData {
  goal: string;
  progress: number;
  target: number;
}

export const GoalsProgressChart = ({ 
  data, 
  className 
}: { 
  data: GoalData[]; 
  className?: string; 
}) => {
  const chartData = data.map(goal => ({
    ...goal,
    percentage: Math.round((goal.progress / goal.target) * 100)
  }));

  return (
    <ChartWrapper 
      title="Goals Progress" 
      description="Achievement progress towards set targets"
      className={className}
      height={350}
    >
      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={chartData}>
        <RadialBar
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          dataKey="percentage"
          fill={CHART_COLORS.primary[0]}
        />
        <Legend iconSize={10} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
      </RadialBarChart>
    </ChartWrapper>
  );
};

// 10. Achievements Timeline Scatter Plot
interface AchievementData {
  date: string;
  points: number;
  category: string;
  importance: number;
}

export const AchievementsTimelineChart = ({ 
  data, 
  className 
}: { 
  data: AchievementData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="Achievements Timeline" 
      description="Achievement points earned over time"
      className={className}
      height={350}
    >
      <ScatterChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis dataKey="points" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Scatter 
          dataKey="points" 
          fill={CHART_COLORS.primary[0]}
          name="Achievement Points"
        />
      </ScatterChart>
    </ChartWrapper>
  );
};

// 11. Rank vs Cohort Comparison
interface RankData {
  semester: string;
  myRank: number;
  totalStudents: number;
  percentile: number;
}

export const RankComparisonChart = ({ 
  data, 
  className 
}: { 
  data: RankData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="Academic Rank Progression" 
      description="Rank and percentile tracking across semesters"
      className={className}
      height={350}
    >
      <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis yAxisId="rank" orientation="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis yAxisId="percentile" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        <Legend />
        <Bar yAxisId="rank" dataKey="myRank" fill={CHART_COLORS.primary[0]} name="Class Rank" />
        <Line yAxisId="percentile" type="monotone" dataKey="percentile" stroke={CHART_COLORS.success[0]} name="Percentile" />
      </ComposedChart>
    </ChartWrapper>
  );
};

// 12. Alerts Volume Over Time
interface AlertData {
  month: string;
  alerts: number;
  resolved: number;
  pending: number;
}

export const AlertsVolumeChart = ({ 
  data, 
  className 
}: { 
  data: AlertData[]; 
  className?: string; 
}) => {
  return (
    <ChartWrapper 
      title="Alert Volume Trends" 
      description="Monthly alert generation and resolution"
      className={className}
      height={300}
    >
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
          dataKey="resolved"
          stackId="1"
          stroke={CHART_COLORS.success[0]}
          fill={CHART_COLORS.success[0]}
          name="Resolved"
        />
        <Area
          type="monotone"
          dataKey="pending"
          stackId="1"
          stroke={CHART_COLORS.warning[0]}
          fill={CHART_COLORS.warning[0]}
          name="Pending"
        />
      </AreaChart>
    </ChartWrapper>
  );
};

// 13. KPI Tiles with Sparklines
interface KPIData {
  title: string;
  value: string;
  change: number;
  sparklineData: number[];
  color: 'primary' | 'success' | 'warning' | 'info';
}

export const KPITilesWithSparklines = ({ 
  data, 
  className 
}: { 
  data: KPIData[]; 
  className?: string; 
}) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {data.map((kpi, index) => (
        <Card key={index} className="p-4" data-testid={`kpi-tile-${kpi.title.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-muted-foreground">{kpi.title}</h4>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              kpi.change >= 0 
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            )}>
              {kpi.change >= 0 ? '+' : ''}{kpi.change}%
            </span>
          </div>
          <div className="text-2xl font-bold mb-2">{kpi.value}</div>
          <div className="h-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={kpi.sparklineData.map((value, i) => ({ value, index: i }))}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={CHART_COLORS[kpi.color][0]} 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ))}
    </div>
  );
};
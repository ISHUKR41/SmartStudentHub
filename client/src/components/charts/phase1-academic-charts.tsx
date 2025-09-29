/**
 * Phase 1 - Core Academic Charts (Recharts)
 * 
 * Comprehensive academic performance visualization charts using Recharts.
 * Features 8 core chart types designed for Higher Education analytics with
 * NAAC/NIRF compliance and professional academic styling.
 * 
 * Charts:
 * 1. GPA trend by semester (Line chart with target band)
 * 2. Credits per semester (Bar chart with dual-axis GPA)
 * 3. Cumulative CGPA (Area chart) 
 * 4. Subject-wise GPA distribution (Horizontal Bar)
 * 5. GPA vs attendance correlation (Scatter plot)
 * 6. Skill radar chart (Radar)
 * 7. Skill growth radial bars (RadialBar)
 * 8. Achievement funnel (Funnel: submitted→approved)
 */

import { memo, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  RadialBarChart, RadialBar, FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  ReferenceLine, ReferenceArea, Cell, ComposedChart
} from 'recharts';
import { ChartCard, ChartExportOptions } from './chart-wrappers';
import { cn } from '@/lib/utils';

// Academic Color Palette for Higher Education
export const ACADEMIC_COLORS = {
  primary: '#2563eb',      // Professional blue
  secondary: '#1e40af',    // Darker blue
  success: '#10b981',      // Green for positive metrics
  warning: '#f59e0b',      // Amber for attention items
  danger: '#ef4444',       // Red for negative metrics
  info: '#06b6d4',         // Cyan for information
  purple: '#8b5cf6',       // Purple for skill metrics
  gradient: [
    '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe',
    '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'
  ],
  neutral: ['#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9']
};

// Chart 1: GPA Trend by Semester (Line chart with target band)
export interface GPATrendData {
  semester: string;
  semesterNumber: number;
  gpa: number;
  targetGPA: number;
  minTarget: number;
  maxTarget: number;
  credits: number;
  cumulativeGPA: number;
}

export const GPATrendChart = memo<{
  data: GPATrendData[];
  className?: string;
  targetGPA?: number;
}>(({ data, className, targetGPA = 8.5 }) => {
  const config = {
    title: 'GPA Trend Analysis',
    subtitle: 'Academic performance tracking with target goals',
    description: 'Semester-wise GPA progression with performance targets and achievement bands',
    showLegend: true,
    exportable: true,
    responsive: true,
    colorScheme: 'academic' as const
  };

  const handleExport = async (options: ChartExportOptions) => {
    // Export implementation will be handled by chart wrapper
    console.log('Exporting GPA Trend Chart:', options);
  };

  return (
    <ChartCard
      config={config}
      data={data}
      onExport={handleExport}
      className={className}
      testId="gpa-trend-chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="targetBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACADEMIC_COLORS.success} stopOpacity={0.1}/>
              <stop offset="95%" stopColor={ACADEMIC_COLORS.success} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis 
            dataKey="semester"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tick={{ fontSize: 11 }}
          />
          
          <YAxis 
            domain={[6, 10]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tick={{ fontSize: 11 }}
            label={{ value: 'GPA', angle: -90, position: 'insideLeft' }}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value: number, name: string) => [
              typeof value === 'number' ? value.toFixed(2) : value, 
              name
            ]}
          />
          
          <Legend />

          {/* Target Achievement Band */}
          <Area
            dataKey="maxTarget"
            fill="url(#targetBand)"
            stroke="none"
            stackId="band"
            name="Target Range"
          />
          
          <Area
            dataKey="minTarget"
            fill="white"
            stroke="none"
            stackId="band"
          />

          {/* Target Line */}
          <Line
            type="monotone"
            dataKey="targetGPA"
            stroke={ACADEMIC_COLORS.success}
            strokeDasharray="8 4"
            strokeWidth={2}
            name="Target GPA"
            dot={false}
            activeDot={{ r: 4, fill: ACADEMIC_COLORS.success }}
          />

          {/* Actual GPA Line */}
          <Line
            type="monotone"
            dataKey="gpa"
            stroke={ACADEMIC_COLORS.primary}
            strokeWidth={3}
            name="Semester GPA"
            dot={{ fill: ACADEMIC_COLORS.primary, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 6, fill: ACADEMIC_COLORS.primary }}
          />

          {/* Cumulative GPA Line */}
          <Line
            type="monotone"
            dataKey="cumulativeGPA"
            stroke={ACADEMIC_COLORS.info}
            strokeWidth={2}
            name="Cumulative GPA"
            dot={{ fill: ACADEMIC_COLORS.info, strokeWidth: 2, r: 3 }}
            activeDot={{ r: 4, fill: ACADEMIC_COLORS.info }}
          />

          {/* Excellence Reference Line */}
          <ReferenceLine 
            y={9} 
            stroke={ACADEMIC_COLORS.warning} 
            strokeDasharray="4 4" 
            label={{ value: "Excellence (9.0)", position: "topRight", fontSize: 10 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 2: Credits per Semester (Bar chart with dual-axis GPA)
export interface CreditsGPAData {
  semester: string;
  earnedCredits: number;
  totalCredits: number;
  gpa: number;
  cumulativeCredits: number;
  progressPercentage: number;
}

export const CreditsPerSemesterChart = memo<{
  data: CreditsGPAData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Credits & GPA Analysis',
    subtitle: 'Credit progression with academic performance correlation',
    description: 'Semester-wise credit accumulation alongside GPA performance metrics',
    showLegend: true,
    exportable: true,
    responsive: true
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="credits-gpa-chart">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis 
            dataKey="semester"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
          />
          
          <YAxis 
            yAxisId="credits"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            label={{ value: 'Credits', angle: -90, position: 'insideLeft' }}
          />
          
          <YAxis 
            yAxisId="gpa"
            orientation="right"
            domain={[6, 10]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            label={{ value: 'GPA', angle: 90, position: 'insideRight' }}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px'
            }}
          />
          
          <Legend />

          {/* Credit Bars */}
          <Bar 
            yAxisId="credits"
            dataKey="earnedCredits"
            fill={ACADEMIC_COLORS.primary}
            name="Credits Earned"
            radius={[4, 4, 0, 0]}
          />

          {/* GPA Line */}
          <Line
            yAxisId="gpa"
            type="monotone"
            dataKey="gpa"
            stroke={ACADEMIC_COLORS.success}
            strokeWidth={3}
            name="GPA"
            dot={{ fill: ACADEMIC_COLORS.success, strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 3: Cumulative CGPA (Area chart)
export interface CumulativeCGPAData {
  semester: string;
  cgpa: number;
  targetCGPA: number;
  creditsCompleted: number;
  projectedCGPA: number;
}

export const CumulativeCGPAChart = memo<{
  data: CumulativeCGPAData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Cumulative CGPA Progression',
    subtitle: 'Overall academic performance trajectory',
    description: 'Cumulative Grade Point Average evolution with target achievement analysis',
    showLegend: true,
    exportable: true
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="cumulative-cgpa-chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="cgpaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACADEMIC_COLORS.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={ACADEMIC_COLORS.primary} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACADEMIC_COLORS.info} stopOpacity={0.6}/>
              <stop offset="95%" stopColor={ACADEMIC_COLORS.info} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis domain={[6, 10]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
          
          <Tooltip />
          <Legend />

          {/* Projected CGPA Area */}
          <Area
            type="monotone"
            dataKey="projectedCGPA"
            stroke={ACADEMIC_COLORS.info}
            fill="url(#projectedGradient)"
            strokeWidth={2}
            strokeDasharray="6 6"
            name="Projected CGPA"
          />

          {/* Actual CGPA Area */}
          <Area
            type="monotone"
            dataKey="cgpa"
            stroke={ACADEMIC_COLORS.primary}
            fill="url(#cgpaGradient)"
            strokeWidth={3}
            name="Cumulative CGPA"
          />

          {/* Target Line */}
          <Area
            type="monotone"
            dataKey="targetCGPA"
            stroke={ACADEMIC_COLORS.success}
            fill="none"
            strokeWidth={2}
            strokeDasharray="8 4"
            name="Target CGPA"
          />

          <ReferenceLine y={8.5} stroke={ACADEMIC_COLORS.warning} strokeDasharray="2 2" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 4: Subject-wise GPA Distribution (Horizontal Bar)
export interface SubjectGPAData {
  subject: string;
  subjectCode: string;
  gpa: number;
  credits: number;
  grade: string;
  attendance: number;
}

export const SubjectGPAChart = memo<{
  data: SubjectGPAData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Subject-wise GPA Distribution',
    subtitle: 'Performance analysis across subjects',
    description: 'Individual subject GPA performance with grade distribution analysis',
    showLegend: true,
    exportable: true
  };

  const sortedData = useMemo(() => 
    [...data].sort((a, b) => b.gpa - a.gpa), [data]
  );

  return (
    <ChartCard config={config} data={sortedData} className={className} testId="subject-gpa-chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="horizontal"
          data={sortedData}
          margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis 
            type="number"
            domain={[0, 10]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
          />
          
          <YAxis 
            type="category"
            dataKey="subject"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            width={100}
          />
          
          <Tooltip 
            formatter={(value: number) => [value.toFixed(2), 'GPA']}
            labelFormatter={(label) => `Subject: ${label}`}
          />

          <Bar 
            dataKey="gpa"
            fill={ACADEMIC_COLORS.primary}
            radius={[0, 4, 4, 0]}
            name="GPA"
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  entry.gpa >= 9 ? ACADEMIC_COLORS.success :
                  entry.gpa >= 8 ? ACADEMIC_COLORS.primary :
                  entry.gpa >= 7 ? ACADEMIC_COLORS.warning :
                  ACADEMIC_COLORS.danger
                } 
              />
            ))}
            <LabelList 
              dataKey="grade" 
              position="right" 
              fontSize={10}
              fill="hsl(var(--muted-foreground))"
            />
          </Bar>

          <ReferenceLine x={8.5} stroke={ACADEMIC_COLORS.info} strokeDasharray="4 4" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 5: GPA vs Attendance Correlation (Scatter plot)
export interface GPAAttendanceData {
  subject: string;
  gpa: number;
  attendance: number;
  credits: number;
  category: 'Core' | 'Elective' | 'Lab' | 'Project';
}

export const GPAAttendanceCorrelationChart = memo<{
  data: GPAAttendanceData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'GPA vs Attendance Correlation',
    subtitle: 'Performance correlation with attendance patterns',
    description: 'Subject-wise analysis of GPA performance relative to attendance rates',
    showLegend: true,
    exportable: true
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Core': return ACADEMIC_COLORS.primary;
      case 'Elective': return ACADEMIC_COLORS.success;
      case 'Lab': return ACADEMIC_COLORS.warning;
      case 'Project': return ACADEMIC_COLORS.purple;
      default: return ACADEMIC_COLORS.neutral[0];
    }
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="gpa-attendance-chart">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis 
            type="number"
            dataKey="attendance"
            domain={[60, 100]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            label={{ value: 'Attendance %', position: 'bottom' }}
          />
          
          <YAxis 
            type="number"
            dataKey="gpa"
            domain={[6, 10]}
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            label={{ value: 'GPA', angle: -90, position: 'insideLeft' }}
          />
          
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            formatter={(value: number, name: string) => [
              typeof value === 'number' ? value.toFixed(2) : value,
              name === 'gpa' ? 'GPA' : 'Attendance %'
            ]}
            labelFormatter={(label, payload) => 
              payload?.[0]?.payload?.subject || 'Subject'
            }
          />
          
          <Legend />

          {['Core', 'Elective', 'Lab', 'Project'].map(category => (
            <Scatter
              key={category}
              name={category}
              data={data.filter(item => item.category === category)}
              fill={getCategoryColor(category)}
            />
          ))}

          {/* Correlation trend line reference */}
          <ReferenceLine 
            segment={[{x: 75, y: 7}, {x: 95, y: 9}]} 
            stroke={ACADEMIC_COLORS.info}
            strokeDasharray="6 6"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 6: Skill Radar Chart
export interface SkillData {
  skill: string;
  current: number;
  target: number;
  industry: number;
  maxValue: number;
}

export const SkillRadarChart = memo<{
  data: SkillData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Skill Assessment Radar',
    subtitle: 'Multi-dimensional skill analysis',
    description: 'Comprehensive skill evaluation against targets and industry benchmarks',
    showLegend: true,
    exportable: true
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="skill-radar-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 40, right: 40, bottom: 40, left: 40 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          
          <PolarAngleAxis 
            dataKey="skill"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          
          <PolarRadiusAxis 
            domain={[0, 100]}
            tick={{ fontSize: 8, fill: 'hsl(var(--muted-foreground))' }}
            tickCount={5}
          />
          
          <Tooltip />
          <Legend />

          {/* Industry Benchmark */}
          <Radar
            dataKey="industry"
            stroke={ACADEMIC_COLORS.neutral[2]}
            fill={ACADEMIC_COLORS.neutral[2]}
            fillOpacity={0.1}
            name="Industry Average"
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* Target Level */}
          <Radar
            dataKey="target"
            stroke={ACADEMIC_COLORS.warning}
            fill={ACADEMIC_COLORS.warning}
            fillOpacity={0.15}
            name="Target Level"
            strokeWidth={2}
            strokeDasharray="6 3"
          />

          {/* Current Level */}
          <Radar
            dataKey="current"
            stroke={ACADEMIC_COLORS.primary}
            fill={ACADEMIC_COLORS.primary}
            fillOpacity={0.2}
            name="Current Level"
            strokeWidth={3}
            dot={{ fill: ACADEMIC_COLORS.primary, strokeWidth: 2, r: 4 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 7: Skill Growth Radial Bars
export interface SkillGrowthData {
  skill: string;
  category: string;
  progress: number;
  target: number;
  growth: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export const SkillGrowthRadialChart = memo<{
  data: SkillGrowthData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Skill Growth Progress',
    subtitle: 'Radial progression visualization',
    description: 'Individual skill development progress with achievement levels',
    showLegend: true,
    exportable: true
  };

  const chartData = useMemo(() => 
    data.map((skill, index) => ({
      ...skill,
      angle: (360 / data.length) * index,
      progressPercent: Math.round((skill.progress / skill.target) * 100)
    })), [data]
  );

  return (
    <ChartCard config={config} data={chartData} className={className} testId="skill-growth-chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="30%" 
          outerRadius="80%" 
          data={chartData}
          startAngle={90}
          endAngle={450}
        >
          <RadialBar
            label={{ position: 'insideStart', fill: '#fff', fontSize: 10 }}
            background={{ fill: 'hsl(var(--muted))' }}
            dataKey="progressPercent"
            cornerRadius={4}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={ACADEMIC_COLORS.gradient[index % ACADEMIC_COLORS.gradient.length]} 
              />
            ))}
          </RadialBar>
          
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Progress']}
          />
          <Legend 
            iconSize={10}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 8: Achievement Funnel
export interface AchievementFunnelData {
  stage: string;
  count: number;
  percentage: number;
  conversionRate?: number;
}

export const AchievementFunnelChart = memo<{
  data: AchievementFunnelData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Achievement Approval Funnel',
    subtitle: 'Activity submission to approval pipeline',
    description: 'Conversion analysis from activity submission through approval process',
    showLegend: false,
    exportable: true
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="achievement-funnel-chart">
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <Tooltip 
            formatter={(value: number, name: string) => [
              name === 'count' ? value : `${value}%`,
              name === 'count' ? 'Activities' : 'Conversion'
            ]}
          />
          
          <Funnel
            dataKey="count"
            data={data}
            isAnimationActive={true}
            fill={ACADEMIC_COLORS.primary}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={ACADEMIC_COLORS.gradient[index]} 
              />
            ))}
            <LabelList 
              position="center" 
              fill="#fff" 
              fontSize={12}
              formatter={(value: number, entry: any) => 
                `${entry.stage}\n${value} (${entry.percentage}%)`
              }
            />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Simple Achievement Timeline Chart as a placeholder
export const AchievementsTimelineChart = memo(() => {
  const data = [
    { date: '2024-01', achievements: 3, type: 'Academic' },
    { date: '2024-02', achievements: 5, type: 'Extracurricular' },
    { date: '2024-03', achievements: 2, type: 'Research' },
    { date: '2024-04', achievements: 4, type: 'Leadership' },
    { date: '2024-05', achievements: 6, type: 'Community' },
    { date: '2024-06', achievements: 3, type: 'Technical' }
  ];

  const config = {
    title: 'Achievement Timeline',
    subtitle: 'Track your accomplishments over time',
    description: 'Timeline view of your achievements across different categories',
    showLegend: true,
    exportable: true,
    responsive: true
  };

  return (
    <ChartCard config={config} data={data} testId="achievements-timeline">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            label={{ value: 'Achievements', angle: -90, position: 'insideLeft' }}
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
            dataKey="achievements"
            stroke={ACADEMIC_COLORS.primary}
            strokeWidth={3}
            name="Monthly Achievements"
            dot={{ fill: ACADEMIC_COLORS.primary, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 6, fill: ACADEMIC_COLORS.primary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

AchievementsTimelineChart.displayName = 'AchievementsTimelineChart';

// Export all Phase 1 charts
export const Phase1Charts = {
  GPATrendChart,
  CreditsPerSemesterChart,
  CumulativeCGPAChart,
  SubjectGPAChart,
  GPAAttendanceCorrelationChart,
  SkillRadarChart,
  SkillGrowthRadialChart,
  AchievementFunnelChart,
  AchievementsTimelineChart
};

// Export chart data interfaces for type safety
export type {
  GPATrendData,
  CreditsGPAData,
  CumulativeCGPAData,
  SubjectGPAData,
  GPAAttendanceData,
  SkillData,
  SkillGrowthData,
  AchievementFunnelData
};
/**
 * Phase 2 - Advanced Analytics Charts (ECharts + Chart.js)
 * 
 * Advanced analytics visualization charts using ECharts and Chart.js.
 * Features 10 sophisticated chart types for comprehensive data analysis
 * with professional Higher Education styling and advanced interactivity.
 * 
 * Charts:
 * 9. Attendance calendar heatmap (ECharts Calendar)
 * 10. Attendance weekly patterns (Recharts Sparklines)
 * 11. Activity category share (Chart.js Doughnut with center total)
 * 12. Activity volume over time (Recharts Stacked Area)
 * 13. Peer comparison boxplot (ECharts Boxplot)
 * 14. Rank percentile gauge (ECharts Gauge)
 * 15. Department ranking (Recharts Sorted Bar with gradient)
 * 16. Portfolio strength treemap (Recharts Treemap)
 * 17. Approval SLA by reviewer (Recharts Composed)
 * 18. Grade correlation matrix (ECharts Heatmap)
 */

import { memo, useMemo, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Tooltip, Legend, Cell, Treemap, ComposedChart, Line
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, ChartData } from 'chart.js';
import { ChartCard, ChartExportOptions } from './chart-wrappers';
import { ACADEMIC_COLORS } from './phase1-academic-charts';
import { cn } from '@/lib/utils';
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

// Register Chart.js components
ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

// Advanced Analytics Color Palette
export const ANALYTICS_COLORS = {
  ...ACADEMIC_COLORS,
  heatmap: ['#f7fafc', '#edf2f7', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b', '#475569', '#334155', '#1e293b'],
  performance: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
  risk: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626'],
  correlation: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#fef3c7', '#fcd34d', '#f59e0b', '#d97706']
};

// Chart 9: Attendance Calendar Heatmap (ECharts)
export interface AttendanceHeatmapData {
  date: string;
  attendance: number;
  status: 'present' | 'absent' | 'late' | 'excused' | 'holiday';
  classes: number;
}

export const AttendanceCalendarHeatmap = memo<{
  data: AttendanceHeatmapData[];
  year?: number;
  className?: string;
}>(({ data, year = new Date().getFullYear(), className }) => {
  const config = {
    title: 'Attendance Calendar Heatmap',
    subtitle: `Daily attendance patterns for ${year}`,
    description: 'Visual representation of daily attendance with intensity mapping',
    showLegend: false,
    exportable: true
  };

  const echartsOption = useMemo(() => {
    const attendanceData = data.map(item => [
      item.date,
      item.attendance,
      item.status,
      item.classes
    ]);

    return {
      tooltip: {
        position: 'top',
        formatter: function(params: any) {
          const [date, attendance, status, classes] = params.data;
          return `
            <div style="font-size: 12px;">
              <strong>${format(parseISO(date), 'MMM dd, yyyy')}</strong><br/>
              Attendance: ${attendance}%<br/>
              Status: ${status}<br/>
              Classes: ${classes}
            </div>
          `;
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 10,
        inRange: {
          color: ANALYTICS_COLORS.heatmap
        },
        text: ['High', 'Low']
      },
      calendar: {
        top: 60,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: year,
        itemStyle: {
          borderWidth: 0.5,
          borderColor: '#ccc'
        },
        yearLabel: { show: false },
        monthLabel: {
          nameMap: 'EN',
          fontSize: 12
        },
        dayLabel: {
          fontSize: 10
        }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: attendanceData
      }
    };
  }, [data, year]);

  return (
    <ChartCard config={config} data={data} className={className} testId="attendance-heatmap">
      <ReactECharts 
        option={echartsOption}
        style={{ width: '100%', height: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </ChartCard>
  );
});

// Chart 10: Attendance Weekly Patterns (Recharts Sparklines)
export interface WeeklyPatternData {
  week: string;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  weekAverage: number;
}

export const AttendanceWeeklyPatterns = memo<{
  data: WeeklyPatternData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Weekly Attendance Patterns',
    subtitle: 'Weekday attendance distribution with sparklines',
    description: 'Micro-charts showing attendance patterns across weekdays',
    showLegend: true,
    exportable: true
  };

  const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const weekdayColors = [
    ACADEMIC_COLORS.primary,
    ACADEMIC_COLORS.success,
    ACADEMIC_COLORS.warning,
    ACADEMIC_COLORS.info,
    ACADEMIC_COLORS.purple
  ];

  return (
    <ChartCard config={config} data={data} className={className} testId="weekly-patterns">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-full">
        {weekdays.map((day, index) => (
          <div key={day} className="flex flex-col">
            <h4 className="text-sm font-medium text-center mb-2 capitalize">
              {day}
            </h4>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Area
                    type="monotone"
                    dataKey={day}
                    stroke={weekdayColors[index]}
                    fill={weekdayColors[index]}
                    fillOpacity={0.3}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 2, fill: weekdayColors[index] }}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: '10px' }}
                    formatter={(value: number) => [`${value}%`, day.charAt(0).toUpperCase() + day.slice(1)]}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-center text-muted-foreground mt-1">
              Avg: {Math.round(data.reduce((acc, curr) => acc + curr[day as keyof WeeklyPatternData], 0) / data.length)}%
            </div>
          </div>
        ))}
      </div>
    </ChartCard>
  );
});

// Chart 11: Activity Category Share (Chart.js Doughnut with center total)
export interface ActivityShareData {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export const ActivityCategoryShare = memo<{
  data: ActivityShareData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Activity Category Distribution',
    subtitle: 'Portfolio composition by activity type',
    description: 'Proportional breakdown of activities with center total display',
    showLegend: false,
    exportable: true
  };

  const totalActivities = useMemo(() => 
    data.reduce((sum, item) => sum + item.count, 0), [data]
  );

  const chartData: ChartData<'doughnut'> = useMemo(() => ({
    labels: data.map(item => item.category),
    datasets: [{
      data: data.map(item => item.count),
      backgroundColor: data.map(item => item.color),
      borderColor: data.map(item => item.color),
      borderWidth: 2,
      hoverBorderWidth: 3,
      hoverOffset: 4
    }]
  }), [data]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        callbacks: {
          label: function(context: any) {
            const percentage = ((context.parsed / totalActivities) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
    elements: {
      arc: {
        borderRadius: 4
      }
    }
  }), [totalActivities]);

  return (
    <ChartCard config={config} data={data} className={className} testId="activity-share">
      <div className="relative h-full flex items-center justify-center">
        <Doughnut data={chartData} options={chartOptions} />
        
        {/* Center Total */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-3xl font-bold text-foreground">
            {totalActivities}
          </div>
          <div className="text-sm text-muted-foreground">
            Total Activities
          </div>
        </div>

        {/* Legend */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
          {data.map((item, index) => (
            <div key={item.category} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground">
                {item.category} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
});

// Chart 12: Activity Volume Over Time (Recharts Stacked Area)
export interface ActivityVolumeData {
  month: string;
  academic: number;
  technical: number;
  leadership: number;
  community: number;
  research: number;
  total: number;
}

export const ActivityVolumeChart = memo<{
  data: ActivityVolumeData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Activity Volume Trends',
    subtitle: 'Monthly activity submission patterns',
    description: 'Stacked area visualization of activity categories over time',
    showLegend: true,
    exportable: true
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="activity-volume">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="academicGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACADEMIC_COLORS.primary} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={ACADEMIC_COLORS.primary} stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="technicalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACADEMIC_COLORS.success} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={ACADEMIC_COLORS.success} stopOpacity={0.3}/>
            </linearGradient>
            <linearGradient id="leadershipGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACADEMIC_COLORS.warning} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={ACADEMIC_COLORS.warning} stopOpacity={0.3}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
          
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
            dataKey="academic"
            stackId="1"
            stroke={ACADEMIC_COLORS.primary}
            fill="url(#academicGrad)"
            name="Academic"
          />
          <Area
            type="monotone"
            dataKey="technical"
            stackId="1"
            stroke={ACADEMIC_COLORS.success}
            fill="url(#technicalGrad)"
            name="Technical"
          />
          <Area
            type="monotone"
            dataKey="leadership"
            stackId="1"
            stroke={ACADEMIC_COLORS.warning}
            fill="url(#leadershipGrad)"
            name="Leadership"
          />
          <Area
            type="monotone"
            dataKey="community"
            stackId="1"
            stroke={ACADEMIC_COLORS.info}
            fill={ACADEMIC_COLORS.info}
            fillOpacity={0.6}
            name="Community"
          />
          <Area
            type="monotone"
            dataKey="research"
            stackId="1"
            stroke={ACADEMIC_COLORS.purple}
            fill={ACADEMIC_COLORS.purple}
            fillOpacity={0.6}
            name="Research"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 13: Peer Comparison Boxplot (ECharts)
export interface PeerComparisonData {
  metric: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  myValue: number;
  unit: string;
}

export const PeerComparisonBoxplot = memo<{
  data: PeerComparisonData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Peer Performance Comparison',
    subtitle: 'Statistical analysis vs departmental peers',
    description: 'Box plot visualization showing performance distribution and personal position',
    showLegend: true,
    exportable: true
  };

  const echartsOption = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function(params: any) {
        if (params.seriesName === 'My Performance') {
          const dataItem = data[params.dataIndex];
          return `
            <div style="font-size: 12px;">
              <strong>${dataItem.metric}</strong><br/>
              My Value: ${dataItem.myValue} ${dataItem.unit}<br/>
              Percentile: ${((dataItem.myValue - dataItem.min) / (dataItem.max - dataItem.min) * 100).toFixed(1)}%
            </div>
          `;
        }
        return `
          <div style="font-size: 12px;">
            <strong>${params.name}</strong><br/>
            Max: ${params.data[5]} ${data[params.dataIndex]?.unit}<br/>
            Q3: ${params.data[4]} ${data[params.dataIndex]?.unit}<br/>
            Median: ${params.data[3]} ${data[params.dataIndex]?.unit}<br/>
            Q1: ${params.data[2]} ${data[params.dataIndex]?.unit}<br/>
            Min: ${params.data[1]} ${data[params.dataIndex]?.unit}
          </div>
        `;
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.metric),
      axisLabel: {
        fontSize: 10,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10
      }
    },
    series: [
      {
        name: 'Peer Distribution',
        type: 'boxplot',
        data: data.map(item => [item.min, item.q1, item.median, item.q3, item.max]),
        itemStyle: {
          color: ACADEMIC_COLORS.primary,
          borderColor: ACADEMIC_COLORS.secondary
        }
      },
      {
        name: 'My Performance',
        type: 'scatter',
        data: data.map((item, index) => [index, item.myValue]),
        symbolSize: 8,
        itemStyle: {
          color: ACADEMIC_COLORS.danger
        }
      }
    ]
  }), [data]);

  return (
    <ChartCard config={config} data={data} className={className} testId="peer-comparison">
      <ReactECharts 
        option={echartsOption}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
});

// Chart 14: Rank Percentile Gauge (ECharts)
export interface RankGaugeData {
  currentRank: number;
  totalStudents: number;
  percentile: number;
  previousRank?: number;
  target: number;
  departmentAverage: number;
}

export const RankPercentileGauge = memo<{
  data: RankGaugeData;
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Academic Rank Gauge',
    subtitle: `Rank ${data.currentRank} of ${data.totalStudents} students`,
    description: 'Percentile performance gauge with target and average indicators',
    showLegend: false,
    exportable: true
  };

  const echartsOption = useMemo(() => ({
    series: [
      {
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: '#58D9F9',
          shadowColor: 'rgba(0,138,255,0.45)',
          shadowBlur: 10,
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        progress: {
          show: true,
          roundCap: true,
          width: 18
        },
        pointer: {
          icon: 'path://M2090.36389,615.302447 L2090.36389,615.302447 C2091.48372,615.302447 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.877953 L2049.12936,728.877953 L2053.58775,617.312956 C2053.63251,616.194028 2054.55262,615.302447 2055.67245,615.302447 L2090.36389,615.302447 Z',
          length: '75%',
          width: 16,
          offsetCenter: [0, '5%'],
          itemStyle: {
            color: ACADEMIC_COLORS.primary,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 15,
            shadowOffsetX: 2,
            shadowOffsetY: 4
          }
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 18
          }
        },
        axisTick: {
          splitNumber: 2,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        splitLine: {
          length: 12,
          lineStyle: {
            width: 3,
            color: '#999'
          }
        },
        axisLabel: {
          distance: 30,
          color: '#999',
          fontSize: 10,
          formatter: (value: number) => `${value}%`
        },
        title: {
          offsetCenter: [0, '20%'],
          fontSize: 14,
          color: '#333'
        },
        detail: {
          fontSize: 20,
          offsetCenter: [0, '35%'],
          valueAnimation: true,
          formatter: function(value: number) {
            return `${value.toFixed(1)}%`;
          },
          color: ACADEMIC_COLORS.primary
        },
        data: [
          {
            value: data.percentile,
            name: 'Percentile'
          }
        ]
      }
    ]
  }), [data]);

  return (
    <ChartCard config={config} data={[data]} className={className} testId="rank-gauge">
      <ReactECharts 
        option={echartsOption}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
});

// Chart 15: Department Ranking (Recharts Sorted Bar with gradient)
export interface DepartmentRankData {
  department: string;
  averageGPA: number;
  studentCount: number;
  activityScore: number;
  overallScore: number;
  rank: number;
}

export const DepartmentRankingChart = memo<{
  data: DepartmentRankData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Department Performance Ranking',
    subtitle: 'Comparative academic performance by department',
    description: 'Overall performance scores with GPA and activity metrics',
    showLegend: true,
    exportable: true
  };

  const sortedData = useMemo(() => 
    [...data].sort((a, b) => b.overallScore - a.overallScore), [data]
  );

  return (
    <ChartCard config={config} data={sortedData} className={className} testId="department-ranking">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="horizontal"
          data={sortedData}
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <defs>
            <linearGradient id="rankGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="5%" stopColor={ACADEMIC_COLORS.success} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={ACADEMIC_COLORS.primary} stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis 
            type="number"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
          />
          
          <YAxis 
            type="category"
            dataKey="department"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            width={80}
          />
          
          <Tooltip 
            formatter={(value: number, name: string) => [value.toFixed(2), name]}
            labelFormatter={(label) => `Department: ${label}`}
          />
          
          <Bar 
            dataKey="overallScore"
            fill="url(#rankGradient)"
            radius={[0, 4, 4, 0]}
            name="Overall Score"
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? ACADEMIC_COLORS.success : 
                      index === 1 ? ACADEMIC_COLORS.info : 
                      index === 2 ? ACADEMIC_COLORS.warning : 
                      ACADEMIC_COLORS.neutral[0]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 16: Portfolio Strength Treemap (Recharts)
export interface PortfolioTreemapData {
  name: string;
  size: number;
  strength: number;
  category: string;
  children?: PortfolioTreemapData[];
}

export const PortfolioStrengthTreemap = memo<{
  data: PortfolioTreemapData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Portfolio Strength Analysis',
    subtitle: 'Hierarchical view of skill and achievement distribution',
    description: 'Treemap visualization showing relative strength across portfolio areas',
    showLegend: false,
    exportable: true
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="portfolio-treemap">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          nameKey="name"
          stroke="#fff"
          fill={ACADEMIC_COLORS.primary}
          content={({ root, depth, x, y, width, height, index, name, size, strength }) => (
            <g>
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                  fill: depth < 2 ? ANALYTICS_COLORS.performance[depth] : ACADEMIC_COLORS.primary,
                  stroke: '#fff',
                  strokeWidth: 2 / (depth + 1),
                  strokeOpacity: 1 / (depth + 1)
                }}
              />
              {width > 60 && height > 30 && (
                <>
                  <text
                    x={x + width / 2}
                    y={y + height / 2 - 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={Math.min(14, width / 6, height / 4)}
                    fontWeight="bold"
                  >
                    {name}
                  </text>
                  <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={Math.min(10, width / 8, height / 6)}
                  >
                    {size} items
                  </text>
                </>
              )}
            </g>
          )}
        />
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 17: Approval SLA by Reviewer (Recharts Composed)
export interface ApprovalSLAData {
  reviewer: string;
  avgApprovalTime: number;
  slaTarget: number;
  totalReviewed: number;
  onTimePercentage: number;
  delayedCount: number;
}

export const ApprovalSLAChart = memo<{
  data: ApprovalSLAData[];
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Approval SLA Performance',
    subtitle: 'Reviewer efficiency and turnaround metrics',
    description: 'Service level agreement compliance with average approval times',
    showLegend: true,
    exportable: true
  };

  return (
    <ChartCard config={config} data={data} className={className} testId="approval-sla">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          
          <XAxis 
            dataKey="reviewer"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          
          <YAxis 
            yAxisId="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
          />
          
          <YAxis 
            yAxisId="percentage"
            orientation="right"
            stroke="hsl(var(--muted-foreground))"
            fontSize={11}
            label={{ value: 'On-time %', angle: 90, position: 'insideRight' }}
          />
          
          <Tooltip />
          <Legend />

          {/* SLA Target Line */}
          <Line
            yAxisId="time"
            type="monotone"
            dataKey="slaTarget"
            stroke={ACADEMIC_COLORS.warning}
            strokeWidth={2}
            strokeDasharray="8 4"
            name="SLA Target"
            dot={false}
          />

          {/* Average Approval Time Bars */}
          <Bar 
            yAxisId="time"
            dataKey="avgApprovalTime"
            name="Avg Approval Time (hrs)"
            radius={[4, 4, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.avgApprovalTime <= entry.slaTarget ? 
                      ACADEMIC_COLORS.success : 
                      ACADEMIC_COLORS.danger} 
              />
            ))}
          </Bar>

          {/* On-time Percentage Line */}
          <Line
            yAxisId="percentage"
            type="monotone"
            dataKey="onTimePercentage"
            stroke={ACADEMIC_COLORS.info}
            strokeWidth={3}
            name="On-time %"
            dot={{ fill: ACADEMIC_COLORS.info, strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
});

// Chart 18: Grade Correlation Matrix (ECharts Heatmap)
export interface CorrelationMatrixData {
  subjects: string[];
  correlationMatrix: number[][];
  significance: number[][];
}

export const GradeCorrelationMatrix = memo<{
  data: CorrelationMatrixData;
  className?: string;
}>(({ data, className }) => {
  const config = {
    title: 'Subject Grade Correlation Matrix',
    subtitle: 'Inter-subject performance correlation analysis',
    description: 'Statistical correlation between subject grades with significance indicators',
    showLegend: false,
    exportable: true
  };

  const echartsOption = useMemo(() => {
    const matrixData = [];
    for (let i = 0; i < data.subjects.length; i++) {
      for (let j = 0; j < data.subjects.length; j++) {
        matrixData.push([
          j, i, data.correlationMatrix[i][j], data.significance[i][j]
        ]);
      }
    }

    return {
      tooltip: {
        position: 'top',
        formatter: function(params: any) {
          const [x, y, correlation, significance] = params.data;
          return `
            <div style="font-size: 12px;">
              <strong>${data.subjects[x]} vs ${data.subjects[y]}</strong><br/>
              Correlation: ${correlation.toFixed(3)}<br/>
              Significance: ${significance.toFixed(3)}<br/>
              ${significance < 0.05 ? '<em>Statistically Significant</em>' : '<em>Not Significant</em>'}
            </div>
          `;
        }
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: data.subjects,
        splitArea: {
          show: true
        },
        axisLabel: {
          fontSize: 10,
          rotate: 45
        }
      },
      yAxis: {
        type: 'category',
        data: data.subjects,
        splitArea: {
          show: true
        },
        axisLabel: {
          fontSize: 10
        }
      },
      visualMap: {
        min: -1,
        max: 1,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
          color: ANALYTICS_COLORS.correlation
        }
      },
      series: [{
        name: 'Correlation',
        type: 'heatmap',
        data: matrixData,
        label: {
          show: true,
          fontSize: 8,
          formatter: function(params: any) {
            return params.data[2].toFixed(2);
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }, [data]);

  return (
    <ChartCard config={config} data={[data]} className={className} testId="correlation-matrix">
      <ReactECharts 
        option={echartsOption}
        style={{ width: '100%', height: '100%' }}
      />
    </ChartCard>
  );
});

// Export all Phase 2 charts
export const Phase2Charts = {
  AttendanceCalendarHeatmap,
  AttendanceWeeklyPatterns,
  ActivityCategoryShare,
  ActivityVolumeChart,
  PeerComparisonBoxplot,
  RankPercentileGauge,
  DepartmentRankingChart,
  PortfolioStrengthTreemap,
  ApprovalSLAChart,
  GradeCorrelationMatrix
};

// Export chart data interfaces
export type {
  AttendanceHeatmapData,
  WeeklyPatternData,
  ActivityShareData,
  ActivityVolumeData,
  PeerComparisonData,
  RankGaugeData,
  DepartmentRankData,
  PortfolioTreemapData,
  ApprovalSLAData,
  CorrelationMatrixData
};
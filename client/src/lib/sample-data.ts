/**
 * Sample Data Generators for Academic Dashboard
 * 
 * Provides realistic sample data for all chart components and analytics
 * to demonstrate the comprehensive dashboard functionality.
 */

import { format, subDays, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

// GPA Trend Data
export const generateGPATrendData = () => {
  return [
    { semester: 'Sem 1', gpa: 3.2, target: 3.5, credits: 18 },
    { semester: 'Sem 2', gpa: 3.4, target: 3.5, credits: 20 },
    { semester: 'Sem 3', gpa: 3.6, target: 3.5, credits: 19 },
    { semester: 'Sem 4', gpa: 3.7, target: 3.6, credits: 21 },
    { semester: 'Sem 5', gpa: 3.8, target: 3.7, credits: 18 },
    { semester: 'Sem 6', gpa: 3.9, target: 3.8, credits: 20 }
  ];
};

// Credits Progress Data
export const generateCreditsProgressData = () => {
  return [
    { semester: 'Sem 1', earnedCredits: 18, totalCredits: 20, cumulativeCredits: 18 },
    { semester: 'Sem 2', earnedCredits: 20, totalCredits: 22, cumulativeCredits: 38 },
    { semester: 'Sem 3', earnedCredits: 19, totalCredits: 21, cumulativeCredits: 57 },
    { semester: 'Sem 4', earnedCredits: 21, totalCredits: 21, cumulativeCredits: 78 },
    { semester: 'Sem 5', earnedCredits: 18, totalCredits: 20, cumulativeCredits: 96 },
    { semester: 'Sem 6', earnedCredits: 20, totalCredits: 20, cumulativeCredits: 116 }
  ];
};

// Attendance by Subject Data
export const generateAttendanceBySubjectData = () => {
  return [
    { subject: 'Mathematics', present: 28, absent: 2, late: 1, excused: 1 },
    { subject: 'Physics', present: 25, absent: 4, late: 2, excused: 1 },
    { subject: 'Chemistry', present: 30, absent: 1, late: 1, excused: 0 },
    { subject: 'Computer Science', present: 27, absent: 2, late: 3, excused: 0 },
    { subject: 'English', present: 26, absent: 3, late: 2, excused: 1 },
    { subject: 'History', present: 29, absent: 1, late: 1, excused: 1 }
  ];
};

// Attendance Calendar Heatmap Data
export const generateAttendanceCalendarData = (month: Date) => {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  return days.map(day => {
    const dayOfWeek = day.getDay();
    let status: 'present' | 'absent' | 'late' | 'excused' | 'holiday';
    
    // Weekend logic
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      status = 'holiday';
    } else {
      // Random status for weekdays
      const rand = Math.random();
      if (rand < 0.85) status = 'present';
      else if (rand < 0.92) status = 'late';
      else if (rand < 0.98) status = 'excused';
      else status = 'absent';
    }
    
    return {
      date: format(day, 'yyyy-MM-dd'),
      status,
      percentage: status === 'present' ? 100 : status === 'late' ? 75 : 0
    };
  });
};

// Weekday Attendance Data
export const generateWeekdayAttendanceData = () => {
  return [
    { day: 'Monday', attendance: 92, classes: 25 },
    { day: 'Tuesday', attendance: 88, classes: 24 },
    { day: 'Wednesday', attendance: 95, classes: 26 },
    { day: 'Thursday', attendance: 90, classes: 25 },
    { day: 'Friday', attendance: 85, classes: 23 }
  ];
};

// Grade Distribution Data
export const generateGradeDistributionData = () => {
  return [
    {
      subject: 'Mathematics',
      grades: [78, 82, 85, 90, 88, 92, 76, 94, 89, 87],
      median: 87,
      q1: 82,
      q3: 91,
      average: 86.1
    },
    {
      subject: 'Physics',
      grades: [75, 79, 83, 88, 85, 90, 73, 91, 86, 84],
      median: 84.5,
      q1: 79,
      q3: 88,
      average: 83.4
    },
    {
      subject: 'Chemistry',
      grades: [80, 85, 88, 93, 91, 96, 82, 95, 92, 89],
      median: 90,
      q1: 85,
      q3: 93,
      average: 89.1
    }
  ];
};

// Assignment Timeline Data
export const generateAssignmentTimelineData = () => {
  return [
    { week: 'Week 1', completed: 8, pending: 2, overdue: 0 },
    { week: 'Week 2', completed: 7, pending: 3, overdue: 1 },
    { week: 'Week 3', completed: 9, pending: 1, overdue: 0 },
    { week: 'Week 4', completed: 6, pending: 4, overdue: 2 },
    { week: 'Week 5', completed: 10, pending: 2, overdue: 0 },
    { week: 'Week 6', completed: 8, pending: 3, overdue: 1 },
    { week: 'Week 7', completed: 9, pending: 2, overdue: 0 },
    { week: 'Week 8', completed: 7, pending: 4, overdue: 1 }
  ];
};

// Category Distribution Data
export const generateCategoryDistributionData = () => {
  return [
    { category: 'Technical Skills', value: 35, color: '#8884d8' },
    { category: 'Leadership', value: 25, color: '#82ca9d' },
    { category: 'Research', value: 20, color: '#ffc658' },
    { category: 'Community Service', value: 15, color: '#ff7300' },
    { category: 'Sports', value: 5, color: '#00ff7f' }
  ];
};

// Goals Progress Data
export const generateGoalsProgressData = () => {
  return [
    { goal: 'Academic Excellence', progress: 8, target: 10 },
    { goal: 'Research Publications', progress: 3, target: 5 },
    { goal: 'Leadership Roles', progress: 2, target: 3 },
    { goal: 'Community Service Hours', progress: 45, target: 50 },
    { goal: 'Technical Certifications', progress: 4, target: 6 }
  ];
};

// Achievements Timeline Data
export const generateAchievementsTimelineData = () => {
  return [
    { date: '2024-01', points: 150, category: 'Academic', importance: 5 },
    { date: '2024-02', points: 200, category: 'Research', importance: 8 },
    { date: '2024-03', points: 175, category: 'Leadership', importance: 6 },
    { date: '2024-04', points: 300, category: 'Academic', importance: 9 },
    { date: '2024-05', points: 125, category: 'Community', importance: 4 },
    { date: '2024-06', points: 250, category: 'Technical', importance: 7 },
    { date: '2024-07', points: 180, category: 'Research', importance: 6 },
    { date: '2024-08', points: 220, category: 'Academic', importance: 8 }
  ];
};

// Rank Comparison Data
export const generateRankComparisonData = () => {
  return [
    { semester: 'Sem 1', myRank: 45, totalStudents: 120, percentile: 62 },
    { semester: 'Sem 2', myRank: 38, totalStudents: 120, percentile: 68 },
    { semester: 'Sem 3', myRank: 32, totalStudents: 118, percentile: 73 },
    { semester: 'Sem 4', myRank: 28, totalStudents: 118, percentile: 76 },
    { semester: 'Sem 5', myRank: 22, totalStudents: 115, percentile: 81 },
    { semester: 'Sem 6', myRank: 18, totalStudents: 115, percentile: 84 }
  ];
};

// Alerts Volume Data
export const generateAlertsVolumeData = () => {
  return [
    { month: 'Jan', alerts: 12, resolved: 10, pending: 2 },
    { month: 'Feb', alerts: 8, resolved: 7, pending: 1 },
    { month: 'Mar', alerts: 15, resolved: 12, pending: 3 },
    { month: 'Apr', alerts: 6, resolved: 6, pending: 0 },
    { month: 'May', alerts: 10, resolved: 8, pending: 2 },
    { month: 'Jun', alerts: 4, resolved: 4, pending: 0 },
    { month: 'Jul', alerts: 9, resolved: 7, pending: 2 },
    { month: 'Aug', alerts: 7, resolved: 6, pending: 1 }
  ];
};

// KPI Tiles Data
export const generateKPITilesData = () => {
  return [
    {
      title: 'Overall GPA',
      value: '3.87',
      change: 2.3,
      sparklineData: [3.2, 3.4, 3.6, 3.7, 3.8, 3.87],
      color: 'primary' as const
    },
    {
      title: 'Attendance Rate',
      value: '94.2%',
      change: 1.8,
      sparklineData: [92, 91, 95, 93, 96, 94.2],
      color: 'success' as const
    },
    {
      title: 'Credits Earned',
      value: '116/120',
      change: 15.2,
      sparklineData: [18, 38, 57, 78, 96, 116],
      color: 'info' as const
    },
    {
      title: 'Class Rank',
      value: '18/115',
      change: -12.5,
      sparklineData: [45, 38, 32, 28, 22, 18],
      color: 'warning' as const
    }
  ];
};

// Combined Analytics Data Generator
export const generateAnalyticsData = () => {
  const currentMonth = new Date();
  
  return {
    gpaProgress: generateGPATrendData(),
    creditsProgress: generateCreditsProgressData(),
    attendanceBySubject: generateAttendanceBySubjectData(),
    attendanceCalendar: generateAttendanceCalendarData(currentMonth),
    weekdayAttendance: generateWeekdayAttendanceData(),
    gradeDistribution: generateGradeDistributionData(),
    assignmentTimeline: generateAssignmentTimelineData(),
    categoryDistribution: generateCategoryDistributionData(),
    goalsProgress: generateGoalsProgressData(),
    achievementsTimeline: generateAchievementsTimelineData(),
    rankComparison: generateRankComparisonData(),
    alertsVolume: generateAlertsVolumeData(),
    kpiTiles: generateKPITilesData()
  };
};
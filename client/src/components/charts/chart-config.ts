export const chartColors = {
  primary: "hsl(var(--chart-1))",
  secondary: "hsl(var(--chart-2))",
  success: "hsl(var(--chart-3))",
  warning: "hsl(var(--chart-4))",
  danger: "hsl(var(--chart-5))",
  info: "hsl(var(--chart-6))",
  purple: "hsl(var(--chart-7))",
  pink: "hsl(var(--chart-8))",
};

export const chartColorPalette = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

export const gradientColors = {
  primary: ["hsl(222, 84%, 24%)", "hsl(222, 84%, 48%)"],
  secondary: ["hsl(220, 18%, 96%)", "hsl(220, 18%, 85%)"],
  success: ["hsl(139, 69%, 32%)", "hsl(139, 69%, 45%)"],
  warning: ["hsl(30, 88%, 42%)", "hsl(30, 88%, 55%)"],
  danger: ["hsl(0, 76%, 54%)", "hsl(0, 76%, 65%)"],
  info: ["hsl(222, 84%, 50%)", "hsl(222, 84%, 65%)"],
};

export const commonTooltipConfig = {
  backgroundColor: "hsl(var(--popover))",
  borderColor: "hsl(var(--border))",
  titleColor: "hsl(var(--foreground))",
  bodyColor: "hsl(var(--muted-foreground))",
  borderWidth: 1,
  borderRadius: 8,
  padding: 12,
  displayColors: true,
  boxPadding: 6,
  usePointStyle: true,
  titleFont: {
    size: 13,
    weight: "600" as const,
    family: "'Inter', sans-serif",
  },
  bodyFont: {
    size: 12,
    weight: "400" as const,
    family: "'Inter', sans-serif",
  },
};

export const responsiveChartOptions = {
  mobile: {
    maintainAspectRatio: true,
    aspectRatio: 1.2,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 10,
          padding: 10,
          font: { size: 11 },
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 10 }, maxRotation: 45 },
      },
      y: {
        ticks: { font: { size: 10 } },
      },
    },
  },
  tablet: {
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 12,
          padding: 12,
          font: { size: 12 },
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 11 } },
      },
      y: {
        ticks: { font: { size: 11 } },
      },
    },
  },
  desktop: {
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 14,
          padding: 15,
          font: { size: 13 },
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 12 } },
      },
      y: {
        ticks: { font: { size: 12 } },
      },
    },
  },
  tv: {
    maintainAspectRatio: true,
    aspectRatio: 2.5,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          boxWidth: 16,
          padding: 20,
          font: { size: 15 },
        },
      },
    },
    scales: {
      x: {
        ticks: { font: { size: 14 } },
      },
      y: {
        ticks: { font: { size: 14 } },
      },
    },
  },
};

export const getResponsiveChartConfig = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  if (width <= 640) return responsiveChartOptions.mobile;
  if (width <= 1024) return responsiveChartOptions.tablet;
  if (width <= 1536) return responsiveChartOptions.desktop;
  return responsiveChartOptions.tv;
};

export const baseChartConfig = {
  responsive: true,
  maintainAspectRatio: true,
  interaction: {
    mode: "index" as const,
    intersect: false,
  },
  plugins: {
    tooltip: commonTooltipConfig,
    legend: {
      display: true,
      position: "top" as const,
      labels: {
        usePointStyle: true,
        padding: 15,
        font: {
          size: 12,
          family: "'Inter', sans-serif",
        },
        color: "hsl(var(--foreground))",
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "hsl(var(--border))",
        borderColor: "hsl(var(--border))",
      },
      ticks: {
        color: "hsl(var(--muted-foreground))",
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
    },
    y: {
      grid: {
        color: "hsl(var(--border))",
        borderColor: "hsl(var(--border))",
      },
      ticks: {
        color: "hsl(var(--muted-foreground))",
        font: {
          size: 11,
          family: "'Inter', sans-serif",
        },
      },
    },
  },
};

export const echartsTheme = {
  color: chartColorPalette,
  backgroundColor: "transparent",
  textStyle: {
    fontFamily: "'Inter', sans-serif",
    color: "hsl(var(--foreground))",
  },
  title: {
    textStyle: {
      color: "hsl(var(--foreground))",
      fontWeight: 600,
    },
    subtextStyle: {
      color: "hsl(var(--muted-foreground))",
    },
  },
  line: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 3,
    },
    symbolSize: 6,
    smooth: true,
  },
  bar: {
    itemStyle: {
      borderRadius: [4, 4, 0, 0],
    },
  },
  pie: {
    itemStyle: {
      borderRadius: 4,
      borderColor: "hsl(var(--background))",
      borderWidth: 2,
    },
  },
  radar: {
    itemStyle: {
      borderWidth: 2,
    },
    lineStyle: {
      width: 2,
    },
    symbolSize: 4,
  },
  categoryAxis: {
    axisLine: {
      lineStyle: {
        color: "hsl(var(--border))",
      },
    },
    axisTick: {
      lineStyle: {
        color: "hsl(var(--border))",
      },
    },
    axisLabel: {
      color: "hsl(var(--muted-foreground))",
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: ["hsl(var(--border))"],
      },
    },
  },
  valueAxis: {
    axisLine: {
      lineStyle: {
        color: "hsl(var(--border))",
      },
    },
    axisTick: {
      lineStyle: {
        color: "hsl(var(--border))",
      },
    },
    axisLabel: {
      color: "hsl(var(--muted-foreground))",
      fontSize: 11,
    },
    splitLine: {
      lineStyle: {
        color: ["hsl(var(--border))"],
      },
    },
  },
  toolbox: {
    iconStyle: {
      borderColor: "hsl(var(--muted-foreground))",
    },
  },
  legend: {
    textStyle: {
      color: "hsl(var(--foreground))",
    },
  },
  tooltip: {
    backgroundColor: "hsl(var(--popover))",
    borderColor: "hsl(var(--border))",
    borderWidth: 1,
    textStyle: {
      color: "hsl(var(--foreground))",
    },
  },
  dataZoom: {
    backgroundColor: "hsl(var(--muted))",
    dataBackgroundColor: "hsl(var(--muted-foreground) / 0.3)",
    fillerColor: "hsl(var(--primary) / 0.2)",
    handleColor: "hsl(var(--primary))",
    textStyle: {
      color: "hsl(var(--muted-foreground))",
    },
  },
};

export const rechartsConfig = {
  margin: { top: 20, right: 30, left: 20, bottom: 5 },
  cartesianGrid: {
    strokeDasharray: "3 3",
    stroke: "hsl(var(--border))",
  },
  xAxis: {
    stroke: "hsl(var(--muted-foreground))",
    style: {
      fontSize: "11px",
      fontFamily: "'Inter', sans-serif",
      fill: "hsl(var(--muted-foreground))",
    },
  },
  yAxis: {
    stroke: "hsl(var(--muted-foreground))",
    style: {
      fontSize: "11px",
      fontFamily: "'Inter', sans-serif",
      fill: "hsl(var(--muted-foreground))",
    },
  },
  tooltip: {
    contentStyle: {
      backgroundColor: "hsl(var(--popover))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "8px",
      fontSize: "12px",
      fontFamily: "'Inter', sans-serif",
      color: "hsl(var(--foreground))",
    },
    itemStyle: {
      color: "hsl(var(--foreground))",
    },
    labelStyle: {
      color: "hsl(var(--muted-foreground))",
    },
  },
  legend: {
    wrapperStyle: {
      fontSize: "12px",
      fontFamily: "'Inter', sans-serif",
      color: "hsl(var(--foreground))",
    },
  },
};

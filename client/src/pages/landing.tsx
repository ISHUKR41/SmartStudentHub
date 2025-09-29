/**
 * Enhanced Landing Page Component for Smart Student Hub
 * 
 * A comprehensive, modern landing page that showcases the institutional capabilities
 * of the Student Activity Record Management System with professional animations,
 * full responsiveness, and detailed content for all stakeholders.
 * 
 * Features:
 * - Framer Motion animations and transitions
 * - Animated counters and scroll-triggered reveals
 * - Complete responsiveness (320px to 2560px+)
 * - Comprehensive content sections
 * - Professional academic design
 * - SEO optimization and accessibility
 */

import { useState, useEffect, useMemo } from "react";
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { useInView as useIntersectionObserver } from "react-intersection-observer";
import CountUp from "react-countup";
import { useSpring, animated, config } from "react-spring";
import { 
  GraduationCap, Shield, Users, BarChart3, FileCheck, Award, TrendingUp, 
  Database, CheckCircle, Building, Clock, Search, BookOpen, Briefcase, 
  Trophy, Globe, Star, Zap, Settings, Lock, Cloud, Cpu, UserCheck, 
  Workflow, Target, Calendar, Smartphone, ChevronDown, Menu, X,
  Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin,
  Plus, Minus, ArrowRight, Play, CheckSquare, AlertCircle,
  Lightbulb, Layers, Rocket, Heart, Monitor, TabletSmartphone, FileText,
  Filter, SortAsc, SortDesc, Sparkles, MousePointer, Gamepad2,
  Headphones, Video, MessageSquare, ThumbsUp, Eye, Download,
  Activity, TrendingDown,
  ChevronRight, ChevronLeft, CircleDot, Mic, Camera, Share,
  Bell, Bookmark, Flag, HelpCircle, MessageCircle, Send,
  Quote, MapPinned, PhoneCall, ExternalLink, Copy, Check
} from "lucide-react";
import { 
  FaReact, FaNodeJs, FaAws, FaDocker, FaMicrosoft, FaGoogle,
  FaApple, FaAndroid, FaLinux, FaWindows, FaDatabase, FaCloud,
  FaShieldAlt, FaCertificate, FaChartLine, FaRocket
} from "react-icons/fa";
import { 
  SiKubernetes, SiRedis, SiPostgresql, SiMongodb, SiElasticsearch,
  SiGraphql, SiTypescript, SiTailwindcss, SiFramer
} from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  AreaChart, Area, BarChart as RechartsBarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, ComposedChart, ScatterChart, Scatter
} from "recharts";

// Enhanced Animated Counter Component with react-countup
const AnimatedCounter = ({ end, duration = 2, suffix = "", prefix = "", decimals = 0 }: { 
  end: number; 
  duration?: number; 
  suffix?: string; 
  prefix?: string;
  decimals?: number;
}) => {
  const { ref, inView } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <span ref={ref} data-testid={`animated-counter-${end}`}>
      {inView ? (
        <CountUp
          start={0}
          end={end}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          separator=","
          preserveValue
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
};

// Advanced Interactive Chart Component
const InteractiveChart = ({ data, type = "area", color = "#3B82F6" }: {
  data: any[];
  type?: "area" | "bar" | "line" | "pie";
  color?: string;
}) => {
  const { ref, inView } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Create a safe gradient ID by removing special characters
  const gradientId = useMemo(() => 
    `grad-${color.replace(/[^a-zA-Z0-9_-]/g, "")}`, 
    [color]
  );

  const chartProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  };

  if (!inView || !data || data.length === 0) {
    return <div ref={ref} className="w-full h-80 flex items-center justify-center text-muted-foreground">Loading chart...</div>;
  }

  // Render the appropriate chart type as a single child
  let chartElement;
  
  if (type === "area") {
    chartElement = (
      <AreaChart {...chartProps}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }} 
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          fillOpacity={1} 
          fill={`url(#${gradientId})`}
          strokeWidth={3}
        />
      </AreaChart>
    );
  } else if (type === "bar") {
    chartElement = (
      <RechartsBarChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }} 
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    );
  } else if (type === "line") {
    chartElement = (
      <RechartsLineChart {...chartProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            border: 'none', 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }} 
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={color} 
          strokeWidth={3}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </RechartsLineChart>
    );
  } else if (type === "pie") {
    chartElement = (
      <RechartsPieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill={color}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    );
  }

  return (
    <div ref={ref} className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        {chartElement}
      </ResponsiveContainer>
    </div>
  );
};

// Professional Avatar Component with ratings
const TestimonialAvatar = ({ src, name, role, rating, company }: {
  src: string;
  name: string;
  role: string;
  rating: number;
  company: string;
}) => {
  return (
    <motion.div 
      className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20"
        whileHover={{ scale: 1.1 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">{name.charAt(0)}</span>
        </div>
        <motion.div 
          className="absolute inset-0 bg-primary/20 rounded-full"
          initial={{ scale: 0 }}
          whileHover={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      <div className="flex-1">
        <h4 className="font-semibold text-foreground text-sm">{name}</h4>
        <p className="text-muted-foreground text-xs">{role}</p>
        <p className="text-muted-foreground text-xs font-medium">{company}</p>
        <div className="flex items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              className={`w-3 h-3 ${
                i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Contact Form Schema
const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  institution: z.string().min(2, "Institution name is required"),
  role: z.string().min(1, "Please select your role"),
  studentCount: z.string().min(1, "Please select student count range"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.boolean().refine(val => val === true, "You must agree to be contacted")
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Mobile Menu Component
const MobileMenu = ({ isOpen, onToggle, setLocation }: { isOpen: boolean; onToggle: () => void; setLocation: (path: string) => void }) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="md:hidden"
        data-testid="mobile-menu-toggle"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-border shadow-lg md:hidden z-50"
          data-testid="mobile-menu"
        >
          <div className="p-4 space-y-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo';
                onToggle();
              }}
              className="w-full"
              data-testid="mobile-demo-button"
            >
              Schedule Demo
            </Button>
            <Button
              onClick={() => setLocation('/login')}
              size="sm"
              className="w-full"
              data-testid="mobile-login-button"
            >
              Sign In
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  // Set document title for SEO
  useEffect(() => {
    document.title = "Smart Student Hub - Centralized Digital Platform for Comprehensive Student Activity Records";
  }, []);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
        {/* Enhanced Header with Mobile Menu */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-card/95 border-b border-border sticky top-0 z-50 backdrop-blur-md supports-[backdrop-filter]:bg-opacity-60"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4">
            <div className="flex items-center justify-between relative">
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 2xl:w-16 2xl:h-16 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 2xl:w-9 2xl:h-9 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground" data-testid="site-title">
                    Smart Student Hub
                  </h1>
                  <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground hidden sm:block" data-testid="site-subtitle">
                    Institutional Excellence Management System
                  </p>
                </div>
              </motion.div>
              
              <div className="hidden md:flex items-center space-x-4">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo'}
                  className="hover:scale-105 transition-transform"
                  data-testid="desktop-demo-button"
                >
                  Schedule Demo
                </Button>
                <Button 
                  onClick={() => setLocation('/login')}
                  size="sm"
                  className="hover:scale-105 transition-transform shadow-md"
                  data-testid="desktop-login-button"
                >
                  Sign In
                </Button>
              </div>
              
              <MobileMenu isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} setLocation={setLocation} />
            </div>
          </div>
        </motion.header>

        {/* Hero Section with Enhanced Animations */}
        <section className="relative py-16 sm:py-20 lg:py-28 xl:py-32 2xl:py-40 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <motion.div 
            className="relative max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center mb-16 lg:mb-20">
              <motion.div variants={itemVariants}>
                <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm xl:text-base 2xl:text-lg font-medium" data-testid="hero-badge">
                  Powering Excellence in 150+ Higher Education Institutions Globally
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-foreground mb-8 leading-tight tracking-tight"
                data-testid="hero-title"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Centralized Digital Platform
                </span>
                <br />
                <span className="text-foreground">
                  for Comprehensive Student Activity Records
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-muted-foreground mb-10 max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto leading-relaxed"
                data-testid="hero-description"
              >
                Revolutionize your Higher Education Institution's approach to student achievement documentation 
                with an enterprise-grade digital ecosystem. Automate compliance reporting, enhance accreditation 
                readiness, and create verified student portfolios that drive <strong className="text-primary font-semibold">measurable 
                improvements in NAAC grades, NIRF rankings, and student placement outcomes</strong>.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setLocation('/login')}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-10 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                    data-testid="cta-launch-platform"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Launch Platform Now
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo'}
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-10 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="cta-schedule-demo"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Institution Demo
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Enhanced Key Metrics with Animated Counters */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12 max-w-6xl xl:max-w-7xl 2xl:max-w-8xl mx-auto"
            >
              {[
                { number: 75000, suffix: "+", label: "Student Activities Tracked", icon: Database, color: "text-blue-600" },
                { number: 2500, suffix: "+", label: "Daily Faculty Verifications", icon: Shield, color: "text-green-600" },
                { number: 150, suffix: "+", label: "Institutions Empowered", icon: Building, color: "text-purple-600" },
                { number: 99.9, suffix: "%", label: "System Reliability", icon: Clock, color: "text-orange-600" },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    y: -5 
                  }}
                  className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center group"
                  data-testid={`metric-card-${index}`}
                >
                  <metric.icon className={`w-10 h-10 ${metric.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold ${metric.color} mb-2`} data-testid={`metric-${index}`}>
                    <AnimatedCounter end={metric.number} suffix={metric.suffix} />
                  </div>
                  <div className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-muted-foreground font-medium">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Role-Specific CTAs Section */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white dark:bg-gray-900">
          <motion.div 
            className="max-w-7xl xl:max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="role-ctas-title"
              >
                Tailored Solutions for Every Stakeholder
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="role-ctas-description"
              >
                Discover how Smart Student Hub transforms experiences for students, faculty, and administrators 
                with specialized features designed for each role's unique needs.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              {[
                {
                  title: "For Students",
                  subtitle: "Build Your Digital Portfolio",
                  icon: Users,
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
                  benefits: [
                    "Document all academic and co-curricular activities seamlessly",
                    "Get instant faculty verification for credible achievements",
                    "Generate professional portfolios for placements and applications",
                    "Track skill development and career readiness progress",
                    "Access mobile-friendly interface for on-the-go updates"
                  ],
                  cta: {
                    primary: "Start Building Portfolio",
                    secondary: "View Student Demo",
                    primaryAction: () => setLocation('/login'),
                    secondaryAction: () => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Student Demo Request'
                  },
                  stats: [
                    { label: "Average Portfolio Views", value: "250+" },
                    { label: "Placement Success Rate", value: "85%" },
                    { label: "Time Saved Per Application", value: "4 Hours" }
                  ]
                },
                {
                  title: "For Faculty",
                  subtitle: "Streamline Verification & Assessment",
                  icon: Shield,
                  color: "from-green-500 to-emerald-500",
                  bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                  benefits: [
                    "Efficient bulk verification workflows with smart assignment",
                    "Comprehensive evidence review with plagiarism detection",
                    "Standardized rubrics for consistent quality assessment",
                    "Real-time dashboard for tracking verification progress",
                    "Automated notifications and reminders system"
                  ],
                  cta: {
                    primary: "Access Faculty Portal",
                    secondary: "Faculty Training",
                    primaryAction: () => setLocation('/login'),
                    secondaryAction: () => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Faculty Training Request'
                  },
                  stats: [
                    { label: "Time Reduction", value: "70%" },
                    { label: "Verification Accuracy", value: "99.5%" },
                    { label: "Faculty Satisfaction", value: "4.8/5" }
                  ]
                },
                {
                  title: "For Administrators",
                  subtitle: "Institutional Excellence Management",
                  icon: Building,
                  color: "from-purple-500 to-pink-500",
                  bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
                  benefits: [
                    "One-click NAAC, NIRF, and AICTE compliance reports",
                    "Advanced analytics for institutional decision-making",
                    "Seamless ERP and LMS system integrations",
                    "Comprehensive audit trails and data security",
                    "ROI tracking and performance metrics dashboard"
                  ],
                  cta: {
                    primary: "Schedule Institution Demo",
                    secondary: "Get ROI Analysis",
                    primaryAction: () => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Institution Demo Request',
                    secondaryAction: () => window.location.href = 'mailto:contact@smartstudenthub.com?subject=ROI Analysis Request'
                  },
                  stats: [
                    { label: "Accreditation Prep Time", value: "-90%" },
                    { label: "Data Accuracy", value: "100%" },
                    { label: "Implementation Time", value: "2-4 Weeks" }
                  ]
                }
              ].map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="group relative"
                  data-testid={`role-cta-${index}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.bgColor} rounded-3xl transform group-hover:scale-105 transition-transform duration-500 opacity-50`}></div>
                  
                  <Card className="relative h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                    <CardHeader className="text-center pb-6 relative">
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${role.color}"></div>
                      <div className={`w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-gradient-to-br ${role.color} rounded-full flex items-center justify-center mx-auto mb-6 mt-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <role.icon className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 text-white" />
                      </div>
                      <CardTitle className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground mb-2">{role.title}</CardTitle>
                      <p className="text-lg xl:text-xl 2xl:text-2xl text-muted-foreground font-medium">{role.subtitle}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        {role.benefits.map((benefit, benefitIndex) => (
                          <motion.div
                            key={benefitIndex}
                            className="flex items-start space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: (index * 0.2) + (benefitIndex * 0.1) }}
                          >
                            <CheckCircle className="w-5 h-5 xl:w-6 xl:h-6 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed">{benefit}</span>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Role-specific stats */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
                        {role.stats.map((stat, statIndex) => (
                          <div key={statIndex} className="text-center">
                            <div className={`text-lg xl:text-xl 2xl:text-2xl font-bold bg-gradient-to-r ${role.color} bg-clip-text text-transparent`}>
                              {stat.value}
                            </div>
                            <div className="text-xs xl:text-sm 2xl:text-base text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      
                      {/* CTAs */}
                      <div className="space-y-3 pt-4">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={role.cta.primaryAction}
                            className={`w-full bg-gradient-to-r ${role.color} hover:opacity-90 text-white py-3 xl:py-4 2xl:py-5 text-base xl:text-lg 2xl:text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
                            data-testid={`role-primary-cta-${index}`}
                          >
                            <ArrowRight className="w-5 h-5 xl:w-6 xl:h-6 mr-2" />
                            {role.cta.primary}
                          </Button>
                        </motion.div>
                        
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={role.cta.secondaryAction}
                            variant="outline"
                            className="w-full border-2 py-3 xl:py-4 2xl:py-5 text-base xl:text-lg 2xl:text-xl font-medium rounded-xl hover:shadow-lg transition-all duration-300"
                            data-testid={`role-secondary-cta-${index}`}
                          >
                            <Play className="w-4 h-4 xl:w-5 xl:h-5 mr-2" />
                            {role.cta.secondary}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Institutional Compliance & Standards Section */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white dark:bg-gray-900">
          <motion.div 
            className="max-w-7xl xl:max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="compliance-title"
              >
                Industry-Leading Compliance & Security Standards
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Built with enterprise-grade security and compliance frameworks that meet the highest standards 
                of Higher Education Institutions and regulatory bodies worldwide.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
              {[
                {
                  icon: Shield,
                  title: "NAAC Ready",
                  description: "Fully compliant with NAAC accreditation standards and reporting requirements",
                  badge: "Grade A+ Compatible"
                },
                {
                  icon: Award,
                  title: "NIRF Aligned", 
                  description: "Structured data collection aligned with NIRF ranking parameters and metrics",
                  badge: "Ranking Optimized"
                },
                {
                  icon: Lock,
                  title: "Data Security",
                  description: "Enterprise-grade encryption, secure authentication, and GDPR compliance",
                  badge: "ISO 27001 Ready"
                },
                {
                  icon: Cloud,
                  title: "Cloud Infrastructure",
                  description: "Scalable, reliable cloud hosting with 99.9% uptime and automatic backups",
                  badge: "99.9% Uptime"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Card className="h-full bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                        <item.icon className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-primary" />
                      </div>
                      <Badge variant="secondary" className="mb-3 text-xs xl:text-sm font-medium">{item.badge}</Badge>
                      <h3 className="text-lg xl:text-xl 2xl:text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                      <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Technical Specifications Section */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
          <motion.div 
            className="max-w-7xl xl:max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Advanced Technical Capabilities
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Built on modern architecture with cutting-edge technology stack for optimal performance, 
                scalability, and user experience across all institutional environments.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground mb-6">Platform Architecture</h3>
                {[
                  {
                    icon: Database,
                    title: "PostgreSQL Database",
                    description: "Robust relational database with advanced indexing and transaction support"
                  },
                  {
                    icon: Cloud,
                    title: "Cloud-Native Design",
                    description: "Microservices architecture with horizontal scaling and load balancing"
                  },
                  {
                    icon: Shield,
                    title: "JWT Authentication",
                    description: "Secure token-based authentication with role-based access control"
                  },
                  {
                    icon: Zap,
                    title: "Real-time Updates",
                    description: "WebSocket integration for instant notifications and live data synchronization"
                  }
                ].map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <tech.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-xl font-semibold text-foreground mb-2">{tech.title}</h4>
                      <p className="text-sm xl:text-base text-muted-foreground">{tech.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground mb-6">Integration Capabilities</h3>
                {[
                  {
                    icon: Globe,
                    title: "ERP System Integration",
                    description: "Seamless integration with existing institutional ERP and management systems"
                  },
                  {
                    icon: FileText,
                    title: "Document Processing",
                    description: "AI-powered document verification and automated certificate validation"
                  },
                  {
                    icon: BarChart3,
                    title: "Analytics Engine",
                    description: "Advanced analytics with custom dashboards and predictive insights"
                  },
                  {
                    icon: Smartphone,
                    title: "Mobile Responsive",
                    description: "Progressive Web App (PWA) with native mobile app performance"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg xl:text-xl font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-sm xl:text-base text-muted-foreground">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Live Data Visualization Dashboard Section */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
          <motion.div 
            className="max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="data-viz-title"
              >
                Real-Time Analytics & Insights Dashboard
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="data-viz-description"
              >
                Interactive data visualization powered by advanced analytics provides institutional leaders 
                with real-time insights into student engagement, faculty efficiency, and institutional performance metrics.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              {/* Student Activity Trends */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="lg:col-span-2 xl:col-span-2"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-foreground flex items-center">
                        <TrendingUp className="w-6 h-6 xl:w-8 xl:h-8 text-blue-600 mr-3" />
                        Student Activity Trends
                      </CardTitle>
                      <Badge variant="secondary" className="text-sm xl:text-base">Live Data</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <InteractiveChart 
                      data={[
                        { name: 'Jan', value: 1200 },
                        { name: 'Feb', value: 1800 },
                        { name: 'Mar', value: 2200 },
                        { name: 'Apr', value: 2800 },
                        { name: 'May', value: 3200 },
                        { name: 'Jun', value: 3800 },
                        { name: 'Jul', value: 4200 },
                        { name: 'Aug', value: 4800 },
                      ]}
                      type="area"
                      color="#3B82F6"
                    />
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                      <div className="text-center">
                        <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-blue-600">
                          <AnimatedCounter end={4800} suffix="+" />
                        </div>
                        <p className="text-sm xl:text-base text-muted-foreground">Activities This Month</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-green-600">
                          +35%
                        </div>
                        <p className="text-sm xl:text-base text-muted-foreground">Growth Rate</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-purple-600">
                          <AnimatedCounter end={92} suffix="%" />
                        </div>
                        <p className="text-sm xl:text-base text-muted-foreground">Verification Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Institutional Performance Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="xl:col-span-1"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-foreground flex items-center">
                      <Award className="w-6 h-6 xl:w-8 xl:h-8 text-yellow-600 mr-3" />
                      NAAC Readiness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: "Criterion I: Curricular Aspects", value: 98, color: "bg-green-500" },
                      { label: "Criterion II: Teaching-Learning", value: 95, color: "bg-blue-500" },
                      { label: "Criterion III: Research", value: 88, color: "bg-purple-500" },
                      { label: "Criterion IV: Infrastructure", value: 92, color: "bg-orange-500" },
                      { label: "Criterion V: Student Support", value: 96, color: "bg-teal-500" },
                    ].map((criterion, index) => (
                      <motion.div
                        key={index}
                        className="space-y-2"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm xl:text-base font-medium text-foreground">{criterion.label}</span>
                          <span className="text-sm xl:text-base font-bold text-foreground">{criterion.value}%</span>
                        </div>
                        <Progress value={criterion.value} className="h-3" />
                      </motion.div>
                    ))}
                    <div className="pt-4 border-t border-border text-center">
                      <div className="text-3xl xl:text-4xl 2xl:text-5xl font-bold text-green-600 mb-2">
                        A+
                      </div>
                      <p className="text-sm xl:text-base text-muted-foreground">Projected NAAC Grade</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Department-wise Analytics */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="lg:col-span-2 xl:col-span-2"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-foreground flex items-center">
                      <BarChart3 className="w-6 h-6 xl:w-8 xl:h-8 text-purple-600 mr-3" />
                      Department Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InteractiveChart 
                      data={[
                        { name: 'Computer Science', value: 450 },
                        { name: 'Mechanical', value: 380 },
                        { name: 'Electronics', value: 320 },
                        { name: 'Civil', value: 290 },
                        { name: 'Business', value: 410 },
                        { name: 'Arts & Science', value: 350 },
                      ]}
                      type="bar"
                      color="#8B5CF6"
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Placement Success Metrics */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="xl:col-span-1"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-foreground flex items-center">
                      <Briefcase className="w-6 h-6 xl:w-8 xl:h-8 text-green-600 mr-3" />
                      Placement Impact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <InteractiveChart 
                      data={[
                        { name: 'With Platform', value: 85 },
                        { name: 'Traditional', value: 62 },
                      ]}
                      type="pie"
                      color="#10B981"
                    />
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm xl:text-base text-muted-foreground">Success Rate Increase</span>
                        <span className="text-xl xl:text-2xl font-bold text-green-600">+37%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm xl:text-base text-muted-foreground">Time Reduction</span>
                        <span className="text-xl xl:text-2xl font-bold text-blue-600">-60%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm xl:text-base text-muted-foreground">Portfolio Quality</span>
                        <span className="text-xl xl:text-2xl font-bold text-purple-600">+95%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Comprehensive Testimonials Section with Animated Avatars and Ratings */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white dark:bg-gray-900">
          <motion.div 
            className="max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="testimonials-title"
              >
                Trusted by 150+ Leading Institutions Worldwide
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="testimonials-description"
              >
                Hear from Vice-Chancellors, Deans, and academic leaders who have transformed their institutions 
                with Smart Student Hub's comprehensive student achievement management platform.
              </motion.p>
            </div>

            {/* Testimonial Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              {[
                {
                  name: "Dr. Rajesh Kumar",
                  role: "Vice-Chancellor",
                  company: "University of Delhi",
                  rating: 5,
                  quote: "Smart Student Hub revolutionized our accreditation process. We achieved NAAC A++ grade with 90% less preparation time. The automated compliance reporting and real-time analytics have been game-changing for our institution's excellence journey.",
                  impact: "NAAC A++ Grade Achieved",
                  metrics: { time: "90%", accuracy: "100%", satisfaction: "98%" }
                },
                {
                  name: "Prof. Priya Sharma",
                  role: "Dean of Academic Affairs",
                  company: "IIT Bombay",
                  rating: 5,
                  quote: "The platform's integration with our existing ERP system was seamless. Faculty verification workflows have reduced administrative burden by 75%, allowing our professors to focus more on teaching and research excellence.",
                  impact: "75% Reduction in Admin Work",
                  metrics: { efficiency: "85%", adoption: "96%", timeToValue: "2 weeks" }
                },
                {
                  name: "Dr. Suresh Patel",
                  role: "Registrar",
                  company: "Anna University",
                  rating: 5,
                  quote: "Student portfolio generation for placements has improved dramatically. Our placement success rate increased by 40% within the first semester of implementation. Companies now prefer our students' verified portfolios.",
                  impact: "40% Increase in Placements",
                  metrics: { placements: "40%", quality: "95%", recruiterSatisfaction: "92%" }
                },
                {
                  name: "Dr. Meera Nair",
                  role: "Director of Student Affairs",
                  company: "Manipal Academy",
                  rating: 5,
                  quote: "The real-time analytics dashboard provides unprecedented insights into student engagement and institutional performance. Our NIRF ranking improved by 15 positions within two years of implementation.",
                  impact: "NIRF Ranking +15 Positions",
                  metrics: { ranking: "+15", dataAccuracy: "99.9%", insights: "24/7" }
                },
                {
                  name: "Prof. Anil Gupta",
                  role: "Head of IT Services",
                  company: "Jawaharlal Nehru University",
                  rating: 5,
                  quote: "Security and compliance were our top concerns. The platform's SOC 2 certification, end-to-end encryption, and GDPR compliance gave us complete confidence in protecting our students' sensitive data.",
                  impact: "100% Security Compliance",
                  metrics: { security: "SOC 2", uptime: "99.99%", compliance: "100%" }
                },
                {
                  name: "Dr. Kavita Singh",
                  role: "Pro-Vice-Chancellor",
                  company: "Banaras Hindu University",
                  rating: 5,
                  quote: "Implementation was surprisingly smooth with their dedicated support team. The comprehensive training programs ensured 100% faculty adoption within 3 weeks. ROI was visible from month one itself.",
                  impact: "100% Faculty Adoption",
                  metrics: { implementation: "3 weeks", training: "100%", roi: "Month 1" }
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="group"
                  data-testid={`testimonial-${index}`}
                >
                  <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden group-hover:-translate-y-2">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <TestimonialAvatar 
                          src=""
                          name={testimonial.name}
                          role={testimonial.role}
                          rating={testimonial.rating}
                          company={testimonial.company}
                        />
                        <Quote className="w-8 h-8 xl:w-10 xl:h-10 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />
                      </div>
                      <Badge variant="secondary" className="w-fit text-sm xl:text-base font-medium">
                        {testimonial.impact}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <blockquote className="text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed italic">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                        {Object.entries(testimonial.metrics).map(([key, value], metricIndex) => (
                          <div key={metricIndex} className="text-center">
                            <div className="text-lg xl:text-xl 2xl:text-2xl font-bold text-primary">
                              {value}
                            </div>
                            <div className="text-xs xl:text-sm text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Trust Indicators */}
            <motion.div 
              className="mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { metric: "150+", label: "Partner Institutions", icon: Building },
                { metric: "4.9/5", label: "Customer Rating", icon: Star },
                { metric: "99.9%", label: "Platform Uptime", icon: Shield },
                { metric: "24/7", label: "Expert Support", icon: Headphones },
                { metric: "SOC 2", label: "Security Certified", icon: Lock },
                { metric: "GDPR", label: "Compliant", icon: CheckCircle },
              ].map((indicator, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                    <indicator.icon className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-primary" />
                  </div>
                  <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {indicator.metric}
                  </div>
                  <div className="text-sm xl:text-base 2xl:text-lg text-muted-foreground font-medium">
                    {indicator.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Student Success Story - Enhanced */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="success-story-title"
              >
                Student Success Story: ISHU KUMAR
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="success-story-description"
              >
                See how students like ISHU KUMAR leverage our platform to systematically document their academic 
                journey and build comprehensive portfolios that showcase institutional achievements.
              </motion.p>
            </div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-12 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <motion.div 
                  className="lg:col-span-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <div className="relative z-10">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <Users className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-3" data-testid="student-name">ISHU KUMAR</h3>
                      <p className="text-blue-100 mb-4 text-lg">B.Tech Computer Science Engineering</p>
                      <div className="space-y-1 text-sm">
                        <p className="text-blue-100">NIT Delhi</p>
                        <p className="text-blue-100">Roll No: 20CS3024</p>
                        <p className="text-blue-100">CGPA: 8.7/10</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      {
                        icon: Award,
                        title: "Academic Excellence",
                        color: "text-yellow-600",
                        items: [
                          "Research contributions in Machine Learning",
                          "Consistent academic performance (8.7 CGPA)",
                          "Technical competition participation",
                          "Project work in AI/ML domain"
                        ]
                      },
                      {
                        icon: Briefcase,
                        title: "Professional Development",
                        color: "text-blue-600",
                        items: [
                          "Industry internship at Google",
                          "Professional certification courses",
                          "Technical skill development",
                          "Open source contributions"
                        ]
                      },
                      {
                        icon: Trophy,
                        title: "Leadership & Co-curricular",
                        color: "text-green-600",
                        items: [
                          "Student body leadership roles",
                          "Event organization and coordination",
                          "Community service activities",
                          "Peer mentoring and guidance"
                        ]
                      },
                      {
                        icon: Star,
                        title: "Platform Outcomes",
                        color: "text-purple-600",
                        items: [
                          "Comprehensive verified portfolio",
                          "Enhanced placement readiness",
                          "Institutional verification benefits",
                          "Streamlined documentation process"
                        ]
                      }
                    ].map((category, index) => (
                      <motion.div
                        key={index}
                        className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center mb-4">
                          <category.icon className={`w-6 h-6 ${category.color} mr-3`} />
                          <h4 className="font-semibold text-foreground text-lg">{category.title}</h4>
                        </div>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div 
                    className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm lg:text-base text-muted-foreground italic leading-relaxed mb-3">
                          "The platform helps me maintain a complete record of all my academic and co-curricular activities. 
                          Having faculty verification for each achievement adds credibility, and the portfolio generation 
                          feature saves significant time during placement applications."
                        </p>
                        <p className="text-sm font-medium text-primary" data-testid="student-testimonial">
                          - ISHU KUMAR, Computer Science Engineering Student
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Comprehensive Features Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="features-title"
              >
                Complete Student Achievement Ecosystem
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="features-description"
              >
                Centralize documentation and streamline data collection. Our platform provides a unified repository 
                for all student activities - from academic achievements to co-curricular participation, internships, 
                and leadership roles.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Database,
                  title: "Comprehensive Activity Tracking",
                  description: "Record and categorize all student activities including seminars, hackathons, MOOCs, internships, leadership roles, and volunteering efforts with automated documentation and smart categorization.",
                  color: "from-blue-500 to-cyan-500",
                  features: ["Auto-categorization", "Bulk uploads", "Evidence validation", "Progress tracking"]
                },
                {
                  icon: Shield,
                  title: "Faculty Verification System",
                  description: "Multi-level approval workflow ensures every achievement is verified by authorized faculty, maintaining institutional credibility and authenticity with transparent audit trails.",
                  color: "from-green-500 to-emerald-500",
                  features: ["Multi-level approval", "Audit trails", "Bulk verifications", "Quality assurance"]
                },
                {
                  icon: FileCheck,
                  title: "NAAC/NIRF Compliance",
                  description: "Automated report generation for NAAC accreditation, NIRF rankings, and AICTE compliance with pre-configured templates, data mapping, and one-click exports.",
                  color: "from-purple-500 to-pink-500",
                  features: ["Auto-reporting", "Template mapping", "Compliance tracking", "Export formats"]
                },
                {
                  icon: Award,
                  title: "Digital Portfolio Generation",
                  description: "Auto-generated professional portfolios with institutional logos, verification stamps, QR codes, and shareable links for placements and higher education applications.",
                  color: "from-orange-500 to-red-500",
                  features: ["Professional templates", "QR code sharing", "Custom branding", "PDF exports"]
                },
                {
                  icon: BarChart3,
                  title: "Advanced Analytics Dashboard",
                  description: "Department-wise statistics, year-over-year growth analysis, participation trends, and data-driven insights for institutional decision-making and strategic planning.",
                  color: "from-indigo-500 to-purple-500",
                  features: ["Real-time analytics", "Custom reports", "Trend analysis", "Predictive insights"]
                },
                {
                  icon: Building,
                  title: "ERP & LMS Integration",
                  description: "Seamless integration with existing institutional systems including ERP, Learning Management Systems, and placement portals for unified data management and workflow automation.",
                  color: "from-teal-500 to-cyan-500",
                  features: ["API integrations", "Data synchronization", "Workflow automation", "System connectivity"]
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 bg-white dark:bg-gray-800" data-testid={`feature-card-${index}`}>
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="space-y-2">
                        {feature.features.map((feat, featIndex) => (
                          <div key={featIndex} className="flex items-center justify-center text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feat}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Technical Architecture & Security Section */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
          <motion.div 
            className="max-w-7xl xl:max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="tech-architecture-title"
              >
                Enterprise-Grade Technology Architecture
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="tech-architecture-description"
              >
                Built with cutting-edge technology stack and robust security frameworks to ensure scalability, 
                reliability, and compliance with international educational technology standards.
              </motion.p>
            </div>

            {/* Technology Stack Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-16">
              {/* Cloud Infrastructure */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Cloud className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 text-white" />
                    </div>
                    <CardTitle className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground">Cloud Infrastructure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "Multi-Cloud Architecture",
                        description: "AWS, Azure, and GCP deployment options with automatic failover and load balancing for 99.99% uptime guarantee."
                      },
                      {
                        title: "Global CDN Network",
                        description: "Content delivery through 150+ global edge locations ensuring sub-200ms response times worldwide."
                      },
                      {
                        title: "Auto-Scaling Infrastructure",
                        description: "Kubernetes-based microservices that automatically scale from 100 to 100,000+ concurrent users seamlessly."
                      },
                      {
                        title: "Real-time Data Processing",
                        description: "Apache Kafka and Redis-powered real-time analytics with sub-second data synchronization across all modules."
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Cpu className="w-5 h-5 xl:w-6 xl:h-6 text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground text-sm xl:text-base 2xl:text-lg">{feature.title}</h4>
                          <p className="text-xs xl:text-sm 2xl:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security & Compliance */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="group"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Lock className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 text-white" />
                    </div>
                    <CardTitle className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground">Security & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "SOC 2 Type II Certified",
                        description: "Annual third-party security audits with comprehensive penetration testing and vulnerability assessments."
                      },
                      {
                        title: "GDPR & FERPA Compliant",
                        description: "Full compliance with international data protection regulations including data portability and right to deletion."
                      },
                      {
                        title: "End-to-End Encryption",
                        description: "AES-256 encryption for data at rest and TLS 1.3 for data in transit with zero-knowledge architecture."
                      },
                      {
                        title: "Advanced Access Controls",
                        description: "Multi-factor authentication, role-based permissions, and audit trails with immutable blockchain verification."
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Shield className="w-5 h-5 xl:w-6 xl:h-6 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground text-sm xl:text-base 2xl:text-lg">{feature.title}</h4>
                          <p className="text-xs xl:text-sm 2xl:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Integration & API Capabilities */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 xl:p-12 2xl:p-16"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground mb-4">
                  Seamless Integration Ecosystem
                </h3>
                <p className="text-base xl:text-lg 2xl:text-xl text-muted-foreground max-w-4xl mx-auto">
                  Connect with existing institutional systems through our comprehensive API framework and pre-built integrations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[
                  {
                    category: "ERP Systems",
                    icon: Database,
                    color: "text-blue-600",
                    items: ["SAP Campus Management", "Oracle Student Cloud", "Microsoft Dynamics 365", "Workday Student", "Custom ERP Solutions"]
                  },
                  {
                    category: "Learning Platforms",
                    icon: BookOpen,
                    color: "text-green-600",
                    items: ["Moodle LMS", "Canvas by Instructure", "Blackboard Learn", "Google Classroom", "Microsoft Teams Education"]
                  },
                  {
                    category: "Authentication",
                    icon: UserCheck,
                    color: "text-purple-600",
                    items: ["Active Directory", "LDAP Integration", "SAML 2.0 SSO", "OAuth 2.0", "Multi-Factor Authentication"]
                  },
                  {
                    category: "Analytics & BI",
                    icon: BarChart3,
                    color: "text-orange-600",
                    items: ["Power BI Connector", "Tableau Integration", "Google Analytics", "Custom Dashboards", "Real-time Reports"]
                  }
                ].map((integration, index) => (
                  <motion.div
                    key={index}
                    className="text-center group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300">
                      <integration.icon className={`w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 ${integration.color}`} />
                    </div>
                    <h4 className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-foreground mb-3">{integration.category}</h4>
                    <ul className="text-xs xl:text-sm 2xl:text-base text-muted-foreground space-y-1">
                      {integration.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="truncate" title={item}>{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            >
              {[
                {
                  metric: "< 200ms",
                  label: "Average Response Time",
                  icon: Zap,
                  color: "text-yellow-600"
                },
                {
                  metric: "99.99%",
                  label: "System Uptime SLA",
                  icon: CheckCircle,
                  color: "text-green-600"
                },
                {
                  metric: "256-bit",
                  label: "AES Encryption Standard",
                  icon: Lock,
                  color: "text-purple-600"
                },
                {
                  metric: "24/7",
                  label: "Technical Support",
                  icon: Clock,
                  color: "text-blue-600"
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 xl:p-8 2xl:p-10 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <stat.icon className={`w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 ${stat.color} mx-auto mb-4`} />
                  <div className={`text-2xl xl:text-3xl 2xl:text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.metric}
                  </div>
                  <div className="text-sm xl:text-base 2xl:text-lg text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="workflow-title"
              >
                Complete Workflow: From Upload to Portfolio
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl text-muted-foreground max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="workflow-description"
              >
                Our streamlined three-stage process ensures every student achievement is properly documented, 
                verified, and integrated into professional portfolios for career advancement.
              </motion.p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: 1,
                  title: "Student Documentation",
                  subtitle: "Comprehensive Activity Recording",
                  color: "from-blue-500 to-cyan-500",
                  icon: BookOpen,
                  details: [
                    {
                      title: "Activity Upload Interface",
                      description: "Intuitive form-based system for recording seminars, competitions, internships, research projects, and leadership roles with guided workflows."
                    },
                    {
                      title: "Certificate Management",
                      description: "Secure upload and storage of supporting documents, certificates, and evidence with automatic file validation and OCR processing."
                    },
                    {
                      title: "Category Classification",
                      description: "Automatic categorization into academic, co-curricular, professional development, and community service activities with smart tagging."
                    },
                    {
                      title: "Real-time Progress Tracking",
                      description: "Dashboard showing skill credits earned, portfolio completion status, and achievement milestones reached with visual progress indicators."
                    }
                  ]
                },
                {
                  step: 2,
                  title: "Faculty Verification",
                  subtitle: "Multi-level Approval Workflow",
                  color: "from-green-500 to-emerald-500",
                  icon: Shield,
                  details: [
                    {
                      title: "Automated Assignment",
                      description: "Smart routing of activities to relevant department faculty based on activity type and student's academic program with workload balancing."
                    },
                    {
                      title: "Evidence Review Process",
                      description: "Comprehensive evaluation of supporting documents, certificates, and activity details with plagiarism detection and authenticity verification."
                    },
                    {
                      title: "Quality Assessment",
                      description: "Faculty evaluation of activity impact, learning outcomes achieved, and skill development demonstrated with standardized rubrics."
                    },
                    {
                      title: "Feedback & Credit Assignment",
                      description: "Detailed feedback provision with skill credit allocation, improvement suggestions, and approval status communication to students."
                    }
                  ]
                },
                {
                  step: 3,
                  title: "Portfolio & Analytics",
                  subtitle: "Automated Reporting & Insights",
                  color: "from-purple-500 to-pink-500",
                  icon: BarChart3,
                  details: [
                    {
                      title: "Professional Portfolio Generation",
                      description: "Auto-created portfolios with institutional branding, verification stamps, and professional formatting ready for industry presentations."
                    },
                    {
                      title: "Institutional Compliance Reports",
                      description: "One-click generation of NAAC, NIRF, and AICTE reports with accurate data mapping and compliance verification for accreditation processes."
                    },
                    {
                      title: "Advanced Analytics & Insights",
                      description: "Department-wise participation analysis, student engagement metrics, and predictive analytics for institutional planning and decision-making."
                    },
                    {
                      title: "Integration & Export Capabilities",
                      description: "Seamless data export to placement portals, higher education applications, and third-party systems with standardized formats and APIs."
                    }
                  ]
                }
              ].map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative"
                  data-testid={`workflow-stage-${stage.step}`}
                >
                  {/* Connection Line */}
                  {index < 2 && (
                    <div className="hidden lg:block absolute top-16 -right-6 w-12 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500"></div>
                  )}
                  
                  <Card className="h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
                    <CardHeader className="text-center pb-6">
                      <div className={`w-20 h-20 bg-gradient-to-br ${stage.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        <span className="text-2xl font-bold text-white">{stage.step}</span>
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground mb-2">{stage.title}</CardTitle>
                      <p className="text-muted-foreground font-medium">{stage.subtitle}</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {stage.details.map((detail, detailIndex) => (
                        <motion.div
                          key={detailIndex}
                          className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: (index * 0.2) + (detailIndex * 0.1) }}
                        >
                          <div className="w-2 h-2 bg-gradient-to-br from-primary to-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-semibold text-foreground text-sm mb-1">{detail.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{detail.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Institutional Benefits & Compliance Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="compliance-title"
              >
                Institutional Compliance & Accreditation Benefits
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="compliance-description"
              >
                Streamline your institution's accreditation processes and enhance rankings with comprehensive 
                data management and automated reporting capabilities.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
              {/* NAAC Compliance */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">NAAC Accreditation Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        "Criterion 2.6: Student Performance and Learning Outcomes",
                        "Criterion 3.3: Research Publications and Awards",
                        "Criterion 5.1: Student Support and Progression",
                        "Automated data collection and verification",
                        "Pre-formatted reports and documentation",
                        "Real-time compliance tracking"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* NIRF Rankings */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">NIRF Ranking Enhancement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        "Student Strength and Faculty Data",
                        "Teaching, Learning & Resources metrics",
                        "Research and Professional Practice data",
                        "Graduation Outcomes tracking",
                        "Outreach and Inclusivity measures",
                        "Automated ranking parameter calculation"
                      ].map((item, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Key Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  title: "90% Time Savings",
                  description: "Reduce accreditation preparation time from months to weeks",
                  color: "text-blue-600"
                },
                {
                  icon: CheckSquare,
                  title: "100% Accuracy",
                  description: "Eliminate human errors in data collection and reporting",
                  color: "text-green-600"
                },
                {
                  icon: Workflow,
                  title: "Automated Workflows",
                  description: "Streamlined processes from data entry to report generation",
                  color: "text-purple-600"
                },
                {
                  icon: Target,
                  title: "Higher Rankings",
                  description: "Improved institutional rankings through better data management",
                  color: "text-orange-600"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white dark:bg-gray-900">
          <motion.div 
            className="max-w-7xl xl:max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="testimonials-title"
              >
                Transforming Higher Education Institutions
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="testimonials-description"
              >
                Discover how leading educational institutions have achieved measurable improvements in 
                compliance, student outcomes, and operational efficiency with Smart Student Hub.
              </motion.p>
            </div>

            {/* Featured Institutional Success Stories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-16">
              {[
                {
                  type: "Vice Chancellor",
                  name: "Prof. Dr. Anil Kumar Tripathi",
                  position: "Vice Chancellor, Delhi Technological University",
                  institution: "Delhi Technological University",
                  avatar: "AT",
                  quote: "Implementing Smart Student Hub revolutionized our accreditation process. We achieved NAAC A++ grade with 90% reduction in preparation time. The platform's comprehensive data management helped us improve our NIRF ranking from 75th to 42nd position in just two years.",
                  achievements: [
                    "NAAC A++ Grade Achievement",
                    "NIRF Ranking: 75th → 42nd",
                    "90% Reduction in Accreditation Prep Time",
                    "100% Faculty Adoption Rate"
                  ],
                  metrics: {
                    cost_savings: "₹2.5 Cr annually",
                    time_reduction: "90%",
                    ranking_improvement: "33 positions"
                  },
                  rating: 5,
                  color: "from-purple-600 to-indigo-700",
                  bgGradient: "from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20"
                },
                {
                  type: "Director",
                  name: "Dr. Kavita Bhanwala",
                  position: "Director, IIT Mandi",
                  institution: "Indian Institute of Technology Mandi",
                  avatar: "KB",
                  quote: "The platform's analytics dashboard provides unprecedented insights into student engagement patterns. We've seen 40% improvement in placement rates and 25% increase in co-curricular participation since implementation. The ROI exceeded our expectations within the first semester.",
                  achievements: [
                    "40% Improvement in Placement Rates",
                    "25% Increase in Student Participation",
                    "Real-time Analytics Implementation",
                    "Seamless ERP Integration"
                  ],
                  metrics: {
                    placement_improvement: "40%",
                    participation_increase: "25%",
                    roi_timeline: "6 months"
                  },
                  rating: 5,
                  color: "from-emerald-600 to-teal-700",
                  bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20"
                }
              ].map((leader, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  className="group relative"
                  data-testid={`featured-testimonial-${index}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${leader.bgGradient} rounded-3xl transform group-hover:scale-105 transition-transform duration-500 opacity-30`}></div>
                  
                  <Card className="relative h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden">
                    <CardHeader className="pb-6 relative">
                      <div className="flex items-start space-x-4 mb-6">
                        <div className={`w-20 h-20 xl:w-24 xl:h-24 2xl:w-28 2xl:h-28 bg-gradient-to-br ${leader.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <span className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-white">{leader.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-center lg:justify-start mb-3">
                            {[...Array(leader.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 xl:w-6 xl:h-6 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <Badge variant="secondary" className="mb-3 text-sm xl:text-base">{leader.type}</Badge>
                          <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-foreground mb-2">{leader.name}</h3>
                          <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground mb-1">{leader.position}</p>
                          <p className="text-xs xl:text-sm 2xl:text-base text-primary font-medium">{leader.institution}</p>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <blockquote className="text-sm xl:text-base 2xl:text-lg text-muted-foreground italic leading-relaxed border-l-4 border-primary pl-4">
                        "{leader.quote}"
                      </blockquote>
                      
                      {/* Key Achievements */}
                      <div>
                        <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-foreground mb-3">Key Achievements</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {leader.achievements.map((achievement, achIndex) => (
                            <div key={achIndex} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 xl:w-5 xl:h-5 text-green-500 flex-shrink-0" />
                              <span className="text-xs xl:text-sm 2xl:text-base text-muted-foreground">{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* ROI Metrics */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 xl:p-6">
                        <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-foreground mb-3">Measurable Impact</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {Object.entries(leader.metrics).map(([key, value], metricIndex) => (
                            <div key={metricIndex}>
                              <div className={`text-lg xl:text-xl 2xl:text-2xl font-bold bg-gradient-to-r ${leader.color} bg-clip-text text-transparent`}>
                                {value}
                              </div>
                              <div className="text-xs xl:text-sm 2xl:text-base text-muted-foreground capitalize">
                                {key.replace('_', ' ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Additional Testimonials Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              {[
                {
                  type: "Student",
                  name: "Arjun Patel",
                  position: "M.Tech Computer Science, IIT Bombay",
                  institution: "Indian Institute of Technology Bombay",
                  avatar: "AP",
                  quote: "The platform made my academic journey transparent and verifiable. I secured 3 internship offers and a dream job at Microsoft, thanks to my comprehensive digital portfolio that showcased 50+ verified activities and achievements.",
                  metrics: ["3 Internship Offers", "Dream Job at Microsoft", "50+ Verified Activities"],
                  rating: 5,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  type: "Faculty",
                  name: "Dr. Meera Krishnan",
                  position: "Professor & Research Dean",
                  institution: "Anna University, Chennai",
                  avatar: "MK",
                  quote: "Verification workflows reduced my administrative burden by 75%. The platform's intelligent assignment system and bulk approval features allow me to focus more on research and teaching. Student engagement analytics help identify at-risk students early.",
                  metrics: ["75% Time Savings", "Enhanced Student Insights", "Streamlined Workflows"],
                  rating: 5,
                  color: "from-green-500 to-emerald-500"
                },
                {
                  type: "Administrator",
                  name: "Prof. Ramesh Gupta",
                  position: "Registrar, Jawaharlal Nehru University",
                  institution: "Jawaharlal Nehru University",
                  avatar: "RG",
                  quote: "Implementation transformed our compliance reporting from a 6-month process to 2 weeks. NAAC peer review was seamless with instant access to comprehensive student activity data. Our accreditation score improved from 3.2 to 3.8.",
                  metrics: ["6 months → 2 weeks", "NAAC Score: 3.2 → 3.8", "Seamless Compliance"],
                  rating: 5,
                  color: "from-purple-500 to-pink-500"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                  data-testid={`testimonial-${index}`}
                >
                  <Card className="h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br ${testimonial.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg xl:text-xl 2xl:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {testimonial.avatar}
                      </div>
                      <div className="flex justify-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 xl:w-6 xl:h-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Badge variant="secondary" className="mb-2 text-sm xl:text-base">{testimonial.type}</Badge>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <blockquote className="text-sm xl:text-base 2xl:text-lg text-muted-foreground italic leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      
                      {/* Quick Metrics */}
                      <div className="space-y-2">
                        {testimonial.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="flex items-center justify-center space-x-2">
                            <TrendingUp className="w-4 h-4 xl:w-5 xl:h-5 text-green-500" />
                            <span className="text-xs xl:text-sm 2xl:text-base text-muted-foreground font-medium">{metric}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-4 border-t border-border">
                        <p className="font-semibold text-foreground text-base xl:text-lg 2xl:text-xl">{testimonial.name}</p>
                        <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground">{testimonial.position}</p>
                        <p className="text-xs xl:text-sm 2xl:text-base text-primary font-medium">{testimonial.institution}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Implementation Roadmap Section */}
        <section className="py-16 sm:py-20 lg:py-24 xl:py-28 2xl:py-32 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-950/20 dark:via-blue-950/20 dark:to-cyan-950/20">
          <motion.div 
            className="max-w-7xl xl:max-w-8xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="implementation-title"
              >
                Implementation Roadmap
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="implementation-description"
              >
                A structured approach to seamless implementation ensuring minimal disruption 
                to your academic operations while maximizing system adoption and effectiveness.
              </motion.p>
            </div>

            {/* Implementation Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-blue-500 to-cyan-500 transform lg:-translate-x-1/2 rounded-full shadow-lg"></div>
              
              <div className="space-y-12 lg:space-y-16">
                {[
                  {
                    phase: "Phase 1",
                    duration: "Week 1-2",
                    title: "Assessment & Planning",
                    icon: Search,
                    color: "from-blue-500 to-cyan-500",
                    bgColor: "bg-blue-50 dark:bg-blue-950/20",
                    activities: [
                      "Comprehensive institutional assessment and requirement analysis",
                      "Current system integration evaluation and compatibility check",
                      "Custom configuration design based on institutional workflows",
                      "Implementation timeline finalization and resource allocation"
                    ],
                    deliverables: "Detailed implementation plan, system architecture design, and integration roadmap"
                  },
                  {
                    phase: "Phase 2", 
                    duration: "Week 3-4",
                    title: "System Setup & Integration",
                    icon: Settings,
                    color: "from-green-500 to-emerald-500",
                    bgColor: "bg-green-50 dark:bg-green-950/20",
                    activities: [
                      "Cloud infrastructure deployment and security configuration",
                      "ERP and LMS system integration with real-time data synchronization",
                      "User authentication setup with institutional SSO integration",
                      "Data migration from existing systems with validation protocols"
                    ],
                    deliverables: "Fully configured system, integrated platforms, and migrated historical data"
                  },
                  {
                    phase: "Phase 3",
                    duration: "Week 5-6", 
                    title: "Training & Onboarding",
                    icon: Users,
                    color: "from-purple-500 to-pink-500",
                    bgColor: "bg-purple-50 dark:bg-purple-950/20",
                    activities: [
                      "Comprehensive administrator training on system management",
                      "Faculty workshops on verification workflows and analytics",
                      "Student orientation sessions on portfolio creation and management",
                      "Super-user certification program for ongoing institutional support"
                    ],
                    deliverables: "Trained user base, certified super-users, and comprehensive training materials"
                  },
                  {
                    phase: "Phase 4",
                    duration: "Week 7-8",
                    title: "Launch & Optimization",
                    icon: Rocket,
                    color: "from-orange-500 to-red-500", 
                    bgColor: "bg-orange-50 dark:bg-orange-950/20",
                    activities: [
                      "Soft launch with pilot user groups and feedback collection",
                      "Performance monitoring and system optimization",
                      "Full institutional rollout with change management support",
                      "Compliance reporting setup for NAAC/NIRF requirements"
                    ],
                    deliverables: "Live system, optimized performance, and compliance-ready reporting framework"
                  }
                ].map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className={`relative flex items-start ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-4 lg:left-1/2 w-12 h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 transform lg:-translate-x-1/2 z-10">
                      <motion.div
                        className={`w-full h-full bg-gradient-to-br ${phase.color} rounded-full shadow-xl flex items-center justify-center`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <phase.icon className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Content Card */}
                    <div className={`ml-20 lg:ml-0 ${index % 2 === 0 ? 'lg:mr-12 xl:mr-16 2xl:mr-20' : 'lg:ml-12 xl:ml-16 2xl:ml-20'} flex-1 max-w-xl xl:max-w-2xl 2xl:max-w-3xl`}>
                      <motion.div
                        className={`${phase.bgColor} rounded-2xl p-6 xl:p-8 2xl:p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-gray-700/50`}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="text-sm xl:text-base 2xl:text-lg font-medium">
                            {phase.phase}
                          </Badge>
                          <span className="text-sm xl:text-base 2xl:text-lg text-muted-foreground font-medium">
                            {phase.duration}
                          </span>
                        </div>
                        
                        <h3 className="text-xl xl:text-2xl 2xl:text-3xl font-bold text-foreground mb-4">
                          {phase.title}
                        </h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-foreground mb-3">Key Activities</h4>
                            <ul className="space-y-2">
                              {phase.activities.map((activity, actIndex) => (
                                <li key={actIndex} className="flex items-start space-x-3">
                                  <CheckCircle className="w-4 h-4 xl:w-5 xl:h-5 text-green-500 mt-1 flex-shrink-0" />
                                  <span className="text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed">
                                    {activity}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="pt-4 border-t border-border">
                            <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold text-foreground mb-2">Phase Deliverables</h4>
                            <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed">
                              {phase.deliverables}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Post-Implementation Support */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 lg:mt-20"
            >
              <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Heart className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 text-white" />
                  </div>
                  <CardTitle className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-foreground">
                    Ongoing Support & Success Partnership
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  {[
                    {
                      title: "24/7 Technical Support",
                      description: "Round-the-clock technical assistance with guaranteed response times and dedicated support channels for critical issues.",
                      icon: Clock
                    },
                    {
                      title: "Continuous Enhancement",
                      description: "Regular platform updates, new feature rollouts, and performance optimizations based on institutional feedback and industry best practices.",
                      icon: TrendingUp
                    },
                    {
                      title: "Success Monitoring",
                      description: "Quarterly business reviews, ROI analysis, and strategic consultation to ensure maximum institutional benefit and goal achievement.",
                      icon: Target
                    }
                  ].map((support, index) => (
                    <motion.div
                      key={index}
                      className="text-center"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="w-12 h-12 xl:w-16 xl:h-16 2xl:w-20 2xl:h-20 bg-teal-100 dark:bg-teal-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <support.icon className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 text-teal-600 dark:text-teal-400" />
                      </div>
                      <h4 className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-foreground mb-3">{support.title}</h4>
                      <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed">{support.description}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="faq-title"
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl text-muted-foreground"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="faq-description"
              >
                Get answers to common questions about implementing Smart Student Hub at your institution.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Accordion type="single" collapsible className="w-full space-y-4" data-testid="faq-accordion">
                {[
                  {
                    question: "How long does it take to implement Smart Student Hub at our institution?",
                    answer: "Implementation typically takes 2-4 weeks depending on your institution size. This includes data migration, faculty training, student onboarding, and system integration with your existing ERP/LMS. Our dedicated implementation team ensures a smooth transition with minimal disruption to academic activities."
                  },
                  {
                    question: "Is the platform compliant with data privacy regulations and educational standards?",
                    answer: "Yes, Smart Student Hub is fully compliant with data privacy regulations including GDPR and educational standards. We implement enterprise-grade security with encrypted data storage, secure authentication, role-based access control, and regular security audits. Student data remains under institutional control with export and deletion capabilities."
                  },
                  {
                    question: "Can the system integrate with our existing ERP and LMS platforms?",
                    answer: "Absolutely. Our platform offers seamless integration with popular ERP systems (SAP, Oracle, Microsoft Dynamics) and LMS platforms (Moodle, Canvas, Blackboard). We provide APIs for custom integrations and can work with your IT team to ensure smooth data synchronization and workflow automation."
                  },
                  {
                    question: "What kind of support and training do you provide for faculty and administrators?",
                    answer: "We provide comprehensive support including live training sessions, video tutorials, user manuals, and 24/7 technical support. Our training covers system navigation, verification workflows, report generation, and analytics interpretation. We also offer ongoing webinars and updates on new features."
                  },
                  {
                    question: "How does the platform help with NAAC accreditation and NIRF rankings?",
                    answer: "The platform automates data collection for all major NAAC criteria and NIRF parameters. It generates pre-formatted reports, maintains audit trails, and provides real-time compliance tracking. Institutions typically see 90% reduction in accreditation preparation time and improved ranking scores due to comprehensive data documentation."
                  },
                  {
                    question: "What are the pricing models and what's included in each plan?",
                    answer: "We offer flexible pricing based on student enrollment and feature requirements. Plans include basic activity tracking, premium verification workflows, and enterprise-level analytics and integrations. Contact our sales team for detailed pricing that fits your institution's budget and needs. All plans include setup, training, and ongoing support."
                  }
                ].map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`} 
                    className="bg-white dark:bg-gray-800 rounded-lg border-0 shadow-md hover:shadow-lg transition-shadow duration-300"
                    data-testid={`faq-item-${index}`}
                  >
                    <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary px-6 py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed px-6 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </motion.div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <motion.div 
            className="relative max-w-6xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              data-testid="cta-title"
            >
              Ready to Transform Your Institution?
            </motion.h2>
            <motion.p 
              className="text-lg lg:text-xl text-blue-100 mb-12 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              data-testid="cta-description"
            >
              Join hundreds of educational institutions that have streamlined their student achievement tracking, 
              enhanced accreditation processes, and empowered students with verified digital portfolios.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-6 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setLocation('/login')}
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100 px-10 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  data-testid="cta-get-started"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Get Started Today
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo'}
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-10 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="cta-book-demo"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book a Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white/80"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div>
                <div className="text-2xl font-bold text-white mb-1">100+</div>
                <div className="text-sm">Institutions Trust Us</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                <div className="text-sm">Uptime Guarantee</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm">Expert Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">SOC 2</div>
                <div className="text-sm">Security Certified</div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Interactive Platform Demo Section */}
        <section className="py-16 lg:py-20 xl:py-24 2xl:py-28 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto">
            <motion.div
              className="text-center mb-16 xl:mb-20 2xl:mb-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6" data-testid="demo-title">
                Experience the Platform Live
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto" data-testid="demo-description">
                Interactive demonstrations showcasing real-world institutional workflows and student portfolio management
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
              {/* Student Journey Demo */}
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="h-full border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 transition-all duration-300 overflow-hidden">
                  <CardHeader className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                    <CardTitle className="flex items-center text-xl xl:text-2xl 2xl:text-3xl">
                      <Users className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 mr-3" />
                      Student Portfolio Builder
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 xl:p-8 2xl:p-10">
                    <div className="space-y-6">
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 xl:p-6 2xl:p-8">
                        <Tabs defaultValue="activities" className="w-full">
                          <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="activities" className="text-xs xl:text-sm 2xl:text-base">Activities</TabsTrigger>
                            <TabsTrigger value="achievements" className="text-xs xl:text-sm 2xl:text-base">Achievements</TabsTrigger>
                            <TabsTrigger value="portfolio" className="text-xs xl:text-sm 2xl:text-base">Portfolio</TabsTrigger>
                          </TabsList>
                          <TabsContent value="activities" className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded">
                              <span className="text-sm xl:text-base 2xl:text-lg">Technical Workshop</span>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Verified</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded">
                              <span className="text-sm xl:text-base 2xl:text-lg">Research Paper</span>
                              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Pending</Badge>
                            </div>
                          </TabsContent>
                          <TabsContent value="achievements">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-900 rounded">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <span className="text-sm xl:text-base 2xl:text-lg">Best Project Award</span>
                              </div>
                              <div className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-900 rounded">
                                <Award className="w-5 h-5 text-blue-500" />
                                <span className="text-sm xl:text-base 2xl:text-lg">Academic Excellence</span>
                              </div>
                            </div>
                          </TabsContent>
                          <TabsContent value="portfolio">
                            <div className="space-y-4">
                              <Progress value={75} className="w-full" />
                              <p className="text-sm xl:text-base 2xl:text-lg text-muted-foreground">Portfolio Completion: 75%</p>
                              <Button size="sm" className="w-full">Generate PDF Portfolio</Button>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                      <Button className="w-full group-hover:scale-105 transition-transform" data-testid="demo-student-cta">
                        Try Student Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Faculty Verification Demo */}
              <motion.div
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="h-full border-2 border-transparent group-hover:border-purple-200 dark:group-hover:border-purple-800 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                    <CardTitle className="flex items-center text-xl xl:text-2xl 2xl:text-3xl">
                      <UserCheck className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 mr-3" />
                      Faculty Verification Hub
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 xl:p-8 2xl:p-10">
                    <div className="space-y-6">
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 xl:p-6 2xl:p-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm xl:text-base 2xl:text-lg font-medium">Pending Verifications</span>
                            <Badge variant="destructive" className="animate-pulse">12 New</Badge>
                          </div>
                          <div className="space-y-3">
                            {[
                              { student: "Rahul Sharma", activity: "IEEE Conference Paper", urgency: "high" },
                              { student: "Priya Patel", activity: "Hackathon Winner", urgency: "medium" },
                              { student: "Arjun Kumar", activity: "Industry Internship", urgency: "low" }
                            ].map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded border-l-4 border-l-blue-500">
                                <div>
                                  <p className="text-sm xl:text-base 2xl:text-lg font-medium">{item.student}</p>
                                  <p className="text-xs xl:text-sm 2xl:text-base text-muted-foreground">{item.activity}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline" className="text-xs xl:text-sm 2xl:text-base">
                                    <CheckCircle className="w-3 h-3 xl:w-4 xl:h-4 mr-1" />
                                    Approve
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button className="w-full group-hover:scale-105 transition-transform" data-testid="demo-faculty-cta">
                        Try Faculty Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Analytics Dashboard Demo */}
              <motion.div
                className="group lg:col-span-2 2xl:col-span-1"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="h-full border-2 border-transparent group-hover:border-green-200 dark:group-hover:border-green-800 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <CardTitle className="flex items-center text-xl xl:text-2xl 2xl:text-3xl">
                      <BarChart3 className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 mr-3" />
                      Institutional Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 xl:p-8 2xl:p-10">
                    <div className="space-y-6">
                      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg p-4 xl:p-6 2xl:p-8">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="text-center p-3 bg-white dark:bg-gray-900 rounded">
                            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-blue-600">
                              <AnimatedCounter end={1247} />
                            </div>
                            <p className="text-xs xl:text-sm 2xl:text-base text-muted-foreground">Active Students</p>
                          </div>
                          <div className="text-center p-3 bg-white dark:bg-gray-900 rounded">
                            <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-green-600">
                              <AnimatedCounter end={89} suffix="%" />
                            </div>
                            <p className="text-xs xl:text-sm 2xl:text-base text-muted-foreground">Verification Rate</p>
                          </div>
                        </div>
                        <div className="h-32 xl:h-40 2xl:h-48">
                          <InteractiveChart 
                            data={[
                              { name: 'Jan', value: 400 },
                              { name: 'Feb', value: 600 },
                              { name: 'Mar', value: 800 },
                              { name: 'Apr', value: 1200 },
                              { name: 'May', value: 1000 },
                              { name: 'Jun', value: 1400 }
                            ]}
                            type="area"
                            color="#10b981"
                          />
                        </div>
                      </div>
                      <Button className="w-full group-hover:scale-105 transition-transform" data-testid="demo-analytics-cta">
                        Try Analytics Demo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Advanced Technology Stack Showcase */}
        <section className="py-16 lg:py-20 xl:py-24 2xl:py-28 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-7xl xl:max-w-8xl 2xl:max-w-9xl mx-auto">
            <motion.div
              className="text-center mb-16 xl:mb-20 2xl:mb-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-6" data-testid="tech-stack-title">
                Built with Enterprise-Grade Technology
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-blue-100 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto" data-testid="tech-stack-description">
                Leveraging cutting-edge technologies to deliver scalable, secure, and performant educational solutions
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
              {/* Frontend Technologies */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center text-xl xl:text-2xl 2xl:text-3xl">
                      <Monitor className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 mr-3 text-blue-400" />
                      Frontend Excellence
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
                      {[
                        { icon: FaReact, name: "React 18", color: "#61DAFB" },
                        { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
                        { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
                        { icon: SiFramer, name: "Framer Motion", color: "#0055FF" },
                        { icon: FileText, name: "Recharts", color: "#8884d8" },
                        { icon: Layers, name: "Shadcn/ui", color: "#000000" }
                      ].map((tech, index) => (
                        <motion.div
                          key={index}
                          className="text-center p-3 xl:p-4 2xl:p-6 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <tech.icon 
                            className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 mx-auto mb-2" 
                            style={{ color: tech.color }}
                          />
                          <p className="text-xs xl:text-sm 2xl:text-base text-gray-300 font-medium">{tech.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Backend & Infrastructure */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center text-xl xl:text-2xl 2xl:text-3xl">
                      <Database className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 mr-3 text-green-400" />
                      Backend Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
                      {[
                        { icon: FaNodeJs, name: "Node.js", color: "#339933" },
                        { icon: SiPostgresql, name: "PostgreSQL", color: "#336791" },
                        { icon: FaDocker, name: "Docker", color: "#2496ED" },
                        { icon: SiKubernetes, name: "Kubernetes", color: "#326CE5" },
                        { icon: SiRedis, name: "Redis", color: "#DC382D" },
                        { icon: SiGraphql, name: "GraphQL", color: "#E10098" }
                      ].map((tech, index) => (
                        <motion.div
                          key={index}
                          className="text-center p-3 xl:p-4 2xl:p-6 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <tech.icon 
                            className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 mx-auto mb-2" 
                            style={{ color: tech.color }}
                          />
                          <p className="text-xs xl:text-sm 2xl:text-base text-gray-300 font-medium">{tech.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Cloud & Security */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 h-full">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center text-xl xl:text-2xl 2xl:text-3xl">
                      <Shield className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-10 2xl:h-10 mr-3 text-yellow-400" />
                      Cloud & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 xl:gap-6 2xl:gap-8">
                      {[
                        { icon: FaAws, name: "AWS Cloud", color: "#FF9900" },
                        { icon: FaGoogle, name: "Google Cloud", color: "#4285F4" },
                        { icon: FaMicrosoft, name: "Azure", color: "#0078D4" },
                        { icon: FaShieldAlt, name: "Security", color: "#28A745" },
                        { icon: FaCertificate, name: "SSL/TLS", color: "#17A2B8" },
                        { icon: Lock, name: "OAuth 2.0", color: "#6C757D" }
                      ].map((tech, index) => (
                        <motion.div
                          key={index}
                          className="text-center p-3 xl:p-4 2xl:p-6 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <tech.icon 
                            className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 mx-auto mb-2" 
                            style={{ color: tech.color }}
                          />
                          <p className="text-xs xl:text-sm 2xl:text-base text-gray-300 font-medium">{tech.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Performance Metrics */}
            <motion.div
              className="mt-16 xl:mt-20 2xl:mt-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16 2xl:gap-20">
                {[
                  { metric: "99.9%", label: "Uptime Guarantee", icon: Clock, color: "text-green-400" },
                  { metric: "<100ms", label: "Response Time", icon: Zap, color: "text-yellow-400" },
                  { metric: "256-bit", label: "Encryption", icon: Shield, color: "text-blue-400" },
                  { metric: "24/7", label: "Support", icon: Headphones, color: "text-purple-400" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 ${item.color} bg-gray-800 rounded-full mb-4`}>
                      <item.icon className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12" />
                    </div>
                    <div className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-white mb-2">
                      <AnimatedCounter end={item.metric.includes('%') ? parseInt(item.metric) : 100} suffix={item.metric.includes('%') ? '%' : ''} />
                      {!item.metric.includes('%') && <span>{item.metric.replace(/[0-9]/g, '')}</span>}
                    </div>
                    <p className="text-sm xl:text-base 2xl:text-lg text-gray-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive FAQ Section with Search */}
        <section className="py-16 lg:py-20 xl:py-24 2xl:py-28 bg-background px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-12 xl:mb-16 2xl:mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6" data-testid="faq-title">
                Frequently Asked Questions
              </h2>
              <p className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground mb-8" data-testid="faq-description">
                Find answers to common questions about our institutional platform
              </p>
              
              {/* FAQ Search */}
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
                <Input 
                  type="text" 
                  placeholder="Search FAQs..."
                  className="pl-10 xl:pl-12 2xl:pl-14 text-sm xl:text-base 2xl:text-lg h-10 xl:h-12 2xl:h-14"
                  data-testid="faq-search"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    id: "faq-1",
                    question: "How does the verification process work for student activities?",
                    answer: "Our platform uses a multi-tier verification system where students submit their activities with supporting documents. Faculty members receive notifications and can verify activities through our streamlined interface. The system maintains an audit trail for complete transparency and NAAC/NIRF compliance."
                  },
                  {
                    id: "faq-2", 
                    question: "Is the platform compliant with educational standards like NAAC and NIRF?",
                    answer: "Yes, Smart Student Hub is designed specifically to meet NAAC and NIRF requirements. Our platform automatically categorizes activities according to these standards, generates compliant reports, and maintains the documentation necessary for institutional accreditation and ranking processes."
                  },
                  {
                    id: "faq-3",
                    question: "Can the platform integrate with existing institutional systems?",
                    answer: "Absolutely. Our platform offers robust API integrations and supports standard protocols like LDAP, SAML, and OAuth for seamless integration with existing Learning Management Systems, Student Information Systems, and institutional databases."
                  },
                  {
                    id: "faq-4",
                    question: "What security measures are in place to protect student data?",
                    answer: "We implement enterprise-grade security including 256-bit encryption, secure cloud infrastructure, regular security audits, GDPR compliance, and role-based access controls. All data is stored in certified cloud environments with backup and disaster recovery systems."
                  },
                  {
                    id: "faq-5",
                    question: "How scalable is the platform for large institutions?",
                    answer: "Our platform is built on cloud-native architecture that can scale from small colleges to large universities with 50,000+ students. We use auto-scaling infrastructure, CDN delivery, and optimized databases to ensure consistent performance regardless of institution size."
                  },
                  {
                    id: "faq-6",
                    question: "What kind of support and training do you provide?",
                    answer: "We offer comprehensive onboarding, video tutorials, live training sessions, dedicated support representatives, and extensive documentation. Our support team is available 24/7 during implementation and provides ongoing assistance for all user levels."
                  }
                ].map((faq, index) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-lg px-6">
                    <AccordionTrigger className="text-left text-base xl:text-lg 2xl:text-xl font-semibold hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm xl:text-base 2xl:text-lg text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>

            <motion.div
              className="text-center mt-12 xl:mt-16 2xl:mt-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-lg xl:text-xl 2xl:text-2xl text-muted-foreground mb-6">
                Still have questions? We're here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  className="hover:scale-105 transition-transform"
                  onClick={() => window.location.href = 'mailto:support@smartstudenthub.com?subject=Platform Inquiry'}
                  data-testid="faq-contact-email"
                >
                  <Mail className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 mr-2" />
                  Email Support
                </Button>
                <Button 
                  className="hover:scale-105 transition-transform"
                  onClick={() => window.location.href = 'tel:+919876543210'}
                  data-testid="faq-contact-phone"
                >
                  <Phone className="w-4 h-4 xl:w-5 xl:h-5 2xl:w-6 2xl:h-6 mr-2" />
                  Call Us
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Newsletter Subscription Section */}
        <section className="py-16 lg:py-20 xl:py-24 2xl:py-28 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto text-center">
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              data-testid="newsletter-title"
            >
              Stay Updated with Educational Innovation
            </motion.h2>
            <motion.p 
              className="text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-blue-100 mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              data-testid="newsletter-description"
            >
              Get the latest insights on educational technology, platform updates, and institutional best practices
            </motion.p>
            
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-4" data-testid="newsletter-form">
                <Input 
                  type="email" 
                  placeholder="Enter your institutional email"
                  className="flex-1 bg-white/90 border-0 text-gray-900 placeholder-gray-600 h-10 xl:h-12 2xl:h-14 text-sm xl:text-base 2xl:text-lg"
                  data-testid="newsletter-email-input"
                />
                <Button 
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 h-10 xl:h-12 2xl:h-14 px-6 xl:px-8 2xl:px-10 text-sm xl:text-base 2xl:text-lg"
                  data-testid="newsletter-subscribe-button"
                >
                  Subscribe Now
                </Button>
              </div>
              <p className="text-xs xl:text-sm 2xl:text-base text-blue-200 mt-4" data-testid="newsletter-privacy">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Professional Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold" data-testid="footer-brand">Smart Student Hub</h3>
                    <p className="text-sm text-gray-400">Educational Excellence</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  Transforming higher education through comprehensive student achievement tracking and institutional excellence management.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" data-testid="social-twitter">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" data-testid="social-linkedin">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" data-testid="social-facebook">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" data-testid="social-instagram">
                    <Instagram className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-lg font-semibold mb-6" data-testid="footer-product-title">Product</h4>
                <ul className="space-y-3">
                  {[
                    "Features",
                    "Pricing",
                    "Integrations",
                    "API Documentation",
                    "Security",
                    "What's New"
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm" data-testid={`footer-product-${index}`}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <h4 className="text-lg font-semibold mb-6" data-testid="footer-solutions-title">Solutions</h4>
                <ul className="space-y-3">
                  {[
                    "For Students",
                    "For Faculty",
                    "For Administrators",
                    "NAAC Compliance",
                    "NIRF Rankings",
                    "Portfolio Management"
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm" data-testid={`footer-solutions-${index}`}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold mb-6" data-testid="footer-support-title">Support</h4>
                <ul className="space-y-3 mb-6">
                  {[
                    "Help Center",
                    "Training Resources",
                    "Implementation Guide",
                    "Video Tutorials",
                    "Community Forum",
                    "Contact Support"
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm" data-testid={`footer-support-${index}`}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span data-testid="footer-email">contact@smartstudenthub.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <Phone className="w-4 h-4" />
                    <span data-testid="footer-phone">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span data-testid="footer-address">Bangalore, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-sm text-gray-400" data-testid="footer-copyright">
                  © 2024 Smart Student Hub. All rights reserved.
                </div>
                <div className="flex space-x-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" data-testid="footer-privacy">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" data-testid="footer-terms">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" data-testid="footer-cookies">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}
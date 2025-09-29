/**
 * Optimized Landing Page for Smart Student Hub
 * 
 * A streamlined, professional landing page that showcases the core value propositions
 * of the Student Activity Record Management System with improved performance,
 * enhanced responsiveness, and better user experience.
 * 
 * Features:
 * - SEO optimized with react-helmet-async
 * - Keyboard navigation with react-hotkeys-hook
 * - Loading states with react-loading-skeleton
 * - Framer Motion animations for smooth interactions
 * - Complete responsiveness (320px to 2560px+)
 * - Professional academic design
 * - Consolidated content sections
 */

import { useState, useEffect, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { useInView as useIntersectionObserver } from "react-intersection-observer";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { useHotkeys } from "react-hotkeys-hook";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CountUp from "react-countup";
import { 
  GraduationCap, Shield, Users, BarChart3, FileCheck, Award, TrendingUp, 
  Database, CheckCircle, Building, Clock, Search, Briefcase, 
  Trophy, Star, Zap, Settings, Lock, Calendar, Menu, X,
  Mail, Phone, MapPin, ArrowRight, Play, CheckSquare, 
  Lightbulb, Rocket, Heart, Sparkles, Eye, Download,
  Activity, ChevronRight, Quote, ExternalLink, Check,
  Twitter, Linkedin, Facebook, Instagram
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

// Loading Component
const LoadingSkeleton = ({ lines = 3, height = 20 }: { lines?: number; height?: number }) => (
  <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={height} />
      ))}
    </div>
  </SkeletonTheme>
);

// Enhanced Animated Counter Component
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

// Professional Testimonial Component
const TestimonialCard = ({ name, role, company, rating, quote, impact }: {
  name: string;
  role: string;
  company: string;
  rating: number;
  quote: string;
  impact: string;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="group"
      data-testid={`testimonial-${name.replace(/\s+/g, '-').toLowerCase()}`}
    >
      <Card className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden group-hover:-translate-y-2">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <motion.div 
                className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-primary/20"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{name.charAt(0)}</span>
                </div>
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
            </div>
            <Quote className="w-8 h-8 xl:w-10 xl:h-10 text-primary/20 group-hover:text-primary/40 transition-colors duration-300" />
          </div>
          <Badge variant="secondary" className="w-fit text-sm font-medium">
            {impact}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <blockquote className="text-sm xl:text-base text-muted-foreground leading-relaxed italic">
            "{quote}"
          </blockquote>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useHotkeys('ctrl+k, cmd+k', (e) => {
    e.preventDefault();
    setLocation('/login');
  });

  useHotkeys('ctrl+d, cmd+d', (e) => {
    e.preventDefault();
    window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo';
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full p-8">
          <LoadingSkeleton lines={5} height={40} />
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Smart Student Hub - Centralized Digital Platform for Comprehensive Student Activity Records</title>
          <meta name="description" content="Transform your Higher Education Institution with our enterprise-grade student achievement documentation platform. Automate compliance reporting, enhance accreditation readiness, and improve NAAC grades." />
          <meta name="keywords" content="student management system, NAAC compliance, NIRF rankings, higher education, student portfolio, academic excellence" />
          <meta property="og:title" content="Smart Student Hub - Student Activity Management Platform" />
          <meta property="og:description" content="Revolutionize student achievement documentation with comprehensive digital platform for Higher Education Institutions." />
          <meta property="og:type" content="website" />
          <meta name="robots" content="index, follow" />
          <link rel="canonical" href="https://smartstudenthub.com" />
        </Helmet>

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
                <div className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl xl:text-3xl font-bold text-foreground" data-testid="site-title">
                    Smart Student Hub
                  </h1>
                  <p className="text-sm xl:text-base text-muted-foreground hidden sm:block" data-testid="site-subtitle">
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
                  title="Press Ctrl+D to schedule demo"
                >
                  Schedule Demo
                </Button>
                <Button 
                  onClick={() => setLocation('/login')}
                  size="sm"
                  className="hover:scale-105 transition-transform shadow-md"
                  data-testid="desktop-login-button"
                  title="Press Ctrl+K to sign in"
                >
                  Sign In
                </Button>
              </div>
              
              <MobileMenu isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} setLocation={setLocation} />
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="relative py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <motion.div 
            className="relative max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.div variants={itemVariants}>
                <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm xl:text-base font-medium" data-testid="hero-badge">
                  Powering Excellence in 150+ Higher Education Institutions Globally
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-foreground mb-6 leading-tight tracking-tight"
                data-testid="hero-title"
              >
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  Centralized Digital Platform
                </span>
                <br />
                <span className="text-foreground">
                  for Student Activity Records
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-muted-foreground mb-8 max-w-4xl xl:max-w-5xl mx-auto leading-relaxed"
                data-testid="hero-description"
              >
                Transform your Higher Education Institution with enterprise-grade student achievement documentation. 
                Automate compliance reporting, enhance accreditation readiness, and drive <strong className="text-primary font-semibold">measurable 
                improvements in NAAC grades, NIRF rankings, and student placements</strong>.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 max-w-2xl mx-auto"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setLocation('/login')}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
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
                    className="w-full sm:w-auto border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    data-testid="cta-schedule-demo"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Demo
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Key Metrics */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 xl:gap-8 max-w-5xl xl:max-w-6xl mx-auto"
            >
              {[
                { number: 75000, suffix: "+", label: "Activities Tracked", icon: Database, color: "text-blue-600" },
                { number: 2500, suffix: "+", label: "Daily Verifications", icon: Shield, color: "text-green-600" },
                { number: 150, suffix: "+", label: "Institutions", icon: Building, color: "text-purple-600" },
                { number: 99.9, suffix: "%", label: "Uptime", icon: Clock, color: "text-orange-600" },
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                    y: -5 
                  }}
                  className="bg-white dark:bg-gray-800 p-4 lg:p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 text-center group"
                  data-testid={`metric-card-${index}`}
                >
                  <metric.icon className={`w-8 h-8 lg:w-10 lg:h-10 ${metric.color} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`} />
                  <div className={`text-2xl lg:text-3xl xl:text-4xl font-bold ${metric.color} mb-2`} data-testid={`metric-${index}`}>
                    <AnimatedCounter end={metric.number} suffix={metric.suffix} />
                  </div>
                  <div className="text-sm lg:text-base text-muted-foreground font-medium">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Role-Specific Solutions */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white dark:bg-gray-900">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="solutions-title"
              >
                Tailored Solutions for Every Stakeholder
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="solutions-description"
              >
                Discover how Smart Student Hub transforms experiences for students, faculty, and administrators 
                with specialized features designed for each role's unique needs.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  title: "For Students",
                  subtitle: "Build Your Digital Portfolio",
                  icon: Users,
                  color: "from-blue-500 to-cyan-500",
                  bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
                  benefits: [
                    "Document activities seamlessly with instant faculty verification",
                    "Generate professional portfolios for placements",
                    "Track skill development and career readiness",
                    "Access mobile-friendly interface for updates"
                  ],
                  stats: { success: "85%", time: "4 Hours", views: "250+" }
                },
                {
                  title: "For Faculty",
                  subtitle: "Streamline Verification & Assessment",
                  icon: Shield,
                  color: "from-green-500 to-emerald-500",
                  bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
                  benefits: [
                    "Efficient bulk verification workflows with smart assignment",
                    "Comprehensive evidence review with quality assessment",
                    "Standardized rubrics for consistent evaluation",
                    "Real-time dashboard with automated notifications"
                  ],
                  stats: { reduction: "70%", accuracy: "99.5%", satisfaction: "4.8/5" }
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
                    "Comprehensive audit trails and data security"
                  ],
                  stats: { prep: "-90%", accuracy: "100%", implementation: "2-4 Weeks" }
                }
              ].map((role, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="group relative"
                  data-testid={`role-solution-${index}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.bgColor} rounded-3xl transform group-hover:scale-105 transition-transform duration-500 opacity-50`}></div>
                  
                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700">
                    <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{role.title}</h3>
                    <p className="text-lg text-primary font-semibold mb-6">{role.subtitle}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {role.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm lg:text-base text-muted-foreground leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {Object.entries(role.stats).map(([key, value], statIndex) => (
                        <div key={statIndex} className="text-center">
                          <div className="text-lg lg:text-xl font-bold text-primary">{value}</div>
                          <div className="text-xs text-muted-foreground capitalize">{key}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => setLocation('/login')}
                        className="flex-1 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
                        data-testid={`${role.title.toLowerCase().replace(/\s+/g, '-')}-primary-cta`}
                      >
                        Get Started
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = `mailto:contact@smartstudenthub.com?subject=${role.title} Demo Request`}
                        className="flex-1"
                        data-testid={`${role.title.toLowerCase().replace(/\s+/g, '-')}-secondary-cta`}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Key Benefits & Analytics */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="benefits-title"
              >
                Proven Results & Impact
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="benefits-description"
              >
                Real-time insights and measurable improvements across all institutional metrics
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
              {/* NAAC Readiness */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-1"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl xl:text-2xl font-bold text-foreground flex items-center">
                      <Award className="w-6 h-6 xl:w-8 xl:h-8 text-yellow-600 mr-3" />
                      NAAC Readiness
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { label: "Curricular Aspects", value: 98, color: "bg-green-500" },
                      { label: "Teaching-Learning", value: 95, color: "bg-blue-500" },
                      { label: "Research & Innovation", value: 88, color: "bg-purple-500" },
                      { label: "Student Support", value: 96, color: "bg-teal-500" },
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
                          <span className="text-sm font-medium text-foreground">{criterion.label}</span>
                          <span className="text-sm font-bold text-foreground">{criterion.value}%</span>
                        </div>
                        <Progress value={criterion.value} className="h-2" />
                      </motion.div>
                    ))}
                    <div className="pt-4 border-t border-border text-center">
                      <div className="text-3xl xl:text-4xl font-bold text-green-600 mb-2">A+</div>
                      <p className="text-sm text-muted-foreground">Projected NAAC Grade</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Placement Impact */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl xl:text-2xl font-bold text-foreground flex items-center">
                      <Briefcase className="w-6 h-6 xl:w-8 xl:h-8 text-green-600 mr-3" />
                      Placement Success
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-green-600 mb-2">
                          <AnimatedCounter end={85} suffix="%" />
                        </div>
                        <p className="text-muted-foreground">Success Rate with Platform</p>
                        <p className="text-sm text-muted-foreground">vs 62% traditional methods</p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Success Rate Increase</span>
                          <span className="text-xl font-bold text-green-600">+37%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Time Reduction</span>
                          <span className="text-xl font-bold text-blue-600">-60%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Portfolio Quality</span>
                          <span className="text-xl font-bold text-purple-600">+95%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* ROI & Efficiency */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:col-span-2 xl:col-span-1"
              >
                <Card className="h-full bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl xl:text-2xl font-bold text-foreground flex items-center">
                      <TrendingUp className="w-6 h-6 xl:w-8 xl:h-8 text-blue-600 mr-3" />
                      ROI & Efficiency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-3xl font-bold text-green-600">
                          <AnimatedCounter end={300} suffix="%" />
                        </div>
                        <p className="text-sm text-muted-foreground">ROI in Year 1</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-600">
                          <AnimatedCounter end={75} suffix="%" />
                        </div>
                        <p className="text-sm text-muted-foreground">Time Saved</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-purple-600">
                          <AnimatedCounter end={90} suffix="%" />
                        </div>
                        <p className="text-sm text-muted-foreground">Less Prep Time</p>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-orange-600">100%</div>
                        <p className="text-sm text-muted-foreground">Data Accuracy</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Trusted Testimonials - Consolidated */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-white dark:bg-gray-900">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="testimonials-title"
              >
                Trusted by Leading Institutions
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="testimonials-description"
              >
                Hear from Vice-Chancellors, Deans, and academic leaders who have transformed their institutions.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <TestimonialCard
                name="Dr. Rajesh Kumar"
                role="Vice-Chancellor"
                company="University of Delhi"
                rating={5}
                quote="Smart Student Hub revolutionized our accreditation process. We achieved NAAC A++ grade with 90% less preparation time. The platform's comprehensive analytics have been game-changing for our institutional excellence."
                impact="NAAC A++ Grade Achieved"
              />
              <TestimonialCard
                name="Prof. Priya Sharma"
                role="Dean of Academic Affairs"
                company="IIT Bombay"
                rating={5}
                quote="The platform's integration with our ERP system was seamless. Faculty verification workflows reduced administrative burden by 75%, allowing professors to focus more on teaching excellence."
                impact="75% Reduction in Admin Work"
              />
              <TestimonialCard
                name="Dr. Suresh Patel"
                role="Registrar"
                company="Anna University"
                rating={5}
                quote="Student portfolio generation improved dramatically. Our placement success rate increased by 40% within the first semester. Companies now prefer our students' verified portfolios."
                impact="40% Increase in Placements"
              />
            </div>

            {/* Trust Indicators */}
            <motion.div 
              className="mt-16 lg:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {[
                { metric: "150+", label: "Institutions", icon: Building },
                { metric: "4.9/5", label: "Rating", icon: Star },
                { metric: "99.9%", label: "Uptime", icon: Shield },
                { metric: "24/7", label: "Support", icon: Heart },
                { metric: "SOC 2", label: "Certified", icon: Lock },
                { metric: "GDPR", label: "Compliant", icon: CheckCircle },
              ].map((indicator, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors duration-300">
                    <indicator.icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                  </div>
                  <div className="text-xl lg:text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {indicator.metric}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {indicator.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Simplified Implementation Process */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12 lg:mb-16">
              <motion.h2 
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                data-testid="implementation-title"
              >
                Simple 4-Phase Implementation
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="implementation-description"
              >
                From assessment to full deployment in 2-4 weeks with dedicated support
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  phase: "Week 1",
                  title: "Assessment",
                  icon: Search,
                  color: "from-blue-500 to-cyan-500",
                  description: "Institutional assessment and custom configuration design"
                },
                {
                  phase: "Week 2", 
                  title: "Setup",
                  icon: Settings,
                  color: "from-green-500 to-emerald-500",
                  description: "System deployment and integration with existing platforms"
                },
                {
                  phase: "Week 3",
                  title: "Training",
                  icon: Users,
                  color: "from-purple-500 to-pink-500",
                  description: "Comprehensive training for administrators, faculty, and students"
                },
                {
                  phase: "Week 4",
                  title: "Launch",
                  icon: Rocket,
                  color: "from-orange-500 to-red-500",
                  description: "Full rollout with performance monitoring and optimization"
                }
              ].map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center group"
                  data-testid={`implementation-phase-${index}`}
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${phase.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <phase.icon className="w-10 h-10 text-white" />
                  </div>
                  <Badge variant="secondary" className="mb-3 text-sm font-medium">
                    {phase.phase}
                  </Badge>
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-3">{phase.title}</h3>
                  <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                    {phase.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
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
                Get answers to common questions about implementing Smart Student Hub.
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
                    question: "How long does implementation take?",
                    answer: "Implementation typically takes 2-4 weeks depending on your institution size. This includes data migration, training, and system integration with minimal disruption to academic activities."
                  },
                  {
                    question: "Is the platform compliant with data privacy regulations?",
                    answer: "Yes, Smart Student Hub is fully compliant with GDPR and educational standards. We implement enterprise-grade security with encrypted storage, secure authentication, and regular audits."
                  },
                  {
                    question: "Does it integrate with existing ERP and LMS platforms?",
                    answer: "Absolutely. Our platform offers seamless integration with popular ERP systems (SAP, Oracle, Microsoft Dynamics) and LMS platforms (Moodle, Canvas, Blackboard) through APIs."
                  },
                  {
                    question: "How does it help with NAAC accreditation?",
                    answer: "The platform automates data collection for all NAAC criteria, generates pre-formatted reports, and maintains audit trails. Institutions typically see 90% reduction in preparation time."
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

        {/* Final Call-to-Action */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-blue-600 to-indigo-700 relative overflow-hidden">
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
              data-testid="final-cta-title"
            >
              Ready to Transform Your Institution?
            </motion.h2>
            <motion.p 
              className="text-lg lg:text-xl text-blue-100 mb-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              data-testid="final-cta-description"
            >
              Join hundreds of educational institutions that have streamlined their student achievement tracking, 
              enhanced accreditation processes, and empowered students with verified digital portfolios.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setLocation('/login')}
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
                  data-testid="final-cta-get-started"
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
                  className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="final-cta-book-demo"
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
                <div className="text-2xl font-bold text-white mb-1">150+</div>
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

        {/* Professional Footer */}
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
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
                    "Security",
                    "API Docs"
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
                    "NIRF Rankings"
                  ].map((item, index) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm" data-testid={`footer-solutions-${index}`}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support & Contact */}
              <div>
                <h4 className="text-lg font-semibold mb-6" data-testid="footer-support-title">Support</h4>
                <ul className="space-y-3 mb-6">
                  {[
                    "Help Center",
                    "Training",
                    "Implementation",
                    "Community",
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
    </HelmetProvider>
  );
}
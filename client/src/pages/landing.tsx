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
 * - Complete responsiveness (320px to 1440px+)
 * - Comprehensive content sections
 * - Professional academic design
 * - SEO optimization and accessibility
 */

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLocation } from "wouter";
import { 
  GraduationCap, Shield, Users, BarChart3, FileCheck, Award, TrendingUp, 
  Database, CheckCircle, Building, Clock, Search, BookOpen, Briefcase, 
  Trophy, Globe, Star, Zap, Settings, Lock, Cloud, Cpu, UserCheck, 
  Workflow, Target, Calendar, Smartphone, ChevronDown, Menu, X,
  Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin,
  Plus, Minus, ArrowRight, Play, CheckSquare, AlertCircle,
  Lightbulb, Layers, Rocket, Heart, Monitor, TabletSmartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "", prefix = "" }: { 
  end: number; 
  duration?: number; 
  suffix?: string; 
  prefix?: string; 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime = 0;
      const startCount = 0;
      
      const updateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        setCount(Math.floor(progress * (end - startCount) + startCount));
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    }
  }, [inView, end, duration]);

  return (
    <span ref={ref} data-testid={`animated-counter-${end}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Mobile Menu Component
const MobileMenu = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
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
              onClick={() => setLocation('/api/login')}
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between relative">
              <motion.div 
                className="flex items-center space-x-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="site-title">
                    Smart Student Hub
                  </h1>
                  <p className="text-sm text-muted-foreground hidden sm:block" data-testid="site-subtitle">
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
                  onClick={() => setLocation('/api/login')}
                  size="sm"
                  className="hover:scale-105 transition-transform shadow-md"
                  data-testid="desktop-login-button"
                >
                  Sign In
                </Button>
              </div>
              
              <MobileMenu isOpen={mobileMenuOpen} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
            </div>
          </div>
        </motion.header>

        {/* Hero Section with Enhanced Animations */}
        <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
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
                <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium" data-testid="hero-badge">
                  Trusted by 100+ Educational Institutions
                </Badge>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-8 leading-tight tracking-tight"
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
                className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-5xl mx-auto leading-relaxed"
                data-testid="hero-description"
              >
                Transform your Higher Education Institution with a comprehensive digital framework that records, 
                verifies, and showcases every student's academic and co-curricular achievements. Streamline 
                <strong className="text-primary font-semibold"> NAAC, AICTE, and NIRF compliance</strong> while 
                empowering students with verified digital portfolios.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => setLocation('/api/login')}
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
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto"
            >
              {[
                { number: 50000, suffix: "+", label: "Student Activities Tracked", icon: Database, color: "text-blue-600" },
                { number: 1200, suffix: "+", label: "Daily Faculty Verifications", icon: Shield, color: "text-green-600" },
                { number: 100, suffix: "%", label: "NAAC Compliance Coverage", icon: CheckCircle, color: "text-purple-600" },
                { number: 24, suffix: "/7", label: "System Availability", icon: Clock, color: "text-orange-600" },
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
                  <div className={`text-3xl lg:text-4xl font-bold ${metric.color} mb-2`} data-testid={`metric-${index}`}>
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

        {/* Student Success Story - Enhanced */}
        <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-teal-950/20">
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
                data-testid="success-story-title"
              >
                Student Success Story: ISHU KUMAR
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto"
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

        {/* Testimonials Section */}
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
                data-testid="testimonials-title"
              >
                What Our Users Say
              </motion.h2>
              <motion.p 
                className="text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                data-testid="testimonials-description"
              >
                Hear from students, faculty, and administrators who have transformed their institutional 
                processes with Smart Student Hub.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  type: "Student",
                  name: "Priya Sharma",
                  position: "B.Tech Electronics, IIT Delhi",
                  avatar: "PS",
                  quote: "The platform transformed how I document my achievements. Having verified portfolios ready for placements gave me a significant advantage. The faculty verification process adds real credibility to my profile.",
                  rating: 5,
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  type: "Faculty",
                  name: "Dr. Rajesh Kumar",
                  position: "Professor & HOD, Computer Science",
                  avatar: "RK",
                  quote: "Student activity verification is now seamless. The bulk approval features save hours of work, and the analytics help us identify students who need more engagement in co-curricular activities.",
                  rating: 5,
                  color: "from-green-500 to-emerald-500"
                },
                {
                  type: "Administrator",
                  name: "Prof. Sunita Verma",
                  position: "Dean Academic Affairs, NIT Warangal",
                  avatar: "SV",
                  quote: "NAAC accreditation preparation that used to take 3 months now takes just 2 weeks. The automated reports are comprehensive and accurate. This platform is a game-changer for institutional excellence.",
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
                  <Card className="h-full bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                    <CardHeader className="text-center pb-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {testimonial.avatar}
                      </div>
                      <div className="flex justify-center mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Badge variant="secondary" className="mb-2">{testimonial.type}</Badge>
                    </CardHeader>
                    <CardContent className="text-center">
                      <blockquote className="text-muted-foreground italic mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.position}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
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
                  onClick={() => setLocation('/api/login')}
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
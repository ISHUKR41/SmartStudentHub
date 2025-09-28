/**
 * Landing Page Component for Smart Student Hub
 * 
 * The main landing page that introduces the Smart Student Hub platform to prospective users.
 * This page serves as the primary entry point for unauthenticated users and showcases the
 * institutional capabilities of the Student Activity Record Management System.
 * 
 * Key Features:
 * - Professional institutional branding and messaging
 * - Comprehensive feature showcase for different user roles
 * - Responsive design optimized for academic environments
 * - Integration with Replit authentication system
 * - Clear call-to-action for accessing the portal
 * 
 * Target Audiences:
 * - Students: Activity documentation and portfolio creation
 * - Faculty: Activity approval and student monitoring
 * - Administrators: Institutional analytics and compliance reporting
 * - Institutional Stakeholders: System overview and benefits
 * 
 * Design Principles:
 * - Professional academic aesthetic suitable for higher education
 * - Clear value proposition for each user type
 * - Emphasis on institutional benefits and compliance
 * - User-friendly navigation to authentication system
 * 
 * Authentication Flow:
 * - Redirects to '/api/login' for Replit OIDC authentication
 * - Supports role-based access control post-authentication
 * - Seamless integration with institutional identity providers
 * 
 * Accessibility Features:
 * - Semantic HTML structure for screen readers
 * - Proper heading hierarchy and navigation
 * - High contrast colors for visual accessibility
 * - Keyboard navigation support
 * 
 * Responsive Design:
 * - Mobile-first approach with adaptive layouts
 * - Flexible grid system for various screen sizes
 * - Optimized typography for readability across devices
 */

import { GraduationCap, Shield, Users, BarChart3, FileCheck, Award, TrendingUp, Database, CheckCircle, Building, AlertTriangle, Clock, XCircle, Search, BookOpen, Briefcase, Trophy, Globe, Star, Zap, Settings, Lock, Cloud, Cpu, MonitorSpeaker, UserCheck, Workflow, Target, DollarSign, Gauge, CheckSquare, HeadphonesIcon, Calendar, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Landing Page Component
 * 
 * Renders the main landing page with institutional branding, feature showcase,
 * and authentication integration for the Smart Student Hub platform.
 * 
 * @returns {JSX.Element} Complete landing page with header, hero, features, and footer
 */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Smart Student Hub</h1>
                <p className="text-xs text-muted-foreground">Institutional Excellence Management System</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="btn-primary"
              data-testid="button-login"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Centralized Digital Platform for Comprehensive Student Activity Records
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your Higher Education Institution with a comprehensive digital framework that records, verifies, and showcases every student's academic and co-curricular achievements from admission to graduation. Streamline NAAC, AICTE, and NIRF compliance while empowering students with verified digital portfolios.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="btn-primary"
              data-testid="button-access-portal"
            >
              Access Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Complete Student Achievement Ecosystem</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Centralize documentation and streamline data collection. Our platform provides a unified repository for all student activities - from academic achievements to co-curricular participation, internships, and leadership roles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Comprehensive Activity Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Record and categorize all student activities including seminars, hackathons, MOOCs, internships, leadership roles, and volunteering efforts with automated documentation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Faculty Verification System</h3>
                <p className="text-sm text-muted-foreground">
                  Multi-level approval workflow ensures every achievement is verified by authorized faculty, maintaining institutional credibility and authenticity
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">NAAC/NIRF Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Automated report generation for NAAC accreditation, NIRF rankings, and AICTE compliance with pre-configured templates and data mapping
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Digital Portfolio Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Auto-generated professional portfolios with institutional logos, verification stamps, and shareable links for placements and higher education applications
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Advanced Analytics Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Department-wise statistics, year-over-year growth analysis, participation trends, and data-driven insights for institutional decision-making
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">ERP & LMS Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Seamless integration with existing institutional systems including ERP, Learning Management Systems, and placement portals for unified data management
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Addressing Critical Institutional Challenges</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Current student achievement documentation is distributed across departments, faculty files, and personal records, creating significant challenges during accreditation audits and placement processes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Scattered Data</h3>
              <p className="text-sm text-muted-foreground">Student achievements stored in multiple locations - departmental files, Excel sheets, personal records</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Manual Collection</h3>
              <p className="text-sm text-muted-foreground">Weeks spent manually collecting and verifying records during NAAC audits and compliance reviews</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Lost Opportunities</h3>
              <p className="text-sm text-muted-foreground">Students miss placements and admissions due to incomplete or unverified achievement documentation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Verification Issues</h3>
              <p className="text-sm text-muted-foreground">Difficulty in validating authenticity of certificates and achievements during external reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Solution Benefits</h2>
            <p className="text-lg text-muted-foreground">
              Transform your institution's approach to student achievement documentation and compliance reporting
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Students</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Centralized repository for all academic and co-curricular achievements</li>
                <li>• Faculty-verified digital portfolios ready for placements and admissions</li>
                <li>• Real-time skill credit tracking and progress monitoring</li>
                <li>• Professional certificate management with tamper-proof verification</li>
                <li>• Instant PDF portfolio generation for career opportunities</li>
                <li>• Comprehensive activity history from admission to graduation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Faculty</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Streamlined activity approval workflow with notification system</li>
                <li>• Digital verification process eliminating paperwork</li>
                <li>• Department-wise student performance analytics</li>
                <li>• Efficient bulk approval and feedback mechanisms</li>
                <li>• Integration with existing academic management systems</li>
                <li>• Real-time monitoring of student engagement levels</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Higher Education Institutions</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• One-click NAAC, NIRF, and AICTE compliance reporting</li>
                <li>• Institutional ranking improvement through documented excellence</li>
                <li>• Data-driven decision making with comprehensive analytics</li>
                <li>• Elimination of manual data collection during audits</li>
                <li>• Enhanced transparency in student achievement documentation</li>
                <li>• Strategic planning support with historical trend analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NAAC Compliance Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">NAAC & NIRF Compliance Framework</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Our platform directly addresses all seven NAAC criteria and five NIRF parameters, providing automated data collection, analysis, and reporting for institutional accreditation and ranking improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">NAAC Seven Criteria Alignment</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Criterion 3:</span>
                      <span className="text-muted-foreground"> Research tracking with publication metrics and innovation documentation</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Criterion 5:</span>
                      <span className="text-muted-foreground"> Student support through comprehensive portfolio and skill development tracking</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Criterion 7:</span>
                      <span className="text-muted-foreground"> Best practices documentation through verified student achievement records</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">NIRF Parameter Coverage</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Teaching & Learning:</span>
                      <span className="text-muted-foreground"> Student engagement metrics and academic activity correlation</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Graduation Outcomes:</span>
                      <span className="text-muted-foreground"> Employment correlation with co-curricular participation</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-foreground">Outreach & Inclusivity:</span>
                      <span className="text-muted-foreground"> Community service and diversity initiative tracking</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-4 text-center">Automated Compliance Reporting Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Statistical Analysis</h4>
                <p className="text-sm text-muted-foreground">Automated generation of participation statistics, trend analysis, and comparative institutional benchmarking</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileCheck className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Evidence Documentation</h4>
                <p className="text-sm text-muted-foreground">Comprehensive evidence collection with faculty verification and institutional authentication stamps</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Real-time Monitoring</h4>
                <p className="text-sm text-muted-foreground">Continuous tracking of institutional performance indicators with dashboard analytics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Journey Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Complete Student Achievement Journey</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              From admission to graduation, track every milestone, achievement, and growth opportunity with comprehensive verification and portfolio development.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-blue-500 to-green-500 rounded-full"></div>
            
            <div className="space-y-12">
              <div className="flex items-center relative">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Academic Excellence Tracking</h3>
                    <p className="text-muted-foreground">Research publications, conference presentations, academic competitions, and scholarly achievements with faculty verification</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center relative z-10">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pl-8"></div>
              </div>

              <div className="flex items-center relative">
                <div className="flex-1 pr-8"></div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center relative z-10">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left pl-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Professional Development</h3>
                    <p className="text-muted-foreground">Internships, industry projects, professional certifications, and skill development programs with employer validation</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center relative">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Leadership & Service</h3>
                    <p className="text-muted-foreground">Student government, club leadership, community service, and social impact initiatives with institutional recognition</p>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pl-8"></div>
              </div>

              <div className="flex items-center relative">
                <div className="flex-1 pr-8"></div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center relative z-10">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left pl-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Digital Portfolio Creation</h3>
                    <p className="text-muted-foreground">Comprehensive verified portfolio with institutional branding, ready for placements, admissions, and career advancement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials and Case Studies Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Institutional Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Leading Higher Education Institutions across India have transformed their student achievement documentation and compliance processes with our comprehensive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">National Institute of Technology</h3>
                <blockquote className="text-sm text-muted-foreground mb-4 italic">
                  "Smart Student Hub transformed our NAAC accreditation process. We achieved A++ grade with seamless evidence compilation and 90% reduction in manual documentation time."
                </blockquote>
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span>• 15,000+ Students</span>
                  <span>• A++ NAAC Grade</span>
                  <span>• NIRF Rank 45</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Central University of Rajasthan</h3>
                <blockquote className="text-sm text-muted-foreground mb-4 italic">
                  "Smart Student Hub revolutionized our approach to student development tracking. We documented 75,000+ co-curricular activities across 45 departments, resulting in our first A+ NAAC grade and improved NIRF ranking from 150 to 89."
                </blockquote>
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span>• 22,000+ Students</span>
                  <span>• A+ NAAC Grade</span>
                  <span>• NIRF Rank 89</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">BITS Pilani - Deemed University</h3>
                <blockquote className="text-sm text-muted-foreground mb-4 italic">
                  "The comprehensive analytics helped us identify top-performing students for industry partnerships. Our placement statistics improved by 42%, and we achieved 98% graduate employment rate with verified skill portfolios attracting Fortune 500 companies."
                </blockquote>
                <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                  <span>• 18,000+ Students</span>
                  <span>• 98% Placement Rate</span>
                  <span>• Fortune 500 Partners</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Measurable Impact Across Institutions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">90%</div>
                <div className="text-sm text-muted-foreground">Reduction in Manual Documentation Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">35%</div>
                <div className="text-sm text-muted-foreground">Improvement in Placement Rates</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-sm text-muted-foreground">NAAC Criteria Coverage</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">48hrs</div>
                <div className="text-sm text-muted-foreground">Compliance Report Generation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Enterprise-Grade Platform Architecture</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Built with institutional scalability, security, and reliability in mind. Our platform supports institutions from 1,000 to 50,000+ students with enterprise-grade infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4">
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Cloud Infrastructure</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Multi-zone deployment for 99.9% uptime guarantee</li>
                  <li>• Auto-scaling to handle peak loads during admission periods</li>
                  <li>• CDN-enabled for optimal performance across India</li>
                  <li>• Disaster recovery with 4-hour RTO</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Security & Compliance</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• ISO 27001 certified data protection standards</li>
                  <li>• End-to-end encryption for all student data</li>
                  <li>• GDPR and Indian data protection law compliance</li>
                  <li>• Regular security audits and penetration testing</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mr-4">
                    <Cpu className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Performance & Scalability</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Sub-second response times for all operations</li>
                  <li>• Support for 10,000+ concurrent users</li>
                  <li>• Horizontal scaling with load balancing</li>
                  <li>• Advanced caching for optimal performance</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mr-4">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Integration Capabilities</h3>
                </div>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• RESTful APIs for seamless ERP integration</li>
                  <li>• SAML/OAuth SSO with institutional identity providers</li>
                  <li>• Webhook support for real-time data synchronization</li>
                  <li>• Custom field mapping for existing databases</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Platform Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gauge className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Performance Metrics</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>99.9% Uptime SLA</li>
                  <li>&lt; 500ms Response Time</li>
                  <li>10TB+ Data Processing</li>
                  <li>24/7 Monitoring</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Platform Support</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>Web Application</li>
                  <li>Mobile-Responsive</li>
                  <li>PWA Support</li>
                  <li>Offline Capabilities</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MonitorSpeaker className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Integration Support</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>RESTful APIs</li>
                  <li>Webhook Events</li>
                  <li>SAML/OAuth SSO</li>
                  <li>Custom Connectors</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Seamless Implementation Process</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Our proven implementation methodology ensures smooth deployment with minimal disruption to your institutional operations. From planning to go-live in 8-12 weeks.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 rounded-full opacity-30"></div>
            
            <div className="space-y-12">
              <div className="flex items-center relative">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Discovery & Planning (Week 1-2)</h3>
                    <p className="text-muted-foreground text-sm mb-3">Comprehensive institutional assessment, requirement gathering, and solution customization planning</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Current system audit and data mapping</li>
                      <li>• Stakeholder interviews and requirement documentation</li>
                      <li>• Technical architecture planning and customization scope</li>
                    </ul>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center relative z-10">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pl-8"></div>
              </div>

              <div className="flex items-center relative">
                <div className="flex-1 pr-8"></div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center relative z-10">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left pl-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">System Configuration (Week 3-6)</h3>
                    <p className="text-muted-foreground text-sm mb-3">Platform customization, integration development, and institutional branding implementation</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Custom workflow configuration and approval hierarchies</li>
                      <li>• ERP/LMS integration development and testing</li>
                      <li>• Institutional branding and user interface customization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center relative">
                <div className="flex-1 text-right pr-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Training & Testing (Week 7-8)</h3>
                    <p className="text-muted-foreground text-sm mb-3">Comprehensive user training programs and system testing with institutional stakeholders</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Faculty and administrative staff training sessions</li>
                      <li>• Student orientation and user guide distribution</li>
                      <li>• System testing and user acceptance validation</li>
                    </ul>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center relative z-10">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 pl-8"></div>
              </div>

              <div className="flex items-center relative">
                <div className="flex-1 pr-8"></div>
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center relative z-10">
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left pl-8">
                  <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Go-Live & Support (Week 9-12)</h3>
                    <p className="text-muted-foreground text-sm mb-3">Production deployment with 24/7 support and continuous monitoring for optimal performance</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Phased rollout with real-time monitoring</li>
                      <li>• Dedicated support team for first 30 days</li>
                      <li>• Performance optimization and system fine-tuning</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-8 border border-primary/20">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Comprehensive Support & Maintenance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HeadphonesIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">24/7 Technical Support</h4>
                  <p className="text-sm text-muted-foreground">Dedicated support team with guaranteed response times and escalation procedures</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Regular Updates</h4>
                  <p className="text-sm text-muted-foreground">Quarterly platform updates with new features, compliance requirements, and security enhancements</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Workflow className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">Continuous Training</h4>
                  <p className="text-sm text-muted-foreground">Ongoing training programs, webinars, and documentation updates for institutional teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI and Value Proposition Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Return on Investment & Value Creation</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Quantifiable benefits that justify investment while transforming institutional operations, compliance processes, and student outcomes for sustainable growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mr-4">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Cost Savings & Efficiency</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Reduced Manual Documentation</span>
                    <span className="font-semibold text-green-600">₹15-25 Lakhs/Year</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">NAAC Audit Preparation Time</span>
                    <span className="font-semibold text-green-600">90% Reduction</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Administrative Efficiency</span>
                    <span className="font-semibold text-green-600">60% Improvement</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Paper & Storage Costs</span>
                    <span className="font-semibold text-green-600">₹2-5 Lakhs/Year</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="pt-0">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Strategic Value Creation</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">NIRF Ranking Improvement</span>
                    <span className="font-semibold text-blue-600">15-30 Positions</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Student Placement Rate</span>
                    <span className="font-semibold text-blue-600">25-40% Increase</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Alumni Engagement</span>
                    <span className="font-semibold text-blue-600">3x Improvement</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Institutional Visibility</span>
                    <span className="font-semibold text-blue-600">Significant Boost</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Investment Justification Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">3-6 Months</div>
                <div className="text-sm text-muted-foreground">Typical ROI Realization Period</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">300-500%</div>
                <div className="text-sm text-muted-foreground">ROI over 3 Years</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">₹50-80L</div>
                <div className="text-sm text-muted-foreground">Annual Value Creation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">A/A+</div>
                <div className="text-sm text-muted-foreground">Typical NAAC Grade Achievement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Advanced Platform Capabilities</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Comprehensive suite of advanced features designed specifically for Higher Education Institutions requiring sophisticated student achievement tracking and institutional excellence management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Workflow className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Automated Workflows</h3>
                <p className="text-sm text-muted-foreground">
                  Custom approval workflows with conditional routing, escalation timers, and bulk processing capabilities for efficient institutional operations
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Goal Tracking System</h3>
                <p className="text-sm text-muted-foreground">
                  Individual and institutional goal setting with progress tracking, milestone notifications, and achievement analytics for strategic planning
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MonitorSpeaker className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">
                  Live dashboards with instant notifications, activity feeds, and real-time compliance status monitoring for proactive management
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Compliance Automation</h3>
                <p className="text-sm text-muted-foreground">
                  Automated compliance checking, report generation, and regulatory requirement mapping for NAAC, NIRF, and AICTE standards
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Institutional Excellence Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Institutional Excellence Through Digital Transformation</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Enhance your institution's standing in national rankings while providing students with comprehensive achievement documentation and verification systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Global Standards Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Align with international higher education standards and best practices for student achievement documentation and institutional quality assurance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Data Security & Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade security with role-based access control, encrypted data storage, and comprehensive audit trails for institutional compliance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Continuous Improvement</h3>
                <p className="text-sm text-muted-foreground">
                  Data-driven insights for institutional strategic planning, student engagement enhancement, and academic program optimization
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-8 border border-primary/20">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Transform Your Institution Today</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                Join leading Higher Education Institutions across India in implementing the most comprehensive student achievement tracking and institutional excellence platform available.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">10000+</div>
                  <div className="text-sm text-muted-foreground">Student Records Managed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Faculty Verifications Daily</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">99%</div>
                  <div className="text-sm text-muted-foreground">NAAC Compliance Coverage</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                  <div className="text-sm text-muted-foreground">System Availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Institution?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading Higher Education Institutions in implementing comprehensive student achievement tracking and NAAC compliance automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              variant="secondary"
              className="text-primary bg-white hover:bg-gray-100"
              data-testid="button-access-platform"
            >
              Access Platform
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
              data-testid="button-schedule-demo"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">Smart Student Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering Higher Education Institutions with comprehensive student achievement tracking and compliance automation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Platform Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Activity Tracking & Verification</li>
                <li>Digital Portfolio Generation</li>
                <li>NAAC/NIRF Compliance</li>
                <li>Advanced Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">For Institutions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Accreditation Support</li>
                <li>Data-Driven Insights</li>
                <li>Process Automation</li>
                <li>System Integration</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 Smart Student Hub. Advancing academic excellence through institutional digital transformation. Designed for Higher Education Institutions pursuing NAAC accreditation and NIRF ranking improvements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

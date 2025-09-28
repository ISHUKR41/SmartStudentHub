/**
 * Enhanced Landing Page Component for Smart Student Hub
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
 */

import { GraduationCap, Shield, Users, BarChart3, FileCheck, Award, TrendingUp, Database, CheckCircle, Building, AlertTriangle, Clock, XCircle, Search, BookOpen, Briefcase, Trophy, Globe, Star, Zap, Settings, Lock, Cloud, Cpu, MonitorSpeaker, UserCheck, Workflow, Target, Calendar, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo Request&body=Hello,%0A%0AI am interested in scheduling a demo of the Smart Student Hub platform for my institution.%0A%0APlease contact me to arrange a suitable time.%0A%0AThank you!'}
                data-testid="button-schedule-demo-header"
              >
                Schedule Demo
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary hover:bg-primary/90"
                data-testid="button-login"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
              Centralized Digital Platform for Comprehensive Student Activity Records
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your Higher Education Institution with a comprehensive digital framework that records, verifies, and showcases every student's academic and co-curricular achievements from admission to graduation. Streamline NAAC, AICTE, and NIRF compliance while empowering students with verified digital portfolios.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                data-testid="button-access-portal"
              >
                Launch Platform Now
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo Request&body=Hello,%0A%0AI am interested in scheduling a demo of the Smart Student Hub platform for my institution.%0A%0APlease contact me to arrange a suitable time.%0A%0AThank you!'}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-12 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                data-testid="button-schedule-demo-hero"
              >
                Schedule Institution Demo
              </Button>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-sm text-muted-foreground">Student Activities Tracked</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">1,200+</div>
              <div className="text-sm text-muted-foreground">Faculty Verifications Daily</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">NAAC Compliance Coverage</div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">System Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Profile Showcase - ISHU KUMAR */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Student Success Story: ISHU KUMAR</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              See how students like ISHU KUMAR use our platform to systematically document their academic journey and build comprehensive portfolios that showcase their institutional achievements.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-8 text-white text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">ISHU KUMAR</h3>
                  <p className="text-blue-100 mb-4">B.Tech Computer Science Engineering</p>
                  <p className="text-sm text-blue-100">NIT Delhi</p>
                  <p className="text-sm text-blue-100">Roll No: 20CS3024</p>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Award className="w-6 h-6 text-primary mr-2" />
                      <h4 className="font-semibold text-foreground">Academic Excellence</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Research contributions in Machine Learning</li>
                      <li>• Consistent academic performance</li>
                      <li>• Technical competition participation</li>
                      <li>• Project work in AI/ML domain</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Briefcase className="w-6 h-6 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-foreground">Professional Development</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Industry internship experiences</li>
                      <li>• Professional certification courses</li>
                      <li>• Technical skill development</li>
                      <li>• Open source contributions</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
                      <h4 className="font-semibold text-foreground">Leadership & Co-curricular</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Student body leadership roles</li>
                      <li>• Event organization and coordination</li>
                      <li>• Community service activities</li>
                      <li>• Peer mentoring and guidance</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Star className="w-6 h-6 text-green-600 mr-2" />
                      <h4 className="font-semibold text-foreground">Platform Outcomes</h4>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Comprehensive verified portfolio</li>
                      <li>• Enhanced placement readiness</li>
                      <li>• Institutional verification benefits</li>
                      <li>• Streamlined documentation process</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground italic">
                    "The platform helps me maintain a complete record of all my academic and co-curricular activities. Having faculty verification for each achievement adds credibility, and the portfolio generation feature saves significant time during placement applications."
                  </p>
                  <p className="text-sm font-medium text-primary mt-2">- ISHU KUMAR, Computer Science Engineering Student</p>
                </div>
              </div>
            </div>
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
            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

            <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

      {/* Detailed Workflow Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Complete Workflow: From Upload to Portfolio</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              Our streamlined three-stage process ensures every student achievement is properly documented, verified, and integrated into professional portfolios for career advancement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stage 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Student Documentation</h3>
                <p className="text-muted-foreground">Comprehensive Activity Recording</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Activity Upload Interface</h4>
                    <p className="text-xs text-muted-foreground">Intuitive form-based system for recording seminars, competitions, internships, research projects, and leadership roles</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Certificate Management</h4>
                    <p className="text-xs text-muted-foreground">Secure upload and storage of supporting documents, certificates, and evidence with automatic file validation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Category Classification</h4>
                    <p className="text-xs text-muted-foreground">Automatic categorization into academic, co-curricular, professional development, and community service activities</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Real-time Progress Tracking</h4>
                    <p className="text-xs text-muted-foreground">Dashboard showing skill credits earned, portfolio completion status, and achievement milestones reached</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stage 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Faculty Verification</h3>
                <p className="text-muted-foreground">Multi-level Approval Workflow</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Automated Assignment</h4>
                    <p className="text-xs text-muted-foreground">Smart routing of activities to relevant department faculty based on activity type and student's academic program</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Evidence Review Process</h4>
                    <p className="text-xs text-muted-foreground">Comprehensive evaluation of supporting documents, certificates, and activity details with plagiarism detection</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Quality Assessment</h4>
                    <p className="text-xs text-muted-foreground">Faculty evaluation of activity impact, learning outcomes achieved, and skill development demonstrated</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Feedback & Credit Assignment</h4>
                    <p className="text-xs text-muted-foreground">Detailed feedback provision and skill credit allocation based on institutional guidelines and NAAC criteria</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stage 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-xl p-8 border border-purple-200 dark:border-purple-800">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Portfolio Generation</h3>
                <p className="text-muted-foreground">Professional Career Documentation</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Automated Portfolio Creation</h4>
                    <p className="text-xs text-muted-foreground">Instant generation of professionally formatted PDF portfolios with institutional branding and verification stamps</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Digital Credential Wallet</h4>
                    <p className="text-xs text-muted-foreground">Secure storage of verified certificates with blockchain-based authenticity verification and QR code validation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Customizable Presentation</h4>
                    <p className="text-xs text-muted-foreground">Multiple portfolio formats optimized for different purposes: placements, higher education, scholarships, and competitions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">Shareable Digital Links</h4>
                    <p className="text-xs text-muted-foreground">Secure, time-limited sharing links for employers and institutions with access analytics and engagement tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-8 border border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-4">Complete Process Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">5 mins</div>
                  <div className="text-sm text-muted-foreground">Average Upload Time</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">24-48 hrs</div>
                  <div className="text-sm text-muted-foreground">Faculty Verification</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">Instant</div>
                  <div className="text-sm text-muted-foreground">Portfolio Generation</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">Lifetime</div>
                  <div className="text-sm text-muted-foreground">Secure Storage Access</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Technical Excellence Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Enterprise-Grade Technical Infrastructure</h2>
            <p className="text-xl text-muted-foreground max-w-5xl mx-auto leading-relaxed">
              Built on cutting-edge technology stack with enterprise-grade infrastructure, ensuring scalability, security, and seamless integration with existing institutional systems. Our platform handles millions of transactions while maintaining sub-second response times.
            </p>
          </div>

          {/* Security & Compliance */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Security & Compliance Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-8 border border-red-200 dark:border-red-800">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 text-red-600 mr-3" />
                  <h4 className="text-xl font-bold text-foreground">Enterprise Security</h4>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• AES-256 encryption for data at rest and in transit</li>
                  <li>• Multi-factor authentication (MFA) support</li>
                  <li>• Role-based access control (RBAC) with granular permissions</li>
                  <li>• Regular security audits and penetration testing</li>
                  <li>• SOC 2 Type II compliance certification</li>
                  <li>• GDPR and ISO 27001 alignment</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-4">
                  <Lock className="w-8 h-8 text-blue-600 mr-3" />
                  <h4 className="text-xl font-bold text-foreground">Data Privacy Protection</h4>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Data anonymization and pseudonymization</li>
                  <li>• Automated data retention policies</li>
                  <li>• Secure data deletion and right to be forgotten</li>
                  <li>• Privacy by design architecture</li>
                  <li>• Comprehensive audit logging</li>
                  <li>• Data localization options available</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-8 border border-green-200 dark:border-green-800">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                  <h4 className="text-xl font-bold text-foreground">Regulatory Compliance</h4>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• NAAC and NIRF reporting standards compliance</li>
                  <li>• AICTE guidelines adherence</li>
                  <li>• UGC framework compatibility</li>
                  <li>• Indian IT Act 2000 compliance</li>
                  <li>• Educational data protection standards</li>
                  <li>• Institutional accreditation requirements</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-8 border border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">Proven Performance & Reliability</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our platform delivers exceptional performance with industry-leading uptime and response times, trusted by leading institutions across India.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">System Uptime</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">&lt;200ms</div>
                <div className="text-sm text-muted-foreground">Average Response Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">100K+</div>
                <div className="text-sm text-muted-foreground">Concurrent Users Supported</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600 mb-2">10PB+</div>
                <div className="text-sm text-muted-foreground">Secure Data Storage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Case Studies & Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Institutional Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Leading Higher Education Institutions across India have transformed their student achievement tracking and compliance reporting through our comprehensive platform.
            </p>
          </div>
          
          {/* Case Study 1 */}
          <div className="mb-16">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/20 rounded-xl shadow-xl p-8 border border-blue-200 dark:border-blue-700">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-4">
                      <Building className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">ABC Institute of Technology</h3>
                      <p className="text-muted-foreground">Autonomous Engineering College, Mumbai</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      "Implementing Smart Student Hub transformed our approach to NAAC accreditation. Previously, collecting student achievement data took our team 6 weeks of manual effort. Now, we generate comprehensive reports in under 30 minutes with 100% accuracy and faculty verification."
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      "Our students now have professional portfolios ready for placements, and our faculty can track student engagement more effectively. The platform directly contributed to our NAAC A+ grade achievement."
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Dr. Priya Sharma</p>
                      <p className="text-sm text-muted-foreground">Dean of Academic Affairs</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                    <div className="text-sm text-muted-foreground">Reduction in Manual Work</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">A+</div>
                    <div className="text-sm text-muted-foreground">NAAC Accreditation Grade</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">5,200</div>
                    <div className="text-sm text-muted-foreground">Active Student Portfolios</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg text-center shadow-lg">
                    <div className="text-3xl font-bold text-orange-600 mb-2">92%</div>
                    <div className="text-sm text-muted-foreground">Student Placement Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Implementation was seamless with excellent technical support. Our data migration was completed without any issues, and faculty training took just one day."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Dr. Meera Patel</p>
                  <p className="text-xs text-muted-foreground">IT Director, DEF College</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "The ROI was immediate - we saved thousands of hours in manual documentation work and our NAAC review process became completely stress-free."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Mr. Anil Gupta</p>
                  <p className="text-xs text-muted-foreground">Registrar, GHI Institute</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4 italic">
                "Students love having their achievements professionally documented. Our placement coordinators report that companies are impressed with the verified portfolios."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mr-3">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Dr. Sunita Reddy</p>
                  <p className="text-xs text-muted-foreground">Head of Placements, JKL University</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Institution?</h2>
          <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
            Join leading Higher Education Institutions in implementing comprehensive student achievement tracking and NAAC compliance automation. Start your digital transformation journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              variant="secondary"
              className="text-primary bg-white hover:bg-gray-100 px-12 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              data-testid="button-access-platform"
            >
              Launch Platform Now
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = 'mailto:contact@smartstudenthub.com?subject=Schedule Institution Demo Request&body=Hello,%0A%0AI am interested in scheduling a demo of the Smart Student Hub platform for my institution.%0A%0APlease contact me to arrange a suitable time.%0A%0AThank you!'}
              className="border-2 border-white text-white hover:bg-white hover:text-primary px-12 py-4 text-lg font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              data-testid="button-schedule-demo-footer"
            >
              Schedule Institution Demo
            </Button>
          </div>
          
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-semibold mb-2">Immediate Support</h3>
              <p className="text-sm opacity-90">24/7 technical assistance for institutions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-semibold mb-2">Custom Implementation</h3>
              <p className="text-sm opacity-90">Tailored solutions for your specific needs</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-semibold mb-2">Proven Success</h3>
              <p className="text-sm opacity-90">Trusted by 100+ institutions across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-white">Smart Student Hub</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Empowering Higher Education Institutions with comprehensive student achievement tracking and compliance automation. Built for the future of institutional excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Platform Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Activity Tracking & Verification</li>
                <li>Digital Portfolio Generation</li>
                <li>NAAC/NIRF Compliance</li>
                <li>Advanced Analytics</li>
                <li>Faculty Workflow Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">For Institutions</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Accreditation Support</li>
                <li>Data-Driven Insights</li>
                <li>Process Automation</li>
                <li>System Integration</li>
                <li>Compliance Reporting</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support & Resources</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Implementation Guide</li>
                <li>Training Materials</li>
                <li>Technical Documentation</li>
                <li>Best Practices</li>
                <li>Community Forum</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm leading-relaxed">
              © 2024 Smart Student Hub. Advancing academic excellence through institutional digital transformation. Designed for Higher Education Institutions pursuing NAAC accreditation and NIRF ranking improvements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
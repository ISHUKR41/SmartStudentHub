import { GraduationCap, Shield, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
                <p className="text-xs text-muted-foreground">Student Activity Management Platform</p>
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
            Centralized Digital Platform for Student Activity Records
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A comprehensive solution for recording, verifying, and tracking student achievements 
            from Day 1 of admission to graduation.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="btn-primary"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Smart Student Hub?</h2>
            <p className="text-lg text-muted-foreground">
              Transform your institution's student activity management with our comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Verified Records</h3>
                <p className="text-sm text-muted-foreground">
                  Faculty-verified achievements ensure credibility and authenticity of student records
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Different interfaces for students, faculty, and administrators with appropriate permissions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Analytics & Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive analytics for NAAC, AICTE, and NIRF compliance reporting
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Digital Portfolio</h3>
                <p className="text-sm text-muted-foreground">
                  Auto-generated portfolios for placements, internships, and scholarship applications
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Students</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Centralized activity tracking</li>
                <li>• Verified digital portfolio</li>
                <li>• Real-time progress monitoring</li>
                <li>• Easy certificate management</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Faculty</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Streamlined approval process</li>
                <li>• Reduced paperwork</li>
                <li>• Student progress insights</li>
                <li>• Efficient verification workflow</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Institutions</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• NAAC/NIRF compliance</li>
                <li>• Data-driven decision making</li>
                <li>• Improved transparency</li>
                <li>• Better institutional rankings</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Smart Student Hub. Empowering educational institutions with digital transformation.
          </p>
        </div>
      </footer>
    </div>
  );
}

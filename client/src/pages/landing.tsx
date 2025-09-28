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
            Comprehensive Academic Excellence Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            An institutional-grade platform for comprehensive documentation, verification, and analysis 
            of student achievements throughout their academic journey.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="btn-primary"
              data-testid="button-get-started"
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Institutional Benefits</h2>
            <p className="text-lg text-muted-foreground">
              Enhance institutional excellence through comprehensive student achievement tracking and analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Verified Academic Records</h3>
                <p className="text-sm text-muted-foreground">
                  Faculty-authenticated documentation ensures institutional compliance and academic integrity standards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Institutional Access Control</h3>
                <p className="text-sm text-muted-foreground">
                  Hierarchical access management designed for academic institutional governance and security protocols
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-info" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Institutional Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced reporting and analytics for accreditation, assessment, and institutional excellence initiatives
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-6 h-6 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Professional Portfolios</h3>
                <p className="text-sm text-muted-foreground">
                  Institutional-grade digital portfolios for career services and external stakeholder engagement
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
                <li>• Comprehensive activity documentation</li>
                <li>• Institution-verified digital portfolios</li>
                <li>• Real-time academic progress tracking</li>
                <li>• Professional certificate management</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Faculty</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Streamlined academic approval processes</li>
                <li>• Digital workflow management</li>
                <li>• Comprehensive student analytics</li>
                <li>• Efficient verification protocols</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Institutions</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li>• Comprehensive accreditation compliance</li>
                <li>• Evidence-based institutional planning</li>
                <li>• Enhanced academic transparency</li>
                <li>• Strategic excellence optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Smart Student Hub. Advancing academic excellence through institutional digital transformation.
          </p>
        </div>
      </footer>
    </div>
  );
}

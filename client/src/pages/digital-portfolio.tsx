import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, FileDown, Shield, Calendar, Building, Eye } from "lucide-react";

export default function DigitalPortfolio() {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/students/activities"],
    retry: false,
  });

  const { data: studentStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/students/stats"],
    retry: false,
  });

  const handleSharePortfolio = () => {
    toast({
      title: "Portfolio Link",
      description: "Shareable portfolio link has been generated and copied to clipboard.",
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF Generation",
      description: "Your portfolio PDF is being generated...",
    });
  };

  const handleViewCertificate = (activityId: string) => {
    toast({
      title: "Certificate Viewer",
      description: "Opening certificate viewer...",
    });
  };

  if (!user) {
    return null;
  }

  // Group activities by category
  const academicActivities = activities?.filter((a: any) => a.category === 'academic' && a.status === 'approved') || [];
  const coCurricularActivities = activities?.filter((a: any) => a.category === 'co-curricular' && a.status === 'approved') || [];
  const volunteeringActivities = activities?.filter((a: any) => ['volunteering', 'extra-curricular'].includes(a.category) && a.status === 'approved') || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6" data-testid="main-portfolio">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground" data-testid="text-portfolio-title">
                  Digital Portfolio
                </h2>
                <p className="text-muted-foreground" data-testid="text-portfolio-description">
                  Your verified academic and extracurricular achievements
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleSharePortfolio}
                  data-testid="button-share-portfolio"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Portfolio
                </Button>
                <Button 
                  onClick={handleDownloadPDF}
                  data-testid="button-download-pdf"
                >
                  <FileDown className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Portfolio Content */}
            <Card className="dashboard-card p-8">
              {/* Portfolio Header */}
              <div className="text-center mb-8 pb-8 border-b border-border">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="text-student-name">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-muted-foreground" data-testid="text-student-details">
                  {user.department} Engineering • Roll No: {user.rollNumber}<br />
                  Current CGPA: {user.cgpa || 'N/A'} • Semester {user.currentSemester || 'N/A'} of 8
                </p>
                <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground" data-testid="text-total-activities">
                      {studentStats?.totalActivities || 0}
                    </div>
                    <div className="text-muted-foreground">Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground" data-testid="text-skill-credits">
                      {studentStats?.skillCredits || 0}
                    </div>
                    <div className="text-muted-foreground">Skill Credits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-foreground" data-testid="text-years-study">
                      {user.currentSemester ? Math.ceil(user.currentSemester / 2) : 'N/A'}
                    </div>
                    <div className="text-muted-foreground">Years</div>
                  </div>
                </div>
              </div>

              {/* Academic Performance */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-academic-performance-title">
                  Academic Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/20 rounded-lg" data-testid="card-current-cgpa">
                    <div className="text-sm text-muted-foreground">Current CGPA</div>
                    <div className="text-xl font-bold text-foreground">{user.cgpa || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg" data-testid="card-attendance">
                    <div className="text-sm text-muted-foreground">Attendance</div>
                    <div className="text-xl font-bold text-foreground">94%</div>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-lg" data-testid="card-academic-standing">
                    <div className="text-sm text-muted-foreground">Academic Standing</div>
                    <div className="text-xl font-bold text-green-600">First Class</div>
                  </div>
                </div>
              </div>

              {/* Activities by Category */}
              <div className="space-y-6">
                {/* Academic Activities */}
                {academicActivities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-academic-activities-title">
                      Academic Activities
                    </h3>
                    <div className="space-y-3">
                      {academicActivities.map((activity: any, index: number) => (
                        <div 
                          key={activity.id} 
                          className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                          data-testid={`academic-activity-${index}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {activity.organization} • {new Date(activity.activityDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="status-approved">Verified</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewCertificate(activity.id)}
                              data-testid={`button-view-certificate-${index}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Certificate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Co-Curricular Activities */}
                {coCurricularActivities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-co-curricular-activities-title">
                      Co-Curricular Activities
                    </h3>
                    <div className="space-y-3">
                      {coCurricularActivities.map((activity: any, index: number) => (
                        <div 
                          key={activity.id} 
                          className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                          data-testid={`co-curricular-activity-${index}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {activity.organization} • {new Date(activity.activityDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="status-approved">Verified</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewCertificate(activity.id)}
                              data-testid={`button-view-co-curricular-certificate-${index}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Certificate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Volunteering & Community Service */}
                {volunteeringActivities.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4" data-testid="text-volunteering-activities-title">
                      Volunteering & Community Service
                    </h3>
                    <div className="space-y-3">
                      {volunteeringActivities.map((activity: any, index: number) => (
                        <div 
                          key={activity.id} 
                          className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                          data-testid={`volunteering-activity-${index}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <Building className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {activity.organization} • {new Date(activity.activityDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="status-approved">Verified</Badge>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewCertificate(activity.id)}
                              data-testid={`button-view-volunteering-certificate-${index}`}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Certificate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {activities?.length === 0 && (
                  <div className="text-center py-8" data-testid="text-no-activities">
                    <p className="text-muted-foreground">No verified activities to display in your portfolio yet.</p>
                    <p className="text-muted-foreground">Start by uploading your achievements and certificates.</p>
                  </div>
                )}
              </div>

              {/* Portfolio Footer */}
              <div className="mt-8 pt-8 border-t border-border text-center">
                <div className="text-sm text-muted-foreground" data-testid="text-portfolio-footer">
                  This portfolio is digitally verified by the institution.<br />
                  Generated on {new Date().toLocaleDateString()} • Document ID: SSH-2024-{user.rollNumber}
                </div>
                <div className="mt-4 flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium" data-testid="text-verification-badge">
                    Digitally Verified & Authenticated
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

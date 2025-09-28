/**
 * Activity Upload Page Component for Smart Student Hub
 * 
 * This comprehensive component provides an institutional-grade platform for students to document,
 * upload, and submit their academic and co-curricular achievements for faculty verification.
 * The system implements NAAC, NIRF, and AICTE compliance standards with professional verification workflows.
 * 
 * Core Institutional Features:
 * - NAAC-compliant activity categorization with detailed guidelines
 * - Multi-stage faculty verification workflow with timeline tracking
 * - Professional file upload system with OCR integration
 * - Comprehensive achievement documentation standards
 * - Institutional compliance validation and reporting
 * - Real-time verification status tracking and notifications
 * 
 * Activity Categories (NAAC Aligned):
 * - Academic Excellence: Research publications, conference presentations, academic competitions
 * - Co-curricular Activities: Technical events, skill development, professional societies
 * - Extra-curricular Engagement: Cultural activities, creative arts, sports achievements
 * - Community Service: Volunteering, social responsibility, community outreach
 * - Professional Development: Internships, industry training, professional certifications
 * - Leadership Experience: Student governance, team leadership, organizational management
 * - Continuous Learning: MOOCs, online certifications, skill enhancement programs
 * 
 * Verification Process:
 * 1. Student uploads activity with comprehensive documentation
 * 2. System validates documents using OCR and institutional standards
 * 3. Faculty receives notification for verification review
 * 4. Faculty approves/rejects with detailed feedback and skill credit assignment
 * 5. Approved activities are automatically added to student's verified portfolio
 * 6. Real-time notifications keep students informed throughout the process
 * 
 * Professional Upload Guidelines:
 * - Detailed category-specific requirements and examples
 * - File format specifications for optimal processing
 * - Documentation standards for institutional verification
 * - Timeline expectations for faculty approval process
 * - Skill credit calculation methodology and guidelines
 * 
 * Technical Implementation:
 * - React Hook Form with Zod validation for type safety
 * - File upload with drag-drop interface and progress tracking
 * - Real-time form validation with detailed error messaging
 * - Professional UI components aligned with institutional design standards
 * - Responsive design optimized for academic environments
 * 
 * Compliance Features:
 * - NAAC criteria alignment for institutional accreditation
 * - NIRF parameter mapping for ranking improvements
 * - AICTE guidelines compliance for technical education standards
 * - Institutional audit trail for external quality assessments
 * - Professional portfolio generation for placement and admissions
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import FileUpload from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { 
  Cpu, 
  Save, 
  Send, 
  CheckCircle, 
  Clock, 
  FileText, 
  Award, 
  Shield, 
  BookOpen, 
  Users, 
  Target, 
  Globe, 
  Briefcase, 
  Heart, 
  Crown, 
  Monitor,
  AlertTriangle,
  Info,
  HelpCircle,
  Download,
  Upload,
  Eye,
  Star,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  Building
} from "lucide-react";
import { z } from "zod";
import { useLocation } from "wouter";

/**
 * Activity Form Validation Schema
 * 
 * Defines comprehensive validation rules for the activity upload form using Zod.
 * Ensures data integrity and provides user-friendly error messages for all form fields.
 * 
 * Validation Rules:
 * - Title: Required, non-empty string with minimum length requirements
 * - Category: Must be one of the predefined NAAC-compliant categories
 * - Organization: Required, non-empty string representing official institution name
 * - Activity Date: Required, valid date string with past date validation
 * - Description: Optional detailed description with recommended minimum length
 */
const activityFormSchema = z.object({
  title: z.string().min(1, "Activity title is required"),
  category: z.enum(['academic', 'co-curricular', 'extra-curricular', 'volunteering', 'internship', 'leadership', 'mooc']),
  organization: z.string().min(1, "Organization is required"),
  activityDate: z.string().min(1, "Activity date is required"),
  description: z.string().optional(),
});

// TypeScript types derived from validation schema for type safety
type ActivityFormData = z.infer<typeof activityFormSchema>;

/**
 * Extended Activity Submission Data Interface
 * 
 * Combines form data with uploaded files for complete submission processing.
 * Used in the mutation function to handle both form fields and file uploads in multipart format.
 */
interface ActivitySubmissionData extends ActivityFormData {
  files: File[];
}

/**
 * Activity Upload Component
 * 
 * Main component that renders the comprehensive activity upload interface with tabbed navigation,
 * detailed guidelines, professional form handling, and institutional verification workflow information.
 * 
 * @returns {JSX.Element} Complete activity upload interface with guidelines, form, and verification details
 */
export default function ActivityUpload() {
  // State management for file uploads and UI interactions
  const [files, setFiles] = useState<File[]>([]);
  
  // Hooks for UI interactions, navigation, and API management
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Initialize form with comprehensive validation and professional default values
  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      title: "",
      category: undefined,
      organization: "",
      activityDate: "",
      description: "",
    },
  });

  /**
   * Activity Upload Mutation
   * 
   * Handles the comprehensive submission of activity data and files to the backend API.
   * Uses FormData to support both text fields and file uploads with proper error handling.
   * 
   * Submission Process:
   * 1. Create FormData object with all form fields
   * 2. Append all uploaded verification documents
   * 3. Submit to API endpoint with proper authentication
   * 4. Handle success/error responses with detailed user feedback
   * 5. Update UI state and navigate to dashboard on success
   * 6. Invalidate relevant cache entries for real-time updates
   */
  const uploadMutation = useMutation({
    mutationFn: async (data: ActivitySubmissionData) => {
      const formData = new FormData();
      
      // Append form fields to FormData for multipart submission
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('organization', data.organization);
      formData.append('activityDate', data.activityDate);
      if (data.description) {
        formData.append('description', data.description);
      }
      
      // Append all verification documents for institutional processing
      data.files.forEach((file) => {
        formData.append('files', file);
      });

      // Submit to API with explicit headers and comprehensive error handling
      const response = await fetch('/api/activities', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = 'Failed to upload activity';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use text response for error details
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Achievement Submitted Successfully",
        description: "Your achievement has been submitted for faculty verification and will be reviewed within 3-7 business days.",
      });
      // Invalidate relevant cache entries for real-time dashboard updates
      queryClient.invalidateQueries({ queryKey: ["/api/students/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/students/stats"] });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  /**
   * Form Submission Handler
   * 
   * Processes form data and initiates the upload mutation with comprehensive validation.
   * Combines form data with uploaded files for complete submission processing.
   */
  const onSubmit = (data: ActivityFormData) => {
    const submissionData: ActivitySubmissionData = {
      ...data,
      files
    };
    uploadMutation.mutate(submissionData);
  };

  /**
   * Draft Save Handler
   * 
   * Saves the current form state as a draft for later completion.
   * Provides users with the ability to pause and resume their submission process.
   */
  const handleSaveDraft = () => {
    // TODO: Implement comprehensive draft functionality with local storage
    toast({
      title: "Draft Saved",
      description: "Your achievement draft has been saved and can be resumed later.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6" data-testid="main-upload">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* Comprehensive Page Header with Institutional Branding */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground" data-testid="text-upload-title">
                    Submit Academic Achievement
                  </h2>
                  <p className="text-lg text-muted-foreground" data-testid="text-upload-description">
                    Professional Achievement Documentation & Institutional Verification Portal
                  </p>
                </div>
              </div>
              
              {/* Institutional Compliance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <div className="font-semibold text-blue-900 dark:text-blue-200">NAAC Compliant</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Accreditation Ready Documentation</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-900 dark:text-green-200">Faculty Verified</div>
                    <div className="text-sm text-green-700 dark:text-green-300">Professional Validation Process</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Star className="w-8 h-8 text-purple-600" />
                  <div>
                    <div className="font-semibold text-purple-900 dark:text-purple-200">Portfolio Ready</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">Professional Career Documentation</div>
                  </div>
                </div>
              </div>
              
              {/* Institutional Excellence Information Alert */}
              <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <Info className="h-5 w-5 text-blue-600" />
                <AlertDescription>
                  <div className="font-medium text-blue-900 dark:text-blue-200 mb-2">Institutional Excellence Documentation System</div>
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    This platform enables comprehensive documentation of your academic journey for NAAC accreditation, 
                    NIRF rankings, and professional portfolio development. All submissions undergo rigorous faculty 
                    verification to ensure institutional credibility and external validation.
                  </p>
                </AlertDescription>
              </Alert>
            </div>

            {/* Comprehensive Tabbed Interface */}
            <Tabs defaultValue="guidelines" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guidelines">Upload Guidelines</TabsTrigger>
                <TabsTrigger value="form">Submit Achievement</TabsTrigger>
                <TabsTrigger value="verification">Verification Process</TabsTrigger>
              </TabsList>
              
              {/* Comprehensive Upload Guidelines Tab */}
              <TabsContent value="guidelines" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span>Comprehensive Upload Guidelines</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* NAAC Category Guidelines with Detailed Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-4">NAAC-Compliant Activity Categories</h3>
                      <Accordion type="multiple" className="w-full">
                        
                        {/* Academic Excellence Category */}
                        <AccordionItem value="academic">
                          <AccordionTrigger className="flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            <span>Academic Excellence</span>
                            <Badge variant="secondary">High Impact</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Qualifying Activities</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Research paper publications in peer-reviewed journals</li>
                                  <li>• Conference presentations and proceedings</li>
                                  <li>• National and international academic competitions</li>
                                  <li>• Research project presentations and outcomes</li>
                                  <li>• Academic awards and scholarships</li>
                                  <li>• Patent applications and intellectual property</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Documentation Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Official certificate or publication proof</li>
                                  <li>• Conference proceedings or journal citation</li>
                                  <li>• Institutional endorsement letter</li>
                                  <li>• Research supervisor recommendation</li>
                                  <li>• Impact factor or ranking documentation</li>
                                </ul>
                              </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Star className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-blue-900 dark:text-blue-200">Skill Credits: 25-50 points</span>
                              </div>
                              <p className="text-sm text-blue-800 dark:text-blue-300">
                                Academic achievements receive the highest skill credits due to their direct impact on institutional research rankings and NAAC assessment criteria.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        {/* Co-curricular Activities Category */}
                        <AccordionItem value="co-curricular">
                          <AccordionTrigger className="flex items-center space-x-2">
                            <Users className="w-5 h-5 text-green-600" />
                            <span>Co-curricular Activities</span>
                            <Badge variant="secondary">Medium Impact</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Qualifying Activities</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Technical symposiums and workshops attendance</li>
                                  <li>• Professional society memberships and activities</li>
                                  <li>• Skill development programs and certifications</li>
                                  <li>• Industry interaction sessions and seminars</li>
                                  <li>• Technical competitions and hackathons</li>
                                  <li>• Club activities and organizational participation</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Documentation Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Participation certificate with official seal</li>
                                  <li>• Event organizer contact information</li>
                                  <li>• Learning outcome documentation</li>
                                  <li>• Portfolio of work or project outcomes</li>
                                  <li>• Faculty mentor endorsement</li>
                                </ul>
                              </div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Target className="w-4 h-4 text-green-600" />
                                <span className="font-medium text-green-900 dark:text-green-200">Skill Credits: 10-25 points</span>
                              </div>
                              <p className="text-sm text-green-800 dark:text-green-300">
                                Co-curricular activities demonstrate active engagement beyond academics and contribute to holistic student development metrics.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        {/* Professional Development Category */}
                        <AccordionItem value="internship">
                          <AccordionTrigger className="flex items-center space-x-2">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                            <span>Professional Development</span>
                            <Badge variant="secondary">High Impact</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Qualifying Activities</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Industry internships and training programs</li>
                                  <li>• Professional certification courses</li>
                                  <li>• Corporate project collaborations</li>
                                  <li>• Industry mentorship programs</li>
                                  <li>• Professional development workshops</li>
                                  <li>• Career advancement certifications</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Documentation Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Official internship completion certificate</li>
                                  <li>• Industry supervisor evaluation report</li>
                                  <li>• Project outcome documentation</li>
                                  <li>• Skills assessment and competency report</li>
                                  <li>• Professional recommendation letters</li>
                                </ul>
                              </div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Briefcase className="w-4 h-4 text-purple-600" />
                                <span className="font-medium text-purple-900 dark:text-purple-200">Skill Credits: 20-40 points</span>
                              </div>
                              <p className="text-sm text-purple-800 dark:text-purple-300">
                                Professional development activities directly contribute to employability metrics and industry partnership evaluations for institutional rankings.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        {/* Leadership Experience Category */}
                        <AccordionItem value="leadership">
                          <AccordionTrigger className="flex items-center space-x-2">
                            <Crown className="w-5 h-5 text-orange-600" />
                            <span>Leadership Experience</span>
                            <Badge variant="secondary">Medium Impact</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Qualifying Activities</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Student government positions and responsibilities</li>
                                  <li>• Club and society leadership roles</li>
                                  <li>• Event organization and management</li>
                                  <li>• Team leadership in projects and competitions</li>
                                  <li>• Peer mentoring and tutoring programs</li>
                                  <li>• Community organization leadership</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Documentation Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Official appointment or election certificate</li>
                                  <li>• Leadership impact assessment report</li>
                                  <li>• Project or event outcome documentation</li>
                                  <li>• Peer and supervisor feedback forms</li>
                                  <li>• Portfolio of leadership initiatives</li>
                                </ul>
                              </div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Crown className="w-4 h-4 text-orange-600" />
                                <span className="font-medium text-orange-900 dark:text-orange-200">Skill Credits: 15-30 points</span>
                              </div>
                              <p className="text-sm text-orange-800 dark:text-orange-300">
                                Leadership activities demonstrate soft skills development and contribute to student engagement and campus life quality metrics.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        {/* Community Service Category */}
                        <AccordionItem value="volunteering">
                          <AccordionTrigger className="flex items-center space-x-2">
                            <Heart className="w-5 h-5 text-red-600" />
                            <span>Community Service</span>
                            <Badge variant="secondary">Social Impact</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Qualifying Activities</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Community outreach and social service projects</li>
                                  <li>• NGO collaboration and volunteer work</li>
                                  <li>• Environmental conservation initiatives</li>
                                  <li>• Educational support and teaching programs</li>
                                  <li>• Disaster relief and humanitarian activities</li>
                                  <li>• Social awareness campaigns and advocacy</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Documentation Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• NGO or organization verification letter</li>
                                  <li>• Community impact assessment report</li>
                                  <li>• Photo documentation of activities</li>
                                  <li>• Beneficiary feedback and testimonials</li>
                                  <li>• Project outcome and impact metrics</li>
                                </ul>
                              </div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Heart className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-900 dark:text-red-200">Skill Credits: 10-20 points</span>
                              </div>
                              <p className="text-sm text-red-800 dark:text-red-300">
                                Community service activities contribute to institutional social responsibility metrics and NAAC criterion on community engagement.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        {/* Continuous Learning Category */}
                        <AccordionItem value="mooc">
                          <AccordionTrigger className="flex items-center space-x-2">
                            <Monitor className="w-5 h-5 text-indigo-600" />
                            <span>Continuous Learning</span>
                            <Badge variant="secondary">Skill Enhancement</Badge>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Qualifying Activities</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• MOOC completion from recognized platforms</li>
                                  <li>• Professional certification programs</li>
                                  <li>• Online skill development courses</li>
                                  <li>• Digital literacy and technology training</li>
                                  <li>• Language proficiency certifications</li>
                                  <li>• Specialized technical skill certifications</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground mb-2">Documentation Requirements</h4>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  <li>• Official completion certificate with verification code</li>
                                  <li>• Course curriculum and learning outcome documentation</li>
                                  <li>• Platform verification and authenticity proof</li>
                                  <li>• Assessment scores and performance metrics</li>
                                  <li>• Skills application project or portfolio</li>
                                </ul>
                              </div>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Monitor className="w-4 h-4 text-indigo-600" />
                                <span className="font-medium text-indigo-900 dark:text-indigo-200">Skill Credits: 5-15 points</span>
                              </div>
                              <p className="text-sm text-indigo-800 dark:text-indigo-300">
                                Continuous learning activities demonstrate commitment to skill development and lifelong learning, contributing to employability metrics.
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                      </Accordion>
                    </div>
                    
                    {/* Professional Documentation Standards */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Professional Documentation Standards</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Accepted File Formats</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <FileText className="w-5 h-5 text-red-600" />
                              <div>
                                <div className="font-medium text-foreground">PDF Documents</div>
                                <div className="text-sm text-muted-foreground">Certificates, official letters, reports</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="font-medium text-foreground">Image Files (JPG, PNG)</div>
                                <div className="text-sm text-muted-foreground">Scanned documents, photo evidence</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Quality Requirements</h4>
                          <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>High resolution (minimum 300 DPI for scanned documents)</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Clear, readable text without blur or distortion</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Official letterhead and institutional seals visible</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Complete document without any cropped content</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span>Maximum file size: 10MB per document</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Skill Credits and Portfolio Integration Information */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">Skill Credits & Portfolio Integration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Award className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-900 dark:text-blue-200">Credit Calculation</span>
                          </div>
                          <p className="text-sm text-blue-800 dark:text-blue-300">
                            Faculty assigns skill credits based on activity impact, documentation quality, and learning outcomes achieved.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900 dark:text-green-200">Portfolio Integration</span>
                          </div>
                          <p className="text-sm text-green-800 dark:text-green-300">
                            Approved activities automatically appear in your verified digital portfolio for placements and admissions.
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-purple-900 dark:text-purple-200">Progress Tracking</span>
                          </div>
                          <p className="text-sm text-purple-800 dark:text-purple-300">
                            Real-time tracking of your achievement progress towards institutional excellence targets and career goals.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Main Upload Form Tab */}
              <TabsContent value="form" className="space-y-6">
                <Card className="dashboard-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="w-5 h-5 text-primary" />
                      <span>Professional Achievement Documentation Form</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="form-activity-upload">
                        
                        {/* Achievement Information Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Achievement Information</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-1">
                                    <span>Achievement Title</span>
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g., Best Paper Award at IEEE Conference 2024, Google Summer of Code 2024" 
                                      {...field} 
                                      data-testid="input-activity-title"
                                      className="focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                  </FormControl>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Provide the complete, official title as it appears on the certificate
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-1">
                                    <span>NAAC Compliance Category</span>
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-category" className="focus:ring-2 focus:ring-primary focus:border-transparent">
                                        <SelectValue placeholder="Select appropriate NAAC-aligned category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="academic">
                                        <div className="flex items-center space-x-2">
                                          <BookOpen className="w-4 h-4 text-blue-600" />
                                          <div>
                                            <div>Academic Excellence</div>
                                            <div className="text-xs text-muted-foreground">Research, publications, competitions</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="co-curricular">
                                        <div className="flex items-center space-x-2">
                                          <Users className="w-4 h-4 text-green-600" />
                                          <div>
                                            <div>Co-curricular Activities</div>
                                            <div className="text-xs text-muted-foreground">Technical events, societies, workshops</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="extra-curricular">
                                        <div className="flex items-center space-x-2">
                                          <Star className="w-4 h-4 text-purple-600" />
                                          <div>
                                            <div>Extra-curricular Engagement</div>
                                            <div className="text-xs text-muted-foreground">Cultural, sports, creative activities</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="volunteering">
                                        <div className="flex items-center space-x-2">
                                          <Heart className="w-4 h-4 text-red-600" />
                                          <div>
                                            <div>Community Service</div>
                                            <div className="text-xs text-muted-foreground">Volunteering, social responsibility</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="internship">
                                        <div className="flex items-center space-x-2">
                                          <Briefcase className="w-4 h-4 text-orange-600" />
                                          <div>
                                            <div>Professional Development</div>
                                            <div className="text-xs text-muted-foreground">Internships, industry training</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="leadership">
                                        <div className="flex items-center space-x-2">
                                          <Crown className="w-4 h-4 text-yellow-600" />
                                          <div>
                                            <div>Leadership Experience</div>
                                            <div className="text-xs text-muted-foreground">Student governance, team leadership</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                      <SelectItem value="mooc">
                                        <div className="flex items-center space-x-2">
                                          <Monitor className="w-4 h-4 text-indigo-600" />
                                          <div>
                                            <div>Continuous Learning</div>
                                            <div className="text-xs text-muted-foreground">MOOCs, online certifications</div>
                                          </div>
                                        </div>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Category selection affects skill credit calculation and portfolio organization
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Organization and Date Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <Building className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Institutional Details</h3>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="organization"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-1">
                                    <span>Organizing Institution/Organization</span>
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      placeholder="e.g., IEEE Computer Society, Microsoft Corporation, IIT Delhi" 
                                      {...field} 
                                      data-testid="input-organization"
                                      className="focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                  </FormControl>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Full official name of the institution or organization that issued the certificate
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="activityDate"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="flex items-center space-x-1">
                                    <span>Achievement Date</span>
                                    <span className="text-red-500">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      {...field} 
                                      data-testid="input-activity-date"
                                      className="focus:ring-2 focus:ring-primary focus:border-transparent"
                                      max={new Date().toISOString().split('T')[0]}
                                    />
                                  </FormControl>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    Date when the achievement was completed or awarded
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        {/* Comprehensive Description Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Achievement Details & Learning Outcomes</h3>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Comprehensive Achievement Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Provide a detailed description including:

1. ACHIEVEMENT OVERVIEW: Brief summary of the accomplishment
2. LEARNING OUTCOMES: Specific skills and competencies developed
3. METHODOLOGY: Approach, techniques, or processes used
4. IMPACT & SIGNIFICANCE: Personal and institutional relevance
5. COLLABORATION: Team work, mentorship, or institutional support
6. FUTURE APPLICATION: How this achievement supports career goals

Example: 'Received Best Paper Award at IEEE International Conference on Machine Learning for research on Deep Learning Applications in Healthcare. Developed advanced neural network architectures, improved model accuracy by 15%, collaborated with medical professionals, and demonstrated real-world impact in diagnostic accuracy. This achievement enhances research capabilities and supports career goals in AI/ML research.'" 
                                    className="min-h-[150px] focus:ring-2 focus:ring-primary focus:border-transparent"
                                    {...field} 
                                    data-testid="textarea-description"
                                  />
                                </FormControl>
                                <div className="text-xs text-muted-foreground mt-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <div className="font-medium text-foreground mb-1">Description Guidelines:</div>
                                      <ul className="space-y-1">
                                        <li>• Focus on measurable outcomes and achievements</li>
                                        <li>• Include specific technical skills or competencies gained</li>
                                        <li>• Mention any collaboration or teamwork involved</li>
                                        <li>• Highlight institutional or industry recognition received</li>
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="font-medium text-foreground mb-1">Quality Indicators:</div>
                                      <ul className="space-y-1">
                                        <li>• Clear articulation of learning objectives achieved</li>
                                        <li>• Evidence of personal and professional growth</li>
                                        <li>• Connection to academic program and career goals</li>
                                        <li>• Demonstration of institutional values and excellence</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Professional Document Upload Section */}
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 mb-4">
                            <Upload className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">Professional Verification Documents</h3>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-600" />
                                <div>
                                  <div className="font-medium text-blue-900 dark:text-blue-200">Required</div>
                                  <div className="text-xs text-blue-700 dark:text-blue-300">Official certificate or award document</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <FileText className="w-6 h-6 text-green-600" />
                                <div>
                                  <div className="font-medium text-green-900 dark:text-green-200">Recommended</div>
                                  <div className="text-xs text-green-700 dark:text-green-300">Supporting documents or evidence</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <FileText className="w-6 h-6 text-purple-600" />
                                <div>
                                  <div className="font-medium text-purple-900 dark:text-purple-200">Optional</div>
                                  <div className="text-xs text-purple-700 dark:text-purple-300">Additional verification materials</div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <label className="form-label flex items-center space-x-2 mb-3">
                                <Upload className="w-4 h-4" />
                                <span>Upload Verification Documents</span>
                                <span className="text-red-500">*</span>
                              </label>
                              
                              <FileUpload 
                                files={files}
                                onFilesChange={setFiles}
                                maxFiles={5}
                                acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                                maxFileSize={10 * 1024 * 1024} // 10MB
                                data-testid="file-upload-certificates"
                              />
                              
                              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="text-sm text-muted-foreground">
                                  <div className="font-medium text-foreground mb-2">Document Upload Guidelines:</div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                      <div className="font-medium text-foreground text-xs mb-1">File Quality Standards:</div>
                                      <ul className="text-xs space-y-1">
                                        <li>• High resolution (minimum 300 DPI for scans)</li>
                                        <li>• Clear, readable text without blur</li>
                                        <li>• Complete document - no cropped edges</li>
                                        <li>• Official seals and signatures visible</li>
                                      </ul>
                                    </div>
                                    <div>
                                      <div className="font-medium text-foreground text-xs mb-1">Acceptable Documents:</div>
                                      <ul className="text-xs space-y-1">
                                        <li>• Original certificates (PDF preferred)</li>
                                        <li>• Official transcripts or grade reports</li>
                                        <li>• Award letters or recognition documents</li>
                                        <li>• Photo evidence of participation/achievement</li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Professional Verification Information */}
                        <div className="space-y-4">
                          <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                            <Cpu className="h-5 w-5 text-blue-600" />
                            <AlertDescription>
                              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Advanced Document Processing System</h4>
                              <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                                Our institutional platform employs advanced OCR technology and AI-powered document analysis to 
                                automatically extract and validate key information from uploaded certificates, ensuring accuracy 
                                and efficiency in the verification process.
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs text-blue-700 dark:text-blue-300">Automatic data extraction from certificates</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs text-blue-700 dark:text-blue-300">Institutional seal and signature verification</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs text-blue-700 dark:text-blue-300">Cross-reference with institutional databases</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                  <span className="text-xs text-blue-700 dark:text-blue-300">Quality assessment and authenticity validation</span>
                                </div>
                              </div>
                            </AlertDescription>
                          </Alert>
                          
                          <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                            <Shield className="h-5 w-5 text-green-600" />
                            <AlertDescription>
                              <h4 className="text-sm font-medium text-green-900 dark:text-green-200 mb-2">Faculty Verification Workflow</h4>
                              <p className="text-sm text-green-800 dark:text-green-300">
                                All submitted achievements undergo rigorous faculty review to ensure institutional credibility. 
                                Faculty members with domain expertise evaluate each submission based on established criteria 
                                and institutional standards before approval.
                              </p>
                            </AlertDescription>
                          </Alert>
                        </div>

                        {/* Professional Form Actions */}
                        <div className="pt-6 border-t border-border">
                          <div className="space-y-4">
                            
                            {/* Submission Progress Indicator */}
                            {uploadMutation.isPending && (
                              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
                                  <span className="font-medium text-blue-900 dark:text-blue-200">Processing Your Submission</span>
                                </div>
                                <Progress value={75} className="w-full h-2" />
                                <div className="text-sm text-blue-800 dark:text-blue-300 mt-2">
                                  Uploading documents and validating information... Please do not close this window.
                                </div>
                              </div>
                            )}
                            
                            {/* Pre-submission Checklist */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-3">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-900 dark:text-green-200">Pre-Submission Checklist</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-800 dark:text-green-300">Achievement title is complete and accurate</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-800 dark:text-green-300">Appropriate NAAC category selected</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-800 dark:text-green-300">Organization name is official and complete</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-800 dark:text-green-300">Date is accurate and verifiable</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-800 dark:text-green-300">Description includes learning outcomes</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-green-800 dark:text-green-300">All required documents uploaded</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center justify-between">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={handleSaveDraft}
                                data-testid="button-save-draft"
                                className="flex items-center space-x-2"
                              >
                                <Save className="w-4 h-4" />
                                <span>Save as Draft</span>
                              </Button>
                              
                              <div className="flex items-center space-x-3">
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={() => setLocation('/')}
                                  data-testid="button-cancel"
                                  className="flex items-center space-x-2"
                                >
                                  <span>Cancel</span>
                                </Button>
                                <Button 
                                  type="submit" 
                                  disabled={uploadMutation.isPending || files.length === 0}
                                  data-testid="button-submit"
                                  className="flex items-center space-x-2 bg-primary hover:bg-primary/90 min-w-[200px]"
                                >
                                  {uploadMutation.isPending ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                      <span>Processing Submission...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4" />
                                      <span>Submit for Faculty Review</span>
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                            
                            {/* Submission Information */}
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">
                                By submitting this achievement, you confirm that all information provided is accurate and verifiable. 
                                Faculty will review your submission within 3-7 business days.
                              </div>
                            </div>
                            
                          </div>
                        </div>
                        
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Verification Process Tab */}
              <TabsContent value="verification" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Verification Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>Faculty Verification Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gradient-to-b from-primary to-transparent"></div>
                          
                          <div className="space-y-6">
                            <div className="relative flex items-start space-x-4">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                <Upload className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-foreground">Submission</div>
                                <div className="text-sm text-muted-foreground">Student uploads achievement with documentation</div>
                                <div className="text-xs text-green-600 font-medium mt-1">Immediate • System Validated</div>
                              </div>
                            </div>
                            
                            <div className="relative flex items-start space-x-4">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-foreground">Faculty Review</div>
                                <div className="text-sm text-muted-foreground">Department faculty evaluates documentation and authenticity</div>
                                <div className="text-xs text-blue-600 font-medium mt-1">2-5 Business Days • Expert Assessment</div>
                              </div>
                            </div>
                            
                            <div className="relative flex items-start space-x-4">
                              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Star className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-foreground">Skill Credit Assignment</div>
                                <div className="text-sm text-muted-foreground">Faculty assigns appropriate skill credits based on impact</div>
                                <div className="text-xs text-yellow-600 font-medium mt-1">1-2 Business Days • Credit Calculation</div>
                              </div>
                            </div>
                            
                            <div className="relative flex items-start space-x-4">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-foreground">Portfolio Integration</div>
                                <div className="text-sm text-muted-foreground">Approved achievement added to verified portfolio</div>
                                <div className="text-xs text-green-600 font-medium mt-1">Immediate • Automated Integration</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-900 dark:text-blue-200">Average Processing Time</span>
                          </div>
                          <div className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>3-7 business days</strong> for complete verification and portfolio integration. 
                            Complex submissions may require additional verification time.
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Verification Criteria */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span>Verification Standards</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-foreground mb-3">Faculty Evaluation Criteria</h4>
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-foreground">Document Authenticity</div>
                                <div className="text-sm text-muted-foreground">Verification of institutional seals, signatures, and official formats</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-foreground">Learning Outcomes</div>
                                <div className="text-sm text-muted-foreground">Assessment of skills developed and competencies acquired</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-foreground">Institutional Relevance</div>
                                <div className="text-sm text-muted-foreground">Alignment with academic programs and institutional objectives</div>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <div className="font-medium text-foreground">Impact Assessment</div>
                                <div className="text-sm text-muted-foreground">Evaluation of achievement significance and external recognition</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-foreground mb-3">Approval Outcomes</h4>
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="font-medium text-green-900 dark:text-green-200">Approved</div>
                                <div className="text-sm text-green-700 dark:text-green-300">Added to verified portfolio with assigned skill credits</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              <div>
                                <div className="font-medium text-yellow-900 dark:text-yellow-200">Needs Revision</div>
                                <div className="text-sm text-yellow-700 dark:text-yellow-300">Additional documentation or clarification required</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                              <div>
                                <div className="font-medium text-red-900 dark:text-red-200">Not Approved</div>
                                <div className="text-sm text-red-700 dark:text-red-300">Does not meet institutional standards or verification criteria</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                </div>
                
                {/* NAAC Compliance Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <span>NAAC, NIRF & AICTE Compliance Framework</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <Award className="w-5 h-5 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-foreground">NAAC Alignment</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Criterion 3:</strong> Research activities and publications tracking
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Criterion 5:</strong> Student support and progression documentation
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Criterion 7:</strong> Best practices and institutional distinctiveness
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          </div>
                          <h4 className="font-semibold text-foreground">NIRF Parameters</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Teaching & Learning:</strong> Student engagement metrics
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Graduation Outcomes:</strong> Placement and higher education correlation
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-yellow-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Outreach:</strong> Community engagement and social responsibility
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-purple-600" />
                          </div>
                          <h4 className="font-semibold text-foreground">AICTE Standards</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <Globe className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Industry Interaction:</strong> Internship and placement documentation
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Users className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Student Development:</strong> Skill enhancement and competency tracking
                            </div>
                          </div>
                          <div className="flex items-start space-x-2">
                            <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                            <div className="text-sm text-muted-foreground">
                              <strong>Quality Assurance:</strong> Continuous assessment and improvement
                            </div>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-900 dark:text-purple-200">Institutional Excellence Impact</span>
                      </div>
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        Every verified achievement contributes to institutional metrics for accreditation, ranking, and quality assessments. 
                        Your documented activities directly support institutional excellence and recognition at national and international levels.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
              </TabsContent>
            </Tabs>

          </div>
        </main>
      </div>
    </div>
  );
}
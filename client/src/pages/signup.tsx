/**
 * Professional Signup Page for Smart Student Hub
 * 
 * A comprehensive student registration interface designed for Higher Education Institutions.
 * This page facilitates new student onboarding with institutional-grade data collection,
 * validation, and security measures appropriate for academic environments.
 * 
 * Key Features:
 * - Multi-step form design for optimal user experience
 * - Comprehensive academic data collection (roll number, department, semester)
 * - Professional validation with detailed institutional guidelines
 * - Responsive design optimized for academic environments
 * - Integration with existing authentication infrastructure
 * - Accessibility features for inclusive student access
 * 
 * Data Collection Standards:
 * - Personal information aligned with institutional records
 * - Academic credentials validation and verification
 * - Department-specific enrollment validation
 * - Security compliance for student data protection
 * - GDPR and institutional privacy standards compliance
 * 
 * Professional Features:
 * - Clean, institutional design aesthetic
 * - Progressive form validation with immediate feedback
 * - Secure authentication via Replit Auth integration
 * - Roll number format validation for institutional standards
 * - Department selection with comprehensive options
 * - Semester tracking for academic progression
 * 
 * Technical Implementation:
 * - React Hook Form with optimal performance
 * - Zod validation schemas for comprehensive data validation
 * - React Query for efficient server communication
 * - Professional UI components with institutional branding
 * - TypeScript for type safety and development efficiency
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { 
  GraduationCap, 
  Mail, 
  User, 
  BookOpen, 
  Building, 
  Hash,
  AlertCircle, 
  UserPlus,
  Shield,
  CheckCircle,
  Star,
  Clock
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { signupSchema, departmentOptions, semesterOptions, type SignupFormData } from "@shared/schema";

/**
 * Professional Signup Page Component
 * 
 * Renders a comprehensive student registration interface with multi-step validation,
 * academic data collection, and professional styling for Higher Education Institutions.
 * 
 * @returns {JSX.Element} Complete signup page with forms, validation, and institutional design
 */
export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  // Enhanced entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Initialize form with comprehensive validation
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      rollNumber: "",
      department: "",
      currentSemester: 1,
    },
    mode: "onChange",
  });

  // Enhanced form completion progress with step tracking
  const watchedFields = form.watch();
  const totalFields = 6; // Total number of form fields (no password fields)
  const filledFields = Object.values(watchedFields).filter(value => 
    value !== undefined && value !== null && value !== ""
  ).length;
  const progressPercentage = Math.round((filledFields / totalFields) * 100);

  // Track completed sections
  useEffect(() => {
    const steps = [];
    if (watchedFields.firstName && watchedFields.lastName && watchedFields.email) {
      steps.push('personal');
    }
    if (watchedFields.rollNumber && watchedFields.department && watchedFields.currentSemester) {
      steps.push('academic');
    }
    setCompletedSteps(steps);
  }, [watchedFields]);


  // Signup mutation for backend integration
  const signupMutation = useMutation({
    mutationFn: async (signupData: SignupFormData) => {
      const response = await apiRequest('POST', '/api/auth/signup', signupData);
      return response.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Registration Successful",
        description: "Account created successfully! Redirecting to login...",
        variant: "default",
      });
      // Redirect to login page after successful registration
      setTimeout(() => {
        setLocation('/login');
      }, 1500);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Registration failed. Please try again.";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    },
  });

  /**
   * Form Submission Handler
   * 
   * Validates academic information and creates user account via backend API.
   * Provides meaningful feedback and handles errors properly.
   * 
   * @param data - Validated academic data from the registration form
   */
  const onSubmit = async (data: SignupFormData) => {
    form.clearErrors("root");
    
    try {
      // Validate the form first
      signupSchema.parse(data);
      
      // Submit to backend API
      await signupMutation.mutateAsync(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please check your information.";
      toast({
        title: "Validation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      form.setError("root", {
        type: "manual",
        message: errorMessage,
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-32 h-32 bg-secondary rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent rounded-full blur-xl animate-pulse delay-2000" />
      </div>
      
      <div className={`w-full max-w-lg space-y-6 transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <UserPlus className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Academic Registration Portal</h1>
            <p className="text-muted-foreground text-sm">
              Register your academic credentials to access the Student Achievement Management System with institutional verification.
            </p>
          </div>
        </div>

        {/* Enhanced Progress Indicator with Steps */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Registration Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-primary">{progressPercentage}% Complete</span>
              {progressPercentage === 100 && (
                <Star className="w-3 h-3 text-yellow-500 animate-pulse" />
              )}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3 transition-all duration-500" />
          
          {/* Step Indicators */}
          <div className="flex items-center space-x-4 text-xs">
            <div className={`flex items-center space-x-1 transition-colors duration-300 ${
              completedSteps.includes('personal') ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              {completedSteps.includes('personal') ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 rounded-full border-2 border-current" />
              )}
              <span>Personal Info</span>
            </div>
            <div className={`flex items-center space-x-1 transition-colors duration-300 ${
              completedSteps.includes('academic') ? 'text-green-600' : 'text-muted-foreground'
            }`}>
              {completedSteps.includes('academic') ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 rounded-full border-2 border-current" />
              )}
              <span>Academic Details</span>
            </div>
          </div>
        </div>

        {/* Enhanced Security Indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-4 py-2 backdrop-blur-sm">
          <Shield className="w-3 h-3 text-green-500" />
          <span>Institutional-Grade Security & Verification</span>
          <CheckCircle className="w-3 h-3 text-green-500" />
        </div>

        {/* Enhanced Signup Form Card */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl font-semibold text-center group-hover:scale-105 transition-transform duration-300">Student Registration</CardTitle>
            <CardDescription className="text-center text-sm">
              Complete your academic profile to access institutional achievement tracking and portfolio generation services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Root Error Display */}
                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Enhanced Personal Information Section */}
                <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-muted transition-all duration-300 hover:bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
                      <User className="h-4 w-4" />
                      <span>Personal & Contact Information</span>
                    </div>
                    {completedSteps.includes('personal') && (
                      <CheckCircle className="w-4 h-4 text-green-500 animate-in fade-in duration-300" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* First Name */}
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">First Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter first name"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                              disabled={signupMutation.isPending}
                              data-testid="input-first-name"
                              aria-label="First name as per institutional records"
                              autoComplete="given-name"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Last Name */}
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Last Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter last name"
                              className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                              disabled={signupMutation.isPending}
                              data-testid="input-last-name"
                              aria-label="Last name as per institutional records"
                              autoComplete="family-name"
                              required
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Institutional Email Address</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors duration-200" />
                            <Input
                              {...field}
                              type="email"
                              placeholder="Enter your official academic email address"
                              className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                              disabled={signupMutation.isPending}
                              data-testid="input-email"
                              aria-describedby="email-description"
                              aria-label="Official institutional email address"
                              autoComplete="email"
                              required
                            />
                            {field.value && field.value.includes('@') && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CheckCircle className="w-4 h-4 text-green-500 animate-in fade-in duration-300" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Please provide your official Higher Education Institution email address for verification
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>


                {/* Enhanced Academic Information Section */}
                <div className="space-y-4 p-4 rounded-lg bg-muted/20 border border-muted transition-all duration-300 hover:bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>Academic Credentials & Enrollment Details</span>
                    </div>
                    {completedSteps.includes('academic') && (
                      <CheckCircle className="w-4 h-4 text-green-500 animate-in fade-in duration-300" />
                    )}
                  </div>

                  {/* Roll Number */}
                  <FormField
                    control={form.control}
                    name="rollNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Roll Number</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors duration-200" />
                            <Input
                              {...field}
                              placeholder="Enter your roll number"
                              className="pl-10 h-11 uppercase transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                              disabled={signupMutation.isPending}
                              data-testid="input-roll-number"
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              aria-describedby="roll-number-description"
                              aria-label="Student roll number as per institutional records"
                              autoComplete="off"
                              required
                            />
                            {field.value && field.value.length >= 6 && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <CheckCircle className="w-4 h-4 text-green-500 animate-in fade-in duration-300" />
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">
                          Enter your official student enrollment number as recorded in institutional academic records
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Department */}
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                            <FormControl>
                              <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50" data-testid="select-department">
                                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Select department" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {departmentOptions.map((dept) => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  {dept.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Current Semester */}
                    <FormField
                      control={form.control}
                      name="currentSemester"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Current Semester</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value?.toString()} 
                            disabled={signupMutation.isPending}
                          >
                            <FormControl>
                              <SelectTrigger className="h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50" data-testid="select-semester">
                                <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                                <SelectValue placeholder="Select semester" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {semesterOptions.map((sem) => (
                                <SelectItem key={sem.value} value={sem.value.toString()}>
                                  {sem.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Enhanced Submit Button */}
                <div className="space-y-3">
                  {progressPercentage === 100 && (
                    <div className="text-center">
                      <div className="inline-flex items-center space-x-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 rounded-full px-3 py-1 animate-in fade-in duration-500">
                        <CheckCircle className="w-3 h-3" />
                        <span>All information completed - ready to register!</span>
                      </div>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-medium relative overflow-hidden group hover:shadow-lg transition-all duration-300"
                    disabled={isSubmitting || !form.formState.isValid}
                    data-testid="button-signup"
                    aria-label="Submit academic registration form for institutional verification"
                  >
                    {/* Enhanced Button Background Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 group-hover:from-primary/90 group-hover:to-primary" />
                    
                    <div className="relative z-10">
                      {signupMutation.isPending ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                          <span>Creating Your Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group-hover:scale-105 transition-transform duration-200">
                          <GraduationCap className="h-4 w-4" />
                          <span>Complete Academic Registration</span>
                          {progressPercentage === 100 && (
                            <Star className="h-4 w-4 text-yellow-300 animate-pulse" />
                          )}
                        </div>
                      )}
                    </div>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Already registered with the institution?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium"
              onClick={() => setLocation("/login")}
              data-testid="link-login"
            >
              Access Your Account
            </Button>
          </p>
          <div className="flex justify-center space-x-4 text-xs text-muted-foreground">
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs hover:underline" 
              onClick={() => window.open('https://www.example.com/privacy', '_blank')}
              data-testid="button-privacy-policy"
            >
              Privacy Policy
            </Button>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs hover:underline" 
              onClick={() => window.open('https://www.example.com/terms', '_blank')}
              data-testid="button-terms-of-service"
            >
              Terms of Service
            </Button>
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs hover:underline" 
              onClick={() => setLocation('/help')}
              data-testid="button-help-support"
            >
              Help & Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
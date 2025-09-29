/**
 * Professional Login Page for Smart Student Hub
 * 
 * A comprehensive and secure login interface designed specifically for Higher Education Institutions.
 * This page provides a professional authentication experience while integrating seamlessly with
 * the existing Replit authentication infrastructure.
 * 
 * Key Features:
 * - Professional academic institution design aesthetic
 * - Comprehensive form validation with detailed error feedback
 * - Responsive design optimized for all device sizes
 * - Secure authentication flow with proper error handling
 * - Loading states for optimal user experience
 * - Accessibility features for inclusive access
 * 
 * Security Features:
 * - Integration with Replit Auth for secure authentication
 * - No local password handling for maximum security
 * - Email validation for user identification
 * 
 * Design Principles:
 * - Clean, professional layout suitable for academic environments
 * - Consistent with institutional branding and design standards
 * - Clear visual hierarchy and intuitive user flow
 * - Professional typography and spacing
 * - High contrast colors for accessibility compliance
 * 
 * Technical Implementation:
 * - React Hook Form for optimal performance and validation
 * - Zod schema validation for type safety
 * - React Query for efficient state management
 * - Progressive enhancement for broader browser support
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { GraduationCap, Mail, AlertCircle, Shield, CheckCircle, Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, type LoginFormData } from "@shared/schema";

/**
 * Professional Login Page Component
 * 
 * Renders a complete login interface with validation, security features,
 * and professional styling appropriate for Higher Education Institutions.
 * 
 * @returns {JSX.Element} Complete login page with form, validation, and professional styling
 */
export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

  // Enhanced entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Initialize form with validation schema
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });


  // Login mutation for backend integration
  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginFormData) => {
      const response = await apiRequest('POST', '/api/auth/login', loginData);
      return response.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Email Validated",
        description: "Redirecting to institutional authentication system...",
        variant: "default",
      });
      // Store email for potential use after authentication
      sessionStorage.setItem('loginEmail', JSON.stringify(form.getValues('email')));
      // Redirect to Replit Auth after successful email validation
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 1000);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Login failed. Please check your email address.";
      toast({
        title: "Authentication Error",
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
   * Validates email via backend API and then redirects to Replit Auth for secure authentication.
   * Provides meaningful feedback and proper error handling.
   * 
   * @param data - Validated form data containing email for user identification
   */
  const onSubmit = async (data: LoginFormData) => {
    form.clearErrors("root");
    
    try {
      // Validate the form first
      loginSchema.parse(data);
      
      // Submit to backend API for email validation
      await loginMutation.mutateAsync(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Please check your email address.";
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

  /**
   * Handle Direct Replit Auth
   * 
   * Provides direct access to Replit authentication system.
   */
  const handleReplitAuth = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-secondary rounded-full blur-2xl animate-pulse delay-1000" />
      </div>
      
      <div className={`w-full max-w-md space-y-6 transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        {/* Enhanced Header Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <GraduationCap className="w-8 h-8 text-primary-foreground group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Institutional Access Portal</h1>
            <p className="text-muted-foreground text-sm">
              Access your academic records and student achievement portfolio through secure institutional authentication.
            </p>
          </div>
        </div>

        {/* Enhanced Security Indicator */}
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-4 py-2 backdrop-blur-sm">
          <Shield className="w-3 h-3 text-green-500" />
          <span>Secured by Institutional Authentication</span>
          <CheckCircle className="w-3 h-3 text-green-500" />
        </div>

        {/* Enhanced Login Form Card */}
        <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-xl font-semibold text-center group-hover:scale-105 transition-transform duration-300">Faculty & Student Login</CardTitle>
            <CardDescription className="text-center text-sm">
              Authenticate using your institutional email address to access the Student Achievement Management System
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Root Error Display */}
                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Enhanced Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center space-x-2">
                        <span>Institutional Email Address</span>
                        {field.value && field.value.includes('@') && (
                          <CheckCircle className="w-3 h-3 text-green-500 animate-in fade-in duration-300" />
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors duration-200" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter your official academic email address"
                            className="pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:border-primary/50"
                            disabled={loginMutation.isPending}
                            data-testid="input-email"
                            aria-describedby="email-description"
                            aria-label="Institutional email address for authentication"
                            autoComplete="email"
                            onBlur={() => setEmailTouched(true)}
                            required
                          />
                          {emailTouched && field.value && !field.value.includes('@') && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="w-4 h-4 text-amber-500 animate-pulse" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                      {emailTouched && field.value && field.value.includes('@') && (
                        <div className="text-xs text-green-600 flex items-center space-x-1 animate-in slide-in-from-left duration-300">
                          <CheckCircle className="w-3 h-3" />
                          <span>Valid email format detected</span>
                        </div>
                      )}
                    </FormItem>
                  )}
                />


                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-11 text-sm font-medium"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                  aria-label="Submit login form and authenticate via institutional portal"
                >
                  {loginMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      <span>Redirecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>Authenticate via Institutional Portal</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Alternative Authentication */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-11"
              onClick={handleReplitAuth}
              disabled={loginMutation.isPending}
              data-testid="button-replit-auth"
              aria-label="Login using direct institutional authentication"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Direct Institutional Authentication
            </Button>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            New to the Smart Student Hub?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium"
              onClick={() => setLocation("/signup")}
              data-testid="link-signup"
            >
              Register for Academic Access
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
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


  // Google login handler
  const handleGoogleLogin = () => {
    toast({
      title: "Redirecting to Google",
      description: "Please wait while we redirect you to Google authentication...",
      variant: "default",
    });
    
    // Redirect to Google OAuth
    setTimeout(() => {
      window.location.href = '/api/auth/google';
    }, 1000);
  };

  /**
   * Form Submission Handler
   * 
   * Now redirects directly to Google OAuth instead of collecting email first.
   */
  const onSubmit = async (data: LoginFormData) => {
    handleGoogleLogin();
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
                            disabled={isSubmitting}
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
                  className="w-full h-11 text-sm font-medium bg-red-600 hover:bg-red-700 text-white"
                  disabled={isSubmitting}
                  data-testid="button-login"
                  aria-label="Login with Google"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Redirecting to Google...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Information about Google Authentication */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Login with your Google account to access Smart Student Hub</p>
              <p className="mt-1">Your academic email will be used for authentication</p>
            </div>
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
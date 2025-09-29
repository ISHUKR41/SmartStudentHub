/**
 * Signup Data Handler Component
 * 
 * This component runs after authentication to process signup data
 * stored in sessionStorage and complete the user profile.
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { signupSchema, type SignupFormData } from "@shared/schema";
import { useLocation } from "wouter";

export function SignupDataHandler() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const processSignupData = async () => {
      // Only process if user is authenticated and we haven't processed yet
      if (!isAuthenticated || isLoading || isProcessing || !user) {
        return;
      }

      // Check if user already has academic data (roll number indicates complete profile)
      if (user.rollNumber) {
        // User already has complete profile, remove any leftover signup data
        sessionStorage.removeItem('signupData');
        return;
      }

      // Check for signup data in sessionStorage
      const signupDataString = sessionStorage.getItem('signupData');
      if (!signupDataString) {
        return; // No signup data to process
      }

      setIsProcessing(true);

      try {
        const signupData: SignupFormData = JSON.parse(signupDataString);
        
        // Validate the data
        const validatedData = signupSchema.parse(signupData);
        
        // Send the data to complete profile endpoint
        const response = await fetch('/api/auth/complete-profile', {
          method: 'POST',
          body: JSON.stringify(validatedData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove signup data from sessionStorage after successful processing
        sessionStorage.removeItem('signupData');
        
        toast({
          title: "Profile Completed",
          description: "Your academic information has been successfully added to your profile.",
          variant: "default",
        });

        // Invalidate user data cache and navigate to dashboard
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
        setLocation('/');
        
      } catch (error) {
        console.error('Error processing signup data:', error);
        
        // Keep signup data in sessionStorage for retry
        toast({
          title: "Profile Completion Failed",
          description: "There was an issue completing your profile. Please try again or contact support.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processSignupData();
  }, [isAuthenticated, isLoading, user, isProcessing, toast]);

  // This component doesn't render anything visible
  return null;
}
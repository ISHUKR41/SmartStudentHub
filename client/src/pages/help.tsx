/**
 * Help & Support Page for Smart Student Hub
 * 
 * Provides comprehensive support information for users including
 * contact details, common issues, and helpful resources.
 */

import { useLocation } from "wouter";
import { GraduationCap, ArrowLeft, Mail, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Help() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Help & Support</h1>
          </div>
        </div>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get in touch with our support team for assistance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@smartstudenthub.edu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 9 AM - 5 PM</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">How do I create an account?</h3>
              <p className="text-sm text-muted-foreground">
                Click on the "Sign Up" button and fill in your academic details. You'll then be redirected to authenticate using your institutional credentials.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">I'm having trouble logging in</h3>
              <p className="text-sm text-muted-foreground">
                Make sure you're using your institutional email address. If you continue to have issues, contact your IT administrator or our support team.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">How do I upload activities?</h3>
              <p className="text-sm text-muted-foreground">
                After logging in, navigate to the "Upload Activity" section and fill in the required details along with supporting documents.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">When will my activities be approved?</h3>
              <p className="text-sm text-muted-foreground">
                Faculty members review submitted activities within 3-5 business days. You'll receive notifications about status updates.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => window.open('https://www.example.com/user-guide', '_blank')}
                data-testid="button-user-guide"
              >
                <div className="text-left">
                  <p className="font-medium">User Guide</p>
                  <p className="text-sm text-muted-foreground">Complete documentation</p>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-auto p-4"
                onClick={() => window.open('https://www.example.com/video-tutorials', '_blank')}
                data-testid="button-video-tutorials"
              >
                <div className="text-left">
                  <p className="font-medium">Video Tutorials</p>
                  <p className="text-sm text-muted-foreground">Step-by-step guides</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
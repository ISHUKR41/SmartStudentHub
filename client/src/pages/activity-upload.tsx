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
import { Cpu, Save, Send } from "lucide-react";
import { z } from "zod";
import { useLocation } from "wouter";

const activityFormSchema = z.object({
  title: z.string().min(1, "Activity title is required"),
  category: z.enum(['academic', 'co-curricular', 'extra-curricular', 'volunteering', 'internship', 'leadership', 'mooc']),
  organization: z.string().min(1, "Organization is required"),
  activityDate: z.string().min(1, "Activity date is required"),
  description: z.string().optional(),
});

type ActivityFormData = z.infer<typeof activityFormSchema>;

// Extended type for form data with files
interface ActivitySubmissionData extends ActivityFormData {
  files: File[];
}

export default function ActivityUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

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

  const uploadMutation = useMutation({
    mutationFn: async (data: ActivitySubmissionData) => {
      const formData = new FormData();
      
      // Append form fields (excluding files)
      formData.append('title', data.title);
      formData.append('category', data.category);
      formData.append('organization', data.organization);
      formData.append('activityDate', data.activityDate);
      if (data.description) {
        formData.append('description', data.description);
      }
      
      // Append files
      data.files.forEach((file) => {
        formData.append('files', file);
      });

      // Use fetch with explicit headers and better error handling
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
          // If JSON parsing fails, use text response
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Activity Submitted",
        description: "Your activity has been submitted for faculty review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/students/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/students/stats"] });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ActivityFormData) => {
    const submissionData: ActivitySubmissionData = {
      ...data,
      files
    };
    uploadMutation.mutate(submissionData);
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft functionality
    toast({
      title: "Draft Saved",
      description: "Your activity draft has been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6" data-testid="main-upload">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground" data-testid="text-upload-title">
                Upload Achievement
              </h2>
              <p className="text-muted-foreground" data-testid="text-upload-description">
                Submit your certificates and activity documentation for verification
              </p>
            </div>

            {/* Upload Form */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Activity Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-activity-upload">
                    
                    {/* Activity Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Title</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Activity or achievement title" 
                                {...field} 
                                data-testid="input-activity-title"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-category">
                                  <SelectValue placeholder="Choose activity category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="academic">Academic</SelectItem>
                                <SelectItem value="co-curricular">Co-Curricular</SelectItem>
                                <SelectItem value="extra-curricular">Extra-Curricular</SelectItem>
                                <SelectItem value="volunteering">Volunteering</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                                <SelectItem value="leadership">Leadership</SelectItem>
                                <SelectItem value="mooc">MOOC</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="organization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization/Institution</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Organization or institution name" 
                                {...field} 
                                data-testid="input-organization"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="activityDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Activity</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                data-testid="input-activity-date"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Provide detailed description of your achievement and key learnings" 
                              className="min-h-[100px]"
                              {...field} 
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* File Upload */}
                    <div>
                      <label className="form-label">Upload Certificate/Documentation</label>
                      <FileUpload 
                        files={files}
                        onFilesChange={setFiles}
                        maxFiles={5}
                        acceptedFileTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                        maxFileSize={10 * 1024 * 1024} // 10MB
                        data-testid="file-upload-certificates"
                      />
                    </div>

                    {/* AI Auto-extraction Info */}
                    <Alert className="bg-blue-50 border-blue-200">
                      <Cpu className="h-4 w-4 text-blue-600" />
                      <AlertDescription>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Automated Data Extraction</h4>
                        <p className="text-xs text-blue-700">
                          Our system will automatically extract event name, date, and organization details from your certificates using OCR technology.
                        </p>
                      </AlertDescription>
                    </Alert>

                    {/* Form Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleSaveDraft}
                        data-testid="button-save-draft"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save as Draft
                      </Button>
                      
                      <div className="flex items-center space-x-3">
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={() => setLocation('/')}
                          data-testid="button-cancel"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={uploadMutation.isPending}
                          data-testid="button-submit"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {uploadMutation.isPending ? 'Submitting...' : 'Submit for Review'}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

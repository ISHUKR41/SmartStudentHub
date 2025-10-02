import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, FileText, CheckCircle, AlertCircle, Upload, Download, X, FileIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import CountUp from 'react-countup';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: Date | string;
  maxMarks: number;
  createdAt: Date | string;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  status: 'pending' | 'submitted' | 'graded';
  submittedAt: Date | string;
  grade: number | null;
  feedback: string | null;
  files: SubmissionFile[];
}

interface SubmissionFile {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}

export default function Assignments() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);
  const { toast } = useToast();

  // Fetch assignments
  const { data: assignments = [], isLoading: loadingAssignments } = useQuery<Assignment[]>({
    queryKey: ['/api/assignments'],
  });

  // Fetch submissions
  const { data: submissions = [], isLoading: loadingSubmissions } = useQuery<Submission[]>({
    queryKey: ['/api/submissions'],
  });

  // Submit assignment mutation
  const submitAssignmentMutation = useMutation({
    mutationFn: async ({ assignmentId, files }: { assignmentId: string; files: File[] }) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit assignment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/submissions'] });
      toast({
        title: 'Success',
        description: 'Assignment submitted successfully!',
      });
      setIsSubmitDialogOpen(false);
      setSelectedFiles([]);
      setSelectedAssignment(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Dropzone configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
  });

  // Remove file from selection
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Get submission for an assignment
  const getSubmissionForAssignment = (assignmentId: string): Submission | undefined => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  // Get assignment status
  const getAssignmentStatus = (assignment: Assignment): string => {
    const submission = getSubmissionForAssignment(assignment.id);
    if (!submission) {
      const dueDate = new Date(assignment.dueDate);
      return dueDate < new Date() ? 'overdue' : 'pending';
    }
    return submission.status;
  };

  // Format date
  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get time left
  const getTimeLeft = (dueDate: Date | string): string => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due today';
    if (days === 1) return '1 day left';
    return `${days} days left`;
  };

  // Handle submit assignment
  const handleSubmit = () => {
    if (!selectedAssignment) return;
    if (selectedFiles.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one file to submit',
        variant: 'destructive',
      });
      return;
    }

    submitAssignmentMutation.mutate({
      assignmentId: selectedAssignment.id,
      files: selectedFiles,
    });
  };

  // Handle view submission
  const handleViewSubmission = (assignment: Assignment) => {
    const submission = getSubmissionForAssignment(assignment.id);
    if (submission) {
      setViewingSubmission(submission);
      setIsViewDialogOpen(true);
    }
  };

  // Filter assignments by status
  const filteredAssignments = assignments.filter((assignment) => {
    if (activeTab === 'all') return true;
    const status = getAssignmentStatus(assignment);
    return status === activeTab;
  });

  // Calculate statistics
  const pendingCount = assignments.filter((a) => getAssignmentStatus(a) === 'pending').length;
  const submittedCount = assignments.filter((a) => getAssignmentStatus(a) === 'submitted').length;
  const gradedCount = assignments.filter((a) => getAssignmentStatus(a) === 'graded').length;
  const overdueCount = assignments.filter((a) => getAssignmentStatus(a) === 'overdue').length;

  // Calculate average grade
  const gradedSubmissions = submissions.filter((s) => s.status === 'graded' && s.grade !== null);
  const averageGrade = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0) / gradedSubmissions.length
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'submitted':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'graded':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'overdue':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'graded':
        return <CheckCircle className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      case 'submitted':
        return <Upload className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  if (loadingAssignments || loadingSubmissions) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="assignments-title">
              Assignments 📝
            </h1>
            <p className="text-muted-foreground">Track and manage your course assignments</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-pending">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Pending</span>
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={pendingCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-submitted">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Submitted</span>
                    <Upload className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={submittedCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-graded">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Graded</span>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={gradedCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-overdue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Overdue</span>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={overdueCount} duration={1.5} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-average">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Avg Grade</span>
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">
                    <CountUp end={averageGrade} decimals={1} duration={1.5} />%
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6" data-testid="tabs-list">
              <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted" data-testid="tab-submitted">Submitted</TabsTrigger>
              <TabsTrigger value="graded" data-testid="tab-graded">Graded</TabsTrigger>
              <TabsTrigger value="overdue" data-testid="tab-overdue">Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredAssignments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No assignments found</p>
                  </motion.div>
                ) : (
                  filteredAssignments.map((assignment, index) => {
                    const status = getAssignmentStatus(assignment);
                    const submission = getSubmissionForAssignment(assignment.id);

                    return (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        layout
                      >
                        <Card className="hover:shadow-lg transition-shadow" data-testid={`assignment-card-${index}`}>
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h3 className="text-xl font-bold text-foreground mb-1" data-testid={`assignment-title-${index}`}>
                                      {assignment.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{assignment.subject}</p>
                                  </div>
                                  <Badge className={getStatusColor(status)} variant="outline" data-testid={`assignment-status-${index}`}>
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(status)}
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </span>
                                  </Badge>
                                </div>

                                <p className="text-muted-foreground mb-4" data-testid={`assignment-description-${index}`}>
                                  {assignment.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      Due: <span className="font-medium">{formatDate(assignment.dueDate)}</span>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      <span className="font-medium">{getTimeLeft(assignment.dueDate)}</span>
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
                                      Max Marks: <span className="font-medium">{assignment.maxMarks}</span>
                                    </span>
                                  </div>
                                  {submission?.grade && (
                                    <div className="flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                      <span className="text-sm">
                                        Grade: <span className="font-medium text-green-600">{submission.grade}/{assignment.maxMarks}</span>
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {submission?.feedback && (
                                  <div className="bg-muted/50 p-3 rounded-lg mb-4">
                                    <p className="text-sm font-medium mb-1">Feedback:</p>
                                    <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 lg:min-w-[200px]">
                                {!submission && status !== 'overdue' && (
                                  <Button
                                    onClick={() => {
                                      setSelectedAssignment(assignment);
                                      setIsSubmitDialogOpen(true);
                                    }}
                                    className="w-full"
                                    data-testid={`button-submit-${index}`}
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Submit Assignment
                                  </Button>
                                )}

                                {submission && (
                                  <Button
                                    onClick={() => handleViewSubmission(assignment)}
                                    variant="outline"
                                    className="w-full"
                                    data-testid={`button-view-${index}`}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    View Submission
                                  </Button>
                                )}

                                {status === 'overdue' && !submission && (
                                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 justify-center py-2">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Submission Closed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Submit Assignment Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment && `Upload files for: ${selectedAssignment.title}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
              data-testid="dropzone"
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              {isDragActive ? (
                <p className="text-foreground font-medium">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-foreground font-medium mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PDF, DOC, DOCX, JPG, PNG (Max 10MB per file)
                  </p>
                </div>
              )}
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Selected Files ({selectedFiles.length})</h4>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      data-testid={`selected-file-${index}`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0"
                        data-testid={`remove-file-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitDialogOpen(false);
                  setSelectedFiles([]);
                  setSelectedAssignment(null);
                }}
                disabled={submitAssignmentMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedFiles.length === 0 || submitAssignmentMutation.isPending}
                data-testid="button-confirm-submit"
              >
                {submitAssignmentMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Assignment
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Submission Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              View your submitted files and feedback
            </DialogDescription>
          </DialogHeader>

          {viewingSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge className={getStatusColor(viewingSubmission.status)}>
                    {viewingSubmission.status.charAt(0).toUpperCase() + viewingSubmission.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Submitted On</p>
                  <p className="text-sm font-medium">{formatDate(viewingSubmission.submittedAt)}</p>
                </div>
                {viewingSubmission.grade !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Grade</p>
                    <p className="text-sm font-medium text-green-600">{viewingSubmission.grade}</p>
                  </div>
                )}
              </div>

              {viewingSubmission.feedback && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium mb-2">Feedback:</p>
                  <p className="text-sm text-muted-foreground">{viewingSubmission.feedback}</p>
                </div>
              )}

              {viewingSubmission.files && viewingSubmission.files.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Submitted Files ({viewingSubmission.files.length})</p>
                  <div className="space-y-2">
                    {viewingSubmission.files.map((file, index) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        data-testid={`submission-file-${index}`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <FileIcon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{file.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(file.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={`/api/files/${file.filePath}`} download={file.fileName}>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

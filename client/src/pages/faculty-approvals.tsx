import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Download,
  Eye,
  Filter,
  Search,
  RefreshCcw,
  AlertCircle,
  MessageSquare,
  History,
  CheckCheck,
  GraduationCap,
  Award,
  Briefcase,
  Trophy
} from 'lucide-react';
import CountUp from 'react-countup';
import { useToast } from '@/hooks/use-toast';

const DEPARTMENTS = [
  { id: 'all', label: 'All Departments' },
  { id: 'cs', label: 'Computer Science' },
  { id: 'ee', label: 'Electrical Engineering' },
  { id: 'me', label: 'Mechanical Engineering' },
  { id: 'ce', label: 'Civil Engineering' },
];

const MOCK_SUBMISSIONS = [
  {
    id: 1,
    studentName: 'John Doe',
    studentId: 'CS2021001',
    department: 'cs',
    activityType: 'Certification',
    activityTitle: 'AWS Solutions Architect',
    description: 'Completed AWS certification with score 920/1000',
    submittedDate: '2025-09-20',
    status: 'pending',
    documents: ['certificate.pdf', 'score_report.pdf'],
    category: 'academic',
    icon: Award,
  },
  {
    id: 2,
    studentName: 'Jane Smith',
    studentId: 'CS2021002',
    department: 'cs',
    activityType: 'Competition',
    activityTitle: 'National Hackathon Winner',
    description: 'First place in Smart India Hackathon 2025',
    submittedDate: '2025-09-19',
    status: 'pending',
    documents: ['certificate.pdf', 'project_report.pdf', 'photos.zip'],
    category: 'competition',
    icon: Trophy,
  },
  {
    id: 3,
    studentName: 'Mike Johnson',
    studentId: 'EE2021015',
    department: 'ee',
    activityType: 'Internship',
    activityTitle: 'Google Summer Internship',
    description: 'Completed 3-month internship at Google Cloud team',
    submittedDate: '2025-09-18',
    status: 'approved',
    documents: ['offer_letter.pdf', 'completion_cert.pdf'],
    category: 'internship',
    icon: Briefcase,
    approvedBy: 'Dr. Sarah Williams',
    approvedDate: '2025-09-19',
  },
  {
    id: 4,
    studentName: 'Emily Davis',
    studentId: 'CS2021025',
    department: 'cs',
    activityType: 'Workshop',
    activityTitle: 'Machine Learning Workshop',
    description: 'Attended 5-day advanced ML workshop by IIT Delhi',
    submittedDate: '2025-09-17',
    status: 'rejected',
    documents: ['attendance_cert.pdf'],
    category: 'academic',
    icon: GraduationCap,
    rejectedBy: 'Dr. Robert Brown',
    rejectedDate: '2025-09-18',
    rejectionReason: 'Certificate does not meet verification standards',
  },
];

export default function FacultyApprovals() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState<number[]>([]);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<typeof MOCK_SUBMISSIONS[0] | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const filteredSubmissions = MOCK_SUBMISSIONS.filter(submission => {
    const matchesDept = selectedDepartment === 'all' || submission.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || submission.status === selectedStatus;
    const matchesSearch = 
      submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.activityTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const pendingCount = MOCK_SUBMISSIONS.filter(s => s.status === 'pending').length;
  const approvedCount = MOCK_SUBMISSIONS.filter(s => s.status === 'approved').length;
  const rejectedCount = MOCK_SUBMISSIONS.filter(s => s.status === 'rejected').length;

  const handleSelectSubmission = (id: number) => {
    setSelectedSubmissions(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSubmissions.length === filteredSubmissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(filteredSubmissions.map(s => s.id));
    }
  };

  const handleOpenApprovalDialog = (submission: typeof MOCK_SUBMISSIONS[0], action: 'approve' | 'reject') => {
    setCurrentSubmission(submission);
    setActionType(action);
    setComment('');
    setIsApprovalDialogOpen(true);
  };

  const handleSubmitDecision = () => {
    toast({
      title: actionType === 'approve' ? 'Approved Successfully' : 'Rejected',
      description: `${currentSubmission?.activityTitle} has been ${actionType}d`,
    });
    setIsApprovalDialogOpen(false);
    setCurrentSubmission(null);
  };

  const handleBulkAction = (action: 'approve' | 'reject') => {
    toast({
      title: `Bulk ${action === 'approve' ? 'Approval' : 'Rejection'}`,
      description: `${selectedSubmissions.length} submission(s) ${action}d successfully`,
    });
    setSelectedSubmissions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="page-title">
              Faculty Approvals 📋
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Review and approve student activity submissions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Pending Review', value: pendingCount, icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
              { label: 'Approved', value: approvedCount, icon: CheckCircle, color: 'text-green-500', bgColor: 'bg-green-500/10' },
              { label: 'Rejected', value: rejectedCount, icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10' },
              { label: 'Total Submissions', value: MOCK_SUBMISSIONS.length, icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow" data-testid={`card-stat-${index}`}>
                  <CardContent className="pt-6">
                    <div className={`p-3 rounded-lg ${stat.bgColor} w-fit mb-4`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold text-foreground">
                      <CountUp end={stat.value} duration={2} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="mb-6 hover:shadow-lg transition-shadow" data-testid="card-filters">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filters & Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by student name, ID, or activity..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search"
                    />
                  </div>
                  
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full lg:w-[200px]" data-testid="select-department">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full lg:w-[200px]" data-testid="select-status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon" data-testid="button-refresh">
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>

                {selectedSubmissions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCheck className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {selectedSubmissions.length} submission(s) selected
                      </span>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleBulkAction('approve')}
                        data-testid="button-bulk-approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve All
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleBulkAction('reject')}
                        data-testid="button-bulk-reject"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject All
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="pending" className="space-y-6" data-testid="tabs-submissions">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="gap-2" data-testid="tab-pending">
                <Clock className="h-4 w-4" />
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2" data-testid="tab-approved">
                <CheckCircle className="h-4 w-4" />
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-2" data-testid="tab-rejected">
                <XCircle className="h-4 w-4" />
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {filteredSubmissions.filter(s => s.status === 'pending').length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                    <p className="text-muted-foreground">No pending submissions to review</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Checkbox
                      checked={selectedSubmissions.length === filteredSubmissions.filter(s => s.status === 'pending').length}
                      onCheckedChange={handleSelectAll}
                      data-testid="checkbox-select-all"
                    />
                    <span className="text-sm text-muted-foreground">Select All</span>
                  </div>
                  {filteredSubmissions.filter(s => s.status === 'pending').map((submission) => (
                    <SubmissionCard
                      key={submission.id}
                      submission={submission}
                      isSelected={selectedSubmissions.includes(submission.id)}
                      onSelect={handleSelectSubmission}
                      onApprove={() => handleOpenApprovalDialog(submission, 'approve')}
                      onReject={() => handleOpenApprovalDialog(submission, 'reject')}
                    />
                  ))}
                </>
              )}
            </TabsContent>

            <TabsContent value="approved" className="space-y-4">
              {filteredSubmissions.filter(s => s.status === 'approved').map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  isSelected={false}
                  onSelect={() => {}}
                  showCheckbox={false}
                />
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              {filteredSubmissions.filter(s => s.status === 'rejected').map((submission) => (
                <SubmissionCard
                  key={submission.id}
                  submission={submission}
                  isSelected={false}
                  onSelect={() => {}}
                  showCheckbox={false}
                />
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" data-testid="dialog-approval">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionType === 'approve' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              {actionType === 'approve' ? 'Approve' : 'Reject'} Submission
            </DialogTitle>
            <DialogDescription>
              {currentSubmission?.activityTitle} by {currentSubmission?.studentName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{currentSubmission?.studentName}</span>
                <span className="text-muted-foreground">({currentSubmission?.studentId})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Submitted on {currentSubmission && new Date(currentSubmission.submittedDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                {currentSubmission?.documents.length} document(s) attached
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">
                {actionType === 'approve' ? 'Approval Comments (Optional)' : 'Reason for Rejection *'}
              </Label>
              <Textarea
                id="comment"
                placeholder={actionType === 'approve' ? 'Add any comments...' : 'Explain why this submission is being rejected...'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                data-testid="textarea-comment"
              />
            </div>

            {actionType === 'reject' && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">
                  This action will notify the student about the rejection. Please provide a clear reason.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApprovalDialogOpen(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitDecision}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              data-testid="button-confirm"
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SubmissionCard({
  submission,
  isSelected,
  onSelect,
  onApprove,
  onReject,
  showCheckbox = true,
}: {
  submission: typeof MOCK_SUBMISSIONS[0];
  isSelected: boolean;
  onSelect: (id: number) => void;
  onApprove?: () => void;
  onReject?: () => void;
  showCheckbox?: boolean;
}) {
  const Icon = submission.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      data-testid={`submission-card-${submission.id}`}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            {showCheckbox && submission.status === 'pending' && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onSelect(submission.id)}
                className="mt-1"
                data-testid={`checkbox-${submission.id}`}
              />
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{submission.activityTitle}</h3>
                      <p className="text-sm text-muted-foreground">{submission.activityType}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {submission.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {submission.studentName} ({submission.studentId})
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(submission.submittedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {submission.documents.length} document(s)
                    </div>
                  </div>
                </div>
                
                <div className="flex sm:flex-col items-start gap-2">
                  <Badge className={`${submission.status === 'approved' ? 'bg-green-500/10 text-green-500' : submission.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'} flex items-center gap-1`}>
                    {submission.status === 'approved' ? <CheckCircle className="h-3 w-3" /> : submission.status === 'rejected' ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                  </Badge>
                </div>
              </div>
              
              {(submission.status === 'approved' || submission.status === 'rejected') && (
                <div className="p-3 bg-muted/50 rounded-lg mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {submission.status === 'approved' ? 'Approved' : 'Rejected'} by {submission.status === 'approved' ? submission.approvedBy : submission.rejectedBy}
                    </span>
                    <span className="text-muted-foreground">
                      on {submission.status === 'approved' && submission.approvedDate ? new Date(submission.approvedDate).toLocaleDateString() : submission.status === 'rejected' && submission.rejectedDate ? new Date(submission.rejectedDate).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {submission.status === 'rejected' && submission.rejectionReason && (
                    <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                      <MessageSquare className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{submission.rejectionReason}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2" data-testid={`button-view-${submission.id}`}>
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="gap-2" data-testid={`button-download-${submission.id}`}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                
                {submission.status === 'pending' && onApprove && onReject && (
                  <>
                    <Button 
                      size="sm" 
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      onClick={onApprove}
                      data-testid={`button-approve-${submission.id}`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="gap-2"
                      onClick={onReject}
                      data-testid={`button-reject-${submission.id}`}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

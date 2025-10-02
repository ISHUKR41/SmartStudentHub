import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { 
  Upload, 
  FileText, 
  Calendar, 
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  Target,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  Filter,
  Plus,
  Search,
  TrendingUp
} from 'lucide-react';
import CountUp from 'react-countup';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ACTIVITY_CATEGORIES = [
  { id: 'academic', label: 'Academic', icon: GraduationCap, color: '#3b82f6' },
  { id: 'extracurricular', label: 'Extracurricular', icon: Target, color: '#8b5cf6' },
  { id: 'certifications', label: 'Certifications', icon: Award, color: '#10b981' },
  { id: 'internships', label: 'Internships', icon: Briefcase, color: '#f59e0b' },
  { id: 'workshops', label: 'Workshops', icon: FileText, color: '#ef4444' },
  { id: 'competitions', label: 'Competitions', icon: Trophy, color: '#ec4899' },
];

const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: 'Best Project Award',
    category: 'academic',
    description: 'Received best project award in Computer Science department',
    date: '2025-09-15',
    status: 'approved',
    documents: ['certificate.pdf', 'photo.jpg'],
  },
  {
    id: 2,
    title: 'AWS Certified Solutions Architect',
    category: 'certifications',
    description: 'Successfully completed AWS certification exam',
    date: '2025-08-20',
    status: 'pending',
    documents: ['certificate.pdf'],
  },
  {
    id: 3,
    title: 'Google Summer Internship',
    category: 'internships',
    description: '3-month internship at Google headquarters',
    date: '2025-06-01',
    status: 'approved',
    documents: ['offer_letter.pdf', 'completion_cert.pdf'],
  },
  {
    id: 4,
    title: 'Hackathon Winner - TechFest 2025',
    category: 'competitions',
    description: 'First place in national level hackathon',
    date: '2025-07-10',
    status: 'approved',
    documents: ['certificate.pdf'],
  },
  {
    id: 5,
    title: 'React Advanced Workshop',
    category: 'workshops',
    description: 'Attended 5-day advanced React workshop',
    date: '2025-05-15',
    status: 'rejected',
    documents: ['attendance_cert.pdf'],
  },
];

const monthlyData = [
  { month: 'Jan', activities: 4 },
  { month: 'Feb', activities: 6 },
  { month: 'Mar', activities: 8 },
  { month: 'Apr', activities: 5 },
  { month: 'May', activities: 10 },
  { month: 'Jun', activities: 12 },
];

const categoryData = ACTIVITY_CATEGORIES.map(cat => ({
  name: cat.label,
  value: Math.floor(Math.random() * 20) + 5,
  color: cat.color,
}));

const statusData = [
  { name: 'Approved', value: 45, color: '#10b981' },
  { name: 'Pending', value: 15, color: '#f59e0b' },
  { name: 'Rejected', value: 3, color: '#ef4444' },
];

export default function ActivityTracker() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
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

  const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="page-title">
                Activity Tracker 🎯
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Track and manage your achievements, certifications, and activities
              </p>
            </div>
            
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  data-testid="button-upload-activity"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Upload Activity</span>
                  <span className="sm:hidden">Upload</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" data-testid="dialog-upload-activity">
                <DialogHeader>
                  <DialogTitle>Upload New Activity</DialogTitle>
                  <DialogDescription>
                    Add your achievement, certification, or activity details with supporting documents
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Activity Title *</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., AWS Certification, Hackathon Winner" 
                      data-testid="input-activity-title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select>
                      <SelectTrigger id="category" data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {ACTIVITY_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            <div className="flex items-center gap-2">
                              <cat.icon className="h-4 w-4" style={{ color: cat.color }} />
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      data-testid="input-activity-date"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Provide details about your activity..."
                      rows={4}
                      data-testid="textarea-description"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="documents">Upload Documents *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        id="documents"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                        data-testid="input-file-upload"
                      />
                      <label 
                        htmlFor="documents" 
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Click to upload or drag and drop</p>
                          <p className="text-sm text-muted-foreground">PDF, JPG, PNG (Max 10MB each)</p>
                        </div>
                      </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">Selected Files:</p>
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted rounded">
                            <FileText className="h-4 w-4" />
                            <span className="flex-1 truncate">{file.name}</span>
                            <span className="text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsUploadDialogOpen(false)}
                    data-testid="button-cancel-upload"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-primary to-primary/80"
                    data-testid="button-submit-activity"
                  >
                    Submit for Approval
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {[
              { label: 'Total Activities', value: 63, icon: Award, color: 'text-blue-500', change: '+12%' },
              { label: 'Approved', value: 45, icon: CheckCircle, color: 'text-green-500', change: '+8%' },
              { label: 'Pending Review', value: 15, icon: Clock, color: 'text-yellow-500', change: '+3' },
              { label: 'This Month', value: 12, icon: TrendingUp, color: 'text-purple-500', change: '+40%' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow" data-testid={`card-stat-${index}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      <Badge variant="secondary" className="text-xs">
                        {stat.change}
                      </Badge>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow" data-testid="card-activity-trend">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Activity Trend
                </CardTitle>
                <CardDescription>Monthly activity submissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                    <XAxis dataKey="month" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="activities" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorActivities)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-status-distribution">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Status Distribution
                </CardTitle>
                <CardDescription>Current approval status of activities</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="hover:shadow-lg transition-shadow" data-testid="card-category-breakdown">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Category Breakdown
              </CardTitle>
              <CardDescription>Activities by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mt-6 hover:shadow-lg transition-shadow" data-testid="card-activities-list">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Your Activities</CardTitle>
                  <CardDescription>Manage and track all your submitted activities</CardDescription>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search activities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-activities"
                    />
                  </div>
                  
                  <Button variant="outline" size="sm" className="gap-2" data-testid="button-filter">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {ACTIVITY_CATEGORIES.map((category) => {
                  const categoryActivities = filteredActivities.filter(
                    act => act.category === category.id
                  );
                  
                  if (categoryActivities.length === 0 && selectedCategory !== 'all') return null;
                  
                  return (
                    <AccordionItem 
                      key={category.id} 
                      value={category.id}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="hover:no-underline" data-testid={`accordion-${category.id}`}>
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg" 
                            style={{ backgroundColor: `${category.color}20` }}
                          >
                            <category.icon className="h-5 w-5" style={{ color: category.color }} />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold">{category.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {categoryActivities.length} {categoryActivities.length === 1 ? 'activity' : 'activities'}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {categoryActivities.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <category.icon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                              <p>No activities in this category yet</p>
                            </div>
                          ) : (
                            categoryActivities.map((activity) => (
                              <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                                data-testid={`activity-${activity.id}`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                      <div>
                                        <h4 className="font-semibold text-foreground mb-1">
                                          {activity.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {activity.description}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                          <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(activity.date).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            })}
                                          </div>
                                          <span>•</span>
                                          <div className="flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            {activity.documents.length} {activity.documents.length === 1 ? 'document' : 'documents'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <Badge 
                                      className={`${getStatusColor(activity.status)} flex items-center gap-1`}
                                      data-testid={`badge-status-${activity.id}`}
                                    >
                                      {getStatusIcon(activity.status)}
                                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                    </Badge>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      data-testid={`button-view-${activity.id}`}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      data-testid={`button-download-${activity.id}`}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
              
              {filteredActivities.length === 0 && (
                <div className="text-center py-12" data-testid="empty-state">
                  <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No activities found</h3>
                  <p className="text-muted-foreground mb-6">
                    Start tracking your achievements by uploading your first activity
                  </p>
                  <Button 
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                    data-testid="button-upload-first"
                  >
                    <Plus className="h-4 w-4" />
                    Upload Your First Activity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

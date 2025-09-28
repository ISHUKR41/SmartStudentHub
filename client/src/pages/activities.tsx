/**
 * Student Activities Page Component
 * 
 * A comprehensive page for viewing and managing all student activities with advanced
 * filtering, search, and sorting capabilities. This page provides a complete overview
 * of student achievements and facilitates easy navigation through activity records.
 * 
 * Features:
 * - Advanced filtering by category, status, date range, and skill credits
 * - Real-time search across titles, descriptions, and organizations
 * - Multiple sorting options (date, credits, status, title)
 * - Professional responsive design
 * - Integration with existing API endpoints
 * - Comprehensive error handling and loading states
 * - Interactive activity management actions
 */

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/layout/navigation";
import Sidebar from "@/components/layout/sidebar";
import ActivityList from "@/components/ui/activity-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  RefreshCw, 
  Plus,
  ClipboardList,
  Calendar,
  Trophy,
  User,
  AlertCircle
} from "lucide-react";
import { useLocation } from "wouter";
import { Activity } from "@shared/schema";

// Define filtering and sorting types for type safety
interface FilterState {
  category: string;
  status: string;
  dateRange: string;
  creditRange: string;
  search: string;
}

interface SortState {
  field: 'date' | 'credits' | 'title' | 'status' | 'category';
  direction: 'asc' | 'desc';
}

// Category options with display labels
const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'academic', label: 'Academic' },
  { value: 'co-curricular', label: 'Co-Curricular' },
  { value: 'extra-curricular', label: 'Extra-Curricular' },
  { value: 'internship', label: 'Internship' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'mooc', label: 'MOOC' },
  { value: 'volunteering', label: 'Volunteering' }
];

// Status options with display labels
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' }
];

// Date range options for filtering
const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'last-3-months', label: 'Last 3 Months' },
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: 'this-year', label: 'This Year' },
  { value: 'last-year', label: 'Last Year' }
];

// Credit range options for filtering
const CREDIT_RANGE_OPTIONS = [
  { value: 'all', label: 'All Credits' },
  { value: '0', label: '0 Credits' },
  { value: '1-5', label: '1-5 Credits' },
  { value: '6-10', label: '6-10 Credits' },
  { value: '11-20', label: '11-20 Credits' },
  { value: '21+', label: '21+ Credits' }
];

// Sort options with display labels
const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First', field: 'date' as const, direction: 'desc' as const },
  { value: 'date-asc', label: 'Oldest First', field: 'date' as const, direction: 'asc' as const },
  { value: 'credits-desc', label: 'Highest Credits', field: 'credits' as const, direction: 'desc' as const },
  { value: 'credits-asc', label: 'Lowest Credits', field: 'credits' as const, direction: 'asc' as const },
  { value: 'title-asc', label: 'Title A-Z', field: 'title' as const, direction: 'asc' as const },
  { value: 'title-desc', label: 'Title Z-A', field: 'title' as const, direction: 'desc' as const }
];

export default function Activities() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // State management for filters and sorting
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    status: 'all',
    dateRange: 'all',
    creditRange: 'all',
    search: ''
  });
  
  const [sort, setSort] = useState<SortState>({
    field: 'date',
    direction: 'desc'
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your activities.",
        variant: "destructive",
      });
      setLocation('/');
      return;
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  // Fetch activities data using React Query
  const { data: activities = [], isLoading: activitiesLoading, error, refetch } = useQuery<Activity[]>({
    queryKey: ["/api/students/activities"],
    retry: false,
    enabled: isAuthenticated
  });

  // Filter and sort activities based on current state
  const filteredAndSortedActivities = useMemo(() => {
    if (!activities) return [];

    let filtered = activities.filter(activity => {
      // Category filter
      if (filters.category !== 'all' && activity.category !== filters.category) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && activity.status !== filters.status) {
        return false;
      }

      // Search filter (across title, description, and organization)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesTitle = activity.title.toLowerCase().includes(searchTerm);
        const matchesDescription = activity.description?.toLowerCase().includes(searchTerm) || false;
        const matchesOrganization = activity.organization.toLowerCase().includes(searchTerm);
        
        if (!matchesTitle && !matchesDescription && !matchesOrganization) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const activityDate = new Date(activity.activityDate);
        const now = new Date();
        const diffTime = now.getTime() - activityDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'last-month':
            if (diffDays > 30) return false;
            break;
          case 'last-3-months':
            if (diffDays > 90) return false;
            break;
          case 'last-6-months':
            if (diffDays > 180) return false;
            break;
          case 'this-year':
            if (activityDate.getFullYear() !== now.getFullYear()) return false;
            break;
          case 'last-year':
            if (activityDate.getFullYear() !== now.getFullYear() - 1) return false;
            break;
        }
      }

      // Credit range filter
      if (filters.creditRange !== 'all') {
        const credits = activity.skillCredits || 0;
        switch (filters.creditRange) {
          case '0':
            if (credits !== 0) return false;
            break;
          case '1-5':
            if (credits < 1 || credits > 5) return false;
            break;
          case '6-10':
            if (credits < 6 || credits > 10) return false;
            break;
          case '11-20':
            if (credits < 11 || credits > 20) return false;
            break;
          case '21+':
            if (credits < 21) return false;
            break;
        }
      }

      return true;
    });

    // Sort the filtered activities
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sort.field) {
        case 'date':
          comparison = new Date(a.activityDate).getTime() - new Date(b.activityDate).getTime();
          break;
        case 'credits':
          comparison = (a.skillCredits || 0) - (b.skillCredits || 0);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [activities, filters, sort]);

  // Calculate statistics for display
  const stats = useMemo(() => {
    if (!activities) return { total: 0, approved: 0, pending: 0, rejected: 0, totalCredits: 0 };
    
    return {
      total: activities.length,
      approved: activities.filter(a => a.status === 'approved').length,
      pending: activities.filter(a => a.status === 'pending').length,
      rejected: activities.filter(a => a.status === 'rejected').length,
      totalCredits: activities
        .filter(a => a.status === 'approved')
        .reduce((sum, a) => sum + (a.skillCredits || 0), 0)
    };
  }, [activities]);

  // Filter update functions
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const updateSort = (field: SortState['field'], direction: SortState['direction']) => {
    setSort({ field, direction });
  };

  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      status: 'all',
      dateRange: 'all',
      creditRange: 'all',
      search: ''
    });
    setSort({ field: 'date', direction: 'desc' });
  };

  // Handle activity actions
  const handleViewActivity = (activity: any) => {
    toast({
      title: "Activity Details",
      description: `Viewing details for: ${activity.title}`,
    });
  };

  const handleDownloadCertificate = (activity: any) => {
    toast({
      title: "Certificate Download",
      description: `Downloading certificate for: ${activity.title}`,
    });
  };

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="text-sm font-medium text-foreground">Loading activities...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Unable to Load Activities</h2>
              <p className="text-muted-foreground mb-4">
                There was an error loading your activities. Please try again.
              </p>
              <Button onClick={() => refetch()} data-testid="button-retry-activities">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6" data-testid="main-activities">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground" data-testid="text-activities-title">
                  My Activities
                </h1>
                <p className="text-muted-foreground" data-testid="text-activities-description">
                  View and manage all your academic achievements and extracurricular activities
                </p>
              </div>
            </div>
            <Button 
              onClick={() => setLocation('/upload')}
              data-testid="button-add-new-activity"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Activity
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-foreground" data-testid="stat-total-activities">
                      {stats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-success" data-testid="stat-approved-activities">
                      {stats.approved}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-warning" data-testid="stat-pending-activities">
                      {stats.pending}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-destructive" data-testid="stat-rejected-activities">
                      {stats.rejected}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Skill Credits</p>
                    <p className="text-2xl font-bold text-blue-500" data-testid="stat-total-credits">
                      {stats.totalCredits}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>Filter & Search Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities by title, description, or organization..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="pl-10"
                    data-testid="input-search-activities"
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                    <Select 
                      value={filters.category} 
                      onValueChange={(value) => updateFilter('category', value)}
                    >
                      <SelectTrigger data-testid="select-category-filter">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => updateFilter('status', value)}
                    >
                      <SelectTrigger data-testid="select-status-filter">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Date Range</label>
                    <Select 
                      value={filters.dateRange} 
                      onValueChange={(value) => updateFilter('dateRange', value)}
                    >
                      <SelectTrigger data-testid="select-date-filter">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent>
                        {DATE_RANGE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Credits</label>
                    <Select 
                      value={filters.creditRange} 
                      onValueChange={(value) => updateFilter('creditRange', value)}
                    >
                      <SelectTrigger data-testid="select-credits-filter">
                        <SelectValue placeholder="Select credit range" />
                      </SelectTrigger>
                      <SelectContent>
                        {CREDIT_RANGE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Sort Controls and Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <SortAsc className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Sort by:</span>
                    </div>
                    <Select 
                      value={`${sort.field}-${sort.direction}`}
                      onValueChange={(value) => {
                        const option = SORT_OPTIONS.find(opt => opt.value === value);
                        if (option) updateSort(option.field, option.direction);
                      }}
                    >
                      <SelectTrigger className="w-48" data-testid="select-sort-activities">
                        <SelectValue placeholder="Sort activities" />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={clearAllFilters}
                      data-testid="button-clear-filters"
                    >
                      Clear Filters
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => refetch()}
                      data-testid="button-refresh-activities"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(filters.category !== 'all' || filters.status !== 'all' || filters.dateRange !== 'all' || 
                  filters.creditRange !== 'all' || filters.search) && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                    <span className="text-sm font-medium text-foreground">Active filters:</span>
                    {filters.search && (
                      <Badge variant="secondary" data-testid="badge-search-filter">
                        Search: "{filters.search}"
                      </Badge>
                    )}
                    {filters.category !== 'all' && (
                      <Badge variant="secondary" data-testid="badge-category-filter">
                        {CATEGORY_OPTIONS.find(opt => opt.value === filters.category)?.label}
                      </Badge>
                    )}
                    {filters.status !== 'all' && (
                      <Badge variant="secondary" data-testid="badge-status-filter">
                        {STATUS_OPTIONS.find(opt => opt.value === filters.status)?.label}
                      </Badge>
                    )}
                    {filters.dateRange !== 'all' && (
                      <Badge variant="secondary" data-testid="badge-date-filter">
                        {DATE_RANGE_OPTIONS.find(opt => opt.value === filters.dateRange)?.label}
                      </Badge>
                    )}
                    {filters.creditRange !== 'all' && (
                      <Badge variant="secondary" data-testid="badge-credits-filter">
                        {CREDIT_RANGE_OPTIONS.find(opt => opt.value === filters.creditRange)?.label}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                Showing {filteredAndSortedActivities.length} of {activities.length} activities
              </p>
              {filteredAndSortedActivities.length !== activities.length && (
                <Badge variant="outline" data-testid="badge-filtered-count">
                  {filteredAndSortedActivities.length} filtered
                </Badge>
              )}
            </div>
          </div>

          {/* Activities List */}
          <ActivityList
            activities={filteredAndSortedActivities}
            isLoading={activitiesLoading}
            onViewActivity={handleViewActivity}
            onDownloadCertificate={handleDownloadCertificate}
            data-testid="activities-list-container"
          />
        </main>
      </div>
    </div>
  );
}
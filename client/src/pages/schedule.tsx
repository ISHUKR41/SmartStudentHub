import { useState, useMemo, useCallback } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Calendar as CalendarIcon, Clock, MapPin, User, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import type { Class } from '@shared/schema';

// Initialize moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Days of the week for dropdown
const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

// Recurrence patterns
const recurrencePatterns = [
  { value: 'none', label: 'No Recurrence' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
];

// Color palette for classes
const colorPalette = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
];

// Validation schema for class form
const classFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dayOfWeek: z.string().optional(),
  startDate: z.string().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  room: z.string().optional(),
  instructor: z.string().optional(),
  color: z.string().optional(),
  recurrencePattern: z.string().default('none'),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.recurrencePattern === 'none') {
    return !!data.startDate;
  }
  return !!data.dayOfWeek;
}, {
  message: 'Start date is required for one-time classes, day of week is required for recurring classes',
  path: ['dayOfWeek'],
});

type ClassFormData = z.infer<typeof classFormSchema>;

interface ClassEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
}

export default function Schedule() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [view, setView] = useState<View>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Fetch classes
  const { data: classes = [], isLoading } = useQuery<Class[]>({
    queryKey: ['/api/schedule/classes'],
  });

  // Create class mutation
  const createClassMutation = useMutation({
    mutationFn: async (data: ClassFormData) => {
      return await apiRequest('/api/schedule/classes', 'POST', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/classes'] });
      toast({
        title: 'Success',
        description: 'Class added successfully',
      });
      setIsAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add class',
        variant: 'destructive',
      });
    },
  });

  // Update class mutation
  const updateClassMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ClassFormData> }) => {
      return await apiRequest(`/api/schedule/classes/${id}`, 'PUT', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/classes'] });
      toast({
        title: 'Success',
        description: 'Class updated successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedClass(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update class',
        variant: 'destructive',
      });
    },
  });

  // Delete class mutation
  const deleteClassMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/schedule/classes/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedule/classes'] });
      toast({
        title: 'Success',
        description: 'Class deleted successfully',
      });
      setIsEditDialogOpen(false);
      setSelectedClass(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete class',
        variant: 'destructive',
      });
    },
  });

  // Form for adding classes
  const addForm = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dayOfWeek: '',
      startDate: '',
      startTime: '',
      endTime: '',
      room: '',
      instructor: '',
      color: colorPalette[0],
      recurrencePattern: 'none',
      notes: '',
    },
  });

  // Form for editing classes
  const editForm = useForm<ClassFormData>({
    resolver: zodResolver(classFormSchema),
  });

  // Transform classes to calendar events
  const events: ClassEvent[] = useMemo(() => {
    if (!classes || classes.length === 0) return [];

    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const allEvents: ClassEvent[] = [];
    const today = new Date();
    
    // Generate events for a 6-month range (3 months past, 6 months future)
    const rangeStart = new Date(today);
    rangeStart.setMonth(today.getMonth() - 3);
    rangeStart.setHours(0, 0, 0, 0);
    
    const rangeEnd = new Date(today);
    rangeEnd.setMonth(today.getMonth() + 6);
    rangeEnd.setHours(23, 59, 59, 999);

    classes.forEach((classItem: any) => {
      const [startHour, startMinute] = classItem.startTime.split(':').map(Number);
      const [endHour, endMinute] = classItem.endTime.split(':').map(Number);

      // Handle one-time classes (no recurrence)
      if (classItem.recurrencePattern === 'none') {
        if (classItem.startDate) {
          const eventDate = new Date(classItem.startDate);
          
          const start = new Date(eventDate);
          start.setHours(startHour, startMinute, 0, 0);
          
          const end = new Date(eventDate);
          end.setHours(endHour, endMinute, 0, 0);

          allEvents.push({
            id: `${classItem.id}-${eventDate.toISOString()}`,
            title: classItem.title,
            start,
            end,
            resource: classItem,
          });
        }
        return;
      }

      // Handle recurring classes (weekly/biweekly)
      if (!classItem.dayOfWeek) return;

      const dayIndex = dayMap[classItem.dayOfWeek.toLowerCase()];
      const recurrenceEndDate = classItem.recurrenceEndDate ? new Date(classItem.recurrenceEndDate) : rangeEnd;
      const effectiveEndDate = recurrenceEndDate < rangeEnd ? recurrenceEndDate : rangeEnd;

      // Find the first occurrence of this day in the range
      let currentDate = new Date(rangeStart);
      const currentDay = currentDate.getDay();
      let daysUntil = dayIndex - currentDay;
      if (daysUntil < 0) daysUntil += 7;
      currentDate.setDate(currentDate.getDate() + daysUntil);

      // Generate all occurrences within the date range
      const weekIncrement = classItem.recurrencePattern === 'biweekly' ? 14 : 7;
      
      while (currentDate <= effectiveEndDate) {
        if (currentDate >= rangeStart) {
          const start = new Date(currentDate);
          start.setHours(startHour, startMinute, 0, 0);
          
          const end = new Date(currentDate);
          end.setHours(endHour, endMinute, 0, 0);

          allEvents.push({
            id: `${classItem.id}-${currentDate.toISOString()}`,
            title: classItem.title,
            start,
            end,
            resource: classItem,
          });
        }
        
        currentDate.setDate(currentDate.getDate() + weekIncrement);
      }
    });

    return allEvents;
  }, [classes]);

  // Handle event click
  const handleSelectEvent = useCallback((event: ClassEvent) => {
    setSelectedClass(event.resource);
    editForm.reset({
      title: event.resource.title,
      description: event.resource.description || '',
      dayOfWeek: event.resource.dayOfWeek || '',
      startDate: event.resource.startDate ? new Date(event.resource.startDate).toISOString().split('T')[0] : '',
      startTime: event.resource.startTime,
      endTime: event.resource.endTime,
      room: event.resource.room || '',
      instructor: event.resource.instructor || '',
      color: event.resource.color || colorPalette[0],
      recurrencePattern: event.resource.recurrencePattern || 'none',
      notes: event.resource.notes || '',
    });
    setIsEditDialogOpen(true);
  }, [editForm]);

  // Event style getter
  const eventStyleGetter = useCallback((event: ClassEvent) => {
    return {
      style: {
        backgroundColor: event.resource.color || '#3b82f6',
        borderRadius: '5px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  }, []);

  // Handle form submissions
  const onAddSubmit = (data: ClassFormData) => {
    createClassMutation.mutate(data);
  };

  const onEditSubmit = (data: ClassFormData) => {
    if (selectedClass) {
      updateClassMutation.mutate({ id: selectedClass.id, data });
    }
  };

  const handleDelete = () => {
    if (selectedClass) {
      deleteClassMutation.mutate(selectedClass.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <Skeleton height={40} width={300} />
          <Skeleton height={20} width={400} className="mt-2" />
        </div>
        <Skeleton height={600} />
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
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="schedule-title">
                Class Schedule 📅
              </h1>
              <p className="text-muted-foreground">Manage your weekly class timetable</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-add-class">
                  <Plus className="h-4 w-4" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>Schedule a new class to your timetable</DialogDescription>
                </DialogHeader>
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                    <FormField
                      control={addForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Advanced Mathematics" {...field} data-testid="input-title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Class description..." {...field} data-testid="input-description" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="recurrencePattern"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recurrence *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-recurrence">
                                  <SelectValue placeholder="Select pattern" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {recurrencePatterns.map(pattern => (
                                  <SelectItem key={pattern.value} value={pattern.value}>{pattern.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {addForm.watch('recurrencePattern') === 'none' ? (
                        <FormField
                          control={addForm.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date *</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} data-testid="input-start-date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          control={addForm.control}
                          name="dayOfWeek"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day of Week *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-day">
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {daysOfWeek.map(day => (
                                    <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time *</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-start-time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time *</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} data-testid="input-end-time" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={addForm.control}
                        name="room"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Room/Location</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Room 301" {...field} data-testid="input-room" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="instructor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructor</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Dr. Smith" {...field} data-testid="input-instructor" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={addForm.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <div className="flex gap-2">
                            {colorPalette.map(color => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => field.onChange(color)}
                                className={`w-8 h-8 rounded-full border-2 ${field.value === color ? 'border-foreground' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                data-testid={`color-${color}`}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes..." {...field} data-testid="input-notes" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={createClassMutation.isPending} data-testid="button-save-class">
                        {createClassMutation.isPending ? 'Saving...' : 'Save Class'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Calendar */}
          <Card className="shadow-xl">
            <CardContent className="p-4 md:p-6">
              <div className="schedule-calendar">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  view={view}
                  onView={setView}
                  date={currentDate}
                  onNavigate={setCurrentDate}
                  onSelectEvent={handleSelectEvent}
                  eventPropGetter={eventStyleGetter}
                  views={['month', 'week', 'day']}
                  defaultView="week"
                  step={30}
                  showMultiDayTimes
                  popup
                  data-testid="calendar"
                />
              </div>
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Class</DialogTitle>
                <DialogDescription>Update class details or delete the class</DialogDescription>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Advanced Mathematics" {...field} data-testid="edit-input-title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Class description..." {...field} data-testid="edit-input-description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="recurrencePattern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recurrence *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="edit-select-recurrence">
                                <SelectValue placeholder="Select pattern" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {recurrencePatterns.map(pattern => (
                                <SelectItem key={pattern.value} value={pattern.value}>{pattern.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {editForm.watch('recurrencePattern') === 'none' ? (
                      <FormField
                        control={editForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date *</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} data-testid="edit-input-start-date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <FormField
                        control={editForm.control}
                        name="dayOfWeek"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Day of Week *</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="edit-select-day">
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {daysOfWeek.map(day => (
                                  <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} data-testid="edit-input-start-time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time *</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} data-testid="edit-input-end-time" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room/Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Room 301" {...field} data-testid="edit-input-room" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="instructor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Dr. Smith" {...field} data-testid="edit-input-instructor" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={editForm.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <div className="flex gap-2">
                          {colorPalette.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => field.onChange(color)}
                              className={`w-8 h-8 rounded-full border-2 ${field.value === color ? 'border-foreground' : 'border-transparent'}`}
                              style={{ backgroundColor: color }}
                              data-testid={`edit-color-${color}`}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional notes..." {...field} data-testid="edit-input-notes" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-between gap-3">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={deleteClassMutation.isPending}
                      data-testid="button-delete-class"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deleteClassMutation.isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={updateClassMutation.isPending} data-testid="button-update-class">
                        {updateClassMutation.isPending ? 'Updating...' : 'Update Class'}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          {/* Stats Card */}
          {classes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Overview</CardTitle>
                  <CardDescription>Your weekly class statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">{classes.length}</p>
                      <p className="text-sm text-muted-foreground">Total Classes</p>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {new Set(classes.map((c: any) => c.dayOfWeek)).size}
                      </p>
                      <p className="text-sm text-muted-foreground">Active Days</p>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {classes.filter((c: any) => c.recurrencePattern !== 'none').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Recurring Classes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      <style>{`
        .schedule-calendar .rbc-calendar {
          font-family: inherit;
        }
        .schedule-calendar .rbc-header {
          padding: 10px 3px;
          font-weight: 600;
          border-bottom: 2px solid hsl(var(--border));
        }
        .schedule-calendar .rbc-time-header-content {
          border-left: 1px solid hsl(var(--border));
        }
        .schedule-calendar .rbc-time-content {
          border-top: 1px solid hsl(var(--border));
        }
        .schedule-calendar .rbc-day-slot .rbc-time-slot {
          border-top: 1px solid hsl(var(--border));
        }
        .schedule-calendar .rbc-today {
          background-color: hsl(var(--primary) / 0.05);
        }
        .schedule-calendar .rbc-event {
          padding: 2px 5px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .schedule-calendar .rbc-event:hover {
          opacity: 1 !important;
        }
        .schedule-calendar .rbc-toolbar {
          padding: 10px 0;
          margin-bottom: 10px;
        }
        .schedule-calendar .rbc-toolbar button {
          padding: 8px 15px;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          color: hsl(var(--foreground));
          border-radius: 6px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .schedule-calendar .rbc-toolbar button:hover {
          background: hsl(var(--accent));
        }
        .schedule-calendar .rbc-toolbar button.rbc-active {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
      `}</style>
    </div>
  );
}

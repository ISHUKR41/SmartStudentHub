import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const initialSchedule = [
  { id: 1, day: 'Monday', time: '09:00 AM - 10:30 AM', subject: 'Advanced Mathematics', room: 'Room 301', professor: 'Dr. Smith' },
  { id: 2, day: 'Monday', time: '11:00 AM - 12:30 PM', subject: 'Physics Lab', room: 'Lab B-2', professor: 'Dr. Johnson' },
  { id: 3, day: 'Tuesday', time: '10:00 AM - 11:30 AM', subject: 'Computer Science', room: 'Room 405', professor: 'Dr. Williams' },
  { id: 4, day: 'Wednesday', time: '09:00 AM - 10:30 AM', subject: 'Chemistry', room: 'Lab A-1', professor: 'Dr. Brown' },
  { id: 5, day: 'Thursday', time: '02:00 PM - 03:30 PM', subject: 'English Literature', room: 'Room 201', professor: 'Prof. Davis' },
  { id: 6, day: 'Friday', time: '11:00 AM - 12:30 PM', subject: 'Data Structures', room: 'Room 405', professor: 'Dr. Wilson' },
];

export default function Schedule() {
  const [schedule, setSchedule] = useState(initialSchedule);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredSchedule = schedule.filter(item => item.day === selectedDay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="schedule-title">
                Class Schedule 📅
              </h1>
              <p className="text-muted-foreground">Manage your weekly class timetable</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-add-class">
                  <Plus className="h-4 w-4" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>Schedule a new class to your timetable</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject Name</Label>
                    <Input id="subject" placeholder="e.g., Advanced Mathematics" data-testid="input-subject" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="day">Day</Label>
                    <Select>
                      <SelectTrigger id="day" data-testid="select-day">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input id="start-time" type="time" data-testid="input-start-time" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="end-time">End Time</Label>
                      <Input id="end-time" type="time" data-testid="input-end-time" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="room">Room</Label>
                    <Input id="room" placeholder="e.g., Room 301" data-testid="input-room" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="professor">Professor</Label>
                    <Input id="professor" placeholder="e.g., Dr. Smith" data-testid="input-professor" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)} data-testid="button-save-class">Save Class</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              {daysOfWeek.map((day) => (
                <Button
                  key={day}
                  variant={selectedDay === day ? 'default' : 'outline'}
                  onClick={() => setSelectedDay(day)}
                  className="min-w-[120px]"
                  data-testid={`button-day-${day.toLowerCase()}`}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredSchedule.length > 0 ? (
              filteredSchedule.map((class_, index) => (
                <motion.div
                  key={class_.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow" data-testid={`class-card-${index}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-lg bg-primary/10 flex-shrink-0">
                              <Clock className="h-6 w-6 text-primary mb-1" />
                              <span className="text-xs font-semibold text-center px-1">{class_.time.split(' - ')[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-foreground mb-2">{class_.subject}</h3>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>{class_.time}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{class_.room}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>{class_.professor}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col gap-2">
                          <Button variant="outline" size="sm" className="gap-2" data-testid={`button-edit-${index}`}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive" data-testid={`button-delete-${index}`}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Classes Scheduled</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    You don't have any classes scheduled for {selectedDay}
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-first-class">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Class
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

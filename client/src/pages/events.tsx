import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Star, Plus, Heart, Share2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const events = [
  {
    id: 1,
    title: 'Tech Fest 2024',
    description: 'Annual technology festival featuring hackathons, workshops, and tech talks',
    date: '2024-10-20',
    time: '09:00 AM - 06:00 PM',
    venue: 'Main Auditorium',
    organizer: 'Computer Science Department',
    participants: 450,
    category: 'Technical',
    status: 'upcoming',
    registered: false,
  },
  {
    id: 2,
    title: 'Cultural Night',
    description: 'An evening of music, dance, and cultural performances',
    date: '2024-10-15',
    time: '06:00 PM - 10:00 PM',
    venue: 'Open Air Theatre',
    organizer: 'Cultural Committee',
    participants: 320,
    category: 'Cultural',
    status: 'upcoming',
    registered: true,
  },
  {
    id: 3,
    title: 'Career Guidance Workshop',
    description: 'Expert guidance on career planning and interview preparation',
    date: '2024-10-10',
    time: '02:00 PM - 05:00 PM',
    venue: 'Seminar Hall',
    organizer: 'Placement Cell',
    participants: 180,
    category: 'Workshop',
    status: 'upcoming',
    registered: true,
  },
  {
    id: 4,
    title: 'Sports Day 2024',
    description: 'Inter-department sports competition with various athletic events',
    date: '2024-09-28',
    time: '08:00 AM - 05:00 PM',
    venue: 'Sports Ground',
    organizer: 'Sports Committee',
    participants: 520,
    category: 'Sports',
    status: 'completed',
    registered: true,
  },
  {
    id: 5,
    title: 'Science Exhibition',
    description: 'Showcase of innovative science projects and research work',
    date: '2024-09-25',
    time: '10:00 AM - 04:00 PM',
    venue: 'Exhibition Hall',
    organizer: 'Science Club',
    participants: 280,
    category: 'Academic',
    status: 'completed',
    registered: false,
  },
];

export default function Events() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredEvents = events.filter(e => e.status === activeTab);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Cultural': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Workshop': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Sports': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Academic': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="events-title">
                Campus Events 🎉
              </h1>
              <p className="text-muted-foreground">Discover and participate in campus activities</p>
            </div>
            <Button className="gap-2" data-testid="button-create-event">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6" data-testid="tabs-list">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full" data-testid={`event-card-${index}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-xl">{event.title}</CardTitle>
                            </div>
                            <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(event.id)}
                            data-testid={`button-favorite-${index}`}
                          >
                            <Heart
                              className={`h-5 w-5 ${favorites.includes(event.id) ? 'fill-red-500 text-red-500' : ''}`}
                            />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(event.category)} variant="outline">
                              {event.category}
                            </Badge>
                            {event.registered && (
                              <Badge className="bg-green-500/10 text-green-600 border-green-500/20" variant="outline">
                                Registered
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{event.participants} participants</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground mb-3">
                              Organized by <span className="font-medium text-foreground">{event.organizer}</span>
                            </p>

                            {event.status === 'upcoming' && (
                              <div className="flex gap-2">
                                {!event.registered ? (
                                  <Button className="flex-1" data-testid={`button-register-${index}`}>
                                    Register Now
                                  </Button>
                                ) : (
                                  <Button variant="outline" className="flex-1" data-testid={`button-view-details-${index}`}>
                                    View Details
                                  </Button>
                                )}
                                <Button variant="outline" size="icon" data-testid={`button-share-${index}`}>
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}

                            {event.status === 'completed' && (
                              <div className="flex gap-2">
                                <Button variant="outline" className="flex-1" data-testid={`button-gallery-${index}`}>
                                  View Gallery
                                </Button>
                                <Button variant="outline" className="flex-1" data-testid={`button-highlights-${index}`}>
                                  Highlights
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredEvents.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Events Found</h3>
                    <p className="text-muted-foreground text-center">
                      {activeTab === 'upcoming' ? 'No upcoming events scheduled' : 'No past events to display'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

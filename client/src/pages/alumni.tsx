import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Calendar,
  GraduationCap,
  Building2,
  TrendingUp,
  Award,
  ExternalLink,
  MessageSquare,
  Video,
  DollarSign,
  Heart,
  Share2
} from 'lucide-react';
import CountUp from 'react-countup';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const alumniData = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    batch: '2018-2022',
    degree: 'B.Tech CSE',
    company: 'Google India',
    position: 'Software Engineer III',
    location: 'Bangalore, India',
    email: 'rajesh.k@gmail.com',
    phone: '+91 98765 43210',
    linkedIn: 'linkedin.com/in/rajeshkumar',
    expertise: ['AI/ML', 'Cloud Computing', 'Data Science'],
    mentorship: 'Available',
    avatar: ''
  },
  {
    id: 2,
    name: 'Priya Sharma',
    batch: '2017-2021',
    degree: 'B.Tech ECE',
    company: 'Microsoft',
    position: 'Senior Developer',
    location: 'Hyderabad, India',
    email: 'priya.sharma@outlook.com',
    phone: '+91 98123 45678',
    linkedIn: 'linkedin.com/in/priyasharma',
    expertise: ['IoT', 'Embedded Systems', 'Hardware Design'],
    mentorship: 'Available',
    avatar: ''
  },
  {
    id: 3,
    name: 'Amit Patel',
    batch: '2019-2023',
    degree: 'B.Tech Mechanical',
    company: 'Tesla',
    position: 'Mechanical Engineer',
    location: 'California, USA',
    email: 'amit.p@tesla.com',
    phone: '+1 555-0123',
    linkedIn: 'linkedin.com/in/amitpatel',
    expertise: ['Automotive', 'CAD/CAM', 'Manufacturing'],
    mentorship: 'Limited',
    avatar: ''
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    batch: '2016-2020',
    degree: 'MBA',
    company: 'Amazon',
    position: 'Product Manager',
    location: 'Seattle, USA',
    email: 'sneha.reddy@amazon.com',
    phone: '+1 555-0456',
    linkedIn: 'linkedin.com/in/snehareddy',
    expertise: ['Product Management', 'Strategy', 'Analytics'],
    mentorship: 'Available',
    avatar: ''
  },
];

const statsData = [
  { year: '2018', alumni: 120, employed: 110, pursuing: 10 },
  { year: '2019', alumni: 135, employed: 125, pursuing: 10 },
  { year: '2020', alumni: 148, employed: 138, pursuing: 10 },
  { year: '2021', alumni: 162, employed: 150, pursuing: 12 },
  { year: '2022', alumni: 175, employed: 165, pursuing: 10 },
  { year: '2023', alumni: 190, employed: 178, pursuing: 12 },
];

const industryData = [
  { name: 'IT/Software', value: 45, color: '#3b82f6' },
  { name: 'Core Engineering', value: 25, color: '#10b981' },
  { name: 'Business/Management', value: 15, color: '#f59e0b' },
  { name: 'Higher Studies', value: 10, color: '#8b5cf6' },
  { name: 'Others', value: 5, color: '#6b7280' },
];

const topCompanies = [
  { name: 'Google', count: 28 },
  { name: 'Microsoft', count: 25 },
  { name: 'Amazon', count: 22 },
  { name: 'TCS', count: 20 },
  { name: 'Infosys', count: 18 },
  { name: 'Wipro', count: 15 },
];

export default function Alumni() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedDegree, setSelectedDegree] = useState('All Degrees');
  const [activeTab, setActiveTab] = useState('directory');

  const filteredAlumni = alumniData.filter(alumni => {
    const matchesSearch = alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alumni.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBatch = selectedBatch === 'All Batches' || alumni.batch === selectedBatch;
    const matchesDegree = selectedDegree === 'All Degrees' || alumni.degree === selectedDegree;
    return matchesSearch && matchesBatch && matchesDegree;
  });

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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="alumni-title">
                Alumni Network 🎓
              </h1>
              <p className="text-muted-foreground">Connect with our successful graduates worldwide</p>
            </div>
            <Button className="gap-2" data-testid="button-add-alumni">
              <UserPlus className="h-4 w-4" />
              Add Alumni
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="border-l-4 border-l-blue-500" data-testid="stat-total-alumni">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Alumni</p>
                      <p className="text-3xl font-bold text-blue-600">
                        <CountUp end={950} duration={2} />
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="border-l-4 border-l-green-500" data-testid="stat-employed">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Employed</p>
                      <p className="text-3xl font-bold text-green-600">
                        <CountUp end={886} duration={2} />
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                      <Briefcase className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="border-l-4 border-l-purple-500" data-testid="stat-mentors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Mentors</p>
                      <p className="text-3xl font-bold text-purple-600">
                        <CountUp end={124} duration={2} />
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className="border-l-4 border-l-orange-500" data-testid="stat-global">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Countries</p>
                      <p className="text-3xl font-bold text-orange-600">
                        <CountUp end={32} duration={2} />
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="directory" data-testid="tab-directory">Alumni Directory</TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
              <TabsTrigger value="events" data-testid="tab-events">Events</TabsTrigger>
              <TabsTrigger value="donations" data-testid="tab-donations">Contributions</TabsTrigger>
            </TabsList>

            {/* Alumni Directory Tab */}
            <TabsContent value="directory" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Find Alumni
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, company, or position..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                        data-testid="input-alumni-search"
                      />
                    </div>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger className="w-full md:w-48" data-testid="select-batch">
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Batches">All Batches</SelectItem>
                        <SelectItem value="2018-2022">2018-2022</SelectItem>
                        <SelectItem value="2017-2021">2017-2021</SelectItem>
                        <SelectItem value="2019-2023">2019-2023</SelectItem>
                        <SelectItem value="2016-2020">2016-2020</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedDegree} onValueChange={setSelectedDegree}>
                      <SelectTrigger className="w-full md:w-48" data-testid="select-degree">
                        <SelectValue placeholder="Select Degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Degrees">All Degrees</SelectItem>
                        <SelectItem value="B.Tech CSE">B.Tech CSE</SelectItem>
                        <SelectItem value="B.Tech ECE">B.Tech ECE</SelectItem>
                        <SelectItem value="B.Tech Mechanical">B.Tech Mechanical</SelectItem>
                        <SelectItem value="MBA">MBA</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Alumni Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredAlumni.map((alumni, index) => (
                    <motion.div
                      key={alumni.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid={`alumni-card-${alumni.id}`}>
                        <CardHeader className="pb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 ring-4 ring-primary/10">
                              <AvatarImage src={alumni.avatar} />
                              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                                {alumni.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg truncate" data-testid={`text-alumni-name-${alumni.id}`}>{alumni.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <GraduationCap className="h-3 w-3" />
                                {alumni.degree} • {alumni.batch}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-medium truncate">{alumni.company}</p>
                                <p className="text-muted-foreground truncate">{alumni.position}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{alumni.location}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {alumni.expertise.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t">
                            <Badge variant={alumni.mentorship === 'Available' ? 'default' : 'outline'} className="text-xs">
                              {alumni.mentorship === 'Available' ? 'Available for Mentorship' : 'Limited Availability'}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 gap-2" data-testid={`button-contact-${alumni.id}`}>
                              <Mail className="h-4 w-4" />
                              Contact
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 gap-2" data-testid={`button-linkedin-${alumni.id}`}>
                              <ExternalLink className="h-4 w-4" />
                              LinkedIn
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredAlumni.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">No alumni found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search criteria or filters
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alumni Growth Trend</CardTitle>
                    <CardDescription>Year-wise alumni statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={statsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="alumni" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="employed" stroke="#10b981" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Industry Distribution</CardTitle>
                    <CardDescription>Alumni by industry sectors</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={industryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {industryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Recruiting Companies</CardTitle>
                  <CardDescription>Companies with most alumni placements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topCompanies}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Events Tab */}
            <TabsContent value="events" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Alumni Events
                    </span>
                    <Button size="sm" data-testid="button-create-event">Create Event</Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'Annual Alumni Meet 2024', date: 'Dec 15, 2024', attendees: 250, type: 'Reunion' },
                      { title: 'Tech Talk: AI in Industry', date: 'Dec 20, 2024', attendees: 150, type: 'Webinar' },
                      { title: 'Career Mentorship Program', date: 'Jan 5, 2025', attendees: 80, type: 'Workshop' },
                    ].map((event, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all"
                        data-testid={`event-${idx}`}
                      >
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <Calendar className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg mb-1">{event.title}</h4>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {event.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {event.attendees} registered
                              </span>
                              <Badge variant="outline">{event.type}</Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-register-${idx}`}>
                          Register
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Contributions</p>
                        <p className="text-3xl font-bold text-green-600">
                          ₹<CountUp end={2450000} duration={2} separator="," />
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Contributors</p>
                        <p className="text-3xl font-bold text-blue-600">
                          <CountUp end={342} duration={2} />
                        </p>
                      </div>
                      <Heart className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Campaigns</p>
                        <p className="text-3xl font-bold text-purple-600">
                          <CountUp end={8} duration={2} />
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Active Contribution Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: 'New Computer Lab', goal: 1000000, raised: 750000, donors: 145 },
                      { title: 'Student Scholarship Fund', goal: 500000, raised: 380000, donors: 89 },
                      { title: 'Library Expansion', goal: 800000, raised: 520000, donors: 112 },
                    ].map((campaign, idx) => (
                      <div key={idx} className="p-4 border rounded-lg space-y-3" data-testid={`campaign-${idx}`}>
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-lg">{campaign.title}</h4>
                          <Badge variant="secondary">{campaign.donors} donors</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">
                              ₹{campaign.raised.toLocaleString()} / ₹{campaign.goal.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(campaign.raised / campaign.goal) * 100}%` }}
                              transition={{ duration: 1, delay: idx * 0.2 }}
                              className="bg-primary h-2 rounded-full"
                            />
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" data-testid={`button-contribute-${idx}`}>
                          Contribute Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

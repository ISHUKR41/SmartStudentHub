import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Bell, AlertTriangle, Info, CheckCircle, Calendar, Search, Pin, Archive } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const notices = [
  {
    id: 1,
    title: 'Mid-Term Examination Schedule Released',
    content: 'The mid-term examination schedule has been published. Students are advised to check their individual timetables on the portal.',
    date: '2024-10-01',
    category: 'Examinations',
    priority: 'high',
    author: 'Examination Cell',
    pinned: true,
    read: false,
  },
  {
    id: 2,
    title: 'Library Timings Extended',
    content: 'Due to upcoming examinations, library timings have been extended. New timings: 7:00 AM to 11:00 PM',
    date: '2024-09-30',
    category: 'General',
    priority: 'medium',
    author: 'Library Administration',
    pinned: true,
    read: false,
  },
  {
    id: 3,
    title: 'Scholarship Application Deadline',
    content: 'Last date to apply for merit-cum-means scholarships is October 10, 2024. Submit applications to the accounts section.',
    date: '2024-09-29',
    category: 'Financial',
    priority: 'high',
    author: 'Accounts Department',
    pinned: false,
    read: true,
  },
  {
    id: 4,
    title: 'Tech Fest Registration Open',
    content: 'Registration for annual Tech Fest 2024 is now open. Limited slots available for hackathon and project exhibitions.',
    date: '2024-09-28',
    category: 'Events',
    priority: 'medium',
    author: 'Cultural Committee',
    pinned: false,
    read: true,
  },
  {
    id: 5,
    title: 'Holiday Announcement',
    content: 'The college will remain closed on October 12, 2024, on account of festival holidays.',
    date: '2024-09-27',
    category: 'Holiday',
    priority: 'low',
    author: 'Administration',
    pinned: false,
    read: true,
  },
  {
    id: 6,
    title: 'Placement Drive Schedule',
    content: 'Major IT companies will be visiting campus for placement drives from October 15-25. Eligible students must register.',
    date: '2024-09-26',
    category: 'Placements',
    priority: 'high',
    author: 'Placement Cell',
    pinned: false,
    read: false,
  },
];

export default function Notices() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                       (activeTab === 'unread' && !notice.read) ||
                       (activeTab === 'read' && notice.read) ||
                       (activeTab === 'pinned' && notice.pinned);
    return matchesSearch && matchesTab;
  });

  const pinnedNotices = filteredNotices.filter(n => n.pinned);
  const regularNotices = filteredNotices.filter(n => !n.pinned);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          className: 'bg-red-500/10 text-red-600 border-red-500/20',
          label: 'Urgent'
        };
      case 'medium':
        return {
          icon: <Info className="h-4 w-4" />,
          className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
          label: 'Important'
        };
      case 'low':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          label: 'Info'
        };
      default:
        return {
          icon: <Info className="h-4 w-4" />,
          className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
          label: 'Notice'
        };
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Examinations': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Financial': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Events': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Holiday': return 'bg-pink-500/10 text-pink-600 border-pink-500/20';
      case 'Placements': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const NoticeCard = ({ notice, index }: { notice: typeof notices[0], index: number }) => {
    const priorityConfig = getPriorityConfig(notice.priority);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card 
          className={`hover:shadow-lg transition-shadow ${!notice.read ? 'border-primary' : ''}`}
          data-testid={`notice-card-${index}`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {notice.pinned && <Pin className="h-4 w-4 text-primary" />}
                  <CardTitle className="text-lg">{notice.title}</CardTitle>
                </div>
                <CardDescription>{notice.content}</CardDescription>
              </div>
              {!notice.read && (
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={priorityConfig.className} variant="outline">
                <span className="flex items-center gap-1">
                  {priorityConfig.icon}
                  {priorityConfig.label}
                </span>
              </Badge>
              <Badge className={getCategoryColor(notice.category)} variant="outline">
                {notice.category}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>{notice.date}</span>
              </div>
              <span>By {notice.author}</span>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${index}`}>
                View Full Notice
              </Button>
              <Button variant="outline" size="sm" data-testid={`button-archive-${index}`}>
                <Archive className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="notices-title">
              Notices & Announcements 📢
            </h1>
            <p className="text-muted-foreground">Stay updated with important announcements</p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6" data-testid="tabs-list">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="pinned">Pinned</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {pinnedNotices.length > 0 && activeTab === 'all' && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Pin className="h-5 w-5 text-primary" />
                    Pinned Notices
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {pinnedNotices.map((notice, index) => (
                      <NoticeCard key={notice.id} notice={notice} index={index} />
                    ))}
                  </div>
                </div>
              )}

              {regularNotices.length > 0 && (
                <div>
                  {activeTab === 'all' && <h2 className="text-lg font-semibold mb-4">All Notices</h2>}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {regularNotices.map((notice, index) => (
                      <NoticeCard key={notice.id} notice={notice} index={index + pinnedNotices.length} />
                    ))}
                  </div>
                </div>
              )}

              {filteredNotices.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Bell className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Notices Found</h3>
                    <p className="text-muted-foreground text-center">
                      {searchQuery ? 'Try adjusting your search query' : `No ${activeTab} notices to display`}
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

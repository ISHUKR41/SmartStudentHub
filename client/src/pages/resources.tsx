import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Eye, Search, BookOpen, Video, FileCode, Image, Plus, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const resources = [
  {
    id: 1,
    title: 'Data Structures Complete Notes',
    type: 'PDF',
    subject: 'Computer Science',
    size: '5.2 MB',
    uploadedBy: 'Dr. Smith',
    uploadDate: '2024-09-28',
    downloads: 245,
    category: 'notes',
  },
  {
    id: 2,
    title: 'Calculus Video Lecture - Integration',
    type: 'Video',
    subject: 'Mathematics',
    size: '128 MB',
    uploadedBy: 'Prof. Johnson',
    uploadDate: '2024-09-27',
    downloads: 189,
    category: 'videos',
  },
  {
    id: 3,
    title: 'Binary Search Tree Implementation',
    type: 'Code',
    subject: 'Computer Science',
    size: '15 KB',
    uploadedBy: 'Dr. Wilson',
    uploadDate: '2024-09-26',
    downloads: 156,
    category: 'code',
  },
  {
    id: 4,
    title: 'Periodic Table High Resolution',
    type: 'Image',
    subject: 'Chemistry',
    size: '2.8 MB',
    uploadedBy: 'Dr. Brown',
    uploadDate: '2024-09-25',
    downloads: 312,
    category: 'images',
  },
  {
    id: 5,
    title: 'Physics Lab Manual 2024',
    type: 'PDF',
    subject: 'Physics',
    size: '8.5 MB',
    uploadedBy: 'Prof. Davis',
    uploadDate: '2024-09-24',
    downloads: 198,
    category: 'books',
  },
  {
    id: 6,
    title: 'Python Programming Tutorial Series',
    type: 'Video',
    subject: 'Computer Science',
    size: '450 MB',
    uploadedBy: 'Dr. Smith',
    uploadDate: '2024-09-23',
    downloads: 278,
    category: 'videos',
  },
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [activeTab, setActiveTab] = useState('all');

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All Subjects' || resource.subject === selectedSubject;
    const matchesTab = activeTab === 'all' || resource.category === activeTab;
    return matchesSearch && matchesSubject && matchesTab;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
      case 'Video': return <Video className="h-5 w-5 text-purple-500" />;
      case 'Code': return <FileCode className="h-5 w-5 text-blue-500" />;
      case 'Image': return <Image className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5" />;
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="resources-title">
                Study Resources 📚
              </h1>
              <p className="text-muted-foreground">Access notes, videos, and study materials</p>
            </div>
            <Button className="gap-2" data-testid="button-upload">
              <Upload className="h-4 w-4" />
              Upload Resource
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-subject">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Subjects">All Subjects</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6" data-testid="tabs-list">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full" data-testid={`resource-card-${index}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-muted">
                              {getIcon(resource.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base line-clamp-2">{resource.title}</CardTitle>
                              <CardDescription className="mt-1">{resource.subject}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Size:</span>
                            <span className="font-medium">{resource.size}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Uploaded by:</span>
                            <span className="font-medium">{resource.uploadedBy}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Downloads:</span>
                            <span className="font-medium">{resource.downloads}</span>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button className="flex-1 gap-2" size="sm" data-testid={`button-download-${index}`}>
                              <Download className="h-3 w-3" />
                              Download
                            </Button>
                            <Button variant="outline" className="flex-1 gap-2" size="sm" data-testid={`button-view-${index}`}>
                              <Eye className="h-3 w-3" />
                              Preview
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredResources.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Resources Found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Try adjusting your search or filters
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

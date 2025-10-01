import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Phone, MapPin, Plus, Calendar, Tag } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const items = [
  {
    id: 1,
    title: 'Black Backpack',
    description: 'Black Nike backpack with laptop compartment, found near library',
    category: 'Bags',
    location: 'Library - 2nd Floor',
    date: '2024-10-01',
    status: 'Lost',
    contactName: 'Rahul Sharma',
    contactPhone: '+91 98765 43210',
  },
  {
    id: 2,
    title: 'Scientific Calculator',
    description: 'Casio fx-991EX calculator with name sticker',
    category: 'Electronics',
    location: 'Room 301',
    date: '2024-09-30',
    status: 'Found',
    contactName: 'Admin Office',
    contactPhone: '+91 98765 43211',
  },
  {
    id: 3,
    title: 'Blue Water Bottle',
    description: 'Milton blue water bottle with college sticker',
    category: 'Personal Items',
    location: 'Cafeteria',
    date: '2024-09-30',
    status: 'Found',
    contactName: 'Cafeteria Staff',
    contactPhone: '+91 98765 43212',
  },
  {
    id: 4,
    title: 'ID Card - Student',
    description: 'Student ID card belonging to Engineering department',
    category: 'Documents',
    location: 'Sports Ground',
    date: '2024-09-29',
    status: 'Lost',
    contactName: 'Priya Singh',
    contactPhone: '+91 98765 43213',
  },
  {
    id: 5,
    title: 'Textbook - Data Structures',
    description: 'Data Structures and Algorithms by Cormen',
    category: 'Books',
    location: 'Computer Lab',
    date: '2024-09-28',
    status: 'Found',
    contactName: 'Lab Assistant',
    contactPhone: '+91 98765 43214',
  },
];

export default function LostFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || item.status.toLowerCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Bags': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Electronics': return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
      case 'Personal Items': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Documents': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'Books': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="lost-found-title">
                Lost & Found 🔍
              </h1>
              <p className="text-muted-foreground">Find your lost items or report found items</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" data-testid="button-report-item">
                  <Plus className="h-4 w-4" />
                  Report Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Report Lost/Found Item</DialogTitle>
                  <DialogDescription>Help others find their belongings</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select>
                      <SelectTrigger id="status" data-testid="select-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lost">Lost</SelectItem>
                        <SelectItem value="found">Found</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="item-title">Item Title</Label>
                    <Input id="item-title" placeholder="e.g., Black Backpack" data-testid="input-title" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Provide detailed description" data-testid="textarea-description" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category" data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="personal">Personal Items</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Where was it lost/found?" data-testid="input-location" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input id="contact" type="tel" placeholder="+91 98765 43210" data-testid="input-contact" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={() => setIsDialogOpen(false)} data-testid="button-submit-report">Submit Report</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lost or found items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6" data-testid="tabs-list">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="lost">Lost</TabsTrigger>
              <TabsTrigger value="found">Found</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full" data-testid={`item-card-${index}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <Badge variant={item.status === 'Lost' ? 'destructive' : 'default'}>
                            {item.status}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Badge className={getCategoryColor(item.category)} variant="outline">
                            <Tag className="h-3 w-3 mr-1" />
                            {item.category}
                          </Badge>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{item.date}</span>
                            </div>
                          </div>

                          <div className="pt-3 border-t">
                            <p className="text-sm font-medium mb-1">Contact Details:</p>
                            <p className="text-sm text-muted-foreground">{item.contactName}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Phone className="h-3 w-3" />
                              <span>{item.contactPhone}</span>
                            </div>
                          </div>

                          <Button variant="outline" className="w-full gap-2" data-testid={`button-contact-${index}`}>
                            <Phone className="h-4 w-4" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Package className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Items Found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      {searchQuery ? 'Try adjusting your search query' : `No ${activeTab === 'all' ? '' : activeTab} items to display`}
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)} data-testid="button-report-first">
                      <Plus className="h-4 w-4 mr-2" />
                      Report an Item
                    </Button>
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

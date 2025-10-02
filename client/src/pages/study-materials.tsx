import { useState } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Download,
  Upload,
  FolderOpen,
  Search,
  Filter,
  Star,
  Eye,
  Share2,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const materials = [
  {
    id: 1,
    title: "CS101 Lecture Notes - Week 1",
    type: "PDF",
    size: "2.5 MB",
    course: "Computer Science",
    uploaded: "2024-10-01",
    downloads: 45,
    category: "Lecture Notes",
  },
  {
    id: 2,
    title: "Math201 Problem Set 3",
    type: "PDF",
    size: "1.2 MB",
    course: "Mathematics",
    uploaded: "2024-10-02",
    downloads: 32,
    category: "Assignments",
  },
  {
    id: 3,
    title: "Physics Lab Manual",
    type: "PDF",
    size: "5.8 MB",
    course: "Physics",
    uploaded: "2024-09-28",
    downloads: 78,
    category: "Lab Manual",
  },
  {
    id: 4,
    title: "English Literature Notes",
    type: "DOCX",
    size: "890 KB",
    course: "English",
    uploaded: "2024-10-03",
    downloads: 23,
    category: "Study Material",
  },
];

export default function StudyMaterials() {
  const [searchQuery, setSearchQuery] = useState("");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => console.log(acceptedFiles),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Study Materials
            </h1>
            <p className="text-muted-foreground mt-2">
              Access and manage your course materials
            </p>
          </div>
        </div>

        {/* Upload Zone */}
        <Card>
          <CardContent className="pt-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Files", value: "45", color: "blue" },
            { label: "This Week", value: "8", color: "green" },
            { label: "Total Size", value: "120 MB", color: "orange" },
            { label: "Downloads", value: "234", color: "purple" },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}>
              <Card className={`border-l-4 border-l-${stat.color}-500`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Materials List */}
        <div className="space-y-4">
          {materials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{material.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{material.course}</span>
                          <span>•</span>
                          <span>{material.size}</span>
                          <span>•</span>
                          <span>{material.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

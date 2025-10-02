import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Download,
  Share2,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
  Trophy,
  Star,
  Calendar,
  FileText,
  Code,
  Palette,
  Target,
  CheckCircle,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CountUp from 'react-countup';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';

const skillsData = [
  { skill: 'Programming', value: 90, fullMark: 100 },
  { skill: 'Problem Solving', value: 85, fullMark: 100 },
  { skill: 'Communication', value: 80, fullMark: 100 },
  { skill: 'Leadership', value: 75, fullMark: 100 },
  { skill: 'Teamwork', value: 88, fullMark: 100 },
  { skill: 'Creativity', value: 82, fullMark: 100 },
];

const academicPerformance = [
  { semester: 'Sem 1', gpa: 8.5 },
  { semester: 'Sem 2', gpa: 8.7 },
  { semester: 'Sem 3', gpa: 9.0 },
  { semester: 'Sem 4', gpa: 8.9 },
  { semester: 'Sem 5', gpa: 9.2 },
  { semester: 'Sem 6', gpa: 9.1 },
];

const achievements = [
  {
    id: 1,
    title: 'Best Project Award',
    category: 'Academic',
    date: '2025-09-15',
    icon: Award,
    description: 'Received best project award in Computer Science department',
  },
  {
    id: 2,
    title: 'AWS Certified Solutions Architect',
    category: 'Certification',
    date: '2025-08-20',
    icon: GraduationCap,
    description: 'Successfully completed AWS certification exam',
  },
  {
    id: 3,
    title: 'National Hackathon Winner',
    category: 'Competition',
    date: '2025-07-10',
    icon: Trophy,
    description: 'First place in Smart India Hackathon 2025',
  },
  {
    id: 4,
    title: 'Google Summer Internship',
    category: 'Internship',
    date: '2025-06-01',
    icon: Briefcase,
    description: '3-month internship at Google headquarters',
  },
];

const projects = [
  {
    id: 1,
    title: 'AI-Powered Study Assistant',
    description: 'Developed an intelligent study assistant using machine learning to help students organize and optimize their learning',
    technologies: ['React', 'Python', 'TensorFlow', 'Node.js'],
    link: 'https://github.com/student/ai-study-assistant',
  },
  {
    id: 2,
    title: 'Campus Connect Platform',
    description: 'Built a comprehensive platform connecting students, faculty, and alumni for better collaboration',
    technologies: ['Next.js', 'PostgreSQL', 'GraphQL', 'Redis'],
    link: 'https://github.com/student/campus-connect',
  },
  {
    id: 3,
    title: 'Smart Attendance System',
    description: 'Created an automated attendance system using facial recognition and QR codes',
    technologies: ['OpenCV', 'FastAPI', 'React Native', 'MongoDB'],
    link: 'https://github.com/student/smart-attendance',
  },
];

export default function DigitalPortfolio() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('professional');

  const handleExportPDF = async () => {
    setIsExporting(true);
    toast({
      title: 'Generating PDF...',
      description: 'Please wait while we create your portfolio',
    });

    try {
      const element = document.getElementById('portfolio-content');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${user?.firstName}_${user?.lastName}_Portfolio.pdf`);

      toast({
        title: 'Success!',
        description: 'Your portfolio has been exported as PDF',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'There was an error exporting your portfolio',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/portfolio/${user?.id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link Copied!',
      description: 'Portfolio link has been copied to clipboard',
    });
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
                Digital Portfolio 📄
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Your comprehensive professional portfolio
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedTheme} onValueChange={setSelectedTheme}>
                <SelectTrigger className="w-[150px]" data-testid="select-theme">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                className="gap-2"
                onClick={handleShare}
                data-testid="button-share"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>

              <Button 
                className="gap-2 bg-gradient-to-r from-primary to-primary/80"
                onClick={handleExportPDF}
                disabled={isExporting}
                data-testid="button-export-pdf"
              >
                <Download className="h-4 w-4" />
                {isExporting ? 'Exporting...' : 'Export PDF'}
              </Button>
            </div>
          </div>

          <div id="portfolio-content" className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10" data-testid="card-personal-info">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl font-bold text-primary-foreground">
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-4">
                      Computer Science Engineering | Class of 2026
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>Mumbai, Maharashtra</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 flex items-center gap-2 justify-center px-4 py-2">
                      <TrendingUp className="h-4 w-4" />
                      CGPA: <CountUp end={9.1} decimals={1} duration={2} />
                    </Badge>
                    <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 flex items-center gap-2 justify-center px-4 py-2">
                      <Star className="h-4 w-4" />
                      <CountUp end={63} duration={2} /> Activities
                    </Badge>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Career Objective
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Motivated Computer Science student with a passion for artificial intelligence and full-stack development. 
                    Seeking opportunities to apply my technical skills and innovative thinking to solve real-world problems. 
                    Experienced in leading projects and collaborating with diverse teams to deliver high-impact solutions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow" data-testid="card-quick-stats">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Total Projects', value: 15, icon: Code, color: 'text-blue-500' },
                    { label: 'Certifications', value: 8, icon: Award, color: 'text-green-500' },
                    { label: 'Competitions Won', value: 5, icon: Trophy, color: 'text-yellow-500' },
                    { label: 'Internships', value: 2, icon: Briefcase, color: 'text-purple-500' },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="text-xl font-bold">
                        <CountUp end={stat.value} duration={2} />
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 hover:shadow-lg transition-shadow" data-testid="card-academic-performance">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Academic Performance
                  </CardTitle>
                  <CardDescription>Semester-wise GPA progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={academicPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.1} />
                      <XAxis dataKey="semester" stroke="#888" />
                      <YAxis domain={[0, 10]} stroke="#888" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="gpa" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-skills">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Skills & Competencies
                </CardTitle>
                <CardDescription>Professional and technical skill assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="radar" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="radar" data-testid="tab-radar">Radar View</TabsTrigger>
                    <TabsTrigger value="list" data-testid="tab-list">List View</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="radar">
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={skillsData}>
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis dataKey="skill" stroke="#888" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#888" />
                        <Radar 
                          name="Skills" 
                          dataKey="value" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.6} 
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  
                  <TabsContent value="list" className="space-y-4">
                    {skillsData.map((skill, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{skill.skill}</span>
                          <span className="text-sm text-muted-foreground">{skill.value}%</span>
                        </div>
                        <Progress value={skill.value} className="h-2" />
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                <div>
                  <h4 className="font-semibold mb-4">Technical Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 
                      'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Git', 'TensorFlow',
                      'Machine Learning', 'Data Structures', 'Algorithms', 'System Design'
                    ].map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-achievements">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Achievements & Recognitions
                </CardTitle>
                <CardDescription>Major accomplishments and awards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      data-testid={`achievement-${achievement.id}`}
                    >
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <achievement.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                          <Badge variant="secondary">{achievement.category}</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(achievement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-projects">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Featured Projects
                </CardTitle>
                <CardDescription>Showcase of technical projects and contributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project) => (
                    <div 
                      key={project.id} 
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-muted/30 to-muted/50"
                      data-testid={`project-${project.id}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold">{project.title}</h4>
                        <Button variant="ghost" size="sm" className="gap-2" data-testid={`button-view-project-${project.id}`}>
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                      <p className="text-muted-foreground mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-primary/5 to-primary/10" data-testid="card-footer">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Generated on {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  This is an auto-generated portfolio from Smart Student Hub
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

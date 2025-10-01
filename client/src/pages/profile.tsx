import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, GraduationCap, Edit, Save, X, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: '123 College Street, City, State',
    bio: 'Computer Science student passionate about coding and technology',
    department: 'Computer Science',
    year: '3rd Year',
    semester: '5th Semester',
    registrationNo: 'CS2021001',
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: '+91 98765 43210',
      address: '123 College Street, City, State',
      bio: 'Computer Science student passionate about coding and technology',
      department: 'Computer Science',
      year: '3rd Year',
      semester: '5th Semester',
      registrationNo: 'CS2021001',
    });
    setIsEditing(false);
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
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="profile-title">
                My Profile 👤
              </h1>
              <p className="text-muted-foreground">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="gap-2" data-testid="button-edit">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="gap-2" data-testid="button-save">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" className="gap-2" data-testid="button-cancel">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card data-testid="card-avatar">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-3xl">
                          {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                          data-testid="button-change-photo"
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mt-4">
                      {formData.firstName} {formData.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                    <Badge className="mt-3">Student</Badge>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{formData.department}</p>
                        <p className="text-muted-foreground text-xs">{formData.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Reg. No.</p>
                        <p className="text-muted-foreground text-xs">{formData.registrationNo}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6" data-testid="card-stats">
                <CardHeader>
                  <CardTitle className="text-base">Academic Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">CGPA</span>
                      <span className="font-semibold">8.5</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Attendance</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Activities</span>
                      <span className="font-semibold">45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Achievements</span>
                      <span className="font-semibold">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card data-testid="card-personal-info">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        disabled={!isEditing}
                        data-testid="input-firstName"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        disabled={!isEditing}
                        data-testid="input-lastName"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          className="pl-10"
                          disabled={!isEditing}
                          data-testid="input-email"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="pl-10"
                          disabled={!isEditing}
                          data-testid="input-address"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        data-testid="textarea-bio"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6" data-testid="card-academic-info">
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Your academic details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        disabled
                        data-testid="input-department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNo">Registration Number</Label>
                      <Input
                        id="registrationNo"
                        value={formData.registrationNo}
                        disabled
                        data-testid="input-registrationNo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year</Label>
                      <Input
                        id="year"
                        value={formData.year}
                        disabled
                        data-testid="input-year"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Input
                        id="semester"
                        value={formData.semester}
                        disabled
                        data-testid="input-semester"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

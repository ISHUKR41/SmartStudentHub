import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Lock, Moon, Globe, Mail, Shield, Smartphone, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    assignmentReminders: true,
    examAlerts: true,
    eventUpdates: true,
    darkMode: false,
    language: 'en',
    timezone: 'IST',
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings({ ...settings, [key]: value });
    toast({
      title: 'Settings Updated',
      description: 'Your preferences have been saved successfully',
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
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="settings-title">
              Settings ⚙️
            </h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>

          <div className="space-y-6">
            <Card data-testid="card-notifications">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    data-testid="switch-email"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notif">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    id="push-notif"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    data-testid="switch-push"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notif">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                  </div>
                  <Switch
                    id="sms-notif"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                    data-testid="switch-sms"
                  />
                </div>

                <Separator />

                <div className="space-y-4 mt-4">
                  <h4 className="font-semibold text-sm">Notification Types</h4>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="assignment-reminders">Assignment Reminders</Label>
                    <Switch
                      id="assignment-reminders"
                      checked={settings.assignmentReminders}
                      onCheckedChange={(checked) => handleSettingChange('assignmentReminders', checked)}
                      data-testid="switch-assignments"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="exam-alerts">Exam Alerts</Label>
                    <Switch
                      id="exam-alerts"
                      checked={settings.examAlerts}
                      onCheckedChange={(checked) => handleSettingChange('examAlerts', checked)}
                      data-testid="switch-exams"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="event-updates">Event Updates</Label>
                    <Switch
                      id="event-updates"
                      checked={settings.eventUpdates}
                      onCheckedChange={(checked) => handleSettingChange('eventUpdates', checked)}
                      data-testid="switch-events"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-appearance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable dark theme</p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                    data-testid="switch-dark-mode"
                  />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-localization">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Language & Region
                </CardTitle>
                <CardDescription>Set your language and timezone preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                    <SelectTrigger id="language" data-testid="select-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                      <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange('timezone', value)}>
                    <SelectTrigger id="timezone" data-testid="select-timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IST">IST (Indian Standard Time)</SelectItem>
                      <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                      <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                      <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-security">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Switch
                    id="two-factor"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    data-testid="switch-2fa"
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="login-alerts">Login Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified of new login attempts</p>
                  </div>
                  <Switch
                    id="login-alerts"
                    checked={settings.loginAlerts}
                    onCheckedChange={(checked) => handleSettingChange('loginAlerts', checked)}
                    data-testid="switch-login-alerts"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-change-password">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-privacy">
                    <Eye className="h-4 w-4" />
                    Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-account">
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-download-data">
                  Download My Data
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" data-testid="button-deactivate">
                  Deactivate Account
                </Button>
                <Button variant="destructive" className="w-full justify-start gap-2" data-testid="button-delete">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

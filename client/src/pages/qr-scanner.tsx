import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, Camera, History, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { Subject } from '@shared/schema';

const scanHistory = [
  {
    id: 1,
    type: 'Attendance',
    subject: 'Data Structures',
    time: '09:15 AM',
    date: '2024-10-01',
    status: 'success',
    location: 'Room 301',
  },
  {
    id: 2,
    type: 'Event Check-in',
    event: 'Tech Fest Registration',
    time: '02:30 PM',
    date: '2024-09-30',
    status: 'success',
    location: 'Main Hall',
  },
  {
    id: 3,
    type: 'Library Entry',
    purpose: 'Study Room Booking',
    time: '11:00 AM',
    date: '2024-09-30',
    status: 'success',
    location: 'Library',
  },
  {
    id: 4,
    type: 'Attendance',
    subject: 'Physics Lab',
    time: '10:00 AM',
    date: '2024-09-29',
    status: 'failed',
    error: 'Invalid QR Code',
  },
];

export default function QRScanner() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [qrToken, setQrToken] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; subjectName?: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['/api/subjects'],
  });

  const scanQRMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await apiRequest('/api/attendance/qr/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      return response;
    },
    onSuccess: (data) => {
      const subject = subjects.find(s => s.id === data.subjectId);
      setScanResult({
        success: true,
        message: 'Attendance marked successfully!',
        subjectName: subject?.name || 'Unknown Subject',
      });
      
      toast({
        title: "Success! ✓",
        description: `Attendance marked for ${subject?.name || 'the class'}`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/students/attendance'] });
      queryClient.invalidateQueries({ queryKey: ['/api/students/attendance/stats'] });
      
      setQrToken('');
    },
    onError: (error: any) => {
      setScanResult({
        success: false,
        message: error.message || 'Failed to mark attendance',
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to scan QR code. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleScan = () => {
    if (!qrToken.trim()) {
      toast({
        title: "Enter QR Token",
        description: "Please enter or scan a valid QR token.",
        variant: "destructive",
      });
      return;
    }
    
    setScanResult(null);
    scanQRMutation.mutate(qrToken.trim());
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="qr-scanner-title">
              QR Scanner 📱
            </h1>
            <p className="text-muted-foreground">Scan QR codes for attendance and events</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6" data-testid="tabs-list">
              <TabsTrigger value="scanner">Scanner</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="scanner">
              <div className="max-w-2xl mx-auto">
                <Card data-testid="card-scanner">
                  <CardHeader>
                    <CardTitle>QR Code Scanner</CardTitle>
                    <CardDescription>Enter or scan a QR token to mark your attendance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {scanResult && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg border ${
                            scanResult.success 
                              ? 'bg-green-500/10 border-green-500/20' 
                              : 'bg-red-500/10 border-red-500/20'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {scanResult.success ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600" />
                            )}
                            <div>
                              <p className={`font-semibold ${
                                scanResult.success ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {scanResult.success ? 'Success!' : 'Error'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {scanResult.message}
                              </p>
                              {scanResult.subjectName && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Subject: {scanResult.subjectName}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="space-y-2">
                        <label className="text-sm font-medium">QR Token</label>
                        <Input
                          value={qrToken}
                          onChange={(e) => setQrToken(e.target.value)}
                          placeholder="Enter QR token or scan QR code"
                          className="text-base"
                          data-testid="input-qr-token"
                        />
                        <p className="text-xs text-muted-foreground">
                          Paste the token from the QR code shown by your professor
                        </p>
                      </div>

                      <Button 
                        onClick={handleScan} 
                        disabled={scanQRMutation.isPending || !qrToken.trim()}
                        className="w-full gap-2" 
                        size="lg"
                        data-testid="button-scan"
                      >
                        {scanQRMutation.isPending ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Camera className="h-5 w-5" />
                            Mark Attendance
                          </>
                        )}
                      </Button>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 text-blue-600">How to Mark Attendance:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Get the QR code displayed by your professor</li>
                          <li>• Copy or scan the QR token</li>
                          <li>• Paste it in the field above</li>
                          <li>• Click "Mark Attendance" to submit</li>
                          <li>• You'll receive instant confirmation</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {scanHistory.map((scan, index) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card data-testid={`history-card-${index}`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                              scan.status === 'success' 
                                ? 'bg-green-500/10' 
                                : 'bg-red-500/10'
                            }`}>
                              {scan.status === 'success' ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              ) : (
                                <XCircle className="h-6 w-6 text-red-600" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{scan.type}</h4>
                              <p className="text-sm text-muted-foreground">
                                {scan.subject || scan.event || scan.purpose}
                              </p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {scan.time}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {scan.date}
                                </span>
                                {scan.location && (
                                  <span className="text-xs text-muted-foreground">
                                    {scan.location}
                                  </span>
                                )}
                              </div>
                              {scan.error && (
                                <p className="text-xs text-red-600 mt-1">Error: {scan.error}</p>
                              )}
                            </div>
                          </div>
                          <span className={`font-semibold text-sm ${
                            scan.status === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {scan.status === 'success' ? 'Success' : 'Failed'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

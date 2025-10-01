import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Camera, History, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('scanner');

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
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
                    <CardDescription>Position the QR code within the frame to scan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="relative aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                        {isScanning ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-primary/20 flex items-center justify-center"
                          >
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                          </motion.div>
                        ) : (
                          <div className="text-center p-8">
                            <QrCode className="h-32 w-32 text-muted-foreground mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground">
                              Click the button below to start scanning
                            </p>
                          </div>
                        )}
                        
                        <div className="absolute inset-8 border-4 border-primary/50 rounded-lg pointer-events-none">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleScan} 
                        disabled={isScanning}
                        className="w-full gap-2" 
                        size="lg"
                        data-testid="button-scan"
                      >
                        <Camera className="h-5 w-5" />
                        {isScanning ? 'Scanning...' : 'Start Scanning'}
                      </Button>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 text-blue-600">How to Scan:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Click "Start Scanning" to activate the camera</li>
                          <li>• Position the QR code within the frame</li>
                          <li>• Hold steady until the code is recognized</li>
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

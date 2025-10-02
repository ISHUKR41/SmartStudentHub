import { useState } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  CreditCard,
  Receipt,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const paymentHistory = [
  {
    id: 1,
    type: "Tuition Fee",
    amount: 50000,
    status: "Paid",
    date: "2024-09-01",
    semester: "Fall 2024",
  },
  {
    id: 2,
    type: "Lab Fee",
    amount: 5000,
    status: "Paid",
    date: "2024-09-05",
    semester: "Fall 2024",
  },
  {
    id: 3,
    type: "Library Fee",
    amount: 2000,
    status: "Paid",
    date: "2024-09-10",
    semester: "Fall 2024",
  },
  {
    id: 4,
    type: "Sports Fee",
    amount: 3000,
    status: "Pending",
    date: "2024-10-01",
    semester: "Fall 2024",
  },
];

const feeBreakdown = [
  { name: "Tuition", value: 50000, color: "#3b82f6" },
  { name: "Lab", value: 5000, color: "#10b981" },
  { name: "Library", value: 2000, color: "#f59e0b" },
  { name: "Sports", value: 3000, color: "#8b5cf6" },
  { name: "Other", value: 2000, color: "#ec4899" },
];

export default function FeesPayments() {
  const totalFees = 62000;
  const paidAmount = 57000;
  const pendingAmount = 5000;
  const dueDate = "October 15, 2024";

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
              Fees & Payments
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your fee payments and receipts
            </p>
          </div>
          <Button>
            <CreditCard className="w-4 h-4 mr-2" />
            Pay Now
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Total Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  ₹{totalFees.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This semester
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Paid Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  ₹{paidAmount.toLocaleString()}
                </div>
                <Progress
                  value={(paidAmount / totalFees) * 100}
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  ₹{pendingAmount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Due by {dueDate}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Payment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {((paidAmount / totalFees) * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Completed</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Breakdown</CardTitle>
              <CardDescription>
                Distribution of fees by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={feeBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ₹${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {feeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Timeline</CardTitle>
              <CardDescription>Monthly payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { month: "Jul", amount: 20000 },
                    { month: "Aug", amount: 15000 },
                    { month: "Sep", amount: 22000 },
                    { month: "Oct", amount: 5000 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="amount" fill="#3b82f6" name="Amount (₹)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>All your payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          payment.status === "Paid"
                            ? "bg-green-500/10"
                            : "bg-orange-500/10"
                        }`}
                      >
                        {payment.status === "Paid" ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Clock className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{payment.type}</h3>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{payment.date}</span>
                          <span>•</span>
                          <span>{payment.semester}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold">
                          ₹{payment.amount.toLocaleString()}
                        </div>
                        <Badge
                          variant={
                            payment.status === "Paid" ? "default" : "secondary"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Receipt className="w-4 h-4 mr-2" />
                        Receipt
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Plus,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const scholarships = [
  {
    id: 1,
    name: "Merit Scholarship 2024",
    amount: 50000,
    status: "Active",
    deadline: "2024-12-31",
    category: "Merit-based",
    eligibility: "8.5+ GPA",
  },
  {
    id: 2,
    name: "Sports Excellence Award",
    amount: 25000,
    status: "Applied",
    deadline: "2024-11-15",
    category: "Sports",
    eligibility: "State level player",
  },
  {
    id: 3,
    name: "Need-based Financial Aid",
    amount: 75000,
    status: "Under Review",
    deadline: "2024-10-30",
    category: "Financial Aid",
    eligibility: "Family income < 3L",
  },
];

export default function Scholarships() {
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
              Scholarships
            </h1>
            <p className="text-muted-foreground mt-2">
              Apply and track scholarship opportunities
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Apply New
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Active", value: "1", color: "green" },
            { label: "Applied", value: "1", color: "blue" },
            { label: "Total Amount", value: "₹1.5L", color: "orange" },
          ].map((stat, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }}>
              <Card className={`border-l-4 border-l-${stat.color}-500`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          {scholarships.map((scholarship, index) => (
            <motion.div
              key={scholarship.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">
                          {scholarship.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span>
                            Amount: ₹{scholarship.amount.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span>Deadline: {scholarship.deadline}</span>
                          <span>•</span>
                          <span>{scholarship.eligibility}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge
                        variant={
                          scholarship.status === "Active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {scholarship.status}
                      </Badge>
                      <Button size="sm">View Details</Button>
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

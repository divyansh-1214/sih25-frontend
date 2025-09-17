"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Weekly Collection Data
const weeklyData = [
  { day: "Mon", collected: 850, target: 900 },
  { day: "Tue", collected: 920, target: 900 },
  { day: "Wed", collected: 780, target: 900 },
  { day: "Thu", collected: 890, target: 900 },
  { day: "Fri", collected: 950, target: 900 },
  { day: "Sat", collected: 820, target: 900 },
  { day: "Sun", collected: 760, target: 900 },
]

export function WeeklyCollectionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={weeklyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="collected" fill="hsl(var(--chart-1))" />
        <Bar dataKey="target" fill="hsl(var(--chart-2))" opacity={0.6} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Compliance Trend Data
const complianceData = [
  { month: "Jan", compliance: 78 },
  { month: "Feb", compliance: 82 },
  { month: "Mar", compliance: 85 },
  { month: "Apr", compliance: 87 },
  { month: "May", compliance: 89 },
  { month: "Jun", compliance: 87 },
]

export function ComplianceTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={complianceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="compliance" stroke="hsl(var(--chart-3))" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Waste Distribution Data
const wasteDistribution = [
  { name: "Organic", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Recyclable", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Hazardous", value: 15, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 10, color: "hsl(var(--chart-5))" },
]

export function WasteDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={wasteDistribution}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {wasteDistribution.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

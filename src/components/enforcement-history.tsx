"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, Filter } from "lucide-react"

interface EnforcementRecord {
  id: string
  householdId: string
  type: "warning" | "penalty"
  reason: string
  amount?: number
  status: "issued" | "paid" | "overdue" | "appealed"
  issuedDate: string
  dueDate?: string
  paidDate?: string
  issuedBy: string
}

const mockEnforcementHistory: EnforcementRecord[] = [
  {
    id: "ENF-001",
    householdId: "HH-003",
    type: "penalty",
    reason: "Improper waste segregation",
    amount: 500,
    status: "paid",
    issuedDate: "2024-01-10",
    dueDate: "2024-01-25",
    paidDate: "2024-01-20",
    issuedBy: "Inspector A",
  },
  {
    id: "ENF-002",
    householdId: "HH-005",
    type: "warning",
    reason: "Mixed waste disposal",
    status: "issued",
    issuedDate: "2024-01-12",
    issuedBy: "Inspector B",
  },
  {
    id: "ENF-003",
    householdId: "HH-007",
    type: "penalty",
    reason: "Hazardous waste in regular bin",
    amount: 1000,
    status: "overdue",
    issuedDate: "2024-01-05",
    dueDate: "2024-01-20",
    issuedBy: "Inspector C",
  },
  {
    id: "ENF-004",
    householdId: "HH-002",
    type: "warning",
    reason: "No segregation at source",
    status: "issued",
    issuedDate: "2024-01-14",
    issuedBy: "Inspector A",
  },
  {
    id: "ENF-005",
    householdId: "HH-009",
    type: "penalty",
    reason: "Overflowing waste bins",
    amount: 300,
    status: "appealed",
    issuedDate: "2024-01-08",
    dueDate: "2024-01-23",
    issuedBy: "Inspector B",
  },
]

export function EnforcementHistory() {
  const [data, setData] = useState(mockEnforcementHistory)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredData = data.filter((record) => {
    const matchesSearch =
      record.householdId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || record.type === selectedType
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "issued":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Issued</Badge>
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Overdue</Badge>
      case "appealed":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Appealed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Warning
          </Badge>
        )
      case "penalty":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Penalty
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Enforcement History
        </CardTitle>
        <CardDescription>Track all issued warnings and penalties</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by household ID, enforcement ID, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="penalty">Penalty</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="appealed">Appealed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} enforcement actions
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Household</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.householdId}</TableCell>
                  <TableCell>{getTypeBadge(record.type)}</TableCell>
                  <TableCell className="max-w-xs truncate">{record.reason}</TableCell>
                  <TableCell>{record.amount ? `₹${record.amount}` : "-"}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{record.issuedDate}</TableCell>
                  <TableCell>{record.dueDate || "-"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

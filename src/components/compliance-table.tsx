"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface ComplianceRecord {
  householdId: string
  address: string
  zone: string
  block: string
  complianceRate: number
  lastInspection: string
  warnings: number
  status: "compliant" | "warning" | "violation"
  segregationScore: number
  qrScans: number
}

const mockComplianceData: ComplianceRecord[] = [
  {
    householdId: "HH-001",
    address: "123 Green Street, Block A",
    zone: "Zone 1",
    block: "Block A",
    complianceRate: 95,
    lastInspection: "2024-01-15",
    warnings: 0,
    status: "compliant",
    segregationScore: 9.5,
    qrScans: 28,
  },
  {
    householdId: "HH-002",
    address: "456 Eco Avenue, Block B",
    zone: "Zone 1",
    block: "Block B",
    complianceRate: 78,
    lastInspection: "2024-01-14",
    warnings: 1,
    status: "warning",
    segregationScore: 7.8,
    qrScans: 22,
  },
  {
    householdId: "HH-003",
    address: "789 Clean Road, Block C",
    zone: "Zone 2",
    block: "Block C",
    complianceRate: 45,
    lastInspection: "2024-01-13",
    warnings: 3,
    status: "violation",
    segregationScore: 4.5,
    qrScans: 15,
  },
  {
    householdId: "HH-004",
    address: "321 Waste Way, Block A",
    zone: "Zone 2",
    block: "Block A",
    complianceRate: 88,
    lastInspection: "2024-01-15",
    warnings: 0,
    status: "compliant",
    segregationScore: 8.8,
    qrScans: 25,
  },
  {
    householdId: "HH-005",
    address: "654 Recycle Street, Block D",
    zone: "Zone 3",
    block: "Block D",
    complianceRate: 62,
    lastInspection: "2024-01-12",
    warnings: 2,
    status: "warning",
    segregationScore: 6.2,
    qrScans: 18,
  },
]

export function ComplianceTable() {
  const [data] = useState(mockComplianceData)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedZone, setSelectedZone] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredData = data.filter((record) => {
    const matchesSearch =
      record.householdId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesZone = selectedZone === "all" || record.zone === selectedZone
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus

    return matchesSearch && matchesZone && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-accent/20 text-accent-foreground hover:bg-accent/30">Compliant</Badge>
      case "warning":
        return <Badge className="bg-primary/20 text-primary-foreground hover:bg-primary/30">Warning</Badge>
      case "violation":
        return <Badge className="bg-destructive/20 text-destructive-foreground hover:bg-destructive/30">Violation</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="w-4 h-4 text-accent" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-primary" />
      case "violation":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return "text-accent"
    if (rate >= 70) return "text-primary"
    return "text-destructive"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Household Compliance Monitoring</CardTitle>
        <CardDescription>Track waste segregation compliance across zones and households</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by household ID or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="Zone 1">Zone 1</SelectItem>
              <SelectItem value="Zone 2">Zone 2</SelectItem>
              <SelectItem value="Zone 3">Zone 3</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="violation">Violation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} households
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Household</TableHead>
                <TableHead>Zone/Block</TableHead>
                <TableHead>Compliance Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Warnings</TableHead>
                <TableHead>Last Inspection</TableHead>
                <TableHead>QR Scans</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.householdId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.householdId}</div>
                      <div className="text-sm text-muted-foreground">{record.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.zone}</div>
                      <div className="text-sm text-muted-foreground">{record.block}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`font-medium ${getComplianceColor(record.complianceRate)}`}>
                        {record.complianceRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>
                    <Badge variant={record.warnings > 0 ? "destructive" : "secondary"}>{record.warnings}</Badge>
                  </TableCell>
                  <TableCell>{record.lastInspection}</TableCell>
                  <TableCell>{record.qrScans}</TableCell>
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

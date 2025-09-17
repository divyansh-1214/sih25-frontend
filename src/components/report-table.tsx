"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Eye, MapPin, Calendar, User, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CitizenReport {
  id: string
  title: string
  description: string
  category: "waste_collection" | "illegal_dumping" | "overflowing_bins" | "missed_collection" | "other"
  status: "new" | "assigned" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  reportedBy: string
  reportedDate: string
  assignedTo?: string
  location: {
    address: string
    lat: number
    lng: number
  }
  photoUrl?: string
  resolutionNote?: string
  resolvedDate?: string
}

const mockReports: CitizenReport[] = [
  {
    id: "RPT-001",
    title: "Overflowing waste bins on Main Street",
    description: "The waste bins near the market area have been overflowing for 3 days. Creating hygiene issues.",
    category: "overflowing_bins",
    status: "assigned",
    priority: "high",
    reportedBy: "Rajesh Kumar",
    reportedDate: "2024-01-15",
    assignedTo: "Worker Team A",
    location: {
      address: "Main Street, Near Market, Zone 1",
      lat: 12.9716,
      lng: 77.5946,
    },
    photoUrl: "/overflowing-waste-bins.jpg",
  },
  {
    id: "RPT-002",
    title: "Missed waste collection",
    description: "Our street was skipped during yesterday's collection round. Multiple households affected.",
    category: "missed_collection",
    status: "new",
    priority: "medium",
    reportedBy: "Priya Sharma",
    reportedDate: "2024-01-16",
    location: {
      address: "Green Avenue, Block B, Zone 2",
      lat: 12.9616,
      lng: 77.5846,
    },
  },
  {
    id: "RPT-003",
    title: "Illegal dumping in vacant lot",
    description: "Someone has been dumping construction waste in the vacant lot behind our building.",
    category: "illegal_dumping",
    status: "resolved",
    priority: "urgent",
    reportedBy: "Amit Patel",
    reportedDate: "2024-01-12",
    assignedTo: "Inspector Team B",
    location: {
      address: "Behind Sunrise Apartments, Zone 3",
      lat: 12.9816,
      lng: 77.6046,
    },
    photoUrl: "/illegal-construction-waste-dumping.jpg",
    resolutionNote: "Waste removed and area cleaned. Warning issued to building management.",
    resolvedDate: "2024-01-14",
  },
  {
    id: "RPT-004",
    title: "Broken waste bin needs replacement",
    description: "The waste bin at bus stop is damaged and cannot be used properly.",
    category: "other",
    status: "in_progress",
    priority: "low",
    reportedBy: "Sunita Devi",
    reportedDate: "2024-01-14",
    assignedTo: "Maintenance Team",
    location: {
      address: "Bus Stop, Park Road, Zone 1",
      lat: 12.9516,
      lng: 77.5746,
    },
  },
]

export function ReportTable() {
  const { toast } = useToast()
  const [data, setData] = useState(mockReports)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null)
  const [resolutionNote, setResolutionNote] = useState("")

  const filteredData = data.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || report.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">New</Badge>
      case "assigned":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Assigned</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Progress</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Resolved</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Closed</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "waste_collection":
        return "Waste Collection"
      case "illegal_dumping":
        return "Illegal Dumping"
      case "overflowing_bins":
        return "Overflowing Bins"
      case "missed_collection":
        return "Missed Collection"
      case "other":
        return "Other"
      default:
        return "Unknown"
    }
  }

  const handleResolve = () => {
    if (!selectedReport || !resolutionNote.trim()) return

    setData((prev) =>
      prev.map((report) =>
        report.id === selectedReport.id
          ? {
              ...report,
              status: "resolved",
              resolutionNote,
              resolvedDate: new Date().toISOString().split("T")[0],
            }
          : report,
      ),
    )

    toast({
      title: "Report Resolved",
      description: `Report ${selectedReport.id} has been marked as resolved.`,
    })

    setSelectedReport(null)
    setResolutionNote("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Citizen Reports
        </CardTitle>
        <CardDescription>Manage and resolve citizen complaints and reports</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by report ID, title, or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} reports
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-medium">{report.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{report.description}</div>
                  </TableCell>
                  <TableCell>{getCategoryLabel(report.category)}</TableCell>
                  <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.reportedBy}</TableCell>
                  <TableCell>{report.reportedDate}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{report.title}</DialogTitle>
                          <DialogDescription>Report ID: {report.id}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">Status</Label>
                              <div className="mt-1">{getStatusBadge(report.status)}</div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">Priority</Label>
                              <div className="mt-1">{getPriorityBadge(report.priority)}</div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium">Description</Label>
                            <p className="mt-1 text-sm">{report.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <User className="w-4 h-4" />
                                Reported By
                              </Label>
                              <p className="mt-1 text-sm">{report.reportedBy}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Date
                              </Label>
                              <p className="mt-1 text-sm">{report.reportedDate}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Location
                            </Label>
                            <p className="mt-1 text-sm">{report.location.address}</p>
                          </div>

                          {report.photoUrl && (
                            <div>
                              <Label className="text-sm font-medium">Photo Evidence</Label>
                              <img
                                src={report.photoUrl || "/placeholder.svg"}
                                alt="Report evidence"
                                className="mt-1 rounded-lg border max-w-full h-48 object-cover"
                              />
                            </div>
                          )}

                          {report.assignedTo && (
                            <div>
                              <Label className="text-sm font-medium">Assigned To</Label>
                              <p className="mt-1 text-sm">{report.assignedTo}</p>
                            </div>
                          )}

                          {report.resolutionNote && (
                            <div>
                              <Label className="text-sm font-medium">Resolution Note</Label>
                              <p className="mt-1 text-sm">{report.resolutionNote}</p>
                              <p className="text-xs text-muted-foreground">Resolved on {report.resolvedDate}</p>
                            </div>
                          )}

                          {report.status !== "resolved" && report.status !== "closed" && (
                            <div className="space-y-2">
                              <Label htmlFor="resolution">Resolution Note</Label>
                              <Textarea
                                id="resolution"
                                placeholder="Enter resolution details..."
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                rows={3}
                              />
                              <Button onClick={handleResolve} disabled={!resolutionNote.trim()}>
                                Mark as Resolved
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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

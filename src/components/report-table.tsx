"use client"

import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
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
import Image from "next/image"
import {ward,type wardType} from "@/lib/ward"
interface CitizenReport {
  _id: string
  author: string
  title: string
  description: string
  category: "waste_collection" | "illegal_dumping" | "overflowing_bins" | "missed_collection" | "other"
  location: string
  status: "pending" | "in_progress" | "resolved" | "closed"
  reportedAt: string
  reportedBy: string
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo?: string
  photoUrl?: string
  resolutionNote?: string
  resolvedDate?: string
}

export function ReportTable() {
  const { toast } = useToast()
  const [data, setData] = useState<CitizenReport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(null)
  const [resolutionNote, setResolutionNote] = useState("")
  const [assignedTo, setAssignedTo] = useState<String>("a")
  const [zone, SetZone] = useState<number>(0)
  // Fetch reports from API
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/`)
        console.log("Reports fetched:", response.data)
        
        setData(response.data)
      } catch (error) {
        console.error("Error fetching reports:", error)
        
        let errorMessage = "Failed to fetch reports"
        if (error instanceof AxiosError) {
          errorMessage = `Failed to fetch reports: ${error.response?.data?.message || error.message}`
        } else if (error instanceof Error) {
          errorMessage = `Failed to fetch reports: ${error.message}`
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])
  const  findHead = async (location: string) => {
    for (const v of ward) {
      for (const d of v.mohalla) {
        if (d === location) {
          await setAssignedTo(v.corporator.name);
          await SetZone(v.ward_no);
          return; // Stop after first match
        }
      }
    }
  }
  
  const filteredData = data.filter((report) => {
    const matchesSearch =
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    const matchesPriority = selectedPriority === "all" || report.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "assigned":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Assigned</Badge>
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>
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
        report._id === selectedReport._id
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
      description: `Report ${selectedReport._id} has been marked as resolved.`,
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
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading reports...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="text-red-800">
                <h3 className="text-sm font-medium">Error Loading Reports</h3>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - only show if not loading and no error */}
        {!loading && !error && (
          <>
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
              <SelectItem value="pending">Pending</SelectItem>
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
                <TableRow key={report._id}>
                  <TableCell className="font-medium">{report._id}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate font-medium">{report.title}</div>
                    <div className="text-sm text-muted-foreground truncate">{report.description}</div>
                  </TableCell>
                  <TableCell>{getCategoryLabel(report.category)}</TableCell>
                  <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.author}</TableCell>
                  <TableCell>{new Date(report.reportedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => {setSelectedReport(report); findHead(report.location)}}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{report.title}</DialogTitle>
                          <DialogDescription>Report ID: {report._id}</DialogDescription>
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
                              <p className="mt-1 text-sm">{report.author}</p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Date
                              </Label>
                              <p className="mt-1 text-sm">{new Date(report.reportedAt).toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Location
                            </Label>
                            <p className="mt-1 text-sm">{report.location}</p>
                          </div>

                          {report.photoUrl && (
                            <div>
                              <Label className="text-sm font-medium">Photo Evidence</Label>
                              <Image
                                src={report.photoUrl || "/placeholder.svg"}
                                alt="Report evidence"
                                className="mt-1 rounded-lg border max-w-full h-48 object-cover"
                                width={400}
                                height={200}
                              />
                            </div>
                          )}
                          {assignedTo && (
                            <div>
                              <Label className="text-sm font-medium">Assigning to</Label>
                              <p className="mt-1 text-sm">{assignedTo}</p>
                            </div>
                          )}
                          {report.resolutionNote && (
                            <div>
                              <Label className="text-sm font-medium">Add note Note</Label>
                              <p className="mt-1 text-sm">{report.resolutionNote}</p>
                              <p className="text-xs text-muted-foreground">Resolved on {report.resolvedDate}</p>
                            </div>
                          )}
                          {report.status !== "resolved" && report.status !== "closed" && (
                            <div className="space-y-2">
                              <Label htmlFor="resolution">Feedback Note</Label>
                              <Textarea
                                id="resolution"
                                placeholder="Enter resolution details..."
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                                rows={3}
                              />
                              <Button onClick={handleResolve} disabled={!resolutionNote.trim()}>
                                Assign to
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
        </>
        )}
      </CardContent>
    </Card>
  )
}
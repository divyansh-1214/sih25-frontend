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
import { Search, Eye, MapPin, Calendar, User, MessageSquare, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { ward } from "@/lib/ward"

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
  const [assignedTo, setAssignedTo] = useState<string>("")
  const [zone, setZone] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch reports from API
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
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const findHead = async (location: string) => {
    for (const v of ward) {
      for (const d of v.mohalla) {
        if (d === location) {
          setAssignedTo(v.corporator.name)
          setZone(v.ward_no)
          return
        }
      }
    }
    // Reset if no match found
    setAssignedTo("")
    setZone(0)
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

  const handleAssign = async () => {
    if (!selectedReport || !resolutionNote.trim() || !assignedTo) return

    setIsSubmitting(true)
    try {
      // Update local state
      setData((prev) =>
        prev.map((report) =>
          report._id === selectedReport._id
            ? {
                ...report,
                status: "in_progress",
                assignedTo: assignedTo,
                resolutionNote,
              }
            : report,
        ),
      )

      toast({
        title: "Report Assigned",
        description: `Report ${selectedReport._id} has been assigned to ${assignedTo}.`,
      })

      // Reset form
      setSelectedReport(null)
      setResolutionNote("")
      setAssignedTo("")
      setZone(0)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const retryFetch = () => {
    fetchReports()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Citizen Reports
            </CardTitle>
            <CardDescription>Manage and resolve citizen complaints and reports</CardDescription>
          </div>
          {!loading && (
            <Button variant="outline" size="sm" onClick={retryFetch}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading reports...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-destructive">Error Loading Reports</h3>
                <p className="text-sm text-destructive/80 mt-1">{error}</p>
                <Button variant="outline" size="sm" onClick={retryFetch} className="mt-3">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - only show if not loading and no error */}
        {!loading && !error && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by report ID, title, reporter, or location..."
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
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredData.length} of {data.length} reports
              </div>
              {filteredData.length === 0 && data.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedStatus("all")
                    setSelectedPriority("all")
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Empty State */}
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {data.length === 0 ? "No Reports Found" : "No Matching Reports"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {data.length === 0 
                    ? "There are no citizen reports to display at the moment."
                    : "Try adjusting your search criteria or filters."
                  }
                </p>
                {data.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedStatus("all")
                      setSelectedPriority("all")
                    }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              /* Table */
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Report ID</TableHead>
                      <TableHead className="min-w-64">Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reporter</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((report) => (
                      <TableRow key={report._id} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{report._id.slice(-8)}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="space-y-1">
                            <div className="truncate font-medium">{report.title}</div>
                            <div className="text-sm text-muted-foreground truncate">{report.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getCategoryLabel(report.category)}</TableCell>
                        <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="font-medium">{report.author}</TableCell>
                        <TableCell className="text-sm">{new Date(report.reportedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedReport(report)
                                  findHead(report.location)
                                  setResolutionNote(report.resolutionNote || "")
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl">{report.title}</DialogTitle>
                                <DialogDescription>Report ID: {report._id}</DialogDescription>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Status and Priority Row */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <div className="mt-2">{getStatusBadge(report.status)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Priority</Label>
                                    <div className="mt-2">{getPriorityBadge(report.priority)}</div>
                                  </div>
                                </div>

                                {/* Description */}
                                <div>
                                  <Label className="text-sm font-medium">Description</Label>
                                  <div className="mt-2 p-3 bg-muted rounded-lg">
                                    <p className="text-sm">{report.description}</p>
                                  </div>
                                </div>

                                {/* Reporter and Date */}
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      Reported By
                                    </Label>
                                    <p className="mt-2 text-sm font-medium">{report.author}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      Date Reported
                                    </Label>
                                    <p className="mt-2 text-sm">{new Date(report.reportedAt).toLocaleDateString()}</p>
                                  </div>
                                </div>

                                {/* Location */}
                                <div>
                                  <Label className="text-sm font-medium flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Location
                                  </Label>
                                  <p className="mt-2 text-sm font-medium">{report.location}</p>
                                </div>

                                {/* Assignment Info */}
                                {assignedTo && (
                                  <div className="grid grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg">
                                    <div>
                                      <Label className="text-sm font-medium text-blue-900">Assigned To</Label>
                                      <p className="mt-1 text-sm font-medium text-blue-800">{assignedTo}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-blue-900">Zone</Label>
                                      <p className="mt-1 text-sm font-medium text-blue-800">Ward {zone}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Photo Evidence */}
                                {report.photoUrl && (
                                  <div>
                                    <Label className="text-sm font-medium">Photo Evidence</Label>
                                    <div className="mt-2">
                                      <Image
                                        src={report.photoUrl}
                                        alt="Report evidence"
                                        className="rounded-lg border max-w-full h-64 object-cover"
                                        width={400}
                                        height={256}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Existing Resolution Note */}
                                {report.resolutionNote && (
                                  <div>
                                    <Label className="text-sm font-medium">Resolution Note</Label>
                                    <div className="mt-2 p-3 bg-green-50 rounded-lg">
                                      <p className="text-sm">{report.resolutionNote}</p>
                                      {report.resolvedDate && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Resolved on {report.resolvedDate}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Assignment Form */}
                                {report.status !== "resolved" && report.status !== "closed" && (
                                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                      <Label htmlFor="resolution" className="text-sm font-medium">
                                        Assignment Note
                                      </Label>
                                      <Textarea
                                        id="resolution"
                                        placeholder="Enter assignment details or resolution notes..."
                                        value={resolutionNote}
                                        onChange={(e) => setResolutionNote(e.target.value)}
                                        rows={3}
                                        className="mt-2"
                                      />
                                    </div>
                                    <div className="flex gap-3">
                                      <Button 
                                        onClick={handleAssign} 
                                        disabled={!resolutionNote.trim() || !assignedTo || isSubmitting}
                                        className="flex-1"
                                      >
                                        {isSubmitting ? "Assigning..." : `Assign to ${assignedTo || "Worker"}`}
                                      </Button>
                                    </div>
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
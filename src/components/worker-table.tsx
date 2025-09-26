"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Eye, Edit, Plus, Phone } from "lucide-react"
import axios from "axios"

export interface Worker {
  _id: string
  role: string
  name: string
  aadhar: string
  address: string
  phoneNumber: string
  workerType: 'garbage_collector' | 'sweeper' | 'recycling_worker' | 'supervisor' | 'maintenance' | 'driver' | 'other'
  email: string
  createdAt?: string
  updatedAt?: string
  // Added properties for table usage
  id?: string
  status?: string
  zone?: string
  trainingCompleted?: number
  totalTrainings?: number
  avatar?: string
  complianceStatus?: string
  equipmentRequests?: number
}

export function WorkerTable() {
  const [data,setData] = useState<Worker[]>()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedZone, setSelectedZone] = useState("all")
   const fechData = async ()=>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/worker/get`)
    setData(res.data)
    console.log(data)
  }
  useEffect(()=>{
    fechData()
  },[])
  const filteredData = (data ?? []).filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (worker.id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      worker.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === "all" || worker.role === selectedRole
    const matchesStatus = selectedStatus === "all" || worker.status === selectedStatus
    const matchesZone = selectedZone === "all" || worker.zone === selectedZone

    return matchesSearch && matchesRole && matchesStatus && matchesZone
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      case "on_leave":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">On Leave</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getComplianceBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Good</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
      case "poor":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Poor</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "collector":
        return "Waste Collector"
      case "driver":
        return "Vehicle Driver"
      case "supervisor":
        return "Supervisor"
      case "inspector":
        return "Inspector"
      default:
        return "Unknown"
    }
  }

  const getTrainingProgress = (completed: number, total: number) => {
    const percentage = (completed / total) * 100
    return {
      percentage,
      color: percentage >= 80 ? "bg-green-500" : percentage >= 60 ? "bg-yellow-500" : "bg-red-500",
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Worker Management</CardTitle>
            <CardDescription>Manage worker profiles, training, and compliance</CardDescription>
          </div>
          <Button >
            <Plus className="w-4 h-4 mr-2" />
            Add Worker
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="collector">Collector</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="inspector">Inspector</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedZone} onValueChange={setSelectedZone}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Zones</SelectItem>
              <SelectItem value="Zone 1">Zone 1</SelectItem>
              <SelectItem value="Zone 2">Zone 2</SelectItem>
              <SelectItem value="Zone 3">Zone 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredData.length} of {(data?.length ?? 0)} workers
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Training Progress</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Equipment Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((worker) => {
                const trainingProgress = getTrainingProgress(worker.trainingCompleted ?? 0, worker.totalTrainings ?? 1)
                return (
                  <TableRow key={worker.id ?? worker._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={worker.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {worker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-muted-foreground">{worker.id ?? worker._id}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {worker.phoneNumber}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleLabel(worker.role)}</TableCell>
                    <TableCell>{worker.zone ?? "N/A"}</TableCell>
                    <TableCell>{getStatusBadge(worker.status ?? "unknown")}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${trainingProgress.color}`}
                              style={{ width: `${trainingProgress.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {(worker.trainingCompleted ?? 0)}/{(worker.totalTrainings ?? 1)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getComplianceBadge(worker.complianceStatus ?? "unknown")}</TableCell>
                    <TableCell>
                      {(worker.equipmentRequests ?? 0) > 0 ? (
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          {worker.equipmentRequests} pending
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

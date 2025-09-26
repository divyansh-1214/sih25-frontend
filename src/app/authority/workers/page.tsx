"use client"

import { useState } from "react"
import { WorkerTable } from "@/components/worker-table"
import { WorkerProfileForm } from "@/components/worker-profile-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, GraduationCap } from "lucide-react"

// Mock summary data
const workerSummary = {
  totalWorkers: 142,
  activeWorkers: 128,
  onLeave: 8,
  inactive: 6,
  avgTrainingCompletion: 78.5,
  pendingEquipmentRequests: 12,
  newHiresThisMonth: 5,
}

interface Worker {
  id?: string
  name: string
  role: "collector" | "driver" | "supervisor" | "inspector"
  phone: string
  email: string
  zone: string
  status: "active" | "inactive" | "on_leave"
  trainingCompleted: number
  totalTrainings: number
  complianceStatus: "good" | "warning" | "poor"
  equipmentRequests: number
  joinDate: string
  avatar?: string
  address?: string
  emergencyContact?: string
  notes?: string
}

export default function WorkersPage() {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleEditWorker = (worker: Worker) => {
    setSelectedWorker(worker)
    setShowForm(true)
  }

  const handleSaveWorker = (worker: Worker) => {
    // In a real app, this would save to the backend
    console.log("Saving worker:", worker)
    setShowForm(false)
    setSelectedWorker(null)
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setSelectedWorker(null)
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <WorkerProfileForm worker={selectedWorker || undefined} onSave={handleSaveWorker} onCancel={handleCancelEdit} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Worker Management</h1>
        <p className="text-muted-foreground">Manage worker profiles, training, and equipment requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workerSummary.totalWorkers}</div>
            <p className="text-xs text-green-600">+{workerSummary.newHiresThisMonth} new hires this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{workerSummary.activeWorkers}</div>
            <p className="text-xs text-muted-foreground">
              {((workerSummary.activeWorkers / workerSummary.totalWorkers) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Leave / Inactive</CardTitle>
            <UserX className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{workerSummary.onLeave + workerSummary.inactive}</div>
            <p className="text-xs text-muted-foreground">
              {workerSummary.onLeave} on leave, {workerSummary.inactive} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{workerSummary.avgTrainingCompletion}%</div>
            <p className="text-xs text-muted-foreground">Average across all workers</p>
          </CardContent>
        </Card>
      </div>
      <WorkerTable  />
    </div>
  )
}

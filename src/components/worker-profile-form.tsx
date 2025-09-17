"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { User, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

const trainingModules = [
  "Waste Segregation Basics",
  "Safety Protocols",
  "Equipment Operation",
  "Customer Service",
  "Environmental Compliance",
  "Emergency Procedures",
  "Quality Control",
  "Digital Tools Training",
  "Health & Hygiene",
  "Vehicle Maintenance",
]

const equipmentTypes = [
  "Safety Gloves",
  "Protective Mask",
  "Safety Vest",
  "Collection Tools",
  "Cleaning Supplies",
  "First Aid Kit",
  "Communication Device",
  "Uniform",
]

export function WorkerProfileForm({
  worker,
  onSave,
  onCancel,
}: {
  worker?: Worker
  onSave: (worker: Worker) => void
  onCancel: () => void
}) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<Worker>(
    worker || {
      name: "",
      role: "collector",
      phone: "",
      email: "",
      zone: "Zone 1",
      status: "active",
      trainingCompleted: 0,
      totalTrainings: 10,
      complianceStatus: "good",
      equipmentRequests: 0,
      joinDate: new Date().toISOString().split("T")[0],
      address: "",
      emergencyContact: "",
      notes: "",
    },
  )
  const [completedTrainings, setCompletedTrainings] = useState<string[]>([])
  const [requestedEquipment, setRequestedEquipment] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedWorker = {
      ...formData,
      trainingCompleted: completedTrainings.length,
      equipmentRequests: requestedEquipment.length,
      id: formData.id || `WK-${Date.now().toString().slice(-3)}`,
    }

    onSave(updatedWorker)

    toast({
      title: worker ? "Worker Updated" : "Worker Added",
      description: `${formData.name} has been ${worker ? "updated" : "added"} successfully.`,
    })

    setIsSubmitting(false)
  }

  const handleTrainingChange = (training: string, checked: boolean) => {
    if (checked) {
      setCompletedTrainings([...completedTrainings, training])
    } else {
      setCompletedTrainings(completedTrainings.filter((t) => t !== training))
    }
  }

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    if (checked) {
      setRequestedEquipment([...requestedEquipment, equipment])
    } else {
      setRequestedEquipment(requestedEquipment.filter((e) => e !== equipment))
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {worker ? "Edit Worker Profile" : "Add New Worker"}
        </CardTitle>
        <CardDescription>
          {worker ? "Update worker information and training status" : "Create a new worker profile"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: Worker["role"]) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collector">Waste Collector</SelectItem>
                    <SelectItem value="driver">Vehicle Driver</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="inspector">Inspector</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Assigned Zone</Label>
                <Select value={formData.zone} onValueChange={(value) => setFormData({ ...formData, zone: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Zone 1">Zone 1</SelectItem>
                    <SelectItem value="Zone 2">Zone 2</SelectItem>
                    <SelectItem value="Zone 3">Zone 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Worker["status"]) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="Name and phone number"
              />
            </div>
          </div>

          {/* Training Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Training Status</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {trainingModules.map((training) => (
                <div key={training} className="flex items-center space-x-2">
                  <Checkbox
                    id={training}
                    checked={completedTrainings.includes(training)}
                    onCheckedChange={(checked) => handleTrainingChange(training, checked as boolean)}
                  />
                  <Label htmlFor={training} className="text-sm">
                    {training}
                  </Label>
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              Completed: {completedTrainings.length} / {trainingModules.length} modules
            </div>
          </div>

          {/* Equipment Requests */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Equipment Requests</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {equipmentTypes.map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox
                    id={equipment}
                    checked={requestedEquipment.includes(equipment)}
                    onCheckedChange={(checked) => handleEquipmentChange(equipment, checked as boolean)}
                  />
                  <Label htmlFor={equipment} className="text-sm">
                    {equipment}
                  </Label>
                </div>
              ))}
            </div>
            {requestedEquipment.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {requestedEquipment.map((equipment) => (
                  <Badge key={equipment} variant="outline" className="text-orange-600 border-orange-600">
                    {equipment}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Any additional information about the worker..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {worker ? "Update Worker" : "Add Worker"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

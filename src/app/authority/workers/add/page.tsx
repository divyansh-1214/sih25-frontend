"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { User, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Worker {
  _id?: string
  name: string
  aadhar: string
  address: string
  phoneNumber: string
  password: string
  workerType: "garbage_collector" | "sweeper" | "recycling_worker" | "supervisor" | "maintenance" | "driver" | "other" | "ward_head"
  email: string
  zone?: string
  role?: string
  status?: "active" | "inactive" | "on_leave"
  emergencyContact?: string
  notes?: string
}

export default function AddWorkerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Worker>({
    name: "",
    aadhar: "",
    address: "",
    phoneNumber: "",
    password: "",
    workerType: "garbage_collector",
    email: "",
    zone: "Zone 1",
    role: "worker",
    status: "active",
    emergencyContact: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare data for API
      const workerData = {
        name: formData.name,
        aadhar: formData.aadhar,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        workerType: formData.workerType,
        email: formData.email,
        zone: formData.zone,
        role: formData.role,
      }
      
      // Call the registration API using the correct path
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/worker/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register worker')
      }

      toast({
        title: "Worker Added",
        description: `${formData.name} has been added successfully.`,
      })

      // Redirect to workers list
      router.push('/authority/workers')
      
    } catch (error) {
      console.error("Error saving worker:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save worker. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Add New Worker
          </CardTitle>
          <CardDescription>
            Create a new worker profile
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
                  <Label htmlFor="aadhar">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    value={formData.aadhar}
                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength={12}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workerType">Worker Type</Label>
                  <Select
                    value={formData.workerType}
                    onValueChange={(value: Worker["workerType"]) => setFormData({ ...formData, workerType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="garbage_collector">Garbage Collector</SelectItem>
                      <SelectItem value="sweeper">Sweeper</SelectItem>
                      <SelectItem value="recycling_worker">Recycling Worker</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="ward_head">Ward Head</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                    onValueChange={(value) => setFormData({ ...formData, status: value as Worker["status"] })}
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
                  required
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
                    Add Worker
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

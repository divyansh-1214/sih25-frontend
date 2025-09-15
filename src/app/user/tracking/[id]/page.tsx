"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { VehicleMap } from "@/components/vehicle-map"
import { ArrowLeft, Truck, MapPin, Clock, Bell, Route, CheckCircle, AlertCircle } from "lucide-react"
import { mockVehicleTracking, type VehicleTracking } from "@/lib/mock-data"

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<VehicleTracking | null>(null)
  const [notificationEnabled, setNotificationEnabled] = useState(false)

  useEffect(() => {
    const foundVehicle = mockVehicleTracking.find((v) => v.id === params.id)
    if (foundVehicle) {
      setVehicle(foundVehicle)
    }
  }, [params.id])

  // Simulate real-time updates
  useEffect(() => {
    if (!vehicle) return

    const interval = setInterval(() => {
      setVehicle((prevVehicle) => {
        if (!prevVehicle) return null
        return {
          ...prevVehicle,
          progress: Math.min(prevVehicle.progress + Math.random() * 3, 100),
          status: prevVehicle.progress >= 100 ? "completed" : prevVehicle.status,
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [vehicle])

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Vehicle Not Found</h1>
            <Button onClick={() => router.push("/tracking")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tracking
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on_route":
        return <Truck className="w-5 h-5" />
      case "collecting":
        return <AlertCircle className="w-5 h-5" />
      case "completed":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Truck className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_route":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "collecting":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const toggleNotification = () => {
    setNotificationEnabled(!notificationEnabled)
    // In a real app, this would call an API to set up notifications
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/tracking")} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tracking
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Vehicle {vehicle.vehicleNumber}</h1>
              <p className="text-muted-foreground">{vehicle.route}</p>
            </div>
            <Badge className={`${getStatusColor(vehicle.status)} border`}>
              {getStatusIcon(vehicle.status)}
              <span className="ml-1 capitalize">{vehicle.status.replace("_", " ")}</span>
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle Details */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Vehicle Number</label>
                    <p className="text-lg font-semibold text-foreground">{vehicle.vehicleNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Route</label>
                    <p className="text-sm text-muted-foreground">{vehicle.route}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Current Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{vehicle.currentLocation}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Next Stop</label>
                    <p className="text-sm text-muted-foreground">{vehicle.nextStop}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Estimated Arrival</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{vehicle.estimatedArrival}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="w-5 h-5" />
                    Route Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="text-muted-foreground">{Math.round(vehicle.progress)}%</span>
                    </div>
                    <Progress value={vehicle.progress} className="h-3" />
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={toggleNotification}
                      variant={notificationEnabled ? "default" : "outline"}
                      className="w-full"
                      size="sm"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      {notificationEnabled ? "Notifications On" : "Enable Notifications"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Collection Schedule</CardTitle>
                  <CardDescription>Today's planned stops</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="font-medium text-green-800">Oak Street</p>
                      <p className="text-sm text-green-600">Completed</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="font-medium text-blue-800">{vehicle.currentLocation}</p>
                      <p className="text-sm text-blue-600">In Progress</p>
                    </div>
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{vehicle.nextStop}</p>
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                    </div>
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map */}
            <div className="lg:col-span-2">
              <VehicleMap vehicles={[vehicle]} selectedVehicle={vehicle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

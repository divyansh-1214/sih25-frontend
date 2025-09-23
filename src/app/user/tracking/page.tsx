"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { Truck, MapPin, Clock, Search, Bell, Route, CheckCircle, AlertCircle, NavigationIcon } from "lucide-react"
import { mockVehicleTracking, type VehicleTracking } from "@/lib/mock-data"

export default function TrackingPage() {
  const [vehicles, setVehicles] = useState<VehicleTracking[]>(mockVehicleTracking)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleTracking | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) => ({
          ...vehicle,
          progress: Math.min(vehicle.progress + Math.random() * 5, 100),
          estimatedArrival: vehicle.status === "completed" ? "Completed" : vehicle.estimatedArrival,
          status: vehicle.progress >= 100 ? "completed" : vehicle.status,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Filter vehicles
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.currentLocation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on_route":
        return <Truck className="w-4 h-4" />
      case "collecting":
        return <AlertCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Truck className="w-4 h-4" />
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

  const onRouteVehicles = vehicles.filter((v) => v.status === "on_route").length
  const collectingVehicles = vehicles.filter((v) => v.status === "collecting").length
  const completedVehicles = vehicles.filter((v) => v.status === "completed").length

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Vehicle Tracking</h1>
            <p className="text-muted-foreground text-pretty">
              Track waste collection vehicles in real-time and get updates on collection schedules
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{onRouteVehicles}</div>
                    <div className="text-sm text-muted-foreground">On Route</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{collectingVehicles}</div>
                    <div className="text-sm text-muted-foreground">Collecting</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{completedVehicles}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Route className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{vehicles.length}</div>
                    <div className="text-sm text-muted-foreground">Total Vehicles</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by vehicle number, route, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="on_route">On Route</SelectItem>
                      <SelectItem value="collecting">Collecting</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-foreground">Active Vehicles</h2>

              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className={`hover:shadow-md transition-shadow cursor-pointer ${
                      selectedVehicle?.id === vehicle.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{vehicle.vehicleNumber}</h3>
                            <Badge className={`${getStatusColor(vehicle.status)} border text-xs`}>
                              {getStatusIcon(vehicle.status)}
                              <span className="ml-1 capitalize">{vehicle.status.replace("_", " ")}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{vehicle.route}</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              Current: {vehicle.currentLocation}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <NavigationIcon className="w-4 h-4" />
                              Next: {vehicle.nextStop}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              ETA: {vehicle.estimatedArrival}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Route Progress</span>
                          <span className="text-muted-foreground">{Math.round(vehicle.progress)}%</span>
                        </div>
                        <Progress value={vehicle.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Vehicles Found</h3>
                    <p className="text-muted-foreground mb-4">
                      No vehicles match your current search criteria. Try adjusting your filters.
                    </p>
                    <Button
                      onClick={() => {
                        setSearchTerm("")
                        setStatusFilter("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Vehicle Details & Map */}
            <div className="space-y-6">
              {/* Selected Vehicle Details */}
              {selectedVehicle ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      {selectedVehicle.vehicleNumber}
                    </CardTitle>
                    <CardDescription>Real-time vehicle information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-foreground">Route</label>
                        <p className="text-sm text-muted-foreground">{selectedVehicle.route}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Current Location</label>
                        <p className="text-sm text-muted-foreground">{selectedVehicle.currentLocation}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Next Stop</label>
                        <p className="text-sm text-muted-foreground">{selectedVehicle.nextStop}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Estimated Arrival</label>
                        <p className="text-sm text-muted-foreground">{selectedVehicle.estimatedArrival}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">Status</label>
                        <div className="mt-1">
                          <Badge className={`${getStatusColor(selectedVehicle.status)} border text-xs`}>
                            {getStatusIcon(selectedVehicle.status)}
                            <span className="ml-1 capitalize">{selectedVehicle.status.replace("_", " ")}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full" size="sm">
                        <Bell className="w-4 h-4 mr-2" />
                        Set Arrival Notification
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <Truck className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">Select a vehicle to view details</p>
                  </CardContent>
                </Card>
              )}

              {/* Map Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Live Map
                  </CardTitle>
                  <CardDescription>Real-time vehicle locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Interactive map would be displayed here</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedVehicle ? `Tracking ${selectedVehicle.vehicleNumber}` : "Showing all vehicles"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Collection Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Todays Schedule
                  </CardTitle>
                  <CardDescription>Upcoming collections in your area</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">General Waste</p>
                      <p className="text-sm text-muted-foreground">Your street</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">9:30 AM</p>
                      <p className="text-xs text-muted-foreground">WM-001</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Recyclables</p>
                      <p className="text-sm text-muted-foreground">Your street</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">2:15 PM</p>
                      <p className="text-xs text-muted-foreground">WM-002</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Full Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How Vehicle Tracking Works</CardTitle>
              <CardDescription>Stay informed about waste collection in your area</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Real-time Tracking</h4>
                  <p className="text-sm text-muted-foreground">
                    See live locations and progress of waste collection vehicles
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Smart Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when collection vehicles are approaching your area
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Schedule Updates</h4>
                  <p className="text-sm text-muted-foreground">
                    Stay updated on collection schedules and any service changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, User, MapPin, Clock, Fuel, Route } from "lucide-react"

interface Vehicle {
  id: string
  type: "truck" | "worker"
  name: string
  lat: number
  lng: number
  status: "active" | "idle" | "maintenance"
  route?: string
  lastUpdate: string
  fuel?: number
  speed?: number
}

// Mock data for vehicles and workers
const mockVehicles: Vehicle[] = [
  {
    id: "TR-101",
    type: "truck",
    name: "Collection Truck 101",
    lat: 12.9716,
    lng: 77.5946,
    status: "active",
    route: "Zone A - Route 1",
    lastUpdate: "2 min ago",
    fuel: 75,
    speed: 25,
  },
  {
    id: "TR-102",
    type: "truck",
    name: "Collection Truck 102",
    lat: 12.9616,
    lng: 77.5846,
    status: "idle",
    route: "Zone B - Route 2",
    lastUpdate: "5 min ago",
    fuel: 45,
    speed: 0,
  },
  {
    id: "WK-201",
    type: "worker",
    name: "Rajesh Kumar",
    lat: 12.9816,
    lng: 77.6046,
    status: "active",
    route: "Zone C - Inspection",
    lastUpdate: "1 min ago",
  },
  {
    id: "WK-202",
    type: "worker",
    name: "Priya Sharma",
    lat: 12.9516,
    lng: 77.5746,
    status: "active",
    route: "Zone A - Compliance Check",
    lastUpdate: "3 min ago",
  },
  {
    id: "TR-103",
    type: "truck",
    name: "Collection Truck 103",
    lat: 12.9916,
    lng: 77.6146,
    status: "maintenance",
    route: "Depot",
    lastUpdate: "1 hour ago",
    fuel: 20,
    speed: 0,
  },
]

export function MapView() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((vehicle) => ({
          ...vehicle,
          // Simulate small position changes for active vehicles
          lat: vehicle.status === "active" ? vehicle.lat + (Math.random() - 0.5) * 0.001 : vehicle.lat,
          lng: vehicle.status === "active" ? vehicle.lng + (Math.random() - 0.5) * 0.001 : vehicle.lng,
          lastUpdate: vehicle.status === "active" ? "Just now" : vehicle.lastUpdate,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "maintenance":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "idle":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Idle</Badge>
      case "maintenance":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Maintenance</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Map Area */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Live Tracking Map</CardTitle>
            <CardDescription>Real-time positions of vehicles and field workers</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock Map Interface */}
            <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                {/* Mock map grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300" />
                    ))}
                  </div>
                </div>

                {/* Vehicle markers */}
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${((vehicle.lng - 77.5746) / 0.04) * 100 + 50}%`,
                      top: `${((12.9916 - vehicle.lat) / 0.04) * 100 + 50}%`,
                    }}
                    onClick={() => setSelectedVehicle(vehicle)}
                  >
                    <div className="relative">
                      <div
                        className={`w-4 h-4 rounded-full ${getStatusColor(vehicle.status)} border-2 border-white shadow-lg`}
                      />
                      {vehicle.type === "truck" ? (
                        <Truck className="absolute -top-1 -left-1 w-6 h-6 text-blue-600" />
                      ) : (
                        <User className="absolute -top-1 -left-1 w-6 h-6 text-purple-600" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Map controls */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="outline" className="bg-white">
                    Zoom In
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white">
                    Zoom Out
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="text-sm font-medium mb-2">Legend</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Vehicles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span>Workers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span>Idle</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle List & Details */}
      <div className="space-y-4">
        {/* Selected Vehicle Details */}
        {selectedVehicle && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedVehicle.type === "truck" ? <Truck className="w-5 h-5" /> : <User className="w-5 h-5" />}
                {selectedVehicle.name}
              </CardTitle>
              <CardDescription>ID: {selectedVehicle.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                {getStatusBadge(selectedVehicle.status)}
              </div>
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{selectedVehicle.route}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Updated {selectedVehicle.lastUpdate}</span>
              </div>
              {selectedVehicle.fuel && (
                <div className="flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Fuel: {selectedVehicle.fuel}%</span>
                </div>
              )}
              {selectedVehicle.speed !== undefined && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Speed: {selectedVehicle.speed} km/h</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Vehicle List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Units</CardTitle>
            <CardDescription>{vehicles.length} vehicles and workers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle?.id === vehicle.id ? "bg-accent" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedVehicle(vehicle)}
                >
                  <div className="flex items-center gap-2">
                    {vehicle.type === "truck" ? (
                      <Truck className="w-4 h-4 text-blue-600" />
                    ) : (
                      <User className="w-4 h-4 text-purple-600" />
                    )}
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(vehicle.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{vehicle.id}</p>
                    <p className="text-xs text-muted-foreground truncate">{vehicle.route}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{vehicle.lastUpdate}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

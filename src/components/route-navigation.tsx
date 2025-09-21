"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, CheckCircle, AlertTriangle, X, Locate, Route } from "lucide-react"

interface RouteStop {
  id: string
  houseId: string
  address: string
  status: "pending" | "completed" | "skipped" | "current"
  estimatedTime: string
  actualTime?: string
  coordinates: { lat: number; lng: number }
}

export default function RouteNavigation({ onClose }: { onClose: () => void }) {
  const [currentLocation, setCurrentLocation] = useState({ lat: 40.7128, lng: -74.006 })
  const [selectedStop, setSelectedStop] = useState<string | null>(null)
  const [routeStops, setRouteStops] = useState<RouteStop[]>([
    {
      id: "1",
      houseId: "HSE-001",
      address: "123 Main St",
      status: "completed",
      estimatedTime: "9:00 AM",
      actualTime: "9:05 AM",
      coordinates: { lat: 40.712, lng: -74.005 },
    },
    {
      id: "2",
      houseId: "HSE-002",
      address: "456 Oak Ave",
      status: "completed",
      estimatedTime: "9:15 AM",
      actualTime: "9:18 AM",
      coordinates: { lat: 40.7125, lng: -74.0055 },
    },
    {
      id: "3",
      houseId: "HSE-003",
      address: "789 Pine Rd",
      status: "current",
      estimatedTime: "9:30 AM",
      coordinates: { lat: 40.713, lng: -74.0065 },
    },
    {
      id: "4",
      houseId: "HSE-004",
      address: "321 Elm St",
      status: "pending",
      estimatedTime: "9:45 AM",
      coordinates: { lat: 40.7135, lng: -74.007 },
    },
    {
      id: "5",
      houseId: "HSE-005",
      address: "654 Birch Ln",
      status: "pending",
      estimatedTime: "10:00 AM",
      coordinates: { lat: 40.714, lng: -74.0075 },
    },
  ])

  const completedCount = routeStops.filter((stop) => stop.status === "completed").length
  const totalStops = routeStops.length
  const currentStop = routeStops.find((stop) => stop.status === "current")

  const markStopComplete = (stopId: string) => {
    setRouteStops((prev) =>
      prev.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            status: "completed" as const,
            actualTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
        }
        return stop
      }),
    )
  }

  const skipStop = (stopId: string) => {
    setRouteStops((prev) =>
      prev.map((stop) => {
        if (stop.id === stopId) {
          return { ...stop, status: "skipped" as const }
        }
        return stop
      }),
    )
  }

  const getStatusColor = (status: RouteStop["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "current":
        return "bg-blue-500"
      case "skipped":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: RouteStop["status"]) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "current":
        return "Current"
      case "skipped":
        return "Skipped"
      default:
        return "Pending"
    }
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-orange-500" />
          <div>
            <h1 className="text-lg font-semibold text-foreground">Route Navigation</h1>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{totalStops} stops completed
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="bg-muted/30 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Route Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round((completedCount / totalStops) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalStops) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Map Placeholder */}
        <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 relative border-b border-border">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Interactive Map View</p>
              <p className="text-xs text-muted-foreground">GPS tracking enabled</p>
            </div>
          </div>

          {/* Current Location Indicator */}
          <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-foreground">Live Location</span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              <Locate className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="secondary" className="w-10 h-10 p-0">
              <Route className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Stop Card */}
        {currentStop && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-b border-border">
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">Current Stop</CardTitle>
                  <Badge className="bg-blue-500 text-white">
                    <Navigation className="w-3 h-3 mr-1" />
                    Navigate
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-foreground">{currentStop.houseId}</p>
                    <p className="text-sm text-muted-foreground">{currentStop.address}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">ETA: {currentStop.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">0.2 km away</span>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => markStopComplete(currentStop.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                    <Button variant="outline" onClick={() => skipStop(currentStop.id)} className="flex-1">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Skip
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Route Stops List */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">All Stops</h3>
          <div className="space-y-3">
            {routeStops.map((stop, index) => (
              <Card
                key={stop.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedStop === stop.id ? "border-primary" : ""
                } ${stop.status === "current" ? "border-blue-200 bg-blue-50/50 dark:bg-blue-950/10" : ""}`}
                onClick={() => setSelectedStop(selectedStop === stop.id ? null : stop.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Step Number */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getStatusColor(stop.status)}`}
                    >
                      {stop.status === "completed" ? <CheckCircle className="w-4 h-4" /> : index + 1}
                    </div>

                    {/* Stop Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{stop.houseId}</p>
                          <p className="text-sm text-muted-foreground">{stop.address}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className={`${getStatusColor(stop.status)} text-white`}>
                            {getStatusText(stop.status)}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">{stop.actualTime || stop.estimatedTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedStop === stop.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Estimated:</span>
                          <p className="font-medium text-foreground">{stop.estimatedTime}</p>
                        </div>
                        {stop.actualTime && (
                          <div>
                            <span className="text-muted-foreground">Actual:</span>
                            <p className="font-medium text-foreground">{stop.actualTime}</p>
                          </div>
                        )}
                      </div>

                      {stop.status === "pending" && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <Navigation className="w-3 h-3 mr-1" />
                            Navigate
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                            <MapPin className="w-3 h-3 mr-1" />
                            View on Map
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="bg-card border-t border-border p-4">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Clock className="w-4 h-4 mr-2" />
            Request Break
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Truck, Navigation } from "lucide-react"
import type { VehicleTracking } from "@/lib/mock-data"

interface VehicleMapProps {
  vehicles: VehicleTracking[]
  selectedVehicle?: VehicleTracking | null
  onVehicleSelect?: (vehicle: VehicleTracking) => void
}

export function VehicleMap({ vehicles, selectedVehicle, onVehicleSelect }: VehicleMapProps) {
  // const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.006 })

  useEffect(() => {
    if (selectedVehicle) {
      // In a real implementation, this would update the map center based on vehicle coordinates
      console.log(`Centering map on vehicle ${selectedVehicle.vehicleNumber}`)
    }
  }, [selectedVehicle])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_route":
        return "#3b82f6" // blue
      case "collecting":
        return "#f59e0b" // orange
      case "completed":
        return "#10b981" // green
      default:
        return "#6b7280" // gray
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Live Vehicle Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-muted/30 rounded-lg h-96 overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle Markers */}
          {vehicles.map((vehicle, index) => (
            <div
              key={vehicle.id}
              className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                selectedVehicle?.id === vehicle.id ? "scale-125 z-10" : "hover:scale-110"
              }`}
              style={{
                left: `${20 + index * 25}%`,
                top: `${30 + index * 20}%`,
              }}
              onClick={() => onVehicleSelect?.(vehicle)}
            >
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                  style={{ backgroundColor: getStatusColor(vehicle.status) }}
                >
                  <Truck className="w-4 h-4 text-white" />
                </div>
                {selectedVehicle?.id === vehicle.id && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-max">
                    <div className="text-xs font-medium text-foreground">{vehicle.vehicleNumber}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.currentLocation}</div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Route Lines (simplified) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {vehicles.map((vehicle, index) => (
              <g key={`route-${vehicle.id}`}>
                <path
                  d={`M ${20 + index * 25}% ${30 + index * 20}% Q ${40 + index * 15}% ${50 + index * 10}% ${60 + index * 20}% ${70 + index * 15}%`}
                  stroke={getStatusColor(vehicle.status)}
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                  opacity="0.6"
                />
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <div className="text-xs font-medium text-foreground mb-2">Vehicle Status</div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-muted-foreground">On Route</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs text-muted-foreground">Collecting</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-muted-foreground">Completed</span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="w-8 h-8 bg-white rounded shadow-lg flex items-center justify-center hover:bg-gray-50">
              <span className="text-lg font-bold text-gray-600">+</span>
            </button>
            <button className="w-8 h-8 bg-white rounded shadow-lg flex items-center justify-center hover:bg-gray-50">
              <span className="text-lg font-bold text-gray-600">-</span>
            </button>
            <button className="w-8 h-8 bg-white rounded shadow-lg flex items-center justify-center hover:bg-gray-50">
              <Navigation className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Map Info */}
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {vehicles.length} active vehicles</span>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}

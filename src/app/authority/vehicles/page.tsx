import { MapView } from "@/components/map-view"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Users, Clock, AlertTriangle } from "lucide-react"

// Mock summary data
const vehicleSummary = {
  totalVehicles: 15,
  activeVehicles: 12,
  totalWorkers: 45,
  activeWorkers: 38,
  maintenanceAlerts: 2,
  avgResponseTime: "12 min",
}

export default function VehiclesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Vehicle & Worker Tracking</h1>
        <p className="text-muted-foreground">Real-time tracking of vehicles and field workers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicleSummary.totalVehicles}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600 border-green-600">
                {vehicleSummary.activeVehicles} active
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Field Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicleSummary.totalWorkers}</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-green-600 border-green-600">
                {vehicleSummary.activeWorkers} on duty
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vehicleSummary.avgResponseTime}</div>
            <p className="text-xs text-green-600">-2 min from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{vehicleSummary.maintenanceAlerts}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Map and Tracking */}
      <MapView />
    </div>
  )
}

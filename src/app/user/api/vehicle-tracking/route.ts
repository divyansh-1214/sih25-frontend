import { type NextRequest, NextResponse } from "next/server"
import { mockVehicleTracking } from "@/lib/mock-data"

export async function GET() {
  try {
    // Simulate real-time updates by slightly modifying the mock data
    const updatedVehicles = mockVehicleTracking.map((vehicle) => ({
      ...vehicle,
      progress: Math.min(vehicle.progress + Math.random() * 10, 100),
      currentLocation: vehicle.currentLocation,
      estimatedArrival: vehicle.progress >= 100 ? "Completed" : vehicle.estimatedArrival,
      status: vehicle.progress >= 100 ? ("completed" as const) : vehicle.status,
    }))

    return NextResponse.json(updatedVehicles)
  } catch (error) {
    console.error("Error fetching vehicle tracking data:", error)
    return NextResponse.json({ error: "Failed to fetch vehicle data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { vehicleId, notificationType } = await request.json()

    if (!vehicleId || !notificationType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Simulate notification setup
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: `${notificationType} notification set for vehicle ${vehicleId}`,
      notificationId: Date.now().toString(),
    })
  } catch (error) {
    console.error("Error setting up notification:", error)
    return NextResponse.json({ error: "Failed to set up notification" }, { status: 500 })
  }
}

// Mock API functions for dashboard data
export interface DashboardSummary {
  collectionRate: number
  segregationCompliance: number
  landfillDiversion: number
  activeWorkers: number
}

export interface Alert {
  id: string
  type: "error" | "warning" | "success"
  message: string
  timestamp: string
}

export interface TodaySummary {
  routesCompleted: number
  totalRoutes: number
  wasteCollected: number
  citizenReports: number
  penaltiesIssued: number
}

// Mock data
export async function getDashboardSummary(): Promise<DashboardSummary> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    collectionRate: 94.2,
    segregationCompliance: 87.5,
    landfillDiversion: 76.8,
    activeWorkers: 142,
  }
}

export async function getRecentAlerts(): Promise<Alert[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return [
    {
      id: "1",
      type: "error",
      message: "High non-compliance in Zone 3",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "warning",
      message: "Vehicle TR-101 maintenance due",
      timestamp: "4 hours ago",
    },
    {
      id: "3",
      type: "success",
      message: "Zone 1 collection completed",
      timestamp: "6 hours ago",
    },
  ]
}

export async function getTodaySummary(): Promise<TodaySummary> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    routesCompleted: 23,
    totalRoutes: 28,
    wasteCollected: 847,
    citizenReports: 12,
    penaltiesIssued: 3,
  }
}

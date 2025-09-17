import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { ChartCard, WeeklyCollectionChart, ComplianceTrendChart, WasteDistributionChart } from "@/components/chart-card"
import { Truck, Users, AlertTriangle, CheckCircle } from "lucide-react"
import { getDashboardSummary, getRecentAlerts, getTodaySummary } from "@/lib/api"

async function DashboardStats() {
  const summary = await getDashboardSummary()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Collection Rate"
        value={`${summary.collectionRate}%`}
        change="+2.1% from last month"
        icon={Truck}
        trend="up"
      />
      <StatCard
        title="Segregation Compliance"
        value={`${summary.segregationCompliance}%`}
        change="+5.3% from last month"
        icon={CheckCircle}
        trend="up"
      />
      <StatCard
        title="Landfill Diversion"
        value={`${summary.landfillDiversion}%`}
        change="+1.2% from last month"
        icon={AlertTriangle}
        trend="up"
      />
      <StatCard
        title="Active Workers"
        value={summary.activeWorkers.toString()}
        change="8 on leave today"
        icon={Users}
        trend="neutral"
      />
    </div>
  )
}

async function RecentAlerts() {
  const alerts = await getRecentAlerts()

  const alertColors = {
    error: "bg-red-500",
    warning: "bg-yellow-500",
    success: "bg-green-500",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Latest compliance and operational alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${alertColors[alert.type]}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

async function TodaySummaryCard() {
  const summary = await getTodaySummary()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Summary</CardTitle>
        <CardDescription>Key metrics for today's operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Routes Completed</span>
            <span className="text-sm font-medium">
              {summary.routesCompleted}/{summary.totalRoutes}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Waste Collected</span>
            <span className="text-sm font-medium">{summary.wasteCollected} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Citizen Reports</span>
            <span className="text-sm font-medium">{summary.citizenReports} new</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Penalties Issued</span>
            <span className="text-sm font-medium">{summary.penaltiesIssued}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-8 bg-muted rounded w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">City Waste Dashboard</h1>
        <p className="text-muted-foreground">Overview of waste collection, compliance, and operational metrics</p>
      </div>

      {/* Summary Cards */}
      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <LoadingCard key={i} />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChartCard title="Weekly Collection Performance" description="Daily waste collection vs targets">
          <WeeklyCollectionChart />
        </ChartCard>

        <ChartCard title="Compliance Trend" description="6-month segregation compliance trend">
          <ComplianceTrendChart />
        </ChartCard>

        <ChartCard title="Waste Distribution" description="Breakdown by waste category">
          <WasteDistributionChart />
        </ChartCard>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<LoadingCard />}>
          <RecentAlerts />
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <TodaySummaryCard />
        </Suspense>
      </div>
    </div>
  )
}

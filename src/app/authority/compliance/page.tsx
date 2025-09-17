import { ComplianceTable } from "@/components/compliance-table"
import { ComplianceHeatmap } from "@/components/compliance-heatmap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, XCircle, QrCode } from "lucide-react"

// Mock summary data
const complianceSummary = {
  totalHouseholds: 892,
  compliantHouseholds: 678,
  warningHouseholds: 156,
  violationHouseholds: 58,
  avgComplianceRate: 82.4,
  qrScansToday: 234,
  inspectionsCompleted: 45,
}

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Compliance Monitoring</h1>
        <p className="text-muted-foreground">Monitor household and zone compliance with waste segregation rules</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Households</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceSummary.compliantHouseholds}</div>
            <p className="text-xs text-muted-foreground">
              {((complianceSummary.compliantHouseholds / complianceSummary.totalHouseholds) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{complianceSummary.warningHouseholds}</div>
            <p className="text-xs text-muted-foreground">
              {((complianceSummary.warningHouseholds / complianceSummary.totalHouseholds) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{complianceSummary.violationHouseholds}</div>
            <p className="text-xs text-muted-foreground">
              {((complianceSummary.violationHouseholds / complianceSummary.totalHouseholds) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Scans Today</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceSummary.qrScansToday}</div>
            <p className="text-xs text-green-600">+12% from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <ComplianceHeatmap />

      {/* Detailed Table */}
      <ComplianceTable />
    </div>
  )
}

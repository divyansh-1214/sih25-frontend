import { EnforcementForm } from "@/components/enforcement-form"
import { EnforcementHistory } from "@/components/enforcement-history"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, DollarSign, Clock } from "lucide-react"

// Mock summary data
const enforcementSummary = {
  totalWarnings: 45,
  totalPenalties: 23,
  totalAmount: 15600,
  overduePayments: 8,
  warningsThisMonth: 12,
  penaltiesThisMonth: 7,
  collectionRate: 87.5,
}

export default function EnforcementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Enforcement Management</h1>
        <p className="text-muted-foreground">Issue warnings and penalties for non-compliance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enforcementSummary.totalWarnings}</div>
            <p className="text-xs text-muted-foreground">+{enforcementSummary.warningsThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalties</CardTitle>
            <FileText className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enforcementSummary.totalPenalties}</div>
            <p className="text-xs text-muted-foreground">+{enforcementSummary.penaltiesThisMonth} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{enforcementSummary.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-green-600">{enforcementSummary.collectionRate}% collection rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{enforcementSummary.overduePayments}</div>
            <p className="text-xs text-muted-foreground">Requires follow-up</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enforcement Form */}
        <div className="lg:col-span-1">
          <EnforcementForm />
        </div>

        {/* Enforcement History */}
        <div className="lg:col-span-2">
          <EnforcementHistory />
        </div>
      </div>
    </div>
  )
}

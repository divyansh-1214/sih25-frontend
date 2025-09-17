"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ZoneData {
  zone: string
  blocks: {
    block: string
    complianceRate: number
    households: number
    violations: number
  }[]
}

const mockZoneData: ZoneData[] = [
  {
    zone: "Zone 1",
    blocks: [
      { block: "Block A", complianceRate: 95, households: 45, violations: 2 },
      { block: "Block B", complianceRate: 78, households: 38, violations: 8 },
      { block: "Block C", complianceRate: 88, households: 42, violations: 5 },
      { block: "Block D", complianceRate: 92, households: 40, violations: 3 },
    ],
  },
  {
    zone: "Zone 2",
    blocks: [
      { block: "Block A", complianceRate: 85, households: 35, violations: 5 },
      { block: "Block B", complianceRate: 72, households: 48, violations: 13 },
      { block: "Block C", complianceRate: 45, households: 52, violations: 28 },
      { block: "Block D", complianceRate: 68, households: 44, violations: 14 },
    ],
  },
  {
    zone: "Zone 3",
    blocks: [
      { block: "Block A", complianceRate: 90, households: 38, violations: 4 },
      { block: "Block B", complianceRate: 82, households: 41, violations: 7 },
      { block: "Block C", complianceRate: 76, households: 39, violations: 9 },
      { block: "Block D", complianceRate: 62, households: 46, violations: 17 },
    ],
  },
]

export function ComplianceHeatmap() {
  const getComplianceColor = (rate: number) => {
    if (rate >= 90) return "bg-green-500"
    if (rate >= 80) return "bg-green-400"
    if (rate >= 70) return "bg-yellow-400"
    if (rate >= 60) return "bg-orange-400"
    return "bg-red-500"
  }

  const getComplianceTextColor = (rate: number) => {
    if (rate >= 90) return "text-green-700"
    if (rate >= 80) return "text-green-600"
    if (rate >= 70) return "text-yellow-700"
    if (rate >= 60) return "text-orange-700"
    return "text-red-700"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Heatmap</CardTitle>
        <CardDescription>Visual overview of compliance rates across zones and blocks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockZoneData.map((zone) => (
            <div key={zone.zone}>
              <h3 className="text-lg font-semibold mb-3">{zone.zone}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {zone.blocks.map((block) => (
                  <div
                    key={block.block}
                    className={`p-4 rounded-lg border-2 ${getComplianceColor(block.complianceRate)} bg-opacity-20 border-opacity-50`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-sm">{block.block}</div>
                      <div className={`text-2xl font-bold ${getComplianceTextColor(block.complianceRate)}`}>
                        {block.complianceRate}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{block.households} households</div>
                      {block.violations > 0 && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          {block.violations} violations
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <div className="text-sm font-medium mb-2">Compliance Rate Legend</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>90%+ Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-400 rounded"></div>
              <span>80-89% Good</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span>70-79% Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-400 rounded"></div>
              <span>60-69% Poor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>&lt;60% Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { type NextRequest, NextResponse } from "next/server"
import { mockCommunityReports } from "@/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json(mockCommunityReports)
  } catch (error) {
    console.error("Error fetching community reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const reportData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "description", "category", "location", "priority"]
    for (const field of requiredFields) {
      if (!reportData[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Simulate report creation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newReport = {
      id: Date.now().toString(),
      title: reportData.title,
      description: reportData.description,
      category: reportData.category,
      location: reportData.location,
      status: "pending",
      reportedAt: new Date().toISOString(),
      reportedBy: "Current User", // In real app, this would come from auth
      priority: reportData.priority,
    }

    return NextResponse.json(newReport, { status: 201 })
  } catch (error) {
    console.error("Error creating community report:", error)
    return NextResponse.json({ error: "Failed to create report" }, { status: 500 })
  }
}

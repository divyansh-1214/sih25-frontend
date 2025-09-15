import { type NextRequest, NextResponse } from "next/server"
import { mockWasteItems } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock AI identification - in real app, this would call an AI service
    const randomItem = mockWasteItems[Math.floor(Math.random() * mockWasteItems.length)]
    const confidence = Math.floor(Math.random() * 20) + 80 // 80-99% confidence

    const result = {
      item: randomItem,
      confidence,
      timestamp: new Date().toISOString(),
      processingTime: "1.2s",
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error identifying waste:", error)
    return NextResponse.json({ error: "Failed to identify waste" }, { status: 500 })
  }
}

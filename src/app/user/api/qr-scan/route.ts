import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { qrData } = await request.json()

    if (!qrData) {
      return NextResponse.json({ error: "No QR data provided" }, { status: 400 })
    }

    // Simulate QR code processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock QR scan results based on QR data
    const mockResults = [
      {
        id: "QR001",
        wasteType: "Recyclable Plastic",
        points: 15,
        location: "Main Street Collection Point",
        verified: true,
      },
      {
        id: "QR002",
        wasteType: "Organic Waste",
        points: 10,
        location: "Park Avenue Bin",
        verified: true,
      },
      {
        id: "QR003",
        wasteType: "Hazardous Battery",
        points: 25,
        location: "Electronics Store Drop-off",
        verified: true,
      },
      {
        id: "QR004",
        wasteType: "General Waste",
        points: 5,
        location: "Shopping Center",
        verified: false,
      },
    ]

    const result = mockResults[Math.floor(Math.random() * mockResults.length)]

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      processingTime: "0.8s",
    })
  } catch (error) {
    console.error("Error processing QR scan:", error)
    return NextResponse.json({ error: "Failed to process QR scan" }, { status: 500 })
  }
}

"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { QrCode, Camera, Award, CheckCircle, AlertCircle, Scan, History, TrendingUp } from "lucide-react"

interface QRScanResult {
  id: string
  wasteType: string
  points: number
  location: string
  timestamp: string
  verified: boolean
}

export default function QRScannerPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recentScans, setRecentScans] = useState<QRScanResult[]>([])
  const [totalPoints, setTotalPoints] = useState(1250)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Mock recent scans data
  useEffect(() => {
    setRecentScans([
      {
        id: "QR001",
        wasteType: "Recyclable Plastic",
        points: 15,
        location: "Main Street Collection Point",
        timestamp: "2024-01-15T14:30:00Z",
        verified: true,
      },
      {
        id: "QR002",
        wasteType: "Organic Waste",
        points: 10,
        location: "Park Avenue Bin",
        timestamp: "2024-01-15T12:15:00Z",
        verified: true,
      },
      {
        id: "QR003",
        wasteType: "General Waste",
        points: 5,
        location: "Shopping Center",
        timestamp: "2024-01-14T16:45:00Z",
        verified: false,
      },
    ])
  }, [])

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsScanning(true)
        setError(null)
        setScanResult(null)
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions to scan QR codes."+err)
    }
  }

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsScanning(false)
    }
  }

  const simulateQRScan = () => {
    // Simulate QR code detection
    const mockResults = [
      {
        id: "QR004",
        wasteType: "Recyclable Paper",
        points: 12,
        location: "City Center Collection",
        timestamp: new Date().toISOString(),
        verified: true,
      },
      {
        id: "QR005",
        wasteType: "Hazardous Battery",
        points: 25,
        location: "Electronics Store Drop-off",
        timestamp: new Date().toISOString(),
        verified: true,
      },
    ]

    const result = mockResults[Math.floor(Math.random() * mockResults.length)]
    setScanResult(result)
    setTotalPoints((prev) => prev + result.points)
    setRecentScans((prev) => [result, ...prev.slice(0, 4)])
    stopScanning()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getWasteTypeColor = (wasteType: string) => {
    if (wasteType.toLowerCase().includes("recyclable")) return "bg-blue-100 text-blue-800 border-blue-200"
    if (wasteType.toLowerCase().includes("organic")) return "bg-green-100 text-green-800 border-green-200"
    if (wasteType.toLowerCase().includes("hazardous")) return "bg-red-100 text-red-800 border-red-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">QR Code Scanner</h1>
            <p className="text-muted-foreground text-pretty">
              Scan QR codes on waste bags to track disposal and earn green points
            </p>
          </div>

          {/* Points Overview */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Your Green Points</h3>
                  <p className="text-sm text-muted-foreground">Earned through responsible waste disposal</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{totalPoints.toLocaleString()}</div>
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                    <TrendingUp className="w-3 h-3 mr-1" />+{recentScans.reduce((sum, scan) => sum + scan.points, 0)}{" "}
                    this week
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Scanner Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  QR Code Scanner
                </CardTitle>
                <CardDescription>Point your camera at a QR code on waste bags or bins</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Camera View */}
                {isScanning && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-muted"
                      style={{ maxHeight: "300px" }}
                    />
                    {/* QR Code Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-primary rounded-lg">
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary"></div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button onClick={simulateQRScan} className="flex-1">
                        <Scan className="w-4 h-4 mr-2" />
                        Simulate Scan
                      </Button>
                      <Button variant="outline" onClick={stopScanning}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Scan Result */}
                {scanResult && !isScanning && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800">QR Code Scanned Successfully!</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">Waste Type:</span>
                          <Badge className={`${getWasteTypeColor(scanResult.wasteType)} border text-xs`}>
                            {scanResult.wasteType}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Location:</span>
                          <span className="text-green-800">{scanResult.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Points Earned:</span>
                          <span className="font-bold text-green-800">+{scanResult.points}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Status:</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => setScanResult(null)} className="w-full">
                      Scan Another QR Code
                    </Button>
                  </div>
                )}

                {/* Start Scanning Button */}
                {!isScanning && !scanResult && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <QrCode className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-4">Ready to scan QR codes on waste bags</p>
                    <Button onClick={startScanning} size="lg" className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            {/* Recent Scans & Points History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Recent Scans
                </CardTitle>
                <CardDescription>Your latest QR code scans and points earned</CardDescription>
              </CardHeader>
              <CardContent>
                {recentScans.length > 0 ? (
                  <div className="space-y-4">
                    {recentScans.map((scan) => (
                      <div key={scan.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${getWasteTypeColor(scan.wasteType)} border text-xs`}>
                              {scan.wasteType}
                            </Badge>
                            {scan.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                          </div>
                          <p className="text-sm text-muted-foreground">{scan.location}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(scan.timestamp)}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">+{scan.points}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <History className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">No scans yet</p>
                    <p className="text-sm text-muted-foreground">Start scanning QR codes to see your history</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How QR Code Tracking Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold mb-2">1. Find QR Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Look for QR codes on waste bags, bins, or collection points
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Scan className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-semibold mb-2">2. Scan Code</h4>
                  <p className="text-sm text-muted-foreground">
                    Use your camera to scan the QR code and verify proper disposal
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold mb-2">3. Earn Points</h4>
                  <p className="text-sm text-muted-foreground">
                    Get green points for responsible waste disposal and tracking
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Points Breakdown */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Points System</CardTitle>
              <CardDescription>Earn different points based on waste type and disposal method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-800 mb-1">3-8</div>
                  <div className="text-sm text-green-700">Organic Waste</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-800 mb-1">5-15</div>
                  <div className="text-sm text-blue-700">Recyclables</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-800 mb-1">15-30</div>
                  <div className="text-sm text-red-700">Hazardous</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-2xl font-bold text-gray-800 mb-1">2-5</div>
                  <div className="text-sm text-gray-700">General</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

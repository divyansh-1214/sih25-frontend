"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Camera, QrCode, CheckCircle, X, RotateCcw, Flashlight } from "lucide-react"

interface ScanResult {
  id: string
  houseId: string
  timestamp: string
  workerId: string
  status: "success" | "error"
}

export default function QRScanner({ onClose }: { onClose: () => void }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])
  const [flashEnabled, setFlashEnabled] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate camera access and QR scanning
  const startScanning = async () => {
    setIsScanning(true)
    setScanResult(null)

    try {
      // In a real app, you would use navigator.mediaDevices.getUserMedia
      // For demo purposes, we'll simulate the camera
      if (videoRef.current) {
        // Simulate camera stream
        videoRef.current.style.background = "linear-gradient(45deg, #1f2937, #374151)"
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    setIsScanning(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  // Simulate QR code detection
  const simulateQRDetection = () => {
    const houseIds = ["HSE-001", "HSE-002", "HSE-003", "HSE-004", "HSE-005"]
    const randomHouseId = houseIds[Math.floor(Math.random() * houseIds.length)]

    const newScan: ScanResult = {
      id: `scan-${Date.now()}`,
      houseId: randomHouseId,
      timestamp: new Date().toLocaleTimeString(),
      workerId: "WM-2024-001",
      status: "success",
    }

    setScanResult(newScan)
    setRecentScans((prev) => [newScan, ...prev.slice(0, 4)])
    setIsScanning(false)
  }

  const confirmScan = () => {
    if (scanResult) {
      // In a real app, this would submit to backend
      console.log("Scan confirmed:", scanResult)
      setScanResult(null)
    }
  }

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled)
    // In a real app, this would control the camera flash
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <QrCode className="w-6 h-6 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">QR Scanner</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Scanner Interface */}
      <div className="flex-1 flex flex-col">
        {!scanResult ? (
          <>
            {/* Camera View */}
            <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />

              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* QR Code Frame */}
                  <div className="w-64 h-64 border-4 border-white rounded-lg relative">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

                    {isScanning && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-1 bg-primary animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Instructions */}
                  <p className="text-white text-center mt-4 text-sm">
                    {isScanning ? "Scanning for QR code..." : "Position QR code within the frame"}
                  </p>
                </div>
              </div>

              {/* Camera Controls */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={toggleFlash}
                  className={flashEnabled ? "bg-yellow-500 text-black" : ""}
                >
                  <Flashlight className="w-4 h-4" />
                </Button>

                {!isScanning ? (
                  <Button
                    onClick={startScanning}
                    size="lg"
                    className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
                  >
                    <Camera className="w-6 h-6" />
                  </Button>
                ) : (
                  <Button
                    onClick={simulateQRDetection}
                    size="lg"
                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600"
                  >
                    <QrCode className="w-6 h-6" />
                  </Button>
                )}

                <Button variant="secondary" size="sm" onClick={stopScanning}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Scan Result */
          <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-foreground">Scan Successful!</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">House ID:</span>
                    <span className="font-medium text-foreground">{scanResult.houseId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium text-foreground">{scanResult.timestamp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Worker ID:</span>
                    <span className="font-medium text-foreground">{scanResult.workerId}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={confirmScan} className="flex-1">
                    Confirm & Submit
                  </Button>
                  <Button variant="outline" onClick={() => setScanResult(null)} className="flex-1">
                    Scan Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="bg-muted/50 p-4 border-t border-border">
            <h3 className="text-sm font-medium text-foreground mb-3">Recent Scans</h3>
            <div className="space-y-2">
              {recentScans.map((scan) => (
                <div key={scan.id} className="flex items-center justify-between bg-card p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="default" className="bg-green-500 text-white">
                      {scan.houseId}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{scan.timestamp}</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

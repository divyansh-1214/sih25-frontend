"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, RotateCcw, AlertCircle } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onError: (error: string) => void
}

export function CameraCapture({ onCapture, onError }: CameraCaptureProps) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        setError(null)
      }
    } catch (err) {
      const errorMessage = "Camera access denied. Please allow camera permissions."
      setError(errorMessage)
      onError(errorMessage)
    }
  }, [onError])

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const imageData = canvas.toDataURL("image/jpeg", 0.8)
        onCapture(imageData)
        stopCamera()
      }
    }
  }, [onCapture, stopCamera])

  if (!isCameraActive) {
    return (
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button onClick={startCamera} className="w-full" size="lg">
          <Camera className="w-4 h-4 mr-2" />
          Start Camera
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-muted"
            style={{ maxHeight: "400px" }}
          />
          <div className="flex gap-2">
            <Button onClick={capturePhoto} className="flex-1">
              <Camera className="w-4 h-4 mr-2" />
              Capture Photo
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  )
}

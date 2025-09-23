"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navigation } from "@/components/navigation"
import { Camera, Upload, RotateCcw, CheckCircle, AlertCircle, Recycle, Trash2, Leaf, Zap } from "lucide-react"
import { mockWasteItems, type WasteItem } from "@/lib/mock-data"
import Image from "next/image"

interface IdentificationResult {
  item: WasteItem
  confidence: number
  timestamp: string
}

export default function SegregationPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<IdentificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        setError(null)
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions or upload an image instead."+err)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext("2d")
      ctx?.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg")
      setSelectedImage(imageData)
      stopCamera()
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }

  const analyzeWaste = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)

    // Simulate AI analysis with mock data
    setTimeout(() => {
      // Randomly select a waste item for demo purposes
      const randomItem = mockWasteItems[Math.floor(Math.random() * mockWasteItems.length)]
      const confidence = Math.floor(Math.random() * 20) + 80 // 80-99% confidence

      setResult({
        item: randomItem,
        confidence,
        timestamp: new Date().toISOString(),
      })
      setIsAnalyzing(false)
    }, 2000)
  }

  const reset = () => {
    setSelectedImage(null)
    setResult(null)
    setError(null)
    stopCamera()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "organic":
        return <Leaf className="w-5 h-5" />
      case "recyclable":
        return <Recycle className="w-5 h-5" />
      case "hazardous":
        return <Zap className="w-5 h-5" />
      default:
        return <Trash2 className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "organic":
        return "bg-green-100 text-green-800 border-green-200"
      case "recyclable":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "hazardous":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">AI Waste Identification</h1>
            <p className="text-muted-foreground text-pretty">
              Take a photo or upload an image to identify waste type and get proper disposal instructions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Capture Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Capture or Upload Image
                </CardTitle>
                <CardDescription>Use your camera or upload an image of the waste item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Camera View */}
                {isCameraActive && (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-muted"
                      style={{ maxHeight: "300px" }}
                    />
                    <div className="flex gap-2 mt-4">
                      <Button onClick={capturePhoto} className="flex-1">
                        <Camera className="w-4 h-4 mr-2" />
                        Capture Photo
                      </Button>
                      <Button variant="outline" onClick={stopCamera}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {selectedImage && !isCameraActive && (
                  <div className="space-y-4">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected waste item"
                      className="w-full rounded-lg border bg-muted"
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                    <div className="flex gap-2">
                      <Button onClick={analyzeWaste} disabled={isAnalyzing} className="flex-1">
                        {isAnalyzing ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Identify Waste
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={reset}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                      </Button>
                    </div>
                  </div>
                )}

                {/* Upload/Camera Buttons */}
                {!selectedImage && !isCameraActive && (
                  <div className="space-y-3">
                    <Button onClick={startCamera} className="w-full" size="lg">
                      <Camera className="w-4 h-4 mr-2" />
                      Use Camera
                    </Button>
                    <div className="relative">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full"
                        size="lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                )}

                <canvas ref={canvasRef} className="hidden" />
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Identification Results
                </CardTitle>
                <CardDescription>AI analysis results and disposal instructions</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-6">
                    {/* Confidence Score */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">{result.confidence}%</div>
                      <div className="text-sm text-muted-foreground">Confidence Level</div>
                    </div>

                    {/* Item Details */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{result.item.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{result.item.description}</p>
                        <Badge className={`${getCategoryColor(result.item.category)} border`}>
                          {getCategoryIcon(result.item.category)}
                          <span className="ml-1 capitalize">{result.item.category}</span>
                        </Badge>
                      </div>

                      {/* Disposal Instructions */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2 text-foreground">Disposal Instructions:</h4>
                        <p className="text-sm text-muted-foreground">{result.item.disposalInstructions}</p>
                      </div>

                      {/* Points Earned */}
                      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-primary">Points Earned</span>
                          <span className="text-xl font-bold text-primary">+{result.item.points}</span>
                        </div>
                        <p className="text-xs text-primary/80 mt-1">Added to your green points balance</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button onClick={reset} variant="outline" className="flex-1 bg-transparent">
                        Identify Another
                      </Button>
                      <Button className="flex-1">Share Result</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">
                      {selectedImage
                        ? "Click 'Identify Waste' to analyze your image"
                        : "Capture or upload an image to get started"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Tips for Better Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Camera className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Good Lighting</h4>
                    <p className="text-muted-foreground">Ensure the item is well-lit and clearly visible</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Single Item</h4>
                    <p className="text-muted-foreground">Focus on one waste item at a time for accuracy</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Recycle className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Clean Items</h4>
                    <p className="text-muted-foreground">Clean items are easier to identify correctly</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, X, Camera, Clock, MapPin } from "lucide-react"

interface FeedbackEntry {
  id: string
  houseId: string
  timestamp: string
  status: "correct" | "incorrect"
  comment?: string
  workerId: string
}

export default function SegregationFeedback({ onClose }: { onClose: () => void }) {
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [comment, setComment] = useState("")
  const [recentFeedback, setRecentFeedback] = useState<FeedbackEntry[]>([
    {
      id: "1",
      houseId: "HSE-001",
      timestamp: "10:30 AM",
      status: "correct",
      workerId: "WM-2024-001",
    },
    {
      id: "2",
      houseId: "HSE-002",
      timestamp: "10:25 AM",
      status: "incorrect",
      comment: "Plastic mixed with organic waste",
      workerId: "WM-2024-001",
    },
  ])

  const houses = [
    { id: "HSE-003", address: "123 Main St", status: "pending" },
    { id: "HSE-004", address: "456 Oak Ave", status: "pending" },
    { id: "HSE-005", address: "789 Pine Rd", status: "pending" },
    { id: "HSE-006", address: "321 Elm St", status: "pending" },
  ]

  const submitFeedback = () => {
    if (!selectedHouse || !feedback) return

    const newFeedback: FeedbackEntry = {
      id: Date.now().toString(),
      houseId: selectedHouse,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: feedback,
      comment: comment.trim() || undefined,
      workerId: "WM-2024-001",
    }

    setRecentFeedback((prev) => [newFeedback, ...prev.slice(0, 4)])

    // Reset form
    setSelectedHouse(null)
    setFeedback(null)
    setComment("")
  }

  const wasteCategories = [
    { name: "Organic", color: "bg-green-500", examples: "Food scraps, garden waste" },
    { name: "Recyclable", color: "bg-blue-500", examples: "Paper, plastic, metal" },
    { name: "Hazardous", color: "bg-red-500", examples: "Batteries, chemicals" },
    { name: "General", color: "bg-gray-500", examples: "Non-recyclable items" },
  ]

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <h1 className="text-lg font-semibold text-foreground">Segregation Check</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Waste Categories Reference */}
        <div className="p-4 bg-muted/30 border-b border-border">
          <h3 className="text-sm font-medium text-foreground mb-3">Waste Categories</h3>
          <div className="grid grid-cols-2 gap-2">
            {wasteCategories.map((category) => (
              <div key={category.name} className="flex items-center gap-2 text-xs">
                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                <div>
                  <span className="font-medium text-foreground">{category.name}</span>
                  <p className="text-muted-foreground">{category.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* House Selection */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Select House</h3>
          <div className="grid grid-cols-1 gap-3">
            {houses.map((house) => (
              <Card
                key={house.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedHouse === house.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedHouse(house.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{house.id}</p>
                      <p className="text-sm text-muted-foreground">{house.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feedback Buttons */}
        {selectedHouse && (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Segregation Status for {selectedHouse}</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                size="lg"
                className={`h-24 flex flex-col gap-2 ${
                  feedback === "correct"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200"
                }`}
                onClick={() => setFeedback("correct")}
              >
                <CheckCircle className="w-8 h-8" />
                <span className="font-semibold">Correct Segregation</span>
              </Button>

              <Button
                size="lg"
                className={`h-24 flex flex-col gap-2 ${
                  feedback === "incorrect"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-red-50 hover:bg-red-100 text-red-700 border-2 border-red-200"
                }`}
                onClick={() => setFeedback("incorrect")}
              >
                <XCircle className="w-8 h-8" />
                <span className="font-semibold">Incorrect Segregation</span>
              </Button>
            </div>

            {/* Comment Section */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Additional Comments (Optional)</label>
              <Textarea
                placeholder="Add notes about segregation issues, contamination, or other observations..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button onClick={submitFeedback} disabled={!feedback} className="flex-1">
                Submit Feedback
              </Button>
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Add Photo
              </Button>
            </div>
          </div>
        )}

        {/* Recent Feedback */}
        <div className="p-4 border-t border-border bg-muted/30">
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Feedback</h3>
          <div className="space-y-3">
            {recentFeedback.map((entry) => (
              <Card key={entry.id} className="bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {entry.status === "correct" ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{entry.houseId}</p>
                        {entry.comment && <p className="text-sm text-muted-foreground mt-1">{entry.comment}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {entry.timestamp}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

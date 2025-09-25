"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, X, Camera, Clock, MapPin, AlertCircle } from "lucide-react"

interface FeedbackEntry {
  id: string
  houseId: string
  timestamp: string
  status: "correct" | "incorrect"
  comment?: string
  workerId: string
}

export default function SegregationFeedbackPage() {
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const submitFeedback = async () => {
    if (!selectedHouse || !feedback) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

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
    setIsSubmitting(false)
  }

  const wasteCategories = [
    { name: "Organic", color: "bg-green-100 text-green-800", examples: "Food scraps, garden waste" },
    { name: "Recyclable", color: "bg-blue-100 text-blue-800", examples: "Paper, plastic, metal" },
    { name: "Hazardous", color: "bg-red-100 text-red-800", examples: "Batteries, chemicals" },
    { name: "General", color: "bg-gray-100 text-gray-800", examples: "Non-recyclable items" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Segregation Check</h1>
              <p className="text-sm text-gray-500">Verify household waste segregation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Waste Categories Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Waste Categories Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wasteCategories.map((category) => (
                <div key={category.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    {category.name}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">{category.examples}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* House Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select House for Inspection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {houses.map((house) => (
                <div
                  key={house.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedHouse === house.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                  onClick={() => setSelectedHouse(house.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{house.id}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        {house.address}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      Pending
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form */}
        {selectedHouse && (
          <Card>
            <CardHeader>
              <CardTitle>Inspection Results for {selectedHouse}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feedback Buttons */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Segregation Status
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    type="button"
                    size="lg"
                    variant={feedback === "correct" ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-2 ${
                      feedback === "correct"
                        ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                        : "border-green-200 text-green-700 hover:bg-green-50"
                    }`}
                    onClick={() => setFeedback("correct")}
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-medium">Correctly Segregated</span>
                  </Button>

                  <Button
                    type="button"
                    size="lg"
                    variant={feedback === "incorrect" ? "default" : "outline"}
                    className={`h-20 flex flex-col gap-2 ${
                      feedback === "incorrect"
                        ? "bg-red-600 hover:bg-red-700 text-white border-red-600"
                        : "border-red-200 text-red-700 hover:bg-red-50"
                    }`}
                    onClick={() => setFeedback("incorrect")}
                  >
                    <XCircle className="w-6 h-6" />
                    <span className="font-medium">Incorrectly Segregated</span>
                  </Button>
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Additional Comments {feedback === "incorrect" && <span className="text-red-500">*</span>}
                </label>
                <Textarea
                  placeholder="Add notes about segregation issues, contamination, or other observations..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-24 resize-none"
                />
                {feedback === "incorrect" && !comment.trim() && (
                  <p className="text-xs text-red-500">Please provide details about the segregation issue</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={submitFeedback}
                  disabled={!feedback || isSubmitting || (feedback === "incorrect" && !comment.trim())}
                  className="flex-1 sm:flex-none"
                >
                  {isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Add Photo Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            {recentFeedback.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No feedback submitted yet</p>
            ) : (
              <div className="space-y-3">
                {recentFeedback.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {entry.status === "correct" ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{entry.houseId}</p>
                        <Badge
                          variant={entry.status === "correct" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {entry.status === "correct" ? "Correct" : "Incorrect"}
                        </Badge>
                      </div>
                      {entry.comment && (
                        <p className="text-sm text-gray-600 mb-2">{entry.comment}</p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {entry.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

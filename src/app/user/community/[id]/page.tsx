"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, MapPin, Calendar, User, MessageSquare, Send, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import {CommunityReport } from "@/lib/mock-data"
import axios from "axios"

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  isOfficial: boolean
}

export default function ReportDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState<CommunityReport | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

    async function fechReport() {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reports/${params.id}`
      );
      setReport(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fechReport();
  },[]);

  if (!report) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Report Not Found</h1>
            <Button onClick={() => router.push("/user/community")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmittingComment(true)

    // Simulate comment submission
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        content: newComment,
        timestamp: new Date().toISOString(),
        isOfficial: false,
      }
      setComments([...comments, comment])
      setNewComment("")
      setIsSubmittingComment(false)
    }, 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />
      case "in_progress":
        return <AlertTriangle className="w-5 h-5" />
      case "resolved":
        return <CheckCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/user/community")} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Community
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">Report Details</h1>
            </div>
          </div>

          {/* Report Details */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{report.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`${getStatusColor(report.status)} border`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1 capitalize">{report.status.replace("_", " ")}</span>
                    </Badge>
                    <Badge className={`${getPriorityColor(report.priority)} border`}>
                      <span className="capitalize">{report.priority} Priority</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground text-pretty">{report.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Location</div>
                    <div className="text-sm text-muted-foreground">{report.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Reported By</div>
                    <div className="text-sm text-muted-foreground">{report.reportedBy}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Reported On</div>
                    <div className="text-sm text-muted-foreground">{formatDate(report.reportedAt)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comments & Updates
              </CardTitle>
              <CardDescription>Follow the progress and join the discussion about this report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Comments */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-4 rounded-lg border ${
                      comment.isOfficial ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{comment.author}</span>
                        {comment.isOfficial && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                            Official
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(comment.timestamp)}</span>
                    </div>
                    <p className="text-sm text-foreground text-pretty">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <div className="border-t pt-6">
                <h4 className="font-semibold text-foreground mb-3">Add a Comment</h4>
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share updates, ask questions, or provide additional information..."
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
                      {isSubmittingComment ? (
                        <>
                          <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

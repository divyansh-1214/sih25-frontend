"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Award, BookOpen, Play } from "lucide-react"
import { mockTrainingModules, type TrainingModule } from "@/lib/mock-data"

export default function TrainingModulePage() {
  const params = useParams()
  const router = useRouter()
  const [module, setModule] = useState<TrainingModule | null>(null)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    const foundModule = mockTrainingModules.find((m) => m.id === params.id)
    if (foundModule) {
      setModule(foundModule)
      // Find first incomplete lesson or start from beginning
      const firstIncompleteIndex = foundModule.lessons.findIndex((l) => !l.completed)
      setCurrentLessonIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0)
    }
  }, [params.id])

  if (!module) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Module Not Found</h1>
            <Button onClick={() => router.push("/training")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Training
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentLesson = module.lessons[currentLessonIndex]
  const completedLessons = module.lessons.filter((l) => l.completed).length
  const moduleProgress = (completedLessons / module.lessons.length) * 100
  const isLastLesson = currentLessonIndex === module.lessons.length - 1
  // const canProceed = currentLesson?.completed || currentLessonIndex === 0

  const completeLesson = async () => {
    setIsCompleting(true)

    // Simulate lesson completion
    setTimeout(() => {
      // In a real app, this would update the backend
      currentLesson.completed = true
      setIsCompleting(false)

      if (isLastLesson) {
        // Mark entire module as completed
        module.completed = true
        // Show completion message or redirect
      }
    }, 1500)
  }

  const nextLesson = () => {
    if (currentLessonIndex < module.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    }
  }

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/training")} size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Training
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{module.title}</h1>
              <p className="text-muted-foreground">{module.description}</p>
            </div>
          </div>

          {/* Module Info */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {module.points} points
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {module.lessons.length} lessons
                  </div>
                </div>
                {module.completed && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-muted-foreground">{Math.round(moduleProgress)}%</span>
                </div>
                <Progress value={moduleProgress} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  {completedLessons} of {module.lessons.length} lessons completed
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lesson Navigation */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Lessons</CardTitle>
                <CardDescription>Navigate through the module content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {module.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentLessonIndex(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      index === currentLessonIndex
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : lesson.completed
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {lesson.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : index === currentLessonIndex ? (
                        <Play className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-current opacity-50" />
                      )}
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Lesson Content */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                    <CardDescription>
                      Lesson {currentLessonIndex + 1} of {module.lessons.length}
                    </CardDescription>
                  </div>
                  {currentLesson.completed && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Lesson Content */}
                <div className="prose prose-sm max-w-none">
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <p className="text-foreground leading-relaxed">{currentLesson.content}</p>

                    {/* Mock lesson content based on lesson title */}
                    {currentLesson.title.includes("Types of Waste") && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-foreground">Main Waste Categories:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                            <h5 className="font-medium text-green-800 mb-2">Organic Waste</h5>
                            <p className="text-sm text-green-700">Food scraps, garden waste, biodegradable materials</p>
                          </div>
                          <div className="bg-blue-100 p-4 rounded-lg border border-blue-200">
                            <h5 className="font-medium text-blue-800 mb-2">Recyclable Waste</h5>
                            <p className="text-sm text-blue-700">Paper, plastic, glass, metal containers</p>
                          </div>
                          <div className="bg-red-100 p-4 rounded-lg border border-red-200">
                            <h5 className="font-medium text-red-800 mb-2">Hazardous Waste</h5>
                            <p className="text-sm text-red-700">Batteries, chemicals, electronic waste</p>
                          </div>
                          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                            <h5 className="font-medium text-gray-800 mb-2">General Waste</h5>
                            <p className="text-sm text-gray-700">Non-recyclable, non-hazardous materials</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentLesson.title.includes("Color Coding") && (
                      <div className="mt-6 space-y-4">
                        <h4 className="font-semibold text-foreground">Bin Color System:</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                            <span className="text-foreground">Green - Organic/Compostable waste</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                            <span className="text-foreground">Blue - Recyclable materials</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                            <span className="text-foreground">Red - Hazardous waste</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
                            <span className="text-foreground">Gray - General waste</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Lesson Actions */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={previousLesson}
                    disabled={currentLessonIndex === 0}
                    className="bg-transparent"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {!currentLesson.completed && (
                      <Button onClick={completeLesson} disabled={isCompleting}>
                        {isCompleting ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                            Completing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Complete Lesson
                          </>
                        )}
                      </Button>
                    )}

                    <Button onClick={nextLesson} disabled={!currentLesson.completed || isLastLesson}>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>

                {/* Module Completion */}
                {isLastLesson && currentLesson.completed && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">Module Completed!</h3>
                      <p className="text-muted-foreground mb-4">
                        Congratulations! You have earned {module.points} points.
                      </p>
                      <Button onClick={() => router.push("/training")}>Back to Training Hub</Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

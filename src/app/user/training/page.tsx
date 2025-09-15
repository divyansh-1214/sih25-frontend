"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { BookOpen, Clock, Award, CheckCircle, Lock, Play, Users, Target } from "lucide-react"
import { mockTrainingModules, type TrainingModule } from "@/lib/mock-data"
import Link from "next/link"

export default function TrainingPage() {
  const [modules] = useState<TrainingModule[]>(mockTrainingModules)

  const completedModules = modules.filter((m) => m.completed).length
  const totalPoints = modules.reduce((sum, m) => sum + (m.completed ? m.points : 0), 0)
  const totalPossiblePoints = modules.reduce((sum, m) => sum + m.points, 0)
  const overallProgress = (completedModules / modules.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Training Hub</h1>
            <p className="text-muted-foreground text-pretty">
              Complete mandatory training modules to become a certified waste management expert
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {completedModules}/{modules.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Modules Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{totalPoints}</div>
                    <div className="text-sm text-muted-foreground">Points Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{Math.round(overallProgress)}%</div>
                    <div className="text-sm text-muted-foreground">Overall Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {completedModules >= modules.length ? "Expert" : "Beginner"}
                    </div>
                    <div className="text-sm text-muted-foreground">Certification Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">Training Progress</h3>
                <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}% Complete</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>
                  {totalPoints} / {totalPossiblePoints} points earned
                </span>
                <span>
                  {completedModules} / {modules.length} modules completed
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Training Modules */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Training Modules</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {modules.map((module, index) => {
                const isLocked = index > 0 && !modules[index - 1].completed
                const completedLessons = module.lessons.filter((l) => l.completed).length
                const moduleProgress = (completedLessons / module.lessons.length) * 100

                return (
                  <Card key={module.id} className={`${isLocked ? "opacity-60" : "hover:shadow-lg"} transition-all`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{module.title}</CardTitle>
                            {module.completed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                            {isLocked && (
                              <Badge variant="outline" className="bg-muted">
                                <Lock className="w-3 h-3 mr-1" />
                                Locked
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-pretty">{module.description}</CardDescription>
                        </div>
                      </div>

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
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Module Progress */}
                      {!isLocked && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-muted-foreground">{Math.round(moduleProgress)}%</span>
                          </div>
                          <Progress value={moduleProgress} className="h-2" />
                        </div>
                      )}

                      {/* Lessons List */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-foreground">Lessons:</h4>
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-2 text-sm">
                            {lesson.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                            )}
                            <span className={lesson.completed ? "text-foreground" : "text-muted-foreground"}>
                              {lesson.title}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        {isLocked ? (
                          <Button disabled className="w-full bg-transparent" variant="outline">
                            <Lock className="w-4 h-4 mr-2" />
                            Complete Previous Module First
                          </Button>
                        ) : module.completed ? (
                          <Link href={`/training/${module.id}`} className="block">
                            <Button variant="outline" className="w-full bg-transparent">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Review Module
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/training/${module.id}`} className="block">
                            <Button className="w-full">
                              <Play className="w-4 h-4 mr-2" />
                              {completedLessons > 0 ? "Continue Module" : "Start Module"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Certification Section */}
          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Waste Management Certification</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-pretty">
                Complete all training modules to earn your official waste management certification and unlock advanced
                features.
              </p>
              {completedModules >= modules.length ? (
                <div className="space-y-4">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200 text-base px-4 py-2"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Certified Expert
                  </Badge>
                  <div>
                    <Button size="lg" className="mr-4">
                      Download Certificate
                    </Button>
                    <Button size="lg" variant="outline" className="bg-transparent">
                      Share Achievement
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {modules.length - completedModules} modules remaining
                  </div>
                  <Button size="lg" disabled>
                    <Lock className="w-4 h-4 mr-2" />
                    Certification Locked
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

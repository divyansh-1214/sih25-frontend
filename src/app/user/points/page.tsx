"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation } from "@/components/navigation"
import { Award, TrendingUp, Calendar, Target, Trophy, Star, Gift, Users } from "lucide-react"
import Link from "next/link"

interface Achievement {
  id: string
  title: string
  description: string
  points: number
  unlocked: boolean
  progress: number
  maxProgress: number
}

interface PointsTransaction {
  id: string
  type: "earned" | "redeemed"
  description: string
  points: number
  timestamp: string
  category: string
}

export default function PointsPage() {
  const [currentPoints] = useState(1250)
  const [totalEarned] = useState(2840)
  const [currentLevel] = useState(3)
  const [nextLevelPoints] = useState(1500)

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first waste identification",
      points: 50,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
    },
    {
      id: "2",
      title: "Recycling Champion",
      description: "Properly dispose of 50 recyclable items",
      points: 200,
      unlocked: true,
      progress: 50,
      maxProgress: 50,
    },
    {
      id: "3",
      title: "Training Graduate",
      description: "Complete all training modules",
      points: 300,
      unlocked: false,
      progress: 2,
      maxProgress: 4,
    },
    {
      id: "4",
      title: "Community Helper",
      description: "Report 10 waste management issues",
      points: 150,
      unlocked: false,
      progress: 3,
      maxProgress: 10,
    },
    {
      id: "5",
      title: "QR Master",
      description: "Scan 100 QR codes",
      points: 250,
      unlocked: false,
      progress: 23,
      maxProgress: 100,
    },
    {
      id: "6",
      title: "Eco Warrior",
      description: "Earn 5000 total points",
      points: 500,
      unlocked: false,
      progress: 2840,
      maxProgress: 5000,
    },
  ]

  const recentTransactions: PointsTransaction[] = [
    {
      id: "1",
      type: "earned",
      description: "QR Code Scan - Recyclable Plastic",
      points: 15,
      timestamp: "2024-01-15T14:30:00Z",
      category: "QR Scanning",
    },
    {
      id: "2",
      type: "earned",
      description: "AI Waste Identification - Battery",
      points: 10,
      timestamp: "2024-01-15T12:15:00Z",
      category: "AI Identification",
    },
    {
      id: "3",
      type: "redeemed",
      description: "Reusable Water Bottle",
      points: -200,
      timestamp: "2024-01-14T16:45:00Z",
      category: "Store Purchase",
    },
    {
      id: "4",
      type: "earned",
      description: "Training Module Completion",
      points: 50,
      timestamp: "2024-01-14T10:20:00Z",
      category: "Training",
    },
    {
      id: "5",
      type: "earned",
      description: "Community Report Submission",
      points: 25,
      timestamp: "2024-01-13T15:30:00Z",
      category: "Community",
    },
  ]

  const levelProgress = (currentPoints / nextLevelPoints) * 100
  const unlockedAchievements = achievements.filter((a) => a.unlocked)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Green Points Dashboard</h1>
            <p className="text-muted-foreground text-pretty">
              Track your environmental impact and earn rewards for responsible waste management
            </p>
          </div>

          {/* Points Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{currentPoints.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Current Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{totalEarned.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">Level {currentLevel}</div>
                    <div className="text-sm text-muted-foreground">Current Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</div>
                    <div className="text-sm text-muted-foreground">Achievements</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Level Progress */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Level Progress</h3>
                  <p className="text-sm text-muted-foreground">
                    {nextLevelPoints - currentPoints} points to Level {currentLevel + 1}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Level {currentLevel}
                </Badge>
              </div>
              <Progress value={levelProgress} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{currentPoints} points</span>
                <span>{nextLevelPoints} points</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Unlock badges by completing eco-friendly actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked ? "bg-green-50 border-green-200" : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-semibold ${
                              achievement.unlocked ? "text-green-800" : "text-muted-foreground"
                            }`}
                          >
                            {achievement.title}
                          </h4>
                          {achievement.unlocked && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                              <Trophy className="w-3 h-3 mr-1" />
                              Unlocked
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${achievement.unlocked ? "text-green-700" : "text-muted-foreground"}`}>
                          {achievement.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${achievement.unlocked ? "text-green-800" : "text-muted-foreground"}`}
                        >
                          +{achievement.points}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest points transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(transaction.timestamp)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${transaction.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "earned" ? "+" : ""}
                        {transaction.points}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Redeem Points</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Exchange your points for eco-friendly products and services
                </p>
                <Link href="/store">
                  <Button className="w-full">Visit Store</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Earn More Points</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete training modules and scan QR codes to earn points
                </p>
                <Link href="/training">
                  <Button variant="secondary" className="w-full">
                    Start Training
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Community Impact</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See how your actions contribute to community sustainability
                </p>
                <Link href="/community">
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                  >
                    View Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

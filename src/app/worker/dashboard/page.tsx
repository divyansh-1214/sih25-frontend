"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import QRScanner from "@/components/qr-scanner"
import SegregationFeedback from "@/components/segregation-feedback"
import RouteNavigation from "@/components/route-navigation"
import {
  QrCode,
  CheckCircle,
  XCircle,
  MapPin,
  BookOpen,
  Package,
  MessageSquare,
  User,
  Settings,
  Sun,
  Moon,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function WorkerPortal() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeModule, setActiveModule] = useState<string | null>(null)
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const modules = [
    {
      id: "scanner",
      title: "QR Scanner",
      description: "Scan household waste collection",
      icon: QrCode,
      color: "bg-blue-500",
      status: "Ready",
      link:"scanner"
    },
    {
      id: "feedback",
      title: "Segregation Check",
      description: "Log waste segregation feedback",
      icon: CheckCircle,
      color: "bg-green-500",
      status: "Ready",
      link:"feedback"
    },
    {
      id: "routes",
      title: "Route Navigation",
      description: "View daily routes & GPS tracking",
      icon: MapPin,
      color: "bg-orange-500",
      status: "Active",
      link:"routes"
    },
    {
      id: "training",
      title: "Training & Safety",
      description: "Access guides and safety protocols",
      icon: BookOpen,
      color: "bg-purple-500",
      status: "Ready",
      link:"training"
    },
    {
      id: "equipment",
      title: "Equipment Request",
      description: "Request gear and track status",
      icon: Package,
      color: "bg-red-500",
      status: "Ready",
      link:"equipment"
    },
    {
      id: "communication",
      title: "Communication",
      description: "Chat with supervisors",
      icon: MessageSquare,
      color: "bg-teal-500",
      status: "2 New",
      link:"communication"
    },
  ]
  const router = useRouter();
  const handleModuleClick = (link: string) => {
    router.push(link)
  }

  const closeModule = () => {
    setActiveModule(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4" onClick={()=>{router.push('/worker/profile')}}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center" >
              <User className="w-5 h-5 text-primary-foreground"  />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Worker Portal</h1>
              <p className="text-sm text-muted-foreground">ID: WM-2024-001</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="w-9 h-9 p-0">
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Status Bar */}
      <div className="bg-muted/50 p-3 border-b border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="default" className="bg-green-500 text-white">
              On Duty
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Route Progress:</span>
            <span className="font-medium text-foreground">12/25 Houses</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {modules.map((module) => {
            const IconComponent = module.icon
            return (
              <Card
                key={module.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
                onClick={() => handleModuleClick(module.link)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <Badge
                      variant={module.status === "Active" ? "default" : "secondary"}
                      className={module.status === "Active" ? "bg-green-500 text-white" : ""}
                    >
                      {module.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">{module.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{module.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 max-w-6xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-16 flex flex-col gap-1 text-xs bg-transparent">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Mark Complete
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1 text-xs bg-transparent">
              <XCircle className="w-5 h-5 text-red-500" />
              Report Issue
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1 text-xs bg-transparent">
              <MapPin className="w-5 h-5 text-blue-500" />
              Current Location
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1 text-xs bg-transparent">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Emergency
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

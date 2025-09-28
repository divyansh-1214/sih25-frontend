"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Truck,
  ClipboardCheck,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Users,
  Leaf,
  Menu,
  X,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/authority/dashboard", icon: LayoutDashboard },
  { name: "Vehicle Tracking", href: "/authority/vehicles", icon: Truck },
  { name: "Compliance", href: "/authority/compliance", icon: ClipboardCheck },
  { name: "Enforcement", href: "/authority/enforcement", icon: AlertTriangle },
  { name: "Citizen Reports", href: "/authority/reports", icon: MessageSquare },
  { name: "Analytics", href: "/authority/analytics", icon: BarChart3 },
  { name: "Worker Management", href: "/authority/workers", icon: Users },
]

interface SidebarContentProps {
  onLinkClick?: () => void
}

function SidebarContent({ onLinkClick }: SidebarContentProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col bg-sidebar border-r border-sidebar-border lg:w-64">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
            <Leaf className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            <span className="hidden sm:inline">Swachsetu Authority</span>
            <span className="sm:hidden">Swachsetu</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="text-xs text-muted-foreground">
          <span className="hidden sm:inline">Waste Management Portal v1.0</span>
          <span className="sm:hidden">Portal v1.0</span>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="fixed top-4 left-4 z-50 h-10 w-10 p-0 lg:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent onLinkClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:h-full lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  )
}

// Mobile-aware layout wrapper for pages
export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
        <div className="container mx-auto px-4 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

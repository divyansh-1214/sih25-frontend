"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  Home,
  Camera,
  BookOpen,
  QrCode,
  Users,
  MapPin,
  Truck,
  ShoppingBag,
  Award,
  Recycle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

const navigation = [
  { name: "Home", href: "/user", icon: Home },
  { name: "AI Segregation", href: "/user/segregation", icon: Camera },
  { name: "Training", href: "/user/training", icon: BookOpen },
  { name: "QR Scanner", href: "/user/qr-scanner", icon: QrCode },
  { name: "Community", href: "/user/community", icon: Users },
  { name: "Services", href: "/user/services", icon: MapPin },
  { name: "Tracking", href: "/user/tracking", icon: Truck },
  { name: "Store", href: "/user/store", icon: ShoppingBag },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    setToken(Cookies.get("authToken"));
    console.log("Token:", Cookies.get("authToken"));
  }, []);
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">GreenHome</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Points Badge & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button>
              <Link href={"/user/profile"}>{token ? "Profile" : "Login"}</Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                    <Recycle className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground">
                    GreenHome
                  </span>
                </div>
                <nav className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                  <Button>
                    <Link href={"/user/profile"}>
                      {token ? "Profile" : "Login"}
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

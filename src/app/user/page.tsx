"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  BookOpen,
  Users,
  MapPin,
  Truck,
  Award,
  Recycle,
  QrCode,
  ArrowRight,
  Bell,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);

  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  useEffect(() => {
    setToken(getCookie("authToken"));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm  top-0 z-50 shadow-sm relative">
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 py-1 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center">
                <img src="/icon.png" alt="swach setu" className="w-16" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              {token && (
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full"></div>
                </Button>
              )}
              <Button asChild>
                <Link
                  href={token ? "/user/profile" : "/auth/login"}
                  className="flex items-center"
                >
                  {token ? "Profile" : "Login"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="py-16 px-4"
        style={{
          backgroundImage:
            "url('/Ge mini_Generated_Image_klhjyoklhjyoklhj.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-6 rounded-full shadow-xl">
              <Recycle className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Smart Waste Management for a{" "}
            <span className="text-primary">Greener Tomorrow</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
            Join your community in making waste management smarter, more
            efficient, and environmentally friendly with AI-powered tools and
            gamification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              asChild
              className="shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/user/segregation" className="flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                Identify Waste
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link href="/user/community" className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Report Issue
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need for Smart Waste Management
            </h3>
            {/* <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools and features to make waste management
              effortless and rewarding
            </p> */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* AI Waste ID */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">AI Waste ID</CardTitle>
                <CardDescription className="leading-relaxed">
                  Snap a photo and get instant waste categorization with
                  disposal instructions powered by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group">
                  <Link
                    href="/user/segregation"
                    className="flex items-center justify-center"
                  >
                    Try Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Training Hub */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Training Hub</CardTitle>
                <CardDescription className="leading-relaxed">
                  Complete mandatory modules and earn certifications for proper
                  waste handling and environmental awareness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group">
                  <Link
                    href="/user/training"
                    className="flex items-center justify-center"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* QR & Points */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <QrCode className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">QR Tracking</CardTitle>
                <CardDescription className="leading-relaxed">
                  Scan QR codes on waste bags and earn green points for
                  responsible disposal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group">
                  <Link
                    href="/user/qr-scanner"
                    className="flex items-center justify-center"
                  >
                    Scan QR
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardHeader className="pb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">Community</CardTitle>
                <CardDescription className="leading-relaxed">
                  Report issues, track resolutions, and connect with your
                  neighborhood for a cleaner environment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group">
                  <Link
                    href="/user/community"
                    className="flex items-center justify-center"
                  >
                    Join In
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Quick Actions
            </h3>
            <p className="text-muted-foreground text-lg">
              Access essential services in one click
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>Service Locator</CardTitle>
                    <CardDescription>
                      Find nearby waste facilities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full shadow-md">
                  <Link
                    href="/user/services"
                    className="flex items-center justify-center"
                  >
                    Find Services
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>Track Vehicle</CardTitle>
                    <CardDescription>
                      Monitor collection schedules
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full shadow-md">
                  <Link
                    href="/user/tracking"
                    className="flex items-center justify-center"
                  >
                    Track Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>Waste Store</CardTitle>
                    <CardDescription>
                      Redeem points for eco products
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full shadow-md">
                  <Link
                    href="/user/store"
                    className="flex items-center justify-center"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Swachsetu  ?
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: "AI-Powered",
                description: "Advanced AI for accurate waste identification",
              },
              {
                icon: TrendingUp,
                title: "Gamified",
                description: "Earn points and rewards for eco-friendly actions",
              },
              {
                icon: Users,
                title: "Community-Driven",
                description: "Connect with neighbors for collective impact",
              },
              {
                icon: Recycle,
                title: "Eco-Friendly",
                description: "Reduce waste and environmental footprint",
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <benefit.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Recycle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-xl text-foreground">
                Swachsetu
              </span>
              <p className="text-xs text-muted-foreground">
                Smart Waste Management
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mb-4">
            Making waste management smarter, one household at a time.
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 Swachsetu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

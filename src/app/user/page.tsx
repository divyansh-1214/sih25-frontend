"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  BookOpen,
  QrCode,
  Users,
  MapPin,
  Truck,
  Award,
  Recycle,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
export default function HomePage() {
  const [token, setToken] = useState<string | undefined>(undefined);
  useEffect(() => {
    setToken(Cookies.get("authToken"));
    console.log("Token:", Cookies.get("authToken"));
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">GreenHome</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Link href={"/user/profile"}>{token ? "Profile" : "Login"}</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Smart Waste Management for a Greener Tomorrow
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Join your community in making waste management smarter, more
            efficient, and environmentally friendly with AI-powered tools and
            gamification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Camera className="w-4 h-4 mr-2" />
              Identify Waste
            </Button>
            <Button size="lg" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-foreground">
            Everything You Need for Smart Waste Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {/* Smart Segregation */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">AI Waste ID</CardTitle>
                <CardDescription>
                  Snap a photo and get instant waste categorization with
                  disposal instructions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/user/segregation">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Try Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Training Hub */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Training Hub</CardTitle>
                <CardDescription>
                  Complete mandatory modules and earn certifications for proper
                  waste handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/user/training">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Learn More
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* QR & Points */}
            {/* <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <QrCode className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">QR Tracking</CardTitle>
                <CardDescription>
                  Scan QR codes on waste bags and earn green points for responsible disposal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/user/qr-scanner">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Scan QR
                  </Button>
                </Link>
              </CardContent>
            </Card> */}

            {/* Community */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Community</CardTitle>
                <CardDescription>
                  Report issues, track resolutions, and connect with your
                  neighborhood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/user/community">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                  >
                    Join In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-primary" />
                  <div>
                    <CardTitle>Service Locator</CardTitle>
                    <CardDescription>
                      Find nearby waste facilities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/user/services">
                  <Button className="w-full">Find Services</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 border-secondary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-secondary" />
                  <div>
                    <CardTitle>Track Vehicle</CardTitle>
                    <CardDescription>
                      Monitor collection schedules
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/user/tracking">
                  <Button variant="secondary" className="w-full">
                    Track Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-accent" />
                  <div>
                    <CardTitle>Waste Store</CardTitle>
                    <CardDescription>
                      Redeem points for eco products
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/user/store">
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                  >
                    Shop Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <footer className="border-t bg-muted/30 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Recycle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">GreenHome</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Making waste management smarter, one household at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}

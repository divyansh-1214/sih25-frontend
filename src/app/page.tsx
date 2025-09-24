"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recycle, Users, Shield, Truck, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-full shadow-lg">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 text-balance">
            Smart Waste Management Portal
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            Connecting citizens, workers, and administrators for efficient waste management and a cleaner environment
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-16">
          {/* Citizens Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Citizens</CardTitle>
              <CardDescription className="text-gray-600">
                Report issues, track complaints, and stay informed about waste collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  "File waste complaints",
                  "Track complaint status", 
                  "View notifications",
                  "Access training materials"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 group">
                <Link href="/user/auth/login" className="flex items-center justify-center">
                  Login as Citizen
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Workers Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Workers</CardTitle>
              <CardDescription className="text-gray-600">
                Manage routes, scan QR codes, and update task progress efficiently
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  "QR code scanning",
                  "Route navigation",
                  "Task management", 
                  "Equipment requests"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700 group">
                <Link href="/worker/auth/login" className="flex items-center justify-center">
                  Login as Worker
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Administrators Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">Administrators</CardTitle>
              <CardDescription className="text-gray-600">
                Oversee operations, manage users, and generate comprehensive reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {[
                  "User management",
                  "Complaint assignment",
                  "System monitoring",
                  "Analytics & reports"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 group">
                <Link href="/authority/auth/login" className="flex items-center justify-center">
                  Login as Administrator
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Key Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {[
              {
                title: "Smart Segregation",
                description: "AI-powered waste identification and sorting guidance",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "Real-time Tracking", 
                description: "Live vehicle and worker location monitoring",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Compliance Monitoring",
                description: "Automated compliance checking and reporting", 
                gradient: "from-purple-500 to-violet-500"
              },
              {
                title: "Training Hub",
                description: "Interactive training modules and certifications",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className="w-6 h-6 bg-white rounded-full opacity-80"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3 text-lg">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200/60">
          <p className="text-gray-600 mb-6 text-lg">Ready to make waste management smarter?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button asChild size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg">
              <Link href="/user/auth/signup" className="flex items-center">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-300 hover:bg-gray-50 shadow-sm">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

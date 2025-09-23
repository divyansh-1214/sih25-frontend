'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Users, Shield, Truck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <Recycle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 text-balance">
            Smart Waste Management Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
            Connecting citizens, workers, and administrators for efficient waste management and a cleaner environment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto bg-blue-100 p-3 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Citizens</CardTitle>
              <CardDescription>
                Report issues, track complaints, and stay informed about waste collection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• File waste complaints</li>
                <li>• Track complaint status</li>
                <li>• View notifications</li>
                <li>• Access training materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow" onClick={()=>router.push("/worker")}>
            <CardHeader>
              <div className="mx-auto bg-orange-100 p-3 rounded-full w-fit mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <CardTitle className="text-xl">Workers</CardTitle>
              <CardDescription>Manage routes, scan QR codes, and update task progress efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• QR code scanning</li>
                <li>• Route navigation</li>
                <li>• Task management</li>
                <li>• Equipment requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow" onClick={()=>router.push("/authority")}>
            <CardHeader>
              <div className="mx-auto bg-purple-100 p-3 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">Administrators</CardTitle>
              <CardDescription>Oversee operations, manage users, and generate comprehensive reports</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• User management</li>
                <li>• Complaint assignment</li>
                <li>• System monitoring</li>
                <li>• Analytics & reports</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Smart Segregation</h3>
              <p className="text-sm text-gray-600">AI-powered waste identification and sorting guidance</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-sm text-gray-600">Live vehicle and worker location monitoring</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Compliance Monitoring</h3>
              <p className="text-sm text-gray-600">Automated compliance checking and reporting</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Training Hub</h3>
              <p className="text-sm text-gray-600">Interactive training modules and certifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

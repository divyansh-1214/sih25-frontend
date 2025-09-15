"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { MapPin, Phone, Clock, Search, NavigationIcon, Recycle, Trash2, Zap } from "lucide-react"
import { mockServiceLocations, type ServiceLocation } from "@/lib/mock-data"

export default function ServicesPage() {
  const [locations] = useState<ServiceLocation[]>(mockServiceLocations)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Filter locations
  const filteredLocations = locations.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.services.some((service) => service.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === "all" || location.type === typeFilter
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recycling_center":
        return <Recycle className="w-5 h-5" />
      case "waste_facility":
        return <Zap className="w-5 h-5" />
      case "collection_point":
        return <Trash2 className="w-5 h-5" />
      default:
        return <MapPin className="w-5 h-5" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recycling_center":
        return "bg-green-100 text-green-800 border-green-200"
      case "waste_facility":
        return "bg-red-100 text-red-800 border-red-200"
      case "collection_point":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Service Locator</h1>
            <p className="text-muted-foreground text-pretty">
              Find nearby waste management facilities, recycling centers, and collection points
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {locations.filter((l) => l.type === "recycling_center").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Recycling Centers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {locations.filter((l) => l.type === "waste_facility").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Waste Facilities</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {locations.filter((l) => l.type === "collection_point").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Collection Points</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, address, or services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Facility Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="recycling_center">Recycling Centers</SelectItem>
                      <SelectItem value="waste_facility">Waste Facilities</SelectItem>
                      <SelectItem value="collection_point">Collection Points</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="bg-muted/30 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive map would be displayed here</p>
                  <p className="text-sm text-muted-foreground">Showing {filteredLocations.length} locations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Locations List */}
          <div className="space-y-4">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <Card key={location.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{location.name}</h3>
                          <Badge className={`${getTypeColor(location.type)} border text-xs`}>
                            {getTypeIcon(location.type)}
                            <span className="ml-1 capitalize">{location.type.replace("_", " ")}</span>
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {location.address}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {location.hours}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {location.contact}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInMaps(location.address)}
                          className="bg-transparent"
                        >
                          <NavigationIcon className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${location.contact}`, "_self")}
                          className="bg-transparent"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Available Services:</h4>
                      <div className="flex flex-wrap gap-2">
                        {location.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Locations Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No service locations match your current search criteria. Try adjusting your filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setTypeFilter("all")
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Need Help Finding the Right Service?</CardTitle>
              <CardDescription>Different types of waste require different disposal methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Recycle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Recycling Centers</h4>
                  <p className="text-sm text-muted-foreground">For paper, plastic, glass, and metal recyclables</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Waste Facilities</h4>
                  <p className="text-sm text-muted-foreground">
                    For hazardous materials, electronics, and special waste
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Trash2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Collection Points</h4>
                  <p className="text-sm text-muted-foreground">Convenient drop-off locations for general waste</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

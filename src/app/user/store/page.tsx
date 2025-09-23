"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { ShoppingBag, Award, Search, Gift, Ticket, Wrench, Star, ShoppingCart } from "lucide-react"
import { mockStoreItems, type StoreItem } from "@/lib/mock-data"
import Image from "next/image"

export default function StorePage() {
  const [items] = useState<StoreItem[]>(mockStoreItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("points_asc")
  const [currentPoints] = useState(1250)
  const [cart, setCart] = useState<string[]>([])

  // Filter and sort items
  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "points_asc":
          return a.points - b.points
        case "points_desc":
          return b.points - a.points
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "eco_products":
        return <Gift className="w-4 h-4" />
      case "vouchers":
        return <Ticket className="w-4 h-4" />
      case "services":
        return <Wrench className="w-4 h-4" />
      default:
        return <ShoppingBag className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "eco_products":
        return "bg-green-100 text-green-800 border-green-200"
      case "vouchers":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "services":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const addToCart = (itemId: string) => {
    setCart([...cart, itemId])
  }

  const canAfford = (points: number) => currentPoints >= points

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Green Store</h1>
            <p className="text-muted-foreground text-pretty">
              Redeem your green points for eco-friendly products, vouchers, and services
            </p>
          </div>

          {/* Points Balance */}
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Available Points</h3>
                  <p className="text-sm text-muted-foreground">Use your points to get rewards</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{currentPoints.toLocaleString()}</div>
                  <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                    <Award className="w-3 h-3 mr-1" />
                    Green Points
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products and services..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="eco_products">Eco Products</SelectItem>
                      <SelectItem value="vouchers">Vouchers</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="points_asc">Points: Low to High</SelectItem>
                      <SelectItem value="points_desc">Points: High to Low</SelectItem>
                      <SelectItem value="name">Name: A to Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Store Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className={`hover:shadow-lg transition-shadow ${!item.inStock ? "opacity-60" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg?height=200&width=200"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{item.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`${getCategoryColor(item.category)} border text-xs`}>
                          {getCategoryIcon(item.category)}
                          <span className="ml-1 capitalize">{item.category.replace("_", " ")}</span>
                        </Badge>
                        {!item.inStock && (
                          <Badge variant="outline" className="text-xs">
                            Out of Stock
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-pretty">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="font-bold text-primary">{item.points.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">points</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-muted-foreground">4.8</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => addToCart(item.id)}
                    disabled={!item.inStock || !canAfford(item.points)}
                    className="w-full"
                    variant={canAfford(item.points) ? "default" : "outline"}
                  >
                    {!item.inStock ? (
                      "Out of Stock"
                    ) : !canAfford(item.points) ? (
                      `Need ${(item.points - currentPoints).toLocaleString()} more points`
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Redeem Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Items Found</h3>
                <p className="text-muted-foreground mb-4">
                  No items match your current search criteria. Try adjusting your filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setCategoryFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* How to Earn More Points */}
          <Card className="mt-8 bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Need More Points?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-pretty">
                Earn green points by using our AI waste identification, completing training modules, scanning QR codes,
                and reporting community issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Award className="w-4 h-4 mr-2" />
                  View Points Dashboard
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent">
                  Learn How to Earn
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

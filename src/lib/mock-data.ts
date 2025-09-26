// Mock data for the GreenHome waste management app

export interface WasteItem {
  id: string
  name: string
  category: "organic" | "recyclable" | "hazardous" | "general"
  description: string
  disposalInstructions: string
  points: number
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  duration: number // in minutes
  completed: boolean
  points: number
  lessons: {
    id: string
    title: string
    content: string
    completed: boolean
  }[]
}

export interface CommunityReport {
  _id: string
  author:string | null
  title: string
  description: string
  category: "illegal_dumping" | "overflowing_bin" | "missed_collection" | "overflow_swvage" | "other"
  location: string
  status: "pending" | "in_progress" | "resolved"
  reportedAt: string
  reportedBy: string
  priority: "low" | "medium" | "high",
  imageUrl:string
}

export interface StoreItem {
  id: string
  name: string
  description: string
  points: number
  category: "eco_products" | "vouchers" | "services"
  image: string
  inStock: boolean
}

export interface ServiceLocation {
  id: string
  name: string
  type: "recycling_center" | "waste_facility" | "collection_point"
  address: string
  coordinates: { lat: number; lng: number }
  hours: string
  services: string[]
  contact: string
}

export interface VehicleTracking {
  id: string
  vehicleNumber: string
  route: string
  currentLocation: string
  nextStop: string
  estimatedArrival: string
  status: "on_route" | "collecting" | "completed"
  progress: number
}

// Mock data
export const mockWasteItems: WasteItem[] = [
  {
    id: "1",
    name: "Plastic Bottle",
    category: "recyclable",
    description: "Clear plastic water bottle",
    disposalInstructions: "Remove cap and label, rinse clean, place in recycling bin",
    points: 5,
  },
  {
    id: "2",
    name: "Banana Peel",
    category: "organic",
    description: "Organic fruit waste",
    disposalInstructions: "Place in organic waste bin or compost",
    points: 3,
  },
  {
    id: "3",
    name: "Battery",
    category: "hazardous",
    description: "Used AA battery",
    disposalInstructions: "Take to designated battery collection point - never put in regular trash",
    points: 10,
  },
]

export const mockTrainingModules: TrainingModule[] = [
  {
    id: "1",
    title: "Waste Segregation Basics",
    description: "Learn the fundamentals of proper waste separation and categorization",
    duration: 15,
    completed: true,
    points: 50,
    lessons: [
      {
        id: "1-1",
        title: "Types of Waste",
        content:
          "Understanding different waste categories is crucial for proper disposal. Learn about organic, recyclable, hazardous, and general waste types and their characteristics.",
        completed: true,
      },
      {
        id: "1-2",
        title: "Color Coding System",
        content:
          "Master the universal color coding system used for waste bins. Each color represents a specific type of waste and helps ensure proper segregation.",
        completed: true,
      },
      {
        id: "1-3",
        title: "Common Mistakes",
        content:
          "Identify and avoid the most common waste segregation mistakes that can contaminate recycling streams and harm the environment.",
        completed: true,
      },
    ],
  },
  {
    id: "2",
    title: "Hazardous Waste Handling",
    description: "Safe disposal of dangerous materials and understanding safety protocols",
    duration: 20,
    completed: false,
    points: 75,
    lessons: [
      {
        id: "2-1",
        title: "Identifying Hazardous Waste",
        content:
          "Learn to recognize dangerous materials in household and commercial waste, including chemicals, batteries, and electronic components.",
        completed: false,
      },
      {
        id: "2-2",
        title: "Safety Protocols",
        content:
          "Understand proper handling procedures, protective equipment requirements, and emergency response protocols for hazardous materials.",
        completed: false,
      },
      {
        id: "2-3",
        title: "Disposal Locations",
        content:
          "Find authorized disposal facilities and understand the legal requirements for hazardous waste disposal in your area.",
        completed: false,
      },
    ],
  },
  {
    id: "3",
    title: "Recycling Best Practices",
    description: "Maximize recycling efficiency and understand the recycling process",
    duration: 18,
    completed: false,
    points: 60,
    lessons: [
      {
        id: "3-1",
        title: "Preparation for Recycling",
        content:
          "Learn how to properly clean and prepare materials for recycling to ensure they can be processed effectively.",
        completed: false,
      },
      {
        id: "3-2",
        title: "Recycling Symbols",
        content:
          "Decode recycling symbols and numbers to understand what can and cannot be recycled in your local system.",
        completed: false,
      },
      {
        id: "3-3",
        title: "The Recycling Journey",
        content: "Follow materials through the recycling process from collection to new product creation.",
        completed: false,
      },
    ],
  },
  {
    id: "4",
    title: "Composting and Organic Waste",
    description: "Turn organic waste into valuable compost for gardens and plants",
    duration: 25,
    completed: false,
    points: 80,
    lessons: [
      {
        id: "4-1",
        title: "Composting Basics",
        content:
          "Understand the science behind composting and learn about different composting methods suitable for various living situations.",
        completed: false,
      },
      {
        id: "4-2",
        title: "What to Compost",
        content:
          "Identify which organic materials can be composted and which should be avoided to maintain a healthy compost system.",
        completed: false,
      },
      {
        id: "4-3",
        title: "Troubleshooting Compost",
        content:
          "Solve common composting problems like odors, pests, and slow decomposition to maintain an effective compost system.",
        completed: false,
      },
    ],
  },
]

export const mockStoreItems: StoreItem[] = [
  {
    id: "1",
    name: "Reusable Water Bottle",
    description: "Eco-friendly stainless steel water bottle with double-wall insulation",
    points: 200,
    category: "eco_products",
    image: "/reusable-water-bottle.png",
    inStock: true,
  },
  {
    id: "2",
    name: "Grocery Store Voucher",
    description: "$10 voucher for local grocery store - support local businesses",
    points: 500,
    category: "vouchers",
    image: "/grocery-voucher.jpg",
    inStock: true,
  },
  {
    id: "3",
    name: "Tree Planting Service",
    description: "Plant a tree in your neighborhood and contribute to urban forestry",
    points: 1000,
    category: "services",
    image: "/community-tree-planting.png",
    inStock: false,
  },
  {
    id: "4",
    name: "Bamboo Cutlery Set",
    description: "Portable bamboo utensils perfect for reducing single-use plastic",
    points: 150,
    category: "eco_products",
    image: "/bamboo-cutlery-set.png",
    inStock: true,
  },
  {
    id: "5",
    name: "Coffee Shop Voucher",
    description: "$5 voucher for participating local coffee shops",
    points: 250,
    category: "vouchers",
    image: "/coffee-shop-voucher.jpg",
    inStock: true,
  },
  {
    id: "6",
    name: "Home Composting Kit",
    description: "Complete starter kit for home composting with instructions",
    points: 400,
    category: "eco_products",
    image: "/composting-kit.jpg",
    inStock: true,
  },
  {
    id: "7",
    name: "Waste Audit Service",
    description: "Professional waste audit for your home or business",
    points: 800,
    category: "services",
    image: "/waste-audit-service.jpg",
    inStock: true,
  },
  {
    id: "8",
    name: "Eco-Friendly Cleaning Kit",
    description: "Natural cleaning products that are safe for the environment",
    points: 300,
    category: "eco_products",
    image: "/eco-cleaning-products.jpg",
    inStock: true,
  },
  {
    id: "9",
    name: "Restaurant Voucher",
    description: "$15 voucher for eco-conscious restaurants in your area",
    points: 750,
    category: "vouchers",
    image: "/restaurant-voucher.png",
    inStock: false,
  },
]

export const mockServiceLocations: ServiceLocation[] = [
  {
    id: "1",
    name: "Central Recycling Center",
    type: "recycling_center",
    address: "123 Green Street, City Center",
    coordinates: { lat: 40.7128, lng: -74.006 },
    hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
    services: ["Paper Recycling", "Plastic Recycling", "Metal Recycling", "Glass Recycling"],
    contact: "(555) 123-4567",
  },
  {
    id: "2",
    name: "Hazardous Waste Facility",
    type: "waste_facility",
    address: "456 Industrial Ave, Industrial District",
    coordinates: { lat: 40.7589, lng: -73.9851 },
    hours: "Mon-Sat: 9AM-5PM",
    services: ["Battery Disposal", "Chemical Waste", "Electronic Waste", "Paint Disposal"],
    contact: "(555) 987-6543",
  },
  {
    id: "3",
    name: "Northside Collection Point",
    type: "collection_point",
    address: "789 Oak Avenue, Northside",
    coordinates: { lat: 40.7831, lng: -73.9712 },
    hours: "24/7 Access",
    services: ["General Waste", "Organic Waste", "Small Recyclables"],
    contact: "(555) 456-7890",
  },
  {
    id: "4",
    name: "Electronics Recycling Hub",
    type: "waste_facility",
    address: "321 Tech Boulevard, Innovation District",
    coordinates: { lat: 40.7505, lng: -73.9934 },
    hours: "Tue-Sat: 10AM-6PM",
    services: ["Computer Recycling", "Phone Recycling", "TV Disposal", "Battery Collection"],
    contact: "(555) 234-5678",
  },
  {
    id: "5",
    name: "Community Recycling Station",
    type: "collection_point",
    address: "654 Maple Street, Riverside",
    coordinates: { lat: 40.7282, lng: -74.0776 },
    hours: "Daily: 6AM-10PM",
    services: ["Paper Collection", "Bottle Return", "Textile Recycling"],
    contact: "(555) 345-6789",
  },
]

export const mockVehicleTracking: VehicleTracking[] = [
  {
    id: "1",
    vehicleNumber: "WM-001",
    route: "Downtown Route A",
    currentLocation: "Oak Street",
    nextStop: "Pine Avenue",
    estimatedArrival: "10:30 AM",
    status: "on_route",
    progress: 65,
  },
  {
    id: "2",
    vehicleNumber: "WM-002",
    route: "Residential Route B",
    currentLocation: "Maple Drive",
    nextStop: "Cedar Lane",
    estimatedArrival: "11:15 AM",
    status: "collecting",
    progress: 40,
  },
]

"use client";
import type React from "react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Search,
  Camera,
  Send,
} from "lucide-react";
import { mockCommunityReports, type CommunityReport } from "@/lib/mock-data";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { mohalla } from "@/lib/ward";

type ReportCategory =
  | "illegal_dumping"
  | "overflowing_bin"
  | "missed_collection"
  | "other";
type ReportPriority = "low" | "medium" | "high";

interface ReportFormData {
  title: string;
  description: string;
  category: ReportCategory | "";
  location: string;
  priority: ReportPriority;
  imageUrl: string;
}

export default function CommunityPage() {
  const [reports, setReports] =
    useState<CommunityReport[]>(mockCommunityReports);
  const [showReportForm, setShowReportForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    fechReport();
    async function fechReport() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/reports/`
        );
        setReports(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  });

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || report.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_progress":
        return <AlertTriangle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const inProgressReports = reports.filter(
    (r) => r.status === "in_progress"
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Community Reports
              </h1>
              <p className="text-muted-foreground">
                Report waste management issues and track community improvements
              </p>
            </div>
            <Button onClick={() => setShowReportForm(true)} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Report Issue
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {pendingReports}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {inProgressReports}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {resolvedReports}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Resolved
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {reports.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Reports
                    </div>
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
                      placeholder="Search reports by title, description, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={priorityFilter}
                    onValueChange={setPriorityFilter}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <Card
                  key={report.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {report.title}
                          </h3>
                          <Badge
                            className={`${getStatusColor(
                              report.status
                            )} border text-xs`}
                          >
                            {getStatusIcon(report.status)}
                            <span className="ml-1 capitalize">
                              {report.status.replace("_", " ")}
                            </span>
                          </Badge>
                          <Badge
                            className={`${getPriorityColor(
                              report.priority
                            )} border text-xs`}
                          >
                            <span className="capitalize">
                              {report.priority}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3 text-pretty">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {report.location}
                          </div>
                          <div>Reported by {report.reportedBy}</div>
                          <div>{formatDate(report.reportedAt)}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/user/community/${report.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent"
                          >
                            View Details
                          </Button>
                        </Link>
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
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No Reports Found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    No reports match your current search criteria. Try adjusting
                    your filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setPriorityFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Report Form Modal */}
          {showReportForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Report a Waste Management Issue</CardTitle>
                  <CardDescription>
                    Help improve your community by reporting waste management
                    problems
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ReportForm
                    onClose={() => setShowReportForm(false)}
                    onSubmit={(newReport) => {
                      setReports([newReport, ...reports]);
                      setShowReportForm(false);
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReportFormProps {
  onClose: () => void;
  onSubmit: (report: CommunityReport) => void;
}

function ReportForm({ onClose }: ReportFormProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    description: "",
    category: "",
    location: "",
    priority: "medium",
    imageUrl: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const clearImageUrl = () => {
    setFormData({ ...formData, imageUrl: "" });
  };

  // Get the final image URL (either from upload or URL input)
  const getFinalImageUrl = () => {
    if (imagePreview) return imagePreview; // Uploaded image takes priority
    if (formData.imageUrl) return formData.imageUrl; // URL input as fallback
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("fuck yo");
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    const newReport: CommunityReport = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category as ReportCategory, // Type assertion with proper type
      location: formData.location,
      status: "pending",
      reportedAt: new Date().toISOString(),
      reportedBy: "Current User",
      priority: formData.priority,
      imageUrl: getFinalImageUrl(),
    };
    console.log(newReport);
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reports/`,
      newReport
    );
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Issue Title
        </label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Brief description of the issue"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Category
        </label>
        <Select
          required
          value={formData.category}
          onValueChange={(value: ReportCategory) =>
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select issue category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="illegal_dumping">Illegal Dumping</SelectItem>
            <SelectItem value="overflowing_bin">Overflowing Bin</SelectItem>
            <SelectItem value="missed_collection">Missed Collection</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fixed Location Section */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Location
        </label>
        <Select
          required
          value={formData.location}
          onValueChange={(value: string) =>
            setFormData({ ...formData, location: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select location/mohalla" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto">
            {mohalla.map((location, index) => (
              <SelectItem key={index} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Priority
        </label>
        <Select
          value={formData.priority}
          onValueChange={(value: ReportPriority) =>
            setFormData({ ...formData, priority: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Description
        </label>
        <Textarea
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Provide detailed information about the issue..."
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Image URL (Optional)
        </label>
        <Input
          type="url"
          value={formData.imageUrl}
          onChange={(e) =>
            setFormData({ ...formData, imageUrl: e.target.value })
          }
          placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
          disabled={!!imagePreview} // Disable if image is uploaded
        />
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">
            {imagePreview
              ? "Remove uploaded image to use URL instead"
              : "Provide a direct link to an image that shows the issue"}
          </p>
          {formData.imageUrl && !imagePreview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImageUrl}
              className="h-auto p-1 text-xs"
            >
              Clear URL
            </Button>
          )}
        </div>

        {/* URL Image Preview */}
        {formData.imageUrl && !imagePreview && (
          <div className="mt-3">
            <p className="text-sm font-medium text-foreground mb-2">
              URL Image Preview:
            </p>
            <div className="relative inline-block">
              <Image
                src={formData.imageUrl}
                alt="URL Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const errorDiv = target.nextElementSibling as HTMLElement;
                  if (errorDiv) errorDiv.style.display = "flex";
                }}
                onLoad={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "block";
                  const errorDiv = target.nextElementSibling as HTMLElement;
                  if (errorDiv) errorDiv.style.display = "none";
                }}
              />
              <div
                className="w-32 h-32 bg-gray-100 rounded-lg border items-center justify-center p-2"
                style={{ display: "none" }}
              >
                <p className="text-xs text-gray-500 text-center">
                  Invalid image URL
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Camera className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Upload Image{" "}
            {formData.imageUrl && !imagePreview
              ? "(Override URL)"
              : "(Optional)"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {formData.imageUrl && !imagePreview
            ? "Upload an image to use instead of the URL above"
            : "Upload an image file that shows the issue"}
        </p>

        {imagePreview ? (
          <div className="space-y-3">
            <div className="relative inline-block">
              <Image
                src={imagePreview}
                alt="Preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeImage}
              >
                ×
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              File: {selectedImage?.name}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Camera className="w-4 h-4 mr-2" />
              Choose Image
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1 bg-transparent"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Report
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
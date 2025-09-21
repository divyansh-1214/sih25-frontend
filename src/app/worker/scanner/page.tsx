"use client";

import { useState, useRef, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Video, StopCircle, RotateCcw, Send, Star } from "lucide-react";
import axios from "axios";
import jsQR from "jsqr";
export default function QrScanner() {
  const [data, setData] = useState("No result");
  const [useVideoInput, setUseVideoInput] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [workerId,setWorkerId] = useState(null)
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    behavior: "",
    segregationQuality: "",
    wasteWeight: "",
    comments: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const port = process.env.NEXT_PUBLIC_API_URL;

  // Fetch user data when QR is scanned
  const fetchUserData = async (userId: string) => {
    if (userId === "No result" || loading) return;

    console.log("Attempting to fetch user data for ID:", userId);
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      // Try different API endpoints based on the data format
      let response;

      // First try direct profile fetch
      try {
        response = await axios.get(`${port}/api/auth/profile/${userId}`);
      } catch (firstError) {
        console.log("Direct profile fetch failed, trying alternative endpoint");

        // If that fails, try with the current user endpoint and pass ID as query
        try {
          response = await axios.get(`${port}/api/auth/profile`, {
            params: { userId: userId },
          });
        } catch (secondError) {
          console.log("Alternative endpoint failed, checking if it's a URL");

          // If the QR contains a URL, extract the ID from it
          if (userId.startsWith("http") && userId.includes("/profile/")) {
            const extractedId = userId.split("/profile/")[1];
            response = await axios.get(
              `${port}/api/auth/profile/${extractedId}`
            );
          } else {
            throw secondError;
          }
        }
      }

      setUserData(response.data);
      console.log("User data fetched successfully:", response.data);
      
      // Pre-populate form with user data
      setFormData(prev => ({
        ...prev,
        name: response.data.name || "",
        email: response.data.email || "",
        address: response.data.address || ""
      }));
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setUserData(null);
      setError(
        `Failed to fetch user data: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  // Start webcam video
  const startVideo = async () => {
    setError("");
    try {
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      setStream(mediaStream);
      setIsVideoActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        // Wait a moment for video to initialize before starting detection
        setTimeout(startQRDetection, 1000);
      }
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      let errorMessage = "Failed to access camera. ";

      if (error.name === "NotAllowedError") {
        errorMessage +=
          "Camera permission was denied. Please allow camera access and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No camera found on this device.";
      } else if (error.name === "NotSupportedError") {
        errorMessage += "Camera is not supported in this browser.";
      } else {
        errorMessage +=
          error.message || "Please ensure camera permissions are granted.";
      }

      setError(errorMessage);
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsVideoActive(false);
  };

  // QR detection from video stream
  const startQRDetection = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && canvasRef.current && isVideoActive) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context && video.videoWidth > 0 && video.videoHeight > 0) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Get image data for QR detection
          const imageData = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const qrCode = jsQR(
            imageData.data,
            imageData.width,
            imageData.height
          );

          if (qrCode && qrCode.data !== data) {
            console.log("Raw QR Code Data:", qrCode.data);

            // Process the QR data - could be just an ID, URL, or JSON
            let processedData = qrCode.data;

            // If it's a URL, try to extract useful information
            if (qrCode.data.startsWith("http")) {
              console.log("QR contains URL:", qrCode.data);
              // Extract ID from URL if it contains /profile/
              if (qrCode.data.includes("/profile/")) {
                const urlParts = qrCode.data.split("/profile/");
                if (urlParts.length > 1) {
                  processedData = urlParts[1].split(/[?&#]/)[0]; // Get ID, remove query params
                }
              }
            }

            // If it looks like JSON, try to parse it
            try {
              if (qrCode.data.startsWith("{")) {
                const parsedData = JSON.parse(qrCode.data);
                if (parsedData.userId || parsedData.id) {
                  processedData = parsedData.userId || parsedData.id;
                }
              }
            } catch (e) {
              // Not JSON, use original data
            }

            setData(processedData);
            console.log("Processed QR Code Data:", processedData);
            // Stop scanning after successful detection
            stopVideo();
          }
        }
      }
    }, 100); // Check every 100ms for better responsiveness
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      const token = getCookie("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }
      // Fetch worker profile to get worker ID
      const workerProfileRes = await axios.get(
        `${port}/api/auth/worker/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      const workerId = workerProfileRes.data.user.id;

      const submissionData = {
        ...formData,
        uId: data, // The scanned user ID
        date: new Date().toISOString(),
        wId: workerId,
        scannedAt: new Date().toISOString(),
      };

      console.log("Submitting evaluation:", submissionData);
      
      // Submit to your evaluation/feedback API endpoint
      const response = await axios.post(
        `${port}/api/worker/feedback/`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log("Evaluation submitted successfully:", response.data);
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        address: "",
        behavior: "",
        segregationQuality: "",
        wasteWeight: "",
        comments: ""
      });
      
      // Reset scanner
      setData("No result");
      setUserData(null);
      
      alert("Evaluation submitted successfully!");
      
    } catch (error: any) {
      console.error("Error submitting evaluation:", error);
      setError(`Failed to submit evaluation: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get cookie value (add this if not already present)
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // Handle QR scan result
  useEffect(() => {
    if (data !== "No result") {
      fetchUserData(data);
    }
  }, [data]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVideo();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-6 h-6" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
            {/* QR Reader Mode */}
            {!useVideoInput && (
              <div className="space-y-4">
                <div className="w-0 max-w-md mx-auto">
                  <QrReader
                    onResult={(result, error) => {
                      if (!!result) {
                        setData(result.getText());
                      }
                      if (!!error) {
                        console.error(error);
                      }
                    }}
                    constraints={{ facingMode: "environment" }}
                  />
                  <QrReader
                    constraints={{
                      facingMode: "environment",
                    }}
                    onResult={(result, err) => {
                      if (result) {
                        setData(result.getText()); // ✅ show result
                        console.log("Scanned QR:", result.getText());
                      }
                      if (err && !result) {
                        // log error, but don’t spam UI state
                        console.debug("Scanner error (ignored):", err);
                      }
                    }}
                  />
                </div>
              </div>
            )}
            <div className="relative bg-black ">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                autoPlay
                muted
                playsInline
              />
              {isVideoActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="border-2 border-green-500 bg-transparent w-48 h-48 rounded-lg relative">
                        <div className="absolute top-0 left-0 w-6 h-6 border-l-4 border-t-4 border-green-500"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-r-4 border-t-4 border-green-500"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-4 border-b-4 border-green-500"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-4 border-b-4 border-green-500"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-green-500 text-sm font-medium">
                            Scanning for QR Code...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                {!isVideoActive ? (
                  <Button
                    onClick={startVideo}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopVideo} variant="destructive">
                    <StopCircle className="w-4 h-4 mr-2" />
                    Stop Camera
                  </Button>
                )}
              </div>
            </div>

            {/* Scan Result */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Scanned Result:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setData("No result");
                    setUserData(null);
                    setError("");
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
              <Badge
                variant={data !== "No result" ? "default" : "secondary"}
                className="text-sm"
              >
                {data}
              </Badge>
              {/* Debug Info */}
              {data !== "No result" && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  <p>
                    <strong>Debug Info:</strong>
                  </p>
                  <p>
                    Data Type:{" "}
                    {data.startsWith("http")
                      ? "URL"
                      : data.startsWith("{")
                      ? "JSON"
                      : "String"}
                  </p>
                  <p>Length: {data.length} characters</p>
                  <p>API Call: http://localhost:5000/api/auth/profile/{data}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Data Display */}
        {loading && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Loading user data...</p>
            </CardContent>
          </Card>
        )}

        {userData && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-sm">{userData.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="text-sm">{userData.email || "N/A"}</p>
                </div>
              </div>
              {userData.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Address
                  </label>
                  <p className="text-sm">{userData.address}</p>
                </div>
              )}
            </CardContent>
            
            {/* Evaluation Form */}
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">User Evaluation Form</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter user name"
                        required
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter full address"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Behavior Assessment */}
                    <div className="space-y-2">
                      <Label htmlFor="behavior">User Behavior</Label>
                      <Select
                        value={formData.behavior}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, behavior: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select behavior rating" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent - Very cooperative</SelectItem>
                          <SelectItem value="good">Good - Cooperative</SelectItem>
                          <SelectItem value="average">Average - Somewhat cooperative</SelectItem>
                          <SelectItem value="poor">Poor - Uncooperative</SelectItem>
                          <SelectItem value="very-poor">Very Poor - Hostile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Segregation Quality */}
                    <div className="space-y-2">
                      <Label htmlFor="segregation">Segregation Quality</Label>
                      <Select
                        value={formData.segregationQuality}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, segregationQuality: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select segregation quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent - Perfect segregation</SelectItem>
                          <SelectItem value="good">Good - Well segregated</SelectItem>
                          <SelectItem value="average">Average - Partially segregated</SelectItem>
                          <SelectItem value="poor">Poor - Poorly segregated</SelectItem>
                          <SelectItem value="none">None - No segregation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Waste Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight">Waste Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.wasteWeight}
                      onChange={(e) => setFormData(prev => ({ ...prev, wasteWeight: e.target.value }))}
                      placeholder="Enter waste weight in kg"
                      required
                    />
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea
                      id="comments"
                      value={formData.comments}
                      onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                      placeholder="Any additional observations or comments"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !formData.name || !formData.wasteWeight}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Evaluation
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          name: userData?.name || "",
                          email: userData?.email || "",
                          address: userData?.address || "",
                          behavior: "",
                          segregationQuality: "",
                          wasteWeight: "",
                          comments: ""
                        });
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  RefreshCw,
  LogOut,
  QrCode,
  Download,
  Briefcase,
} from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";
interface WorkerProfile {
  _id: string;
  role: string;
  name: string;
  aadhar: string;
  address: string;
  phoneNumber: string;
  workerType: string;
  email: string;
  password?: string;
  __v?: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [url, setUrl] = useState<string | null>(null);
  // Helper function to get cookie value
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  // Helper function to delete cookie
  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  };

  const fetchProfile = useCallback (async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getCookie("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      // First, get the worker ID from the main profile endpoint
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/worker/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      // Then get the detailed worker profile using the ID
      const detailedResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/authority/profile/${response.data.user.id}`
      );
      setProfile(detailedResponse.data);
      generateQRCode(detailedResponse.data._id);
    } catch (error) {
      console.error("Profile fetch error:", error);
      let errorMessage = "Failed to load worker profile data.";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
          // Clear invalid token
          deleteCookie("authToken");
          localStorage.removeItem("userData");
          setTimeout(() => router.push("/worker"), 2000);
        } else if (error.response?.status === 403) {
          errorMessage =
            "Access denied. You do not have permission to view this profile.";
        } else if (error.response) {
          errorMessage =
            error.response.data?.message ||
            error.response.data?.error ||
            `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  },[router]);

  const generateQRCode = async (value: string) => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(value);
      setUrl(qrCodeUrl);
    } catch (err) {
      console.error(err);
    }
  };

  function downLoadQRCode() {
    if (!profile || !url) return;
    
    const fileName = `${profile.name.replace(/\s+/g, '_')}_QR_Code`;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  const handleLogout = () => {
    // Clear auth data
    deleteCookie("authToken");
    localStorage.removeItem("userData");

    // Redirect to login
    router.push("/worker");
  };

  const handleRefresh = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="flex items-center justify-center p-8">
            <RefreshCw className="h-8 w-8 animate-spin text-green-600 mr-3" />
            <span className="text-lg">Loading profile...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-700">{error}</p>
            <div className="space-x-4">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Login Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center p-8">
            <p className="text-gray-700">No profile data available.</p>
            <Button onClick={handleRefresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Authority Profile</h1>
          <div className="space-x-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-2xl">{profile.name}</CardTitle>
                <CardDescription>Worker ID: {profile._id}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Basic Information
                </h3>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-sm text-gray-500">Email</Label>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-sm text-gray-500">
                      Phone Number
                    </Label>
                    <p className="font-medium">{profile.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-sm text-gray-500">
                      Aadhar Number
                    </Label>
                    <p className="font-medium">{profile.aadhar}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Briefcase className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-sm text-gray-500">Role</Label>
                    <p className="font-medium capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Work Details
                </h3>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <Label className="text-sm text-gray-500">Address</Label>
                    <p className="font-medium">{profile.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-sm text-gray-500">
                      Worker Type
                    </Label>
                    <p className="font-medium capitalize">
                      {profile.workerType.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-green-600" />
              <span>Worker QR Code</span>
            </CardTitle>
            <CardDescription>
              Your unique QR code for worker identification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* QR Code Display */}
              <div className="flex-shrink-0">
                {url ? (
                  <div className="relative">
                    <Image
                      src={url} 
                      alt="Worker QR Code" 
                      className="w-48 h-48 border-2 border-gray-200 rounded-lg bg-white p-2"
                    />
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="secondary" className="text-xs">
                        Worker ID: {profile._id.slice(-6)}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Generating QR Code...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* QR Code Info */}
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">QR Code Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Contains: Worker ID ({profile._id})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <QrCode className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Format: QR Code (PNG)</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-3">
                    This QR code contains your unique worker ID and can be used for:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Worker identification at work sites</li>
                    <li>• Accessing worker account via QR scanner</li>
                    <li>• Verification for waste management tasks</li>
                    <li>• Time tracking and attendance</li>
                  </ul>
                </div>

                {/* Download Button */}
                {url && (
                  <Button 
                    onClick={downLoadQRCode}
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

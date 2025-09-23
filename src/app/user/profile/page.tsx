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
  Users,
  CreditCard,
  RefreshCw,
  LogOut,
  QrCode,
  Download,
} from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";

interface PersonDetail {
  name: string;
  aadhar: string;
  _id?: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  aadhar: string;
  phoneNumber: string;
  address: string;
  numberOfPersons: number;
  personsDetails: PersonDetail[];
  garbagePickerReviewReference?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

  // Memoize fetchProfile to prevent unnecessary re-renders
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getCookie("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      console.log("Fetching profile with token:", token);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("Profile data received:", response.data);

      const responseUser = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/${response.data.user.id}`
      );
      setProfile(responseUser.data);
      generateQRCode(response.data.user.id);
    } catch (error) {
      console.error("Profile fetch error:", error);
      let errorMessage = "Failed to load profile data.";

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
          // Clear invalid token
          deleteCookie("authToken");
          localStorage.removeItem("userData");
          setTimeout(() => router.push("/auth/login"), 2000);
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
  }, [router]); // Include router as dependency

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
    router.push("/auth/login");
  };

  const handleRefresh = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Now fetchProfile is memoized and safe to include

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
          <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
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
                <CardDescription>User ID: {profile._id}</CardDescription>
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
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Address & Details
                </h3>

                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <Label className="text-sm text-gray-500">Address</Label>
                    <p className="font-medium">{profile.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <Label className="text-sm text-gray-500">
                      Household Members
                    </Label>
                    <p className="font-medium">
                      {profile.numberOfPersons} person(s)
                    </p>
                  </div>
                </div>

                {profile.garbagePickerReviewReference && (
                  <div>
                    <Label className="text-sm text-gray-500">
                      Garbage Picker Reference
                    </Label>
                    <p className="font-medium">
                      {profile.garbagePickerReviewReference}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Household Members Card */}
        {profile.personsDetails && profile.personsDetails.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-green-600" />
                <span>Household Members</span>
                <Badge variant="secondary">
                  {profile.personsDetails.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                Details of all household members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.personsDetails.map((person, index) => (
                  <div
                    key={person._id || index}
                    className="border rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-800">
                      Person {index + 1}
                    </h4>
                    <div className="mt-2 space-y-1">
                      <p>
                        <span className="text-gray-500">Name:</span>{" "}
                        {person.name}
                      </p>
                      <p>
                        <span className="text-gray-500">Aadhar:</span>{" "}
                        {person.aadhar}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-green-600" />
              <span>User QR Code</span>
            </CardTitle>
            <CardDescription>
              Your unique QR code for identification
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
                      alt="User QR Code" 
                      width={192}
                      height={192}
                      unoptimized
                      className="w-48 h-48 border-2 border-gray-200 rounded-lg bg-white p-2"
                    />
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                      <Badge variant="secondary" className="text-xs">
                        User ID: {profile._id.slice(-6)}
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
                      <span className="text-gray-600">Contains: User ID ({profile._id})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <QrCode className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">Format: QR Code (PNG)</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-3">
                    This QR code contains your unique user ID and can be used for:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Quick identification at waste collection points</li>
                    <li>• Accessing your account via QR scanner</li>
                    <li>• Verification for waste management services</li>
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

        {/* Account Details */}
        {(profile.createdAt || profile.updatedAt) && (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {profile.createdAt && (
                <p>
                  <span className="text-gray-500">Account Created:</span>{" "}
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              )}
              {profile.updatedAt && (
                <p>
                  <span className="text-gray-500">Last Updated:</span>{" "}
                  {new Date(profile.updatedAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    aadhar: "",
    numberOfPersons: 1,
    personsDetails: [{ name: "", aadhar: "" }],
    address: "",
    garbagePickerReviewReference: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    email: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signup = async (
    name: string,
    aadhar: string,
    numberOfPersons: number,
    personsDetails: Array<{ name: string; aadhar: string }>,
    address: string,
    garbagePickerReviewReference: string,
    phoneNumber: string,
    password: string,
    email: string
  ) => {
    try {
      const requestData = {
        name,
        aadhar,
        numberOfPersons,
        personsDetails,
        address,
        garbagePickerReviewReference,
        phoneNumber,
        password,
        email,
      };

      console.log('Sending registration data:', requestData);

      const response = await axios.post('http://localhost:5000/api/auth/register', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });
      
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
          
          const errorMessage = error.response.data?.message || 
                              error.response.data?.error || 
                              `Server error: ${error.response.status}`;
          throw new Error(errorMessage);
        } else if (error.request) {
          throw new Error('Network error. Please check your connection and ensure the server is running.');
        } else {
          throw new Error('An unexpected error occurred.');
        }
      }
      throw error;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validations
    if (!formData.name.trim()) {
      alert("Please enter your full name");
      return;
    }
    if (!formData.aadhar.trim()) {
      alert("Please enter your Aadhar number");
      return;
    }

    if (!formData.email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      alert("Please enter your phone number");
      return;
    }

    if (!formData.address.trim()) {
      alert("Please enter your address");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (formData.numberOfPersons !== formData.personsDetails.length) {
      alert("Number of persons doesn't match the details provided");
      return;
    }

    // Validate that all person details are filled
    for (const person of formData.personsDetails) {
      if (!person.name.trim() || !person.aadhar.trim()) {
        alert("Please fill all person details (name and aadhar for each person)");
        return;
      }
    }

    console.log('Form data before submission:', formData);

    setIsLoading(true);
    try {
      const result = await signup(
        formData.name.trim(),
        formData.aadhar.trim(),
        formData.numberOfPersons,
        formData.personsDetails.map(person => ({
          name: person.name.trim(),
          aadhar: person.aadhar.trim()
        })),
        formData.address.trim(),
        formData.garbagePickerReviewReference.trim(),
        formData.phoneNumber.trim(),
        formData.password,
        formData.email.trim()
      );
      if (result) {
        alert("Account created successfully!");
        // Reset form
        setFormData({
          name: "",
          aadhar: "",
          numberOfPersons: 1,
          personsDetails: [{ name: "", aadhar: "" }],
          address: "",
          garbagePickerReviewReference: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          email: "",
        });
        // Redirect to login page
        router.push('/auth/login');
      }
    } catch (error) {
      console.error("Signup failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePersonDetailChange = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personsDetails: prev.personsDetails.map((person, i) =>
        i === index ? { ...person, [field]: value } : person
      ),
    }));
  };

  const handleNumberOfPersonsChange = (newNumber: number) => {
    setFormData((prev) => {
      const currentDetails = [...prev.personsDetails];
      if (newNumber > currentDetails.length) {
        // Add new empty person objects
        for (let i = currentDetails.length; i < newNumber; i++) {
          currentDetails.push({ name: "", aadhar: "" });
        }
      } else if (newNumber < currentDetails.length) {
        // Remove excess person objects
        currentDetails.splice(newNumber);
      }
      return {
        ...prev,
        numberOfPersons: newNumber,
        personsDetails: currentDetails,
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-600 p-3 rounded-full w-fit mb-4">
            <Recycle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join the waste management portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="aadhar">Aadhar Number</Label>
              <Input
                id="aadhar"
                type="text"
                placeholder="Enter your Aadhar Number"
                value={formData.aadhar}
                onChange={(e) => handleInputChange("aadhar", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfPersons">Number of Persons in Household</Label>
              <Input
                id="numberOfPersons"
                type="number"
                min="1"
                max="20"
                placeholder="Enter number of persons"
                value={formData.numberOfPersons}
                onChange={(e) => handleNumberOfPersonsChange(parseInt(e.target.value) || 1)}
                required
              />
            </div>
            
            {/* Dynamic persons details */}
            <div className="space-y-4">
              <Label>Household Members Details</Label>
              {formData.personsDetails.map((person, index) => (
                <div key={index} className="border p-3 rounded-md space-y-2">
                  <h4 className="text-sm font-medium">Person {index + 1}</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={person.name}
                      onChange={(e) => handlePersonDetailChange(index, "name", e.target.value)}
                      required
                    />
                    <Input
                      type="text"
                      placeholder="Aadhar Number"
                      value={person.aadhar}
                      onChange={(e) => handlePersonDetailChange(index, "aadhar", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="garbagePickerReviewReference">Garbage Picker Review Reference (Optional)</Label>
              <Input
                id="garbagePickerReviewReference"
                type="text"
                placeholder="Enter reference if any"
                value={formData.garbagePickerReviewReference}
                onChange={(e) => handleInputChange("garbagePickerReviewReference", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/auth/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

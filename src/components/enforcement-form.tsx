"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Send, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnforcementFormData {
  householdId: string;
  type: "warning" | "penalty";
  reason: string;
  description: string;
  amount?: number;
  dueDate?: string;
}
interface SearchType {
  id: string;
  address: string;
  zone: string;
}

const violationReasons = [
  "Improper waste segregation",
  "Mixed waste disposal",
  "Hazardous waste in regular bin",
  "No segregation at source",
  "Overflowing waste bins",
  "Waste disposal outside designated hours",
  "Blocking collection vehicle access",
  "Non-compliance with QR code scanning",
  "Other",
];

export function EnforcementForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<EnforcementFormData>({
    householdId: "",
    type: "warning",
    reason: "",
    description: "",
    amount: undefined,
    dueDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchType[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Enforcement Action Issued",
      description: `${
        formData.type === "warning" ? "Warning" : "Penalty"
      } has been issued to ${formData.householdId}`,
    });

    // Reset form
    setFormData({
      householdId: "",
      type: "warning",
      reason: "",
      description: "",
      amount: undefined,
      dueDate: "",
    });
    setIsSubmitting(false);
  };

  const handleHouseholdSearch = (value: string) => {
    setFormData({ ...formData, householdId: value });
    // Mock search results
    if (value.length > 2) {
      setSearchResults([
        { id: "HH-001", address: "123 Green Street, Block A", zone: "Zone 1" },
        { id: "HH-002", address: "456 Eco Avenue, Block B", zone: "Zone 1" },
        { id: "HH-003", address: "789 Clean Road, Block C", zone: "Zone 2" },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Issue Enforcement Action
        </CardTitle>
        <CardDescription>
          Issue warnings or penalties for non-compliance violations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Household Search */}
          <div className="space-y-2">
            <Label htmlFor="householdId">Household ID</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="householdId"
                placeholder="Search household ID or address..."
                value={formData.householdId}
                onChange={(e) => handleHouseholdSearch(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            {searchResults.length > 0 && (
              <div className="border rounded-md bg-background">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => {
                      setFormData({ ...formData, householdId: result.id });
                      setSearchResults([]);
                    }}
                  >
                    <div className="font-medium">{result.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.address}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {result.zone}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enforcement Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Enforcement Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "warning" | "penalty") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="penalty">Penalty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Violation Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Violation Reason</Label>
            <Select
              value={formData.reason}
              onValueChange={(value) =>
                setFormData({ ...formData, reason: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select violation reason" />
              </SelectTrigger>
              <SelectContent>
                {violationReasons.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Penalty Amount (if penalty) */}
          {formData.type === "penalty" && (
            <div className="space-y-2">
              <Label htmlFor="amount">Penalty Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter penalty amount"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: Number.parseInt(e.target.value) || undefined,
                  })
                }
                required={formData.type === "penalty"}
              />
            </div>
          )}

          {/* Due Date (if penalty) */}
          {formData.type === "penalty" && (
            <div className="space-y-2">
              <Label htmlFor="dueDate">Payment Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required={formData.type === "penalty"}
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Details</Label>
            <Textarea
              id="description"
              placeholder="Provide additional details about the violation..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Issue {formData.type === "warning" ? "Warning" : "Penalty"}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

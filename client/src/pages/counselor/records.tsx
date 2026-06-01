import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const COLLEGES = [
  { value: "CCS", label: "College of Computer Studies" },
  { value: "CSM", label: "College of Science and Mathematics" },
  { value: "COE", label: "College of Engineering" },
  { value: "CASS", label: "College of Arts and Social Sciences" },
  { value: "CED-IDS", label: "College of Education" },
  { value: "CHS", label: "College of Health Sciences" },
  { value: "CEBA", label: "College of Economics, Business and Accountancy" },
];

const YEAR_LEVELS = [
  { value: "1st Year", label: "1st Year" },
  { value: "2nd Year", label: "2nd Year" },
  { value: "3rd Year", label: "3rd Year" },
  { value: "4th Year", label: "4th Year" },
];

export default function StudentRecords() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [college, setCollege] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim() || !college || !yearLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/student-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName,
          studentId,
          college,
          yearLevel,
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add record");
      }

      const record = await response.json();
      
      toast({
        title: "Record Added",
        description: `Student record for ${studentName} has been created successfully.`,
      });

      // Reset form
      setStudentName("");
      setStudentId("");
      setCollege("");
      setYearLevel("");
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add student record",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role={ROLES.COUNSELOR}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/counselor")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-primary">
              Student Records
            </h1>
            <p className="text-muted-foreground">
              Create and manage student records.
            </p>
          </div>
        </div>

        <Card className="shadow-soft border-none max-w-2xl">
          <CardHeader>
            <CardTitle>Add New Student Record</CardTitle>
            <CardDescription>
              Enter the student information to create a new record.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddRecord} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  placeholder="Enter student full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID Number *</Label>
                <Input
                  id="studentId"
                  placeholder="Enter student ID number"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="college">College *</Label>
                  <Select value={college} onValueChange={setCollege} required>
                    <SelectTrigger id="college">
                      <SelectValue placeholder="Select a college" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLLEGES.map((col) => (
                        <SelectItem key={col.value} value={col.value}>
                          {col.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearLevel">Year Level *</Label>
                  <Select value={yearLevel} onValueChange={setYearLevel} required>
                    <SelectTrigger id="yearLevel">
                      <SelectValue placeholder="Select year level" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEAR_LEVELS.map((year) => (
                        <SelectItem key={year.value} value={year.value}>
                          {year.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this student..."
                  className="min-h-[120px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/counselor")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Record"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

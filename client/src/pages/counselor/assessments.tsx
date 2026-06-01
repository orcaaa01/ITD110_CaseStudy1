import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Search, RefreshCw } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Assessment {
  id: string;
  studentName: string;
  studentId: string;
  assessmentType: string;
  assessmentDate: string;
  results?: string;
  notes?: string;
  createdAt: Date;
}

export default function Assessments() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");
  const [assessmentType, setAssessmentType] = useState("");
  const [results, setResults] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Load assessments from API on mount
  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await fetch("/api/assessments");
      if (!response.ok) throw new Error("Failed to fetch assessments");
      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      toast({
        title: "Error",
        description: "Failed to load assessments",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmitAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim() || !assessmentDate.trim() || !assessmentType.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName,
          studentId,
          assessmentType,
          assessmentDate,
          results: results || undefined,
          notes: notes || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit assessment");
      }

      const newAssessment = await response.json();
      setAssessments([...assessments, newAssessment]);

      toast({
        title: "Assessment Submitted",
        description: `Assessment for ${studentName} has been recorded.`,
      });

      // Reset form
      setStudentName("");
      setStudentId("");
      setAssessmentDate("");
      setAssessmentType("");
      setResults("");
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit assessment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAssessments = assessments.filter((assessment) =>
    assessment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assessment.studentId.includes(searchQuery)
  );

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
              Assessment Management
            </h1>
            <p className="text-muted-foreground">
              Schedule and record student assessments.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <Card className="shadow-soft border-none lg:col-span-1">
            <CardHeader>
              <CardTitle>Submit Assessment</CardTitle>
              <CardDescription>
                Record a new assessment result.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAssessment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="studentName">Student Name</Label>
                  <Input
                    id="studentName"
                    placeholder="Enter student full name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input
                    id="studentId"
                    placeholder="Enter student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentType">Assessment Type</Label>
                  <Input
                    id="assessmentType"
                    placeholder="e.g., Psychological, Academic"
                    value={assessmentType}
                    onChange={(e) => setAssessmentType(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentDate">Assessment Date</Label>
                  <Input
                    id="assessmentDate"
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="results">Results (Optional)</Label>
                  <Textarea
                    id="results"
                    placeholder="Enter assessment results..."
                    className="min-h-[80px]"
                    value={results}
                    onChange={(e) => setResults(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes..."
                    className="min-h-[60px]"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation("/counselor")}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary"
                    disabled={isLoading}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {isLoading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Assessments List Section */}
          <Card className="shadow-soft border-none lg:col-span-2">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle>Assessment Records</CardTitle>
                  <CardDescription>View all submitted assessments.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchAssessments}
                  disabled={isFetching}
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or ID..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Results</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Loading assessments...
                      </TableCell>
                    </TableRow>
                  ) : filteredAssessments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No assessments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssessments.map((assessment) => (
                      <TableRow key={assessment.id} className="hover:bg-muted/10 transition-colors">
                        <TableCell className="font-medium">{assessment.studentName}</TableCell>
                        <TableCell className="font-mono text-sm">{assessment.studentId}</TableCell>
                        <TableCell>{assessment.assessmentType}</TableCell>
                        <TableCell>{assessment.assessmentDate}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {assessment.results ? assessment.results.substring(0, 50) + (assessment.results.length > 50 ? "..." : "") : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

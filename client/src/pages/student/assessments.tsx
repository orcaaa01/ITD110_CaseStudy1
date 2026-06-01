import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowLeft, Search, RefreshCw } from "lucide-react";
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

export default function StudentAssessments() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        description: "Failed to load assessment results",
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
    <DashboardLayout role={ROLES.STUDENT}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/student")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-primary">
              Assessment Results
            </h1>
            <p className="text-muted-foreground">
              View your assessment results and feedback from counselors.
            </p>
          </div>
        </div>

        <Card className="shadow-soft border-none">
          <CardHeader className="border-b border-border/40 bg-muted/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Your Assessments</CardTitle>
                <CardDescription>All assessment results and feedback</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAssessments}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assessments..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                Loading assessment results...
              </div>
            ) : filteredAssessments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No assessments found yet. Check back soon for your assessment results.
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredAssessments.map((assessment) => (
                  <AccordionItem key={assessment.id} value={assessment.id} className="border-b border-border/40">
                    <AccordionTrigger className="px-6 py-4 hover:bg-muted/5 transition-colors">
                      <div className="flex items-start justify-between w-full pr-4 gap-4">
                        <div className="text-left flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{assessment.assessmentType}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {assessment.assessmentDate}
                          </p>
                        </div>
                        <Badge variant="secondary" className="font-normal">
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 space-y-4">
                      {assessment.results && (
                        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                          <h4 className="font-medium text-sm">Results</h4>
                          <p className="text-sm text-foreground whitespace-pre-wrap">{assessment.results}</p>
                        </div>
                      )}

                      {assessment.notes && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-2">
                          <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">Notes from Counselor</h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">{assessment.notes}</p>
                        </div>
                      )}

                      {!assessment.results && !assessment.notes && (
                        <div className="text-sm text-muted-foreground italic">
                          Assessment has been recorded. Results and feedback coming soon.
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

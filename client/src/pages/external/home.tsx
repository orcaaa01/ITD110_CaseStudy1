import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, FileSignature } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ExternalHome() {
  const { toast } = useToast();
  const [clinicalObservations, setClinicalObservations] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [interventionDate, setInterventionDate] = useState("");
  const [pendingCases, setPendingCases] = useState([
    { id: "REF-2025-8891", title: "Assessment Follow-up", dueDate: "Nov 25, 2025" },
    { id: "REF-2025-8892", title: "Assessment Follow-up", dueDate: "Nov 25, 2025" },
  ]);

  const handleSaveDraft = () => {
    if (!clinicalObservations.trim() && !recommendations.trim()) {
      toast({
        title: "Nothing to Save",
        description: "Please enter some information before saving.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Draft Saved",
      description: "Your intervention report has been saved as a draft.",
    });
  };

  const handleSubmitReport = () => {
    if (!interventionDate || !clinicalObservations.trim() || !recommendations.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Submitted",
      description: "Your intervention report has been successfully submitted for review.",
    });

    // Reset form
    setInterventionDate("");
    setClinicalObservations("");
    setRecommendations("");
  };

  const handleCaseClick = (caseId: string) => {
    toast({
      title: "Case Selected",
      description: `Loaded case ${caseId}. You can now submit your intervention report.`,
    });
  };

  const handleMarkAsCompleted = (caseId: string) => {
    setPendingCases(pendingCases.filter((c) => c.id !== caseId));
    toast({
      title: "Case Completed",
      description: `Case ${caseId} has been marked as completed.`,
    });
  };

  return (
    <DashboardLayout role={ROLES.EXTERNAL}>
      <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-2">
            <FileSignature className="w-3 h-3" /> Professional Portal
          </div>
          <h1 className="text-3xl font-bold tracking-tight font-display text-primary">
            Case Feedback Submission
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Secure portal for submitting clinical observations and intervention reports for referred university cases.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <Card className="lg:col-span-2 shadow-soft border-none">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <CardTitle>Intervention Report</CardTitle>
              <CardDescription>
                Please provide detailed feedback on the conducted intervention.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Case Reference ID</Label>
                  <div className="relative">
                    <Input
                      defaultValue="REF-2025-8892"
                      className="font-mono bg-muted/30"
                      readOnly
                    />
                    <CheckCircle2 className="absolute right-3 top-2.5 w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Intervention Date</Label>
                  <Input
                    type="date"
                    className="bg-background"
                    value={interventionDate}
                    onChange={(e) => setInterventionDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Clinical Observations</Label>
                <Textarea
                  className="min-h-[150px] resize-none bg-background focus:border-primary/30 focus:ring-primary/20"
                  placeholder="Describe the client's demeanor, engagement, and key issues discussed..."
                  value={clinicalObservations}
                  onChange={(e) => setClinicalObservations(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Recommendations & Next Steps</Label>
                <Textarea
                  className="min-h-[100px] resize-none bg-background focus:border-primary/30 focus:ring-primary/20"
                  placeholder="Outline recommended follow-up actions or further assessments..."
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Attachment (Optional)</Label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-muted/20 transition-colors cursor-pointer border-muted-foreground/20">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop signed documents here, or click to browse.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t border-border/40 p-6 flex justify-end gap-4">
              <Button variant="ghost" onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button
                className="shadow-lg shadow-primary/20"
                onClick={handleSubmitReport}
              >
                Submit Final Report
              </Button>
            </CardFooter>
          </Card>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-blue-50/50 border-blue-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-blue-800 text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-800/80 leading-relaxed">
                  All submitted reports are confidential and strictly for the use of the
                  Guidance & Counseling center. Please ensure all data complies with the
                  Data Privacy Act.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-none">
              <CardHeader>
                <CardTitle className="text-base">Pending Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    className="p-3 rounded-lg border bg-background hover:border-primary/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        {caseItem.id}
                      </span>
                      <Badge variant="outline" className="text-[10px] h-5">
                        Pending
                      </Badge>
                    </div>
                    <p
                      className="font-medium text-sm cursor-pointer hover:text-primary transition-colors"
                      onClick={() => handleCaseClick(caseItem.id)}
                    >
                      {caseItem.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {caseItem.dueDate}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 text-xs h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleMarkAsCompleted(caseItem.id)}
                    >
                      Mark as Completed
                    </Button>
                  </div>
                ))}
                {pendingCases.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    No pending cases at this time.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

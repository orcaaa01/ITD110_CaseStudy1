import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


export default function ClientReferral() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    dateOfReferral: "",
    natureOfReferral: [] as string[],
    otherReferralSpec: "",
    referralAddressedTo: "",
    clientName: "",
    clientAge: "",
    clientSex: "",
    presentingIssues: "",
    actionsTaken: "",
    otherInformation: "",
    counselorName: "",
    counselorPosition: "",
    counselorOffice: "",
    counselorContact: "",
    actingHeadName: "",
    actingHeadContact: "",
  });


  const referralOptions = [
    "Mental health professional (for therapy/assessment)",
    "General health services",
    "Student development services",
    "Other student services",
    "Others (not specified)",
  ];


  const toggleCheckbox = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      natureOfReferral: prev.natureOfReferral.includes(value)
        ? prev.natureOfReferral.filter((item) => item !== value)
        : [...prev.natureOfReferral, value],
    }));
  };


  const handleSavePDF = async () => {
    if (!formData.clientName || !formData.counselorName) {
      toast({
        title: "Missing Information",
        description: "Please fill in client name and counselor name.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 12;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;
      const primaryColor: [number, number, number] = [33, 128, 141]; // Teal
      const darkColor: [number, number, number] = [31, 33, 33]; // Dark gray
      const lightBg: [number, number, number] = [242, 247, 247]; // Light teal background
  
      // Helper to check and add new page
      const checkNewPage = (spaceNeeded: number) => {
        if (yPosition + spaceNeeded > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };
  
      // Add header with company info
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(0, 0, pageWidth, 25, "F");
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("CLIENT REFERRAL FORM", pageWidth / 2, 12, { align: "center" });
      
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("MSU-IIT | Office of Guidance & Counseling", pageWidth / 2, 20, { align: "center" });
  
      yPosition = 35;
  
      // Helper function for section headings
      const addSectionHeading = (text: string) => {
        checkNewPage(12);
        pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.rect(margin - 1, yPosition - 4, contentWidth + 2, 8, "F");
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(11);
        pdf.text(text, margin + 2, yPosition + 2);
        
        pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        yPosition += 10;
      };
  
      // Helper function for field labels
      const addField = (label: string, value: string, isBold = false) => {
        checkNewPage(6);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        
        const labelWidth = 50;
        pdf.text(`${label}:`, margin, yPosition);
        
        pdf.setFont("helvetica", "normal");
        const lines = pdf.splitTextToSize(value || "Not provided", contentWidth - labelWidth - 5);
        pdf.text(lines, margin + labelWidth + 2, yPosition);
        
        yPosition += lines.length > 1 ? lines.length * 5 + 2 : 6;
      };
  
      // Helper for two-column layout
      const addTwoColumnFields = (label1: string, value1: string, label2: string, value2: string) => {
        checkNewPage(6);
        const columnWidth = contentWidth / 2 - 2;
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        pdf.text(label1 + ":", margin, yPosition);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const lines1 = pdf.splitTextToSize(value1 || "N/A", columnWidth - 5);
        pdf.text(lines1, margin + 2, yPosition + 4);
        
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text(label2 + ":", margin + columnWidth + 2, yPosition);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const lines2 = pdf.splitTextToSize(value2 || "N/A", columnWidth - 5);
        pdf.text(lines2, margin + columnWidth + 4, yPosition + 4);
        
        yPosition += Math.max(lines1.length, lines2.length) * 5 + 4;
      };
  
      // REFERRAL INFORMATION SECTION
      addSectionHeading("REFERRAL INFORMATION");
      addTwoColumnFields("Date of Referral", formData.dateOfReferral, "Referred To", formData.referralAddressedTo);
      
      addField("Nature of Referral", formData.natureOfReferral.join(", ") || "Not specified");
      if (formData.otherReferralSpec) {
        addField("Other Specification", formData.otherReferralSpec);
      }
      yPosition += 5;
  
      // CLIENT INFORMATION SECTION
      addSectionHeading("CLIENT INFORMATION");
      addTwoColumnFields("Client Name", formData.clientName, "Age", formData.clientAge);
      addField("Sex", formData.clientSex === "male" ? "Male" : formData.clientSex === "female" ? "Female" : "Not specified");
      
      checkNewPage(8);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      pdf.text("Presenting Issues and Concerns:", margin, yPosition);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const presentingIssuesLines = pdf.splitTextToSize(formData.presentingIssues || "None", contentWidth);
      pdf.text(presentingIssuesLines, margin, yPosition + 4);
      yPosition += presentingIssuesLines.length * 5 + 6;
  
      checkNewPage(8);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      pdf.text("Actions Taken:", margin, yPosition);
      
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const actionsTakenLines = pdf.splitTextToSize(formData.actionsTaken || "None", contentWidth);
      pdf.text(actionsTakenLines, margin, yPosition + 4);
      yPosition += actionsTakenLines.length * 5 + 6;
  
      if (formData.otherInformation) {
        checkNewPage(8);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        pdf.text("Other Information:", margin, yPosition);
        
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9);
        const otherLines = pdf.splitTextToSize(formData.otherInformation, contentWidth);
        pdf.text(otherLines, margin, yPosition + 4);
        yPosition += otherLines.length * 5 + 6;
      }
      yPosition += 3;
  
      // COUNSELOR INFORMATION SECTION
      addSectionHeading("COUNSELOR INFORMATION");
      addTwoColumnFields("Counselor Name", formData.counselorName, "Position", formData.counselorPosition);
      addTwoColumnFields("Office/Institution", formData.counselorOffice, "Contact", formData.counselorContact);
      yPosition += 5;
  
      // ACTING HEAD INFORMATION SECTION
      addSectionHeading("ACTING HEAD INFORMATION");
      addTwoColumnFields("Name", formData.actingHeadName, "Contact", formData.actingHeadContact);
      yPosition += 10;
  
      // Footer
      checkNewPage(10);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 
               pageWidth / 2, pageHeight - 8, { align: "center" });
  
      // Save PDF
      pdf.save(`Client_Referral_Form_${formData.clientName}.pdf`);
  
      toast({
        title: "PDF Saved Successfully",
        description: `Referral form for ${formData.clientName} has been saved.`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error Saving PDF",
        description: `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
        variant: "destructive",
      });
    }
  };  

  const handlePrint = () => {
    if (!formData.clientName || !formData.counselorName) {
      toast({
        title: "Missing Information",
        description: "Please fill in client name and counselor name.",
        variant: "destructive",
      });
      return;
    }

    const element = formRef.current;
    if (!element) return;

    const printContent = element.innerHTML;

    const printWindow = window.open("", "ClientReferralForm", "height=800,width=900");
    if (printWindow) {
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Client Referral Form - ${formData.clientName}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .space-y-2 { margin-bottom: 0.5rem; }
                        .space-y-4 { margin-bottom: 1rem; }
                        .space-y-6 { margin-bottom: 1.5rem; }
                        input, textarea, select { width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ccc; }
                        label { font-weight: bold; display: block; margin-top: 10px; }
                        h3 { margin-top: 20px; font-size: 16px; }
                        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                        @media print {
                            body { margin: 0; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);
        
        printWindow.document.close();

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 250);
    }

    toast({
      title: "Print Dialog Opened",
      description: "Referral form is ready to print.",
    });
  };

  return (
    <DashboardLayout role={ROLES.COUNSELOR}>
      <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
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
              Client Referral Form
            </h1>
            <p className="text-muted-foreground">
              Submit referrals for clients requiring external professional services and support
            </p>
          </div>
        </div>

        <div ref={formRef} className="space-y-6">
          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Referral Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Referral</Label>
                  <Input
                    type="date"
                    value={formData.dateOfReferral}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfReferral: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Referral addressed to:</Label>
                  <Input
                    placeholder="Name/Organization"
                    value={formData.referralAddressedTo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referralAddressedTo: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold">Nature of Referral</Label>
                <div className="space-y-2">
                  {referralOptions.map((option) => (
                    <div key={option}>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`referral-${option}`}
                          checked={formData.natureOfReferral.includes(option)}
                          onCheckedChange={() => toggleCheckbox(option)}
                        />
                        <Label
                          htmlFor={`referral-${option}`}
                          className="font-normal cursor-pointer"
                        >
                          {option}
                        </Label>
                      </div>
                      {option === "Other student services" &&
                        formData.natureOfReferral.includes(option) && (
                          <Input
                            placeholder="Specify"
                            className="mt-2 ml-6"
                            value={formData.otherReferralSpec}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                otherReferralSpec: e.target.value,
                              })
                            }
                          />
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name of Client</Label>
                  <Input
                    placeholder="Enter client name"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input
                    type="number"
                    placeholder="Age"
                    value={formData.clientAge}
                    onChange={(e) =>
                      setFormData({ ...formData, clientAge: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sex</Label>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="male"
                        name="sex"
                        value="male"
                        checked={formData.clientSex === "male"}
                        onChange={(e) =>
                          setFormData({ ...formData, clientSex: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor="male" className="font-normal cursor-pointer">
                        M
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="female"
                        name="sex"
                        value="female"
                        checked={formData.clientSex === "female"}
                        onChange={(e) =>
                          setFormData({ ...formData, clientSex: e.target.value })
                        }
                        className="w-4 h-4"
                      />
                      <Label htmlFor="female" className="font-normal cursor-pointer">
                        F
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Presenting Issues and Concern(s)</Label>
                <Textarea
                  placeholder="Describe the presenting issues..."
                  className="min-h-[100px]"
                  value={formData.presentingIssues}
                  onChange={(e) =>
                    setFormData({ ...formData, presentingIssues: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Action/s Taken, if any</Label>
                <Textarea
                  placeholder="Describe actions already taken..."
                  className="min-h-[100px]"
                  value={formData.actionsTaken}
                  onChange={(e) =>
                    setFormData({ ...formData, actionsTaken: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Other information relevant to the case (optional)</Label>
                <Textarea
                  placeholder="Any additional information..."
                  className="min-h-[100px]"
                  value={formData.otherInformation}
                  onChange={(e) =>
                    setFormData({ ...formData, otherInformation: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Counselor Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name of Counselor making the referral</Label>
                  <Input
                    placeholder="Full name"
                    value={formData.counselorName}
                    onChange={(e) =>
                      setFormData({ ...formData, counselorName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Name of Office/Institution</Label>
                  <Input
                    placeholder="Office/Institution"
                    value={formData.counselorOffice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        counselorOffice: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    placeholder="Position/Title"
                    value={formData.counselorPosition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        counselorPosition: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number & Address</Label>
                  <Input
                    placeholder="Contact details"
                    value={formData.counselorContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        counselorContact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none">
            <CardHeader className="bg-muted/10 border-b border-border/40">
              <CardTitle>Acting Head Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Acting Head, Office of Guidance & Counseling</Label>
                  <Input
                    placeholder="Name"
                    value={formData.actingHeadName}
                    onChange={(e) =>
                      setFormData({ ...formData, actingHeadName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number and Address</Label>
                  <Input
                    placeholder="Contact details"
                    value={formData.actingHeadContact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actingHeadContact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pb-10 sticky bottom-0 bg-background pt-4">
          <Button variant="outline" onClick={() => setLocation("/counselor")}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="shadow-lg"
            onClick={handlePrint}
          >
            <Printer className="w-4 h-4 mr-2" />
            Print Form
          </Button>
          <Button
            className="shadow-lg shadow-primary/20"
            onClick={handleSavePDF}
          >
            <Download className="w-4 h-4 mr-2" />
            Save as PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
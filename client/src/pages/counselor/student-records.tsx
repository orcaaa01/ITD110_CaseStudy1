import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, RefreshCw, MoreVertical, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface StudentRecord {
  id: string;
  studentName: string;
  studentId: string;
  college: string;
  yearLevel: string;
  notes?: string;
}

const COLLEGE_MAPPING: { [key: string]: string } = {
  "CCS": "College of Computer Studies",
  "CSM": "College of Science and Mathematics",
  "COE": "College of Engineering",
  "CASS": "College of Arts and Social Sciences",
  "CED-IDS": "College of Education & Instructional Design Services",
  "CHS": "College of Health Sciences",
  "CEBA": "College of Economics, Business and Accountancy",
};

export default function CounselorDatabase() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isReferralDialogOpen, setIsReferralDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  const [studentRecords, setStudentRecords] = useState<StudentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralFormData, setReferralFormData] = useState({
    studentName: "",
    idNumber: "",
    courseYear: "",
    referredBy: "",
    relationship: "",
    sex: "",
    contactNumber: "",
    academic: [] as string[],
    academicOtherSpec: "",
    personalSocial: [] as string[],
    personalSocialOtherSpec: "",
    behavior: [] as string[],
    career: [] as string[],
    additionalConcerns: "",
    discussedWithStudent: "no",
  });
  
  // Load student records from API
  useEffect(() => {
    fetchStudentRecords();
  }, []);

  const fetchStudentRecords = async () => {
    try {
      const response = await fetch("/api/student-records");
      if (!response.ok) throw new Error("Failed to fetch records");
      const data = await response.json();
      setStudentRecords(data);
    } catch (error) {
      console.error("Error fetching student records:", error);
      toast({
        title: "Error",
        description: "Failed to load student records",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const academicOptions = [
    "Having difficulty in subject/s",
    "Declining quality of work",
    "Inconsistent effort",
    "Dropped out of subjects",
    "Absenteeism",
    "Struggling for achievement",
    "Cheating",
    "Difficulty completing work",
    "Others, please specify",
  ];

  const personalSocialOptions = [
    "Depression / depressive thoughts",
    "Poor hygiene/self-care",
    "Sleeping in class",
    "Consistently tired/sleepy",
    "Express physical complaints",
    "Family problems",
    "Perfectionism",
    "Appears apathetic",
    "Appears sad/depressed mood",
    "Lacks confidence",
    "Death of loved one",
    "Pregnancy",
    "Harassment Issues",
    "Others, please specify",
  ];

  const behaviorOptions = [
    "Frequently off-task",
    "Very active or impulsive",
    "Difficulty concentrating",
    "Disturbs others",
    "Defiant of rules",
    "Substance abuse",
  ];

  const careerOptions = [
    "Barred student",
    "Shifting / plans to shift to another course",
    "Undecided about degree/course/career to pursue",
  ];

  const filteredRecords = studentRecords.filter((record) =>
    record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.studentId.includes(searchQuery)
  );

  const handleSyncDatabase = () => {
    fetchStudentRecords();
    toast({
      title: "Database Synced",
      description: "Student records have been synchronized successfully.",
    });
  };

  const handleExportReports = () => {
    toast({
      title: "Export Started",
      description: "Reports are being generated and will download shortly.",
    });
    console.log("Exporting reports...");
  };

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Monthly service report has been generated successfully.",
    });
  };

  const handleReferStudent = (studentId: string, studentName: string) => {
    setSelectedStudent({ id: studentId, name: studentName });
    setReferralFormData({
      studentName: studentName,
      idNumber: studentId,
      courseYear: "",
      referredBy: "",
      relationship: "",
      sex: "",
      contactNumber: "",
      academic: [],
      academicOtherSpec: "",
      personalSocial: [],
      personalSocialOtherSpec: "",
      behavior: [],
      career: [],
      additionalConcerns: "",
      discussedWithStudent: "no",
    });
    setIsReferralDialogOpen(true);
  };

  const handleEditRecord = (id: string) => {
    toast({
      title: "Edit Record",
      description: `Opening edit dialog for student ID: ${id}`,
    });
  };

  const handleViewHistory = (id: string) => {
    toast({
      title: "View History",
      description: `Viewing history for student ID: ${id}`,
    });
  };

  const handleArchive = (id: string) => {
    setStudentRecords(studentRecords.filter((record) => record.id !== id));
    toast({
      title: "Record Archived",
      description: `Student record ${id} has been archived.`,
    });
  };

  const toggleCheckbox = (category: string, value: string) => {
    setReferralFormData((prev) => {
      const key = category as keyof typeof referralFormData;
      const currentArray = Array.isArray(prev[key]) ? (prev[key] as string[]) : [];
      return {
        ...prev,
        [category]: currentArray.includes(value)
          ? currentArray.filter((item) => item !== value)
          : [...currentArray, value],
      };
    });
  };

  const handleSubmitReferral = () => {
    if (!referralFormData.studentName || !referralFormData.idNumber) {
      toast({
        title: "Missing Information",
        description: "Please ensure student name and ID are filled in.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Referral Submitted Successfully",
      description: `${referralFormData.studentName} has been referred for counseling services.`,
    });

    console.log("Referral Form Data:", referralFormData);
    setIsReferralDialogOpen(false);
  };

  return (
    <DashboardLayout role={ROLES.COUNSELOR}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Student Records Database</h1>
            <p className="text-muted-foreground">Manage and view all student records in the system.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="shadow-sm" onClick={handleSyncDatabase}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Database
            </Button>
            <Button className="shadow-md shadow-primary/20" onClick={handleExportReports}>
              <Download className="w-4 h-4 mr-2" />
              Export Reports
            </Button>
          </div>
        </div>

        {/* Database Management Section */}
        <Card className="shadow-soft border-none overflow-hidden">
          <CardHeader className="border-b border-border/40 bg-muted/10 px-6 py-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg">Student Records Database</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search student records..."
                    className="pl-9 h-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow>
                  <TableHead className="w-[150px]">ID Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>College</TableHead>
                  <TableHead>Year Level</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading student records...
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No student records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="font-mono font-medium text-primary">{record.studentId}</TableCell>
                      <TableCell className="font-medium text-foreground">{record.studentName}</TableCell>
                      <TableCell>{COLLEGE_MAPPING[record.college] || record.college}</TableCell>
                      <TableCell>{record.yearLevel}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.notes || "none"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleReferStudent(record.studentId, record.studentName)}>
                            Refer this Student
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRecord(record.id)}>
                            Edit Record
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewHistory(record.id)}>
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleArchive(record.id)}
                          >
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
            <div className="p-4 border-t border-border/40 flex justify-center">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Load More
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-soft border-none group hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">
                Service Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Compile feedback surveys, generate service utilization reports, and analyze monthly trends.
              </p>
              <Button variant="secondary" className="w-full" onClick={handleGenerateReport}>
                Generate Monthly Report
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none group hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle className="group-hover:text-primary transition-colors">
                System Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Manage system configuration, backup database, and configure user access roles.
              </p>
              <Button variant="outline" className="w-full">
                System Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Student Referral Dialog Modal */}
      <Dialog open={isReferralDialogOpen} onOpenChange={setIsReferralDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Referral Form</DialogTitle>
            <DialogDescription>
              Refer {selectedStudent?.name} for counseling and support services
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Student Information */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Student Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name of Student</Label>
                  <Input
                    placeholder="Student name"
                    value={referralFormData.studentName}
                    onChange={(e) =>
                      setReferralFormData({ ...referralFormData, studentName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>ID Number</Label>
                  <Input
                    placeholder="ID number"
                    value={referralFormData.idNumber}
                    onChange={(e) =>
                      setReferralFormData({ ...referralFormData, idNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Course & Year Level</Label>
                  <Input
                    placeholder="e.g., BS Computer Science 3rd Year"
                    value={referralFormData.courseYear}
                    onChange={(e) =>
                      setReferralFormData({ ...referralFormData, courseYear: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    placeholder="09XXXXXXXXX"
                    value={referralFormData.contactNumber}
                    onChange={(e) =>
                      setReferralFormData({ ...referralFormData, contactNumber: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Concerns */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Concerns</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold mb-2 block">Academic / Educational</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {academicOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`academic-${option}`}
                          checked={(referralFormData.academic as string[]).includes(option)}
                          onCheckedChange={() => toggleCheckbox("academic", option)}
                        />
                        <Label htmlFor={`academic-${option}`} className="font-normal cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold mb-2 block">Personal / Social</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {personalSocialOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`personal-${option}`}
                          checked={(referralFormData.personalSocial as string[]).includes(option)}
                          onCheckedChange={() => toggleCheckbox("personalSocial", option)}
                        />
                        <Label htmlFor={`personal-${option}`} className="font-normal cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold mb-2 block">Behavioral</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {behaviorOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`behavior-${option}`}
                          checked={(referralFormData.behavior as string[]).includes(option)}
                          onCheckedChange={() => toggleCheckbox("behavior", option)}
                        />
                        <Label htmlFor={`behavior-${option}`} className="font-normal cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold mb-2 block">Career / Vocational</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {careerOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`career-${option}`}
                          checked={(referralFormData.career as string[]).includes(option)}
                          onCheckedChange={() => toggleCheckbox("career", option)}
                        />
                        <Label htmlFor={`career-${option}`} className="font-normal cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Concerns */}
            <div className="space-y-2">
              <Label>Additional Concerns</Label>
              <Textarea
                placeholder="Describe any additional concerns..."
                className="min-h-[80px]"
                value={referralFormData.additionalConcerns}
                onChange={(e) =>
                  setReferralFormData({ ...referralFormData, additionalConcerns: e.target.value })
                }
              />
            </div>

            {/* Discussion Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="discussed"
                checked={referralFormData.discussedWithStudent === "yes"}
                onCheckedChange={(checked) =>
                  setReferralFormData({
                    ...referralFormData,
                    discussedWithStudent: checked ? "yes" : "no",
                  })
                }
              />
              <Label htmlFor="discussed" className="font-normal cursor-pointer">
                Have you discussed these concerns with the student?
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsReferralDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="shadow-lg shadow-primary/20" onClick={handleSubmitReferral}>
                Submit Referral
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
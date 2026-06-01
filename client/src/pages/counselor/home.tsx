import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, User, FileText, MessageCircle, CalendarDays, MoreHorizontal, Users, BookOpen, Download } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useAppointments } from "@/lib/context/AppointmentsContext";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { isCounselorLoggedIn } from "@/lib/auth";
import WellnessWidget from "@/components/wellness-widget";

interface Appointment {
  id: string;
  studentName: string;
  serviceType: "counseling" | "referral" | "testing" | "guidance";
  preferredMode: "f2f" | "online";
  date: string;
  time: string;
  reason?: string;
  status: "pending" | "approved" | "denied" | "completed" | "cancelled";
}

export default function CounselorHome() {
  const { appointments: contextAppointments, updateAppointmentStatus, removeAppointment } = useAppointments();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [totalStudents, setTotalStudents] = useState(0);
  const [studentsByCollege, setStudentsByCollege] = useState<Array<{ college: string; count: number }>>([]);
  const [studentsByYear, setStudentsByYear] = useState<Array<{ yearLevel: string; count: number }>>([]);

  // Load appointments and analytics from API on mount
  useEffect(() => {
    if (!isCounselorLoggedIn()) {
      setLocation("/counselor/login");
      return;
    }
    fetchAppointments();
    fetchAnalytics();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
      // Fall back to context appointments if API fails
      setAppointments(contextAppointments as any);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const [totalRes, collegeRes, yearRes] = await Promise.all([
        fetch("/api/analytics/total-students"),
        fetch("/api/analytics/students-by-college"),
        fetch("/api/analytics/students-by-year"),
      ]);

      if (totalRes.ok) {
        const totalData = await totalRes.json();
        setTotalStudents(totalData.total);
      }

      if (collegeRes.ok) {
        const collegeData = await collegeRes.json();
        setStudentsByCollege(collegeData);
      }

      if (yearRes.ok) {
        const yearData = await yearRes.json();
        setStudentsByYear(yearData);
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
    }
  };

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending");
  const totalAppointments = appointments.length;
  const pendingCount = pendingAppointments.length;

  const handleApprove = async (id: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      });

      if (!response.ok) throw new Error("Failed to approve appointment");

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: "approved" } : apt
      ));

      // Update context
      updateAppointmentStatus(id, "approved");

      toast({
        title: "Appointment Approved",
        description: "The appointment has been confirmed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve appointment",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "denied" }),
      });

      if (!response.ok) throw new Error("Failed to reject appointment");

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: "denied" } : apt
      ));

      // Update context
      updateAppointmentStatus(id, "rejected");
      removeAppointment(id);

      toast({
        title: "Appointment Denied",
        description: "The appointment request has been denied.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject appointment",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };


  const handleCreateReport = () => {
    if (!reportTitle.trim() || !reportContent.trim()) {
      alert("Please fill in all report fields");
      return;
    }
    // Here you can save the report or send it to a backend
    console.log("Report created:", { title: reportTitle, content: reportContent });
    setReportTitle("");
    setReportContent("");
    alert("Report created successfully!");
  };

  const handleBackup = async () => {
    try {
      const response = await fetch("/api/backup");
      if (!response.ok) throw new Error("Failed to create backup");
      
      const backupData = await response.json();
      
      // Create a blob from the JSON data
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
      link.download = `guidance-portal-backup-${timestamp}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup Complete",
        description: "Your data has been backed up successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Backup Failed",
        description: error.message || "Failed to create backup",
        variant: "destructive",
      });
    }
  };


  const navigateToPage = (path: string) => {
    setLocation(path);
  };


  return (
    <DashboardLayout role={ROLES.COUNSELOR}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-display text-primary">Counselor Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back. You have <span className="font-semibold text-foreground">{pendingCount} pending requests</span> today.
            </p>
          </div>
          <div className="flex gap-3">
            {/* Backup Button */}
            <Button variant="outline" onClick={handleBackup} className="shadow-sm">
              <Download className="w-4 h-4 mr-2" />
              Backup
            </Button>

            {/* View Calendar Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="shadow-sm">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  View Calendar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Calendar</DialogTitle>
                  <DialogDescription>View and manage your schedule</DialogDescription>
                </DialogHeader>
                <div className="flex justify-center p-8 bg-muted/30 rounded-lg">
                  <Calendar
                    mode="single"
                    selected={calendarDate}
                    onSelect={setCalendarDate}
                    className="rounded-md [&_table]:w-full [&_th]:py-3 [&_td]:py-3 [&_td]:px-2"
                  />
                </div>
              </DialogContent>
            </Dialog>


            {/* Create Report Modal */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="shadow-md shadow-primary/20">
                  <FileText className="w-4 h-4 mr-2" />
                  Create Report
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Report</DialogTitle>
                  <DialogDescription>Write a new report for a student case</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Title</Label>
                    <Input
                      placeholder="Enter report title"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Report Content</Label>
                    <Textarea
                      placeholder="Write your report here..."
                      className="min-h-[200px]"
                      value={reportContent}
                      onChange={(e) => setReportContent(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateReport} className="w-full">
                    Save Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>


        {/* Wellness Widget */}
        <section>
          <WellnessWidget />
        </section>


        {/* Stats Row */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: "Total Appointments", value: totalAppointments.toString(), change: "From student bookings", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending Requests", value: pendingCount.toString(), change: "Requires attention", icon: MessageCircle, color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Active Cases", value: "28", change: "Currently monitoring", icon: User, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Reports Due", value: "3", change: "Due this week", icon: FileText, color: "text-red-600", bg: "bg-red-50" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-soft border-none hover:-translate-y-1 transition-transform duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Demographics */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-soft border-none hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Users className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-foreground">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered in database</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">By College</CardTitle>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <BookOpen className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {studentsByCollege.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.college}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
                {studentsByCollege.length > 3 && (
                  <div className="text-xs text-muted-foreground pt-1">
                    +{studentsByCollege.length - 3} more colleges
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none hover:-translate-y-1 transition-transform duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">By Year Level</CardTitle>
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <BookOpen className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {studentsByYear.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.yearLevel} Year</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="grid md:grid-cols-7 gap-8">
          {/* Appointments List */}
          <Card className="md:col-span-4 shadow-soft border-none">
            <CardHeader className="border-b border-border/40 bg-muted/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pending Appointment Requests</CardTitle>
                  <CardDescription>Manage incoming booking requests from students.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigateToPage("/counselor/appointments")}>View All</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {isLoading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    Loading appointments...
                  </div>
                ) : pendingAppointments.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground">
                    No pending appointment requests.
                  </div>
                ) : (
                  pendingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-6 hover:bg-muted/20 transition-colors group">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg ring-4 ring-white group-hover:ring-primary/5 transition-all">
                          {apt.studentName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{apt.studentName}</p>
                          <Badge variant="secondary" className="mt-1 font-normal capitalize">{apt.serviceType}</Badge>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {apt.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time}</span>
                            <Badge variant="outline" className="capitalize text-xs">{apt.preferredMode === "f2f" ? "In-Person" : "Online"}</Badge>
                          </div>
                          {apt.reason && <p className="text-xs text-muted-foreground mt-2 italic">{apt.reason}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-9 w-9 text-destructive hover:bg-destructive hover:text-white rounded-full"
                          onClick={() => handleReject(apt.id)}
                          disabled={updatingId === apt.id}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-9 w-9 text-green-600 hover:bg-green-600 hover:text-white rounded-full border-green-200"
                          onClick={() => handleApprove(apt.id)}
                          disabled={updatingId === apt.id}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>


          {/* Quick Actions / Right Panel */}
          <div className="md:col-span-3 space-y-6">
            <Card className="bg-primary text-primary-foreground border-none shadow-lg shadow-primary/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="secondary" 
                  className="w-full justify-start bg-white/10 text-white hover:bg-white/20 border-0 h-12"
                  onClick={() => navigateToPage("/counselor/records")}
                >
                  <User className="mr-3 h-5 w-5" />
                  Add New Student Record
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start bg-white/10 text-white hover:bg-white/20 border-0 h-12"
                  onClick={() => navigateToPage("/counselor/assessments")}
                >
                  <FileText className="mr-3 h-5 w-5" />
                  Schedule Assessment
                </Button>
                <Button 
                  variant="secondary" 
                  className="w-full justify-start bg-white/10 text-white hover:bg-white/20 border-0 h-12"
                  onClick={() => navigateToPage("/counselor/client-referral")}
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Fill up Client Referral Form
                </Button>
              </CardContent>
            </Card>


            <Card className="shadow-soft border-none">
              <CardHeader>
                <CardTitle className="text-base">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative pl-4 border-l border-border/60 ml-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-background"></span>
                      <p className="text-sm font-medium">New policy updated for intake forms</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
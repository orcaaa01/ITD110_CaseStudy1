import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, CalendarDays, Clock, RotateCw, Search, Filter, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLocation } from "wouter";
import { useAppointments } from "@/lib/context/AppointmentsContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isCounselorLoggedIn } from "@/lib/auth";

interface Appointment {
  id: string;
  studentName: string;
  studentId?: string;
  serviceType: "counseling" | "referral" | "testing" | "guidance";
  preferredMode: "f2f" | "online";
  date: string;
  time: string;
  reason?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "approved" | "denied" | "finished";
}

export default function AppointmentsPage() {
  const [, setLocation] = useLocation();
  const { appointments: contextAppointments, updateAppointmentStatus, removeAppointment } = useAppointments();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [approvedSearchQuery, setApprovedSearchQuery] = useState("");
  const [approvedServiceFilter, setApprovedServiceFilter] = useState<string>("all");
  const [approvedModeFilter, setApprovedModeFilter] = useState<string>("all");
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [finishedSearchQuery, setFinishedSearchQuery] = useState("");

  // Load appointments from API on mount
  useEffect(() => {
    if (!isCounselorLoggedIn()) {
      setLocation("/counselor/login");
      return;
    }
    fetchAppointments();
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
      
      const updatedAppointment = await response.json();
      
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
    setConfirmRejectId(null);
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to reject appointment");

      // Remove from local state
      setAppointments(appointments.filter(apt => apt.id !== id));

      // Update context - remove appointment
      removeAppointment(id);

      toast({
        title: "Appointment Rejected",
        description: "The appointment request has been removed.",
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

  const handleMarkFinished = async (id: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "finished" }),
      });

      if (!response.ok) throw new Error("Failed to mark appointment as finished");

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: "finished" } : apt
      ));

      toast({
        title: "Appointment Finished",
        description: "The appointment has been marked as finished.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark appointment as finished",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkCancelled = async (id: string) => {
    setUpdatingId(id);
    setConfirmCancelId(null);
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      });

      if (!response.ok) throw new Error("Failed to cancel appointment");

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.id === id ? { ...apt, status: "cancelled" } : apt
      ));

      toast({
        title: "Appointment Cancelled",
        description: "The appointment has been marked as cancelled.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingAppointments = appointments.filter((apt) => apt.status === "pending");
  const approvedAppointments = appointments.filter((apt) => apt.status === "approved");
  const finishedAppointments = appointments.filter((apt) => apt.status === "finished" || apt.status === "cancelled");

  // Filter approved appointments based on search and filters
  const filteredApprovedAppointments = approvedAppointments.filter((apt) => {
    const matchesSearch = apt.studentName
      .toLowerCase()
      .includes(approvedSearchQuery.toLowerCase());
    const matchesService =
      approvedServiceFilter === "all" || apt.serviceType === approvedServiceFilter;
    const matchesMode =
      approvedModeFilter === "all" || apt.preferredMode === approvedModeFilter;

    return matchesSearch && matchesService && matchesMode;
  });

  // Filter finished appointments based on search
  const filteredFinishedAppointments = finishedAppointments.filter((apt) =>
    apt.studentName.toLowerCase().includes(finishedSearchQuery.toLowerCase())
  );

  return (
    <DashboardLayout role={ROLES.COUNSELOR}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
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
                All Appointments
              </h1>
              <p className="text-muted-foreground">
                View and manage all student appointment requests.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAppointments}
            disabled={isLoading}
            className="gap-2"
          >
            <RotateCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="shadow-soft border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Appointments</CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display">{appointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">From all bookings</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-orange-600">{pendingAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-green-600">{approvedAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Confirmed appointments</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-display text-purple-600">{finishedAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Finished or cancelled</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appointments */}
        <Card className="shadow-soft border-none">
          <CardHeader className="border-b border-border/40 bg-muted/10">
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Review and approve/reject student appointment requests.</CardDescription>
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
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                        {apt.studentName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="\space-y-1\">
                          <p className="\font-semibold text-foreground\">{apt.studentName}</p>
                          {apt.studentId && (
                            <p className="\text-sm text-muted-foreground font-mono\">{apt.studentId}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="\mt-2 font-normal capitalize\">
                          {apt.serviceType}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {apt.time}
                          </span>
                          <Badge variant="outline" className="capitalize text-xs">
                            {apt.preferredMode === "f2f" ? "In-Person" : "Online"}
                          </Badge>
                        </div>
                        {apt.reason && (
                          <p className="text-xs text-muted-foreground mt-2 italic">
                            <strong>Reason:</strong> {apt.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 text-destructive hover:bg-destructive hover:text-white rounded-full"
                        onClick={() => setConfirmRejectId(apt.id)}
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

        {/* Approved Appointments */}
        <Card className="shadow-soft border-none">
          <CardHeader className="border-b border-border/40 bg-muted/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Approved Appointments</CardTitle>
                <CardDescription>Confirmed appointments with students.</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {filteredApprovedAppointments.length} results
              </div>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name..."
                  className="pl-9 h-9"
                  value={approvedSearchQuery}
                  onChange={(e) => setApprovedSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={approvedServiceFilter} onValueChange={setApprovedServiceFilter}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Service Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="counseling">Counseling</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="testing">Testing</SelectItem>
                    <SelectItem value="guidance">Guidance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={approvedModeFilter} onValueChange={setApprovedModeFilter}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="f2f">In-Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>

                {(approvedSearchQuery || approvedServiceFilter !== "all" || approvedModeFilter !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setApprovedSearchQuery("");
                      setApprovedServiceFilter("all");
                      setApprovedModeFilter("all");
                    }}
                    className="text-muted-foreground"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {approvedAppointments.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No approved appointments yet.
                </div>
              ) : filteredApprovedAppointments.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No appointments matching your filters.
                </div>
              ) : (
                filteredApprovedAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-6 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">
                        {apt.studentName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="\space-y-1\">
                          <p className="\font-semibold text-foreground\">{apt.studentName}</p>
                          {apt.studentId && (
                            <p className="\text-sm text-muted-foreground font-mono\">{apt.studentId}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="\mt-2 font-normal capitalize\">
                          {apt.serviceType}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {apt.time}
                          </span>
                          <Badge variant="outline" className="capitalize text-xs">
                            {apt.preferredMode === "f2f" ? "In-Person" : "Online"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 text-destructive hover:bg-destructive hover:text-white rounded-full"
                        onClick={() => setConfirmCancelId(apt.id)}
                        disabled={updatingId === apt.id}
                        title="Cancel Appointment"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-9 w-9 text-green-600 hover:bg-green-600 hover:text-white rounded-full border-green-200"
                        onClick={() => handleMarkFinished(apt.id)}
                        disabled={updatingId === apt.id}
                        title="Mark as Finished"
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

        {/* Finished/Cancelled Appointments */}
        <Card className="shadow-soft border-none">
          <CardHeader className="border-b border-border/40 bg-muted/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Finished & Cancelled Appointments</CardTitle>
                <CardDescription>Completed or cancelled appointment records.</CardDescription>
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {filteredFinishedAppointments.length} results
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name..."
                className="pl-9 h-9"
                value={finishedSearchQuery}
                onChange={(e) => setFinishedSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {finishedAppointments.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No finished or cancelled appointments yet.
                </div>
              ) : filteredFinishedAppointments.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No appointments matching your search.
                </div>
              ) : (
                filteredFinishedAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-6 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        apt.status === "finished" 
                          ? "bg-purple-100 text-purple-600" 
                          : "bg-red-100 text-red-600"
                      }`}>
                        {apt.studentName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="\space-y-1\">
                          <p className="\font-semibold text-foreground\">{apt.studentName}</p>
                          {apt.studentId && (
                            <p className="\text-sm text-muted-foreground font-mono\">{apt.studentId}</p>
                          )}
                        </div>
                        <Badge variant="secondary" className="\mt-2 font-normal capitalize\">
                          {apt.serviceType}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-3 h-3" /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {apt.time}
                          </span>
                          <Badge variant="outline" className="capitalize text-xs">
                            {apt.preferredMode === "f2f" ? "In-Person" : "Online"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={apt.status === "finished" ? "bg-purple-100 text-purple-800" : "bg-red-100 text-red-800"}>
                      {apt.status === "finished" ? "Finished" : "Cancelled"}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rejection Confirmation Dialog */}
        <AlertDialog open={confirmRejectId !== null} onOpenChange={(open) => !open && setConfirmRejectId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject Appointment?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to deny this appointment request? The student will be notified of the rejection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => confirmRejectId && handleReject(confirmRejectId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Reject
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Cancellation Confirmation Dialog */}
        <AlertDialog open={confirmCancelId !== null} onOpenChange={(open) => !open && setConfirmCancelId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this appointment? The appointment will be marked as cancelled and kept in the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>No, Keep It</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => confirmCancelId && handleMarkCancelled(confirmCancelId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Yes, Cancel It
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}

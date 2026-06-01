import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useAppointments } from "@/lib/context/AppointmentsContext";
import { useUser } from "@/lib/context/UserContext";


export default function StudentBooking() {
  const [studentName, setStudentName] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [serviceType, setServiceType] = useState<string>("");
  const [preferredMode, setPreferredMode] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { addAppointment } = useAppointments();
  const { studentName: contextStudentName } = useUser();


  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!studentName || !studentId || !serviceType || !preferredMode || !date || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: studentName,
          studentId: studentId,
          serviceType: serviceType as "counseling" | "referral" | "testing" | "guidance",
          preferredMode: preferredMode as "f2f" | "online",
          date: date.toLocaleDateString(),
          time: selectedTime,
          reason: reason || undefined,
          status: "pending",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to book appointment");
      }

      const appointment = await response.json();

      // Also add to context for local state
      addAppointment({
        studentName: studentName,
        serviceType: serviceType as "counseling" | "referral" | "testing" | "guidance",
        preferredMode: preferredMode as "f2f" | "online",
        date: date.toLocaleDateString(),
        time: selectedTime,
        reason: reason || undefined,
      });

      toast({
        title: "Appointment Request Sent",
        description: "A counselor will review your request shortly.",
      });
      
      setLocation("/student");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleCancel = () => {
    setLocation("/student");
  };


  return (
    <DashboardLayout role={ROLES.STUDENT}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Schedule a session with one of our guidance counselors.
          </p>
        </div>


        <form onSubmit={handleBooking}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column - Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ID Number</Label>
                    <Input
                      type="text"
                      placeholder="Enter your student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Service Type</Label>
                    <Select value={serviceType} onValueChange={setServiceType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="counseling">Individual Counseling</SelectItem>
                        <SelectItem value="referral">Referral Service</SelectItem>
                        <SelectItem value="testing">Psychological Testing</SelectItem>
                        <SelectItem value="guidance">Group Guidance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="space-y-2">
                    <Label>Preferred Mode</Label>
                    <Select value={preferredMode} onValueChange={setPreferredMode} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="f2f">Face to Face (Guidance Office)</SelectItem>
                        <SelectItem value="online">Online (Google Meet)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="space-y-2">
                    <Label>Concern / Reason (Optional)</Label>
                    <Textarea 
                      placeholder="Briefly describe what you'd like to discuss..." 
                      className="min-h-[100px]"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Right Column - Date & Time */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-center p-6 bg-muted/30 rounded-lg">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md [&_table]:w-full [&_th]:py-3 [&_td]:py-3 [&_td]:px-2"
                      disabled={(date) => date < new Date()}
                    />
                  </div>


                  <div className="space-y-3">
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"].map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          className="text-xs py-2 h-auto hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


          <div className="flex justify-end mt-6 gap-4">
            <Button variant="ghost" type="button" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
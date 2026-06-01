import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ROLES, MOCK_SERVICES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, MessageSquare, Clock, Phone } from "lucide-react";
import { Link } from "wouter";
import { useUser } from "@/lib/context/UserContext";
import WellnessWidget from "@/components/wellness-widget";


export default function StudentHome() {
  const { studentName } = useUser();


  return (
    <DashboardLayout role={ROLES.STUDENT}>
      <div className="space-y-10 max-w-7xl mx-auto animate-in fade-in duration-500">
        {/* Welcome Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary to-red-900 text-white shadow-xl">
          <div className="absolute inset-0 bg-black/10 pattern-dots pattern-white/10 pattern-size-4 pattern-opacity-20"></div>
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-display">Welcome back, {studentName || "Student"}.</h1>
              <p className="text-white/90 text-lg leading-relaxed">
                Your mental wellness journey matters to us. Access counseling services, career guidance, and resources all in one place.
              </p>
              <div className="flex gap-3 pt-2">
                <Link href="/student/book">
                  <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl transition-all">
                    Book Appointment
                  </Button>
                </Link>
                <Link href="/student/assessments">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white">
                    View Results
                  </Button>
                </Link>
                <Link href="/student/feedback">
                   <Button size="lg" variant="outline" className="bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white">
                    Give Feedback
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block opacity-80">
               {/* Abstract illustration placeholder or just clean space */}
               <Calendar className="w-32 h-32 text-white/20" />
            </div>
          </div>
        </section>


        {/* Wellness Widget */}
        <section>
          <WellnessWidget />
        </section>


        {/* Service Selection */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-primary">Our Services</h2>
            <Link href="/student/book">
              <Button variant="link" className="text-primary">View All services &rarr;</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {MOCK_SERVICES.map((service) => (
              <Card key={service.id} className="group hover:shadow-soft transition-all duration-300 border-transparent hover:border-primary/10 bg-white">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={service.title === "Referral Service" ? "/student/referral" : "/student/book"} className="w-full">
                     <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                      Book Now <ArrowRight className="w-4 h-4 ml-2 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>


        {/* Recent Activity & Quick Actions */}
        <section className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 shadow-soft border-none">
            <CardHeader className="border-b border-border/50 bg-muted/20 rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-primary" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-l-4 border-l-primary rounded-r-lg bg-white hover:bg-muted/20 transition-colors shadow-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">Career Guidance Session</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Nov 24, 2025 at 2:00 PM 
                      <span className="w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                      Face to Face
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-primary/20 text-primary hover:bg-primary/5">
                    Details
                  </Button>
                </div>
                {/* Empty State Placeholder */}
                {/* <div className="text-center py-12 text-muted-foreground text-sm bg-muted/10 rounded-lg border border-dashed">
                  No other upcoming appointments.
                </div> */}
              </div>
            </CardContent>
          </Card>


          <Card className="bg-linear-to-br from-red-50 to-white border-red-100 shadow-soft">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Need Immediate Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-red-600/80 leading-relaxed">
                If you are in crisis or need urgent assistance, please do not hesitate to contact our emergency hotline.
              </p>
              <div className="space-y-3">
                <Button className="w-full shadow-md bg-red-600 hover:bg-red-700 text-white" size="lg">
                  Call Emergency Hotline
                </Button>
                  <Button variant="outline" className="w-full border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                    Report an Incident
                  </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
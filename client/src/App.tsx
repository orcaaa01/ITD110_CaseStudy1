import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppointmentsProvider } from "@/lib/context/AppointmentsContext";
import { UserProvider } from "@/lib/context/UserContext";
import NotFound from "@/pages/not-found";


import AuthPage from "@/pages/auth";
import StudentHome from "@/pages/student/home";
import StudentBooking from "@/pages/student/booking";
import StudentAssessments from "@/pages/student/assessments";
import CounselorLogin from "@/pages/counselor/login";
import CounselorHome from "@/pages/counselor/home";
import ClientRecords from "@/pages/counselor/records";
import Assessments from "@/pages/counselor/assessments";
import ClientReferral from "@/pages/counselor/client-referral";
import AppointmentsPage from "@/pages/counselor/appointments";
import ReferralService from "@/pages/student/referral";
import StudentReferral from "@/pages/faculty/student-referral";
import FacultyHome from "@/pages/faculty/home";
import StudentRecords from "@/pages/counselor/student-records";
import FeedbackPage from "@/pages/student/feedback";


function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      
      {/* Student Routes */}
      <Route path="/student" component={StudentHome} />
      <Route path="/student/book" component={StudentBooking} />
      <Route path="/student/assessments" component={StudentAssessments} />
      <Route path="/student/feedback" component={FeedbackPage} />
      <Route path="/student/referral" component={ReferralService} />



      {/* Counselor Routes */}
      <Route path="/counselor/login" component={CounselorLogin} />
      <Route path="/counselor" component={CounselorHome} />
      <Route path="/counselor/appointments" component={AppointmentsPage} />
      <Route path="/counselor/records" component={ClientRecords} />
      <Route path="/counselor/assessments" component={Assessments} />
      <Route path="/counselor/client-referral" component={ClientReferral} />
      <Route path="/counselor/external-coordination" component={ClientReferral} />
      <Route path="/counselor/student-records" component={StudentRecords} />


      {/* Faculty Routes */}
      <Route path="/faculty" component={FacultyHome} />
      <Route path="/faculty/student-referral" component={StudentReferral} />
      <Route path="/faculty/client-referral" component={StudentReferral} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppointmentsProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppointmentsProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}



export default App;
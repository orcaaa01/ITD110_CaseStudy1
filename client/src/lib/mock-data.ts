import { User, Calendar, FileText, Users, Settings, BarChart, LogOut, Shield, Home, MessageSquare, Clipboard } from "lucide-react";

export const ROLES = {
  STUDENT: "student",
  COUNSELOR: "counselor",
  FACULTY: "faculty_staff",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const NAV_ITEMS: Record<Role, Array<{ href: string; label: string; icon: any }>> = {
  student: [
    { href: "/student", label: "Dashboard", icon: Home },
    { href: "/student/book", label: "Book Appointment", icon: Calendar },
    { href: "/student/assessments", label: "Assessment Results", icon: BarChart },
    { href: "/student/referral", label: "Referral Service", icon: Clipboard },
    { href: "/student/feedback", label: "Feedback", icon: MessageSquare },
  ],
  counselor: [
    { href: "/counselor", label: "Dashboard", icon: Home },
    { href: "/counselor/appointments", label: "Appointments", icon: Calendar },
    { href: "/counselor/records", label: "Student Records", icon: FileText },
    { href: "/counselor/assessments", label: "Assessments", icon: BarChart },
    { href: "/counselor/student-records", label: "Student Records Database", icon: Settings },
    { href: "/counselor/client-referral", label: "Client Referral", icon: Clipboard },
  ],
  faculty_staff: [
    { href: "/faculty", label: "Dashboard", icon: Home },
    { href: "/faculty/client-referral", label: "Student Referral", icon: Clipboard },
  ],
};

export const MOCK_SERVICES = [
  { id: 1, title: "Individual Counseling", description: "One-on-one session with a counselor for personal concerns.", icon: User },
  { id: 2, title: "Referral Service", description: "Refer yourself or others for specialized counseling and support services.", icon: Clipboard },
  { id: 3, title: "Psychological Testing", description: "Standardized tests for personality, aptitude, and mental health.", icon: FileText },
  { id: 4, title: "Group Guidance", description: "Facilitated group sessions for shared experiences and guidance.", icon: Users },
];

export const MOCK_APPOINTMENTS = [
  { id: 1, student: "Juan Dela Cruz", date: "2023-11-20", time: "10:00 AM", type: "Individual Counseling", status: "Pending" },
  { id: 2, student: "Maria Clara", date: "2023-11-21", time: "02:00 PM", type: "Career Guidance", status: "Confirmed" },
  { id: 3, student: "Jose Rizal", date: "2023-11-22", time: "09:00 AM", type: "Psychological Testing", status: "Completed" },
];

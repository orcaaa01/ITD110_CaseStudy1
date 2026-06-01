import { z } from "zod";

// User Schema
export const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: string };

// Student Record Schema
export const insertStudentRecordSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  college: z.enum(["CCS", "CSM", "COE", "CASS", "CED-IDS", "CHS", "CEBA"]),
  yearLevel: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year"]),
  notes: z.string().optional(),
});

export type InsertStudentRecord = z.infer<typeof insertStudentRecordSchema>;
export type StudentRecord = InsertStudentRecord & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Appointment Schema
export const insertAppointmentSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  studentId: z.string().optional(),
  serviceType: z.enum(["counseling", "referral", "testing", "guidance"]),
  preferredMode: z.enum(["f2f", "online"]),
  date: z.string(),
  time: z.string(),
  reason: z.string().optional(),
  status: z.enum(["pending", "approved", "denied", "completed", "cancelled", "finished"]).default("pending"),
});

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = InsertAppointment & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Assessment Schema
export const insertAssessmentSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  studentId: z.string().min(1, "Student ID is required"),
  assessmentType: z.string().min(1, "Assessment type is required"),
  assessmentDate: z.string().min(1, "Assessment date is required"),
  results: z.string().optional(),
  notes: z.string().optional(),
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = InsertAssessment & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

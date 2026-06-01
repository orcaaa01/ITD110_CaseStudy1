import mongoose, { Schema, Document } from "mongoose";

// User Model
export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

// Student Record Model
export interface IStudentRecord extends Document {
  studentName: string;
  studentId: string;
  college: "CCS" | "CSM" | "COE" | "CASS" | "CED-IDS" | "CHS" | "CEBA";
  yearLevel: "1st Year" | "2nd Year" | "3rd Year" | "4th Year";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const studentRecordSchema = new Schema<IStudentRecord>(
  {
    studentName: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    college: {
      type: String,
      enum: ["CCS", "CSM", "COE", "CASS", "CED-IDS", "CHS", "CEBA"],
      required: true,
    },
    yearLevel: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const StudentRecord = mongoose.model<IStudentRecord>(
  "StudentRecord",
  studentRecordSchema
);

// Appointment Model
export interface IAppointment extends Document {
  studentName: string;
  studentId?: string;
  serviceType: "counseling" | "referral" | "testing" | "guidance";
  preferredMode: "f2f" | "online";
  date: string;
  time: string;
  reason?: string;
  status: "pending" | "approved" | "denied" | "completed" | "cancelled" | "finished";
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    studentName: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      default: "",
    },
    serviceType: {
      type: String,
      enum: ["counseling", "referral", "testing", "guidance"],
      required: true,
    },
    preferredMode: {
      type: String,
      enum: ["f2f", "online"],
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "denied", "completed", "cancelled", "finished"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);

// Assessment Model
export interface IAssessment extends Document {
  studentName: string;
  studentId: string;
  assessmentType: string;
  assessmentDate: string;
  results?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSchema = new Schema<IAssessment>(
  {
    studentName: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    assessmentType: {
      type: String,
      required: true,
    },
    assessmentDate: {
      type: String,
      required: true,
    },
    results: {
      type: String,
      default: "",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>(
  "Assessment",
  assessmentSchema
);

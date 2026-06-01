import { type User, type InsertUser, type StudentRecord, type InsertStudentRecord, type Appointment, type InsertAppointment, type Assessment, type InsertAssessment } from "@shared/schema";
import { randomUUID } from "crypto";
import { User as UserModel, StudentRecord as StudentRecordModel, Appointment as AppointmentModel, Assessment as AssessmentModel, IUser, IStudentRecord, IAppointment, IAssessment } from "./models";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;

  // Student Record methods
  createStudentRecord(record: InsertStudentRecord): Promise<StudentRecord>;
  getStudentRecords(): Promise<StudentRecord[]>;
  getStudentRecordById(id: string): Promise<StudentRecord | undefined>;
  updateStudentRecord(id: string, record: Partial<InsertStudentRecord>): Promise<StudentRecord | undefined>;
  deleteStudentRecord(id: string): Promise<boolean>;

  // Appointment methods
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getAppointments(): Promise<Appointment[]>;
  getAppointmentById(id: string): Promise<Appointment | undefined>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: string): Promise<boolean>;

  // Assessment methods
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessments(): Promise<Assessment[]>;
  getAssessmentById(id: string): Promise<Assessment | undefined>;
  updateAssessment(id: string, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  deleteAssessment(id: string): Promise<boolean>;

  // Analytics methods
  getTotalStudents(): Promise<number>;
  getStudentsByCollege(): Promise<Array<{ college: string; count: number }>>;
  getStudentsByYearLevel(): Promise<Array<{ yearLevel: string; count: number }>>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private studentRecords: Map<string, StudentRecord>;
  private appointments: Map<string, Appointment>;
  private assessments: Map<string, Assessment>;

  constructor() {
    this.users = new Map();
    this.studentRecords = new Map();
    this.appointments = new Map();
    this.assessments = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Student Record methods
  async createStudentRecord(record: InsertStudentRecord): Promise<StudentRecord> {
    const id = randomUUID();
    const newRecord: StudentRecord = {
      ...record,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.studentRecords.set(id, newRecord);
    return newRecord;
  }

  async getStudentRecords(): Promise<StudentRecord[]> {
    return Array.from(this.studentRecords.values());
  }

  async getStudentRecordById(id: string): Promise<StudentRecord | undefined> {
    return this.studentRecords.get(id);
  }

  async updateStudentRecord(id: string, record: Partial<InsertStudentRecord>): Promise<StudentRecord | undefined> {
    const existing = this.studentRecords.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...record, updatedAt: new Date() };
    this.studentRecords.set(id, updated);
    return updated;
  }

  async deleteStudentRecord(id: string): Promise<boolean> {
    return this.studentRecords.delete(id);
  }

  // Appointment methods
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const newAppointment: Appointment = {
      ...appointment,
      id,
      status: appointment.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const existing = this.appointments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...appointment, updatedAt: new Date() };
    this.appointments.set(id, updated);
    return updated;
  }

  async deleteAppointment(id: string): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Assessment methods
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const newAssessment: Assessment = {
      ...assessment,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.assessments.set(id, newAssessment);
    return newAssessment;
  }

  async getAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }

  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async updateAssessment(id: string, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const existing = this.assessments.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...assessment, updatedAt: new Date() };
    this.assessments.set(id, updated);
    return updated;
  }

  async deleteAssessment(id: string): Promise<boolean> {
    return this.assessments.delete(id);
  }

  // Analytics methods
  async getTotalStudents(): Promise<number> {
    return this.studentRecords.size;
  }

  async getStudentsByCollege(): Promise<Array<{ college: string; count: number }>> {
    const collegeMap = new Map<string, number>();
    this.studentRecords.forEach((record) => {
      const college = record.college || "Unknown";
      collegeMap.set(college, (collegeMap.get(college) || 0) + 1);
    });
    return Array.from(collegeMap.entries())
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getStudentsByYearLevel(): Promise<Array<{ yearLevel: string; count: number }>> {
    const yearMap = new Map<string, number>();
    this.studentRecords.forEach((record) => {
      const yearLevel = record.yearLevel || "Unknown";
      yearMap.set(yearLevel, (yearMap.get(yearLevel) || 0) + 1);
    });
    return Array.from(yearMap.entries())
      .map(([yearLevel, count]) => ({ yearLevel, count }))
      .sort((a, b) => {
        const yearOrder = { "1st": 0, "2nd": 1, "3rd": 2, "4th": 3, "Unknown": 4 };
        return (yearOrder[a.yearLevel as keyof typeof yearOrder] || 4) - 
               (yearOrder[b.yearLevel as keyof typeof yearOrder] || 4);
      });
  }
}

export class MongoStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    if (!user) return undefined;
    return this.userDocToUser(user);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    if (!user) return undefined;
    return this.userDocToUser(user);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(user => this.userDocToUser(user));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = new UserModel(insertUser);
    await user.save();
    return this.userDocToUser(user);
  }

  // Student Record methods
  async createStudentRecord(record: InsertStudentRecord): Promise<StudentRecord> {
    const newRecord = new StudentRecordModel(record);
    await newRecord.save();
    return this.recordDocToRecord(newRecord);
  }

  async getStudentRecords(): Promise<StudentRecord[]> {
    const records = await StudentRecordModel.find();
    return records.map((r) => this.recordDocToRecord(r));
  }

  async getStudentRecordById(id: string): Promise<StudentRecord | undefined> {
    const record = await StudentRecordModel.findById(id);
    if (!record) return undefined;
    return this.recordDocToRecord(record);
  }

  async updateStudentRecord(id: string, record: Partial<InsertStudentRecord>): Promise<StudentRecord | undefined> {
    const updated = await StudentRecordModel.findByIdAndUpdate(id, record, { new: true });
    if (!updated) return undefined;
    return this.recordDocToRecord(updated);
  }

  async deleteStudentRecord(id: string): Promise<boolean> {
    const result = await StudentRecordModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Appointment methods
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const newAppointment = new AppointmentModel(appointment);
    await newAppointment.save();
    return this.appointmentDocToAppointment(newAppointment);
  }

  async getAppointments(): Promise<Appointment[]> {
    const appointments = await AppointmentModel.find();
    return appointments.map((a) => this.appointmentDocToAppointment(a));
  }

  async getAppointmentById(id: string): Promise<Appointment | undefined> {
    const appointment = await AppointmentModel.findById(id);
    if (!appointment) return undefined;
    return this.appointmentDocToAppointment(appointment);
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const updated = await AppointmentModel.findByIdAndUpdate(id, appointment, { new: true });
    if (!updated) return undefined;
    return this.appointmentDocToAppointment(updated);
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await AppointmentModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Assessment methods
  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const newAssessment = new AssessmentModel(assessment);
    await newAssessment.save();
    return this.assessmentDocToAssessment(newAssessment);
  }

  async getAssessments(): Promise<Assessment[]> {
    const assessments = await AssessmentModel.find();
    return assessments.map((a) => this.assessmentDocToAssessment(a));
  }

  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    const assessment = await AssessmentModel.findById(id);
    if (!assessment) return undefined;
    return this.assessmentDocToAssessment(assessment);
  }

  async updateAssessment(id: string, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const updated = await AssessmentModel.findByIdAndUpdate(id, assessment, { new: true });
    if (!updated) return undefined;
    return this.assessmentDocToAssessment(updated);
  }

  async deleteAssessment(id: string): Promise<boolean> {
    const result = await AssessmentModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  // Analytics methods
  async getTotalStudents(): Promise<number> {
    return await StudentRecordModel.countDocuments();
  }

  async getStudentsByCollege(): Promise<Array<{ college: string; count: number }>> {
    const result = await StudentRecordModel.aggregate([
      {
        $group: {
          _id: "$college",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $project: {
          _id: 0,
          college: "$_id",
          count: 1,
        },
      },
    ]);
    return result;
  }

  async getStudentsByYearLevel(): Promise<Array<{ yearLevel: string; count: number }>> {
    const result = await StudentRecordModel.aggregate([
      {
        $group: {
          _id: "$yearLevel",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          yearLevel: "$_id",
          count: 1,
        },
      },
    ]);

    // Sort by year level order
    const yearOrder = { "1st": 0, "2nd": 1, "3rd": 2, "4th": 3 };
    return result.sort(
      (a, b) =>
        (yearOrder[a.yearLevel as keyof typeof yearOrder] || 999) -
        (yearOrder[b.yearLevel as keyof typeof yearOrder] || 999)
    );
  }

  // Helper methods to convert Mongoose documents to types
  private userDocToUser(doc: IUser): User {
    return {
      id: doc._id.toString(),
      username: doc.username,
      password: doc.password,
    };
  }

  private recordDocToRecord(doc: IStudentRecord): StudentRecord {
    return {
      id: doc._id.toString(),
      studentName: doc.studentName,
      studentId: doc.studentId,
      college: doc.college,
      yearLevel: doc.yearLevel,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private appointmentDocToAppointment(doc: IAppointment): Appointment {
    return {
      id: doc._id.toString(),
      studentName: doc.studentName,
      studentId: doc.studentId,
      serviceType: doc.serviceType,
      preferredMode: doc.preferredMode,
      date: doc.date,
      time: doc.time,
      reason: doc.reason,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  private assessmentDocToAssessment(doc: IAssessment): Assessment {
    return {
      id: doc._id.toString(),
      studentName: doc.studentName,
      studentId: doc.studentId,
      assessmentType: doc.assessmentType,
      assessmentDate: doc.assessmentDate,
      results: doc.results,
      notes: doc.notes,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}

// Use MongoDB storage by default
export const storage = new MongoStorage();

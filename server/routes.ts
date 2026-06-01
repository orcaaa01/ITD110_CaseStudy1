import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentRecordSchema, insertAppointmentSchema, insertAssessmentSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Student Records Routes
  app.post("/api/student-records", async (req, res) => {
    try {
      const data = insertStudentRecordSchema.parse(req.body);
      const record = await storage.createStudentRecord(data);
      res.status(201).json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/student-records", async (req, res) => {
    try {
      const records = await storage.getStudentRecords();
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/student-records/:id", async (req, res) => {
    try {
      const record = await storage.getStudentRecordById(req.params.id);
      if (!record) {
        res.status(404).json({ message: "Record not found" });
        return;
      }
      res.json(record);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/student-records/:id", async (req, res) => {
    try {
      const data = insertStudentRecordSchema.partial().parse(req.body);
      const record = await storage.updateStudentRecord(req.params.id, data);
      if (!record) {
        res.status(404).json({ message: "Record not found" });
        return;
      }
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/student-records/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStudentRecord(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Record not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Appointments Routes
  app.post("/api/appointments", async (req, res) => {
    try {
      const data = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(data);
      res.status(201).json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      res.json(appointments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/appointments/:id", async (req, res) => {
    try {
      const appointment = await storage.getAppointmentById(req.params.id);
      if (!appointment) {
        res.status(404).json({ message: "Appointment not found" });
        return;
      }
      res.json(appointment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/appointments/:id", async (req, res) => {
    try {
      const data = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await storage.updateAppointment(req.params.id, data);
      if (!appointment) {
        res.status(404).json({ message: "Appointment not found" });
        return;
      }
      res.json(appointment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/appointments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAppointment(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Appointment not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Assessments Routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const data = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(data);
      res.status(201).json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessment = await storage.getAssessmentById(req.params.id);
      if (!assessment) {
        res.status(404).json({ message: "Assessment not found" });
        return;
      }
      res.json(assessment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/assessments/:id", async (req, res) => {
    try {
      const data = insertAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateAssessment(req.params.id, data);
      if (!assessment) {
        res.status(404).json({ message: "Assessment not found" });
        return;
      }
      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/assessments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteAssessment(req.params.id);
      if (!deleted) {
        res.status(404).json({ message: "Assessment not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Analytics Routes
  app.get("/api/analytics/total-students", async (req, res) => {
    try {
      const total = await storage.getTotalStudents();
      res.json({ total });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analytics/students-by-college", async (req, res) => {
    try {
      const data = await storage.getStudentsByCollege();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/analytics/students-by-year", async (req, res) => {
    try {
      const data = await storage.getStudentsByYearLevel();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(data.username);
      if (existingUser) {
        res.status(409).json({ message: "Username already exists" });
        return;
      }

      // Create new user
      const user = await storage.createUser(data);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ message: "Username and password are required" });
        return;
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }

      // Simple password comparison (in production, use bcrypt)
      if (user.password !== password) {
        res.status(401).json({ message: "Invalid username or password" });
        return;
      }

      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Backup Route
  app.get("/api/backup", async (req, res) => {
    try {
      const appointments = await storage.getAppointments();
      const studentRecords = await storage.getStudentRecords();
      const assessments = await storage.getAssessments();
      const users = await storage.getAllUsers();
      
      // Exclude passwords for security
      const usersWithoutPasswords = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      const backupData = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        data: {
          appointments,
          studentRecords,
          assessments,
          users: usersWithoutPasswords
        }
      };

      res.json(backupData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

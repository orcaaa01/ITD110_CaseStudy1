import React, { createContext, useContext, useState, ReactNode } from "react";


export interface Appointment {
  id: string;
  studentName: string;
  studentId?: string;
  serviceType: "counseling" | "referral" | "testing" | "guidance";
  preferredMode: "f2f" | "online";
  date: string;
  time: string;
  reason?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}


interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "status">) => void;
  updateAppointmentStatus: (id: string, status: "approved" | "rejected") => void;
  removeAppointment: (id: string) => void;
}


const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);


export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);


  const addAppointment = (appointment: Omit<Appointment, "id" | "createdAt" | "status">) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    setAppointments([...appointments, newAppointment]);
  };


  const updateAppointmentStatus = (id: string, status: "approved" | "rejected") => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status } : apt
      )
    );
  };


  const removeAppointment = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };


  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, updateAppointmentStatus, removeAppointment }}>
      {children}
    </AppointmentsContext.Provider>
  );
}


export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error("useAppointments must be used within AppointmentsProvider");
  }
  return context;
}
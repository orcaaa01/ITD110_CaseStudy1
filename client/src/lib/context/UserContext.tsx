import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  studentName: string;
  setStudentName: (name: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [studentName, setStudentName] = useState("Student");

  return (
    <UserContext.Provider value={{ studentName, setStudentName }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}

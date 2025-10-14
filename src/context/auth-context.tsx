
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "student" | "staff" | "admin" | "technician";

export interface User {
  role: UserRole;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  studentNumber?: string;
  department?: string;
  courseCode?: string;
  campusName: string;
  lastLogin?: string;
  workCode?: string;
}

interface LoginCredentials {
  email: string;
  role: UserRole;
  workCode?: string;
}

interface AuthContextType {
  user: User | null;
  cardImage: string | null;
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  register: (newUser: Omit<User, 'lastLogin'>) => boolean;
  setCardImage: (image: string | null) => void;
  isLoading: boolean;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
    { role: 'student', firstName: 'Jane', lastName: 'Doe', initials: 'JD', email: '123456789@tut4life.ac.za', studentNumber: 'ST123456', courseCode: 'CS101', campusName: 'Main Campus', lastLogin: new Date().toISOString() },
    { role: 'staff', firstName: 'John', lastName: 'Smith', initials: 'JS', email: 'john.smith@example.com', department: 'Computer Science', campusName: 'Main Campus', lastLogin: new Date(Date.now() - 86400000).toISOString() },
    { role: 'admin', firstName: 'Admin', lastName: 'User', initials: 'AU', email: 'admin@example.com', campusName: 'Main Campus', workCode: 'ADMIN123', lastLogin: new Date().toISOString() },
    { role: 'technician', firstName: 'Tech', lastName: 'Support', initials: 'TS', email: 'tech@example.com', campusName: 'Main Campus', lastLogin: new Date(Date.now() - 172800000).toISOString() },
];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cardImage, setCardImageState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("campusIdUser");
      const storedUsers = localStorage.getItem("campusIdUsers");
      const storedCardImage = localStorage.getItem("campusIdCardImage");
      
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(mockUsers);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedCardImage) {
        setCardImageState(storedCardImage);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setUsers(mockUsers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (credentials: LoginCredentials) => {
    const foundUser = users.find(u => {
      if (u.email !== credentials.email || u.role !== credentials.role) {
        return false;
      }
      if (u.role === 'admin') {
        return u.workCode === credentials.workCode;
      }
      return true;
    });
    
    if (foundUser) {
      const userWithLogin = { ...foundUser, lastLogin: new Date().toISOString()};
      setUser(userWithLogin);
      localStorage.setItem("campusIdUser", JSON.stringify(userWithLogin));
      
      const updatedUsers = users.map(u => u.email === foundUser.email ? userWithLogin : u);
      setUsers(updatedUsers);
      localStorage.setItem("campusIdUsers", JSON.stringify(updatedUsers));

      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setCardImageState(null);
    localStorage.removeItem("campusIdUser");
    localStorage.removeItem("campusIdCardImage");
  };

  const register = (newUser: Omit<User, 'lastLogin'>) => {
    const userExists = users.some(u => u.email === newUser.email);
    if (userExists) {
      return false; // User already exists
    }
    
    let userToRegister: User = newUser;
    if (newUser.role === 'admin') {
      const { workCode } = newUser;
      userToRegister = { ...newUser, workCode };
    }


    const updatedUsers = [...users, userToRegister];
    setUsers(updatedUsers);
    localStorage.setItem("campusIdUsers", JSON.stringify(updatedUsers));
    return true;
  }

  const setCardImage = (image: string | null) => {
    setCardImageState(image);
    if (image) {
      localStorage.setItem("campusIdCardImage", image);
    } else {
      localStorage.removeItem("campusIdCardImage");
    }
  };

  return (
    <AuthContext.Provider value={{ user, cardImage, login, logout, register, setCardImage, isLoading, users }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

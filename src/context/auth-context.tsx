"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type UserRole = "student" | "staff";

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
}

interface AuthContextType {
  user: User | null;
  cardImage: string | null;
  login: (user: User) => void;
  logout: () => void;
  setCardImage: (image: string | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cardImage, setCardImageState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("campusIdUser");
      const storedCardImage = localStorage.getItem("campusIdCardImage");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedCardImage) {
        setCardImageState(storedCardImage);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("campusIdUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setCardImageState(null);
    localStorage.removeItem("campusIdUser");
    localStorage.removeItem("campusIdCardImage");
  };

  const setCardImage = (image: string | null) => {
    setCardImageState(image);
    if (image) {
      localStorage.setItem("campusIdCardImage", image);
    } else {
      localStorage.removeItem("campusIdCardImage");
    }
  };

  return (
    <AuthContext.Provider value={{ user, cardImage, login, logout, setCardImage, isLoading }}>
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


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

export interface CardData {
    image: string;
    createdAt: string;
}

interface LoginCredentials {
  email: string;
  role: UserRole;
  workCode?: string;
}

interface AuthContextType {
  user: User | null;
  cardData: CardData | null;
  login: (credentials: LoginCredentials) => boolean;
  logout: () => void;
  register: (newUser: Omit<User, 'lastLogin'>) => boolean;
  setCardImage: (image: string | null) => void;
  isLoading: boolean;
  users: User[];
  removeUser: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
    { role: 'admin', firstName: 'Admin', lastName: 'User', initials: 'AU', email: 'admin@outlook.com', campusName: 'Main Campus', workCode: 'ADMIN123', lastLogin: new Date().toISOString() },
    { role: 'technician', firstName: 'Tech', lastName: 'Support', initials: 'TS', email: 'tech@outlook.com', campusName: 'Main Campus', workCode: 'TECH123', lastLogin: new Date(Date.now() - 172800000).toISOString() },
];


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cardData, setCardDataState] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("campusIdUsers");
      
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        // Add mock users if not present
        const allUsers = [...parsedUsers, ...mockUsers.filter(mu => !parsedUsers.some((pu: User) => pu.email === mu.email))];
        setUsers(allUsers);
        localStorage.setItem("campusIdUsers", JSON.stringify(allUsers));
      } else {
        setUsers(mockUsers);
        localStorage.setItem("campusIdUsers", JSON.stringify(mockUsers));
      }

      const storedUser = localStorage.getItem("campusIdUser");
      if (storedUser) {
        const loggedInUser = JSON.parse(storedUser);
        setUser(loggedInUser);
        const storedCardData = localStorage.getItem(`campusIdCardData_${loggedInUser.email}`);
        if (storedCardData) {
          setCardDataState(JSON.parse(storedCardData));
        }
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
      if (u.role === 'admin' || u.role === 'technician') {
        return u.workCode === credentials.workCode;
      }
      return true;
    });
    
    if (foundUser) {
      const userWithLogin = { ...foundUser, lastLogin: new Date().toISOString()};
      setUser(userWithLogin);
      localStorage.setItem("campusIdUser", JSON.stringify(userWithLogin));
      
      const storedCardData = localStorage.getItem(`campusIdCardData_${foundUser.email}`);
      if (storedCardData) {
        setCardDataState(JSON.parse(storedCardData));
      } else {
        setCardDataState(null); // Reset if no card for this user
      }

      const updatedUsers = users.map(u => u.email === foundUser.email ? userWithLogin : u);
      setUsers(updatedUsers);
      localStorage.setItem("campusIdUsers", JSON.stringify(updatedUsers));

      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setCardDataState(null);
    localStorage.removeItem("campusIdUser");
  };

  const register = (newUser: Omit<User, 'lastLogin'>) => {
    const userExists = users.some(u => u.email === newUser.email);
    if (userExists) {
      return false; // User already exists
    }
    
    let userToRegister: User = newUser as User;
    if (newUser.role === 'admin' || newUser.role === 'technician') {
      const { workCode } = newUser;
      userToRegister = { ...newUser, workCode } as User;
    }


    const updatedUsers = [...users, userToRegister];
    setUsers(updatedUsers);
    localStorage.setItem("campusIdUsers", JSON.stringify(updatedUsers));
    return true;
  }

  const setCardImage = (image: string | null) => {
    if (user) {
        const key = `campusIdCardData_${user.email}`;
        if (image) {
          const newCardData: CardData = {
              image,
              createdAt: new Date().toISOString()
          };
          setCardDataState(newCardData);
          localStorage.setItem(key, JSON.stringify(newCardData));
        } else {
          setCardDataState(null);
          localStorage.removeItem(key);
        }
    }
  };

  const removeUser = (email: string) => {
    const updatedUsers = users.filter(u => u.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem("campusIdUsers", JSON.stringify(updatedUsers));
    localStorage.removeItem(`campusIdCardData_${email}`);
  }

  return (
    <AuthContext.Provider value={{ user, cardData, login, logout, register, setCardImage, isLoading, users, removeUser }}>
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

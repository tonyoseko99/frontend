import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContextCreate";

// Define the User type for TypeScript safety
interface User {
  id: string;
  role: "STUDENT" | "EXPERT" | "ADMIN";
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Paradigm: Persistence
    // When the app refreshes, check if a token exists and decode it
    const token = localStorage.getItem("token");
    if (token) {
      // Logic to decode JWT (e.g., using jwt-decode library) and set user
      // For now, creating a mock user
      try {
        const mockUser: User = {
          id: "student-1",
          role: "STUDENT"
        };
        setUser(mockUser);
      } catch (error) {
        console.error("Error processing stored token:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
    setTimeout(() => setLoading(false), 0);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // For now, we'll create a mock user since we don't have JWT decode
    // In a real app, you would decode the token to get user info
    try {
      // Assuming the token is a simple JSON object for now
      // In production, you'd use jwt-decode library
      const mockUser: User = {
        id: "student-1",
        role: "STUDENT"
      };
      setUser(mockUser);
    } catch (error) {
      console.error("Error processing token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };


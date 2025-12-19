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
      // setUser(decodedToken);
    }
    setTimeout(() => setLoading(false), 0);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    // setUser(decodedToken);
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


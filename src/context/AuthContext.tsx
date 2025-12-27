import React, { useState, useEffect, useMemo } from "react";
import { AuthContext } from "./AuthContextCreate";

// Define the User type for TypeScript safety
interface User {
  id: string;
  role: "STUDENT" | "EXPERT" | "ADMIN";
}

const safeParseJwt = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    // Use replaceAll to convert URL-safe base64 to regular base64
    const b64 = parts[1].replaceAll('-', '+').replaceAll('_', '/');
    // atob is available in browsers; for SSR you'd use Buffer
    return JSON.parse(atob(b64));
  } catch (err) {
    console.warn('safeParseJwt failed to parse token payload', err);
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = safeParseJwt(token);
        const mockUser: User = {
          id: payload?.id ?? 'student-1',
          role: (payload?.role as User['role']) ?? 'STUDENT'
        };
        // Defer setState to avoid synchronous state update inside effect
        setTimeout(() => setUser(mockUser), 0);
      } catch (error) {
        console.error("Error processing stored token:", error);
        localStorage.removeItem("token");
      }
    }
    setTimeout(() => setLoading(false), 0);
  }, []);

  const login = (token: string, role?: User['role']) => {
    localStorage.setItem("token", token);
    try {
      // Try to decode the token to get authoritative id & role
      const payload = safeParseJwt(token);
      const resolvedRole = role ?? (payload?.role as User['role']) ?? 'STUDENT';
      const resolvedId = payload?.id ?? (resolvedRole === 'EXPERT' ? 'expert-1' : 'student-1');
      const loggedInUser: User = { id: resolvedId, role: resolvedRole };
      setUser(loggedInUser);
    } catch (error) {
      console.error("Error processing token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext } from './AuthContextCreate';

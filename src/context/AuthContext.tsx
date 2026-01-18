import React, { useState, useEffect, useMemo, createContext, useContext } from "react";

// Define the User type for TypeScript safety
interface User {
  id: string;
  role: "STUDENT" | "EXPERT" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  login: (token: string, role?: User['role']) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => { },
  logout: () => { },
  loading: true, // Default to true so consumers wait
});

const safeParseJwt = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
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
        if (payload && payload.id && payload.role) {
          setUser({ id: payload.id, role: payload.role });
        }
      } catch (error) {
        console.error("Error processing stored token:", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, role?: User['role']) => {
    localStorage.setItem("token", token);
    try {
      const payload = safeParseJwt(token);
      if (!payload || !payload.id || !payload.role) {
        console.error("Invalid token payload:", payload);
        localStorage.removeItem("token");
        return;
      }
      const resolvedRole = role ?? (payload.role as User['role']);
      const loggedInUser: User = { id: payload.id, role: resolvedRole };
      setUser(loggedInUser);
    } catch (error) {
      console.error("Error processing token:", error);
      localStorage.removeItem("token");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
import { createContext } from "react";

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

// Provide a default value with no-op implementations to avoid `undefined` in useContext
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: (token: string, role?: User['role']) => {
    void token; // no-op default; consume token to avoid unused-var lint errors
    void role;
  },
  logout: () => {},
  loading: false,
});

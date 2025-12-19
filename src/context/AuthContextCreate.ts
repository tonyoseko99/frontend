import { createContext } from "react";

interface User {
  id: string;
  role: "STUDENT" | "EXPERT" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

// Provide a default value with no-op implementations to avoid `undefined` in useContext
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: (token: string) => {
    // no-op default; consume token to avoid unused-var lint errors
    void token;
  },
  logout: () => {},
  loading: false,
});

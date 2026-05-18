import { createContext } from "react";

// Definição do formato do utilizador
interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (username: string, role: "user" | "admin") => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
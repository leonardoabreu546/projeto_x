import { createContext } from "react";

// Definição do formato do utilizador
export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  following: string[]; // <-- NOVO: Guarda a lista de usernames que este utilizador segue
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, role: "user" | "admin") => Promise<boolean>;
  logout: () => void;
  toggleFollow: (targetUsername: string) => Promise<void>; // <-- NOVO: Função para seguir ou deixar de seguir
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
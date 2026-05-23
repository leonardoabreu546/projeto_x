import { createContext } from "react";

// Definição do formato do utilizador (o perfil logado no estado não precisa de guardar a password por segurança)
interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  // <-- CORREÇÃO: Tiramos o '?' para tornar a password obrigatória nas duas funções
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, role: "user" | "admin") => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
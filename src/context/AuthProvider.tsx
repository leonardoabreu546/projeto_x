import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Simulação temporária de login para o Front-End funcionar
  const login = (username: string, role: "user" | "admin") => {
    setUser({
      id: "1",
      username,
      email: `${username}@email.com`,
      role,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
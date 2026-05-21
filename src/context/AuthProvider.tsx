import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Tenta carregar o utilizador do localStorage mal o Provider inicia
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("myApp_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username: string, role: "user" | "admin") => {
    const newUser: User = {
      id: "1",
      username,
      email: `${username}@email.com`,
      role,
    };
    
    // 2. Guarda no estado E no localStorage
    setUser(newUser);
    localStorage.setItem("myApp_user", JSON.stringify(newUser));
  };

  const logout = () => {
    // 3. Limpa ambos
    setUser(null);
    localStorage.removeItem("myApp_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
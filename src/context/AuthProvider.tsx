import { useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
}

type DBUser = User & { password?: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("myApp_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;

      const foundUser = users.find((u: DBUser) => u.username === username);

      if (foundUser) {
        if (foundUser.password === password) {
          const loggedUser: User = {
            id: foundUser.id,
            username: foundUser.username,
            email: foundUser.email,
            role: foundUser.role,
          };
          
          setUser(loggedUser);
          localStorage.setItem("myApp_user", JSON.stringify(loggedUser));
          return true; 
        } else {
          alert("Password incorreta!");
          return false;
        }
      } else {
        alert("Utilizador não encontrado! Regista-te primeiro.");
        return false;
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return false;
    }
  };

  const register = async (username: string, password: string, role: "user" | "admin" = "user") => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;
      
      const userExists = users.some((u: DBUser) => u.username === username);

      if (userExists) {
        alert("Este nome de utilizador já existe! Tenta fazer login.");
        return false; 
      }

      // <-- O id manual foi removido. O json-server gera-o de forma segura!
      const newUser = {
        username,
        email: `${username}@email.com`,
        password, 
        role,
      };
      
      const createResponse = await axios.post("http://localhost:3000/users", newUser);
      
      const loggedUser: User = {
        id: createResponse.data.id, // Apanhamos aqui o ID que o servidor gerou
        username: createResponse.data.username,
        email: createResponse.data.email,
        role: createResponse.data.role,
      };
      
      setUser(loggedUser);
      localStorage.setItem("myApp_user", JSON.stringify(loggedUser));
      
      return true;
    } catch (error) {
      console.error("Erro no registo:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("myApp_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
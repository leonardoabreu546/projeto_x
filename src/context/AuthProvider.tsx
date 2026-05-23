import { useState, type ReactNode } from "react";
import axios from "axios";
import { AuthContext, type User } from "./AuthContext"; // <-- Importamos o User do ficheiro de contexto!

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
            // <-- NOVO: Se for uma conta antiga sem isto, damos-lhe um array vazio
            following: foundUser.following || [], 
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

      const newUser = {
        username,
        email: `${username}@email.com`,
        password, 
        role,
        following: [], // <-- NOVO: Utilizadores novos começam sem seguir ninguém
      };
      
      const createResponse = await axios.post("http://localhost:3000/users", newUser);
      
      const loggedUser: User = {
        id: createResponse.data.id, 
        username: createResponse.data.username,
        email: createResponse.data.email,
        role: createResponse.data.role,
        following: [], // <-- NOVO: Array vazio no estado também
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

  // <-- NOVO: Função Mágica para Seguir / Deixar de Seguir
  const toggleFollow = async (targetUsername: string) => {
    if (!user) return;

    // Vê se já seguimos a pessoa. Se sim, remove. Se não, adiciona!
    const isFollowing = user.following.includes(targetUsername);
    const updatedFollowing = isFollowing
      ? user.following.filter((name) => name !== targetUsername)
      : [...user.following, targetUsername];

    try {
      // 1. Atualiza na base de dados usando PATCH
      await axios.patch(`http://localhost:3000/users/${user.id}`, {
        following: updatedFollowing
      });

      // 2. Atualiza no estado do React e no LocalStorage
      const updatedUser = { ...user, following: updatedFollowing };
      setUser(updatedUser);
      localStorage.setItem("myApp_user", JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error("Erro ao seguir utilizador:", error);
    }
  };

  return (
    // <-- NOVO: Exportamos também a função toggleFollow para o resto da app a poder usar
    <AuthContext.Provider value={{ user, login, register, logout, toggleFollow }}>
      {children}
    </AuthContext.Provider>
  );
}
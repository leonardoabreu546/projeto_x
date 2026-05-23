import { useState, type ReactNode } from "react";
import axios from "axios"; // <-- Importado o axios
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

  // 2. O login agora é async para ligar à base de dados real
  const login = async (username: string, role: "user" | "admin") => {
    try {
      // Procura se o utilizador já existe no servidor
      const response = await axios.get(`http://localhost:3000/users?username=${username}`);
      const users = response.data;

      let loggedInUser: User;

      if (users.length > 0) {
        // Se existir, usa os dados da base de dados (ignora o "role" do formulário)
        loggedInUser = users[0];
      } else {
        // Se não existir, cria o utilizador na base de dados
        const newUser = {
          id: Date.now().toString(), // Gera um ID único em vez de ser sempre "1"
          username,
          email: `${username}@email.com`,
          role,
        };
        
        const createResponse = await axios.post("http://localhost:3000/users", newUser);
        loggedInUser = createResponse.data;
      }

      // Guarda no estado E no localStorage
      setUser(loggedInUser);
      localStorage.setItem("myApp_user", JSON.stringify(loggedInUser));

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao comunicar com o servidor!");
    }
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
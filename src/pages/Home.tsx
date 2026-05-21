import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name, role);
      navigate("/feed");
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="text-center p-5 rounded shadow bg-body-tertiary" style={{ width: "100%", maxWidth: "400px" }}>
        <h1>Entrar</h1>
        <form onSubmit={handleLogin} className="mt-4">
          <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Teu nome" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <select className="form-select mb-3" value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")}>
            <option value="user">Utilizador Comum</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" className="btn btn-success w-100 mb-2">Entrar</button>
        </form>

        <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
          Modo {theme === "dark" ? "Claro ☀️" : "Escuro 🌙"}
        </button>
      </div>
    </div>
  );
}
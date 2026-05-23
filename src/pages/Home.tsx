import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { login, register } = useAuth(); // Agora usamos duas funções distintas
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true); // Controla se estamos no Login ou Registo
  const [name, setName] = useState("");
  const [password, setPassword] = useState(""); // Estado para a password
  const [confirmPassword, setConfirmPassword] = useState(""); // <-- NOVO: Estado para confirmar a password
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;

    if (!isLoginMode) {
      // Validação: Se for Registo, verifica se as passwords são iguais
      if (password !== confirmPassword) {
        alert("As passwords não coincidem!");
        return; // Pára aqui, não tenta registar
      }
      
      const success = await register(name, password, role);
      if (success) navigate("/feed");
    } else {
      // Se for Login, avança normal
      const success = await login(name, password);
      if (success) navigate("/feed");
    }
  };

  return (
    // <-- ALTERADO: Removi o vh-100 e o justify-content-center, e adicionei mt-5 para fixar a margem no topo
    <div className="container d-flex flex-column align-items-center mt-5">
      <div className="text-center p-5 rounded shadow bg-body-tertiary" style={{ width: "100%", maxWidth: "400px" }}>
        <h1>{isLoginMode ? "Entrar" : "Registar"}</h1>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <input 
            type="text" 
            className="form-control mb-3"
            placeholder="Nome de utilizador"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required
          />
          
          <input 
            type="password" 
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required
          />

          {/* O Cargo (Role) e a Confirmação de Password só aparecem se estivermos a Registar uma conta nova */}
          {!isLoginMode && (
            <>
              <input 
                type="password" 
                className="form-control mb-3"
                placeholder="Confirma a Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required
              />
              <select className="form-select mb-3" value={role} onChange={(e) => setRole(e.target.value as "user" | "admin")}>
                <option value="user">Utilizador Comum</option>
                <option value="admin">Administrador</option>
              </select>
            </>
          )}

          <button type="submit" className="btn btn-success w-100 mb-2">
            {isLoginMode ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <button 
          className="btn btn-link text-decoration-none mb-3" 
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setPassword(""); // Limpa os campos quando muda de modo
            setConfirmPassword(""); 
          }}
        >
          {isLoginMode ? "Não tens conta? Regista-te aqui." : "Já tens conta? Entra aqui."}
        </button>

        <br />
        <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
          Modo {theme === "dark" ? "Claro ☀️" : "Escuro 🌙"}
        </button>
      </div>
    </div>
  );
}
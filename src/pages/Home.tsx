import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;

    if (!isLoginMode) {
      if (password !== confirmPassword) {
        alert("As passwords não coincidem!");
        return;
      }
      
      const success = await register(name, password, role);
      if (success) navigate("/feed");
    } else {
      const success = await login(name, password);
      if (success) navigate("/feed");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {/* Substituímos a medida fixa pela Grelha do Bootstrap */}
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          
          <div className="text-center p-4 p-sm-5 border rounded-4 bg-body">
            
            {/* Símbolo 𝕏 no topo da caixa */}
            <div className="display-4 fw-bold mb-4">𝕏</div>
            
            <h2 className="fw-bold mb-4">
              {isLoginMode ? "Entrar no X" : "Criar a tua conta"}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input 
                  type="text" 
                  className="form-control rounded-3"
                  id="floatingInput"
                  placeholder="Nome de utilizador"
                  value={name}
                  onChange={(e) => setName(e.target.value)} 
                  required
                />
                <label htmlFor="floatingInput">Nome de utilizador</label>
              </div>
              
              <div className="form-floating mb-3">
                <input 
                  type="password" 
                  className="form-control rounded-3"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              {!isLoginMode && (
                <>
                  <div className="form-floating mb-3">
                    <input 
                      type="password" 
                      className="form-control rounded-3"
                      id="floatingConfirmPassword"
                      placeholder="Confirma a Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required
                    />
                    <label htmlFor="floatingConfirmPassword">Confirma a Password</label>
                  </div>
                  
                  <div className="form-floating mb-4">
                    <select 
                      className="form-select rounded-3" 
                      id="floatingSelect"
                      value={role} 
                      onChange={(e) => setRole(e.target.value as "user" | "admin")}
                    >
                      <option value="user">Utilizador Comum</option>
                      <option value="admin">Administrador</option>
                    </select>
                    <label htmlFor="floatingSelect">Tipo de conta</label>
                  </div>
                </>
              )}

              {/* Botão largo e arredondado */}
              <button type="submit" className={`btn w-100 py-2 mb-3 rounded-pill fw-bold ${theme === 'dark' ? 'btn-light text-black' : 'btn-dark'}`}>
                {isLoginMode ? "Entrar" : "Registar"}
              </button>
            </form>

            <button 
              className="btn btn-link text-decoration-none text-muted mb-4" 
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setPassword("");
                setConfirmPassword(""); 
              }}
            >
              {isLoginMode ? "Não tens conta? Inscreve-te." : "Já tens conta? Entrar."}
            </button>

            <div className="border-top pt-3">
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={toggleTheme}>
                Modo {theme === "dark" ? "Claro ☀️" : "Escuro 🌙"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
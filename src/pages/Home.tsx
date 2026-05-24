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
  
  // <-- REMOVIDO: const [role, setRole] = useState<"user" | "admin">("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;

    if (!isLoginMode) {
      if (password !== confirmPassword) {
        alert("As passwords não coincidem!");
        return;
      }
      
      // <-- ALTERADO: Passamos "user" fixo por defeito no momento do registo
      const success = await register(name, password, "user");
      if (success) navigate("/feed");
    } else {
      const success = await login(name, password);
      if (success) navigate("/feed");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          
          <div className="text-center p-4 p-sm-5 border rounded-4 bg-body">
            
            {/* Lógica de cor adicionada ao Logótipo */}
            <div className={`display-4 fw-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>𝕏</div>
            
            {/* Lógica de cor adicionada ao Título */}
            <h2 className={`fw-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
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
                  <div className="form-floating mb-4">
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
                  {/* <-- REMOVIDO: A caixa de seleção de role (admin/user) desapareceu daqui */}
                </>
              )}

              {/* Lógica de cor adicionada ao Botão */}
              <button 
                type="submit" 
                className={`btn w-100 py-2 mb-3 rounded-pill fw-bold ${theme === 'dark' ? 'btn-light text-black' : 'btn-dark text-white'}`}
              >
                {isLoginMode ? "Entrar" : "Registar"}
              </button>
            </form>

            {/* Aplicado text-secondary para melhor leitura */}
            <button 
              className="btn btn-link text-decoration-none text-secondary mb-4" 
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
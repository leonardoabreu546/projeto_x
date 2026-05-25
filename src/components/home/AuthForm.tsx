import type { FormEvent } from "react";

interface AuthFormProps {
  theme: string;
  isLoginMode: boolean;
  name: string;
  password: string;
  confirmPassword: string;
  onNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onToggleMode: () => void;
  onToggleTheme: () => void;
}

export function AuthForm({
  theme,
  isLoginMode,
  name,
  password,
  confirmPassword,
  onNameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onToggleMode,
  onToggleTheme
}: AuthFormProps) {
  return (
    <div className="text-center p-4 p-sm-5 border rounded-4 bg-body">
      {/* Logótipo */}
      <div className={`display-4 fw-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>𝕏</div>
      
      {/* Título */}
      <h2 className={`fw-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        {isLoginMode ? "Entrar no X" : "Criar a tua conta"}
      </h2>
      
      <form onSubmit={onSubmit}>
        <div className="form-floating mb-3">
          <input 
            type="text" 
            className="form-control rounded-3"
            id="floatingInput"
            placeholder="Nome de utilizador"
            value={name}
            onChange={(e) => onNameChange(e.target.value)} 
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
            onChange={(e) => onPasswordChange(e.target.value)} 
            required
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        {!isLoginMode && (
          <div className="form-floating mb-4">
            <input 
              type="password" 
              className="form-control rounded-3"
              id="floatingConfirmPassword"
              placeholder="Confirma a Password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)} 
              required
            />
            <label htmlFor="floatingConfirmPassword">Confirma a Password</label>
          </div>
        )}

        {/* Botão de Submit */}
        <button 
          type="submit" 
          className={`btn w-100 py-2 mb-3 rounded-pill fw-bold ${theme === 'dark' ? 'btn-light text-black' : 'btn-dark text-white'}`}
        >
          {isLoginMode ? "Entrar" : "Registar"}
        </button>
      </form>

      {/* Alternar entre Login e Registo */}
      <button 
        type="button"
        className="btn btn-link text-decoration-none text-secondary mb-4" 
        onClick={onToggleMode}
      >
        {isLoginMode ? "Não tens conta? Inscreve-te." : "Já tens conta? Entrar."}
      </button>

      {/* Alternar Tema */}
      <div className="border-top pt-3">
        <button type="button" className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={onToggleTheme}>
          Modo {theme === "dark" ? "Claro ☀️" : "Escuro 🌙"}
        </button>
      </div>
    </div>
  );
}
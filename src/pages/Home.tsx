import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import { useNavigate } from "react-router-dom";

// Importa o componente visual
import { AuthForm } from "../components/home/AuthForm";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Tipagem corrigida para evitar erros de TypeScript
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) return;

    if (!isLoginMode) {
      if (password !== confirmPassword) {
        alert("As passwords não coincidem!");
        return;
      }
      
      const success = await register(name, password, "user");
      if (success) navigate("/feed");
    } else {
      const success = await login(name, password);
      if (success) navigate("/feed");
    }
  };

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setPassword("");
    setConfirmPassword(""); 
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
          
          <AuthForm 
            theme={theme}
            isLoginMode={isLoginMode}
            name={name}
            password={password}
            confirmPassword={confirmPassword}
            onNameChange={setName}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleSubmit}
            onToggleMode={handleToggleMode}
            onToggleTheme={toggleTheme}
          />

        </div>
      </div>
    </div>
  );
}
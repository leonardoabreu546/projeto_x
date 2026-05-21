import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (!user) return null; // Se não estiver logado, não mostra a navbar

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg ${theme === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} shadow-sm`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/feed">MyAPP</Link>
        
        <div className="d-flex align-items-center">
          <ul className="navbar-nav me-3 d-flex flex-row gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/feed">Feed</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/profile">Perfil</Link>
            </li>
            
            {/* LINK CONDICIONAL: Só aparece para Admin */}
            {user.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link text-danger fw-bold" to="/backoffice">Backoffice</Link>
              </li>
            )}
          </ul>

          <button className="btn btn-outline-secondary btn-sm me-2" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </nav>
  );
}
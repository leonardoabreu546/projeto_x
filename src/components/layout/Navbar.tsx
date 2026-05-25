import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { useTheme } from "../../context/useTheme";

export function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand ${theme === 'dark' ? 'navbar-dark bg-black text-white' : 'navbar-light bg-white text-dark'} border-bottom sticky-top py-2`}>
      <div className="container">
        {/* Logótipo tipo X: lógica de cor injetada */}
        <Link className={`navbar-brand fw-bold fs-3 text-decoration-none ${theme === 'dark' ? 'text-white' : 'text-black'}`} to={user ? "/feed" : "/"}>
          𝕏
        </Link>
        
        <div className="d-flex align-items-center justify-content-end gap-2 w-100">
          
          {/* Só mostra os links de navegação se estiver logado */}
          {user && (
            <ul className="navbar-nav d-flex flex-row gap-3 me-2">
              <li className="nav-item">
                {/* Lógica de cor injetada */}
                <Link className={`nav-link fw-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`} to="/feed">Feed</Link>
              </li>
              <li className="nav-item">
                {/* Lógica de cor injetada */}
                <Link className={`nav-link fw-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`} to="/profile">Perfil</Link>
              </li>
              {user.role === "admin" && (
                <li className="nav-item">
                  <Link className="nav-link text-danger fw-semibold" to="/backoffice">Admin</Link>
                </li>
              )}
            </ul>
          )}

          {/* Botão de Tema minimalista sem bordas fortes */}
          <button 
            className="btn btn-outline-secondary btn-sm rounded-circle border-0 fs-5" 
            onClick={toggleTheme}
            title="Mudar tema"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          
          {/* Botão Sair tipo pílula (contraste dinâmico) */}
          {user && (
            <button 
              className={`btn btn-sm rounded-pill px-4 fw-bold ms-2 ${theme === 'dark' ? 'btn-light text-black' : 'btn-dark'}`} 
              onClick={handleLogout}
            >
              Sair
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Feed de Notícias</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div className="card p-4 mb-4 shadow-sm bg-body-tertiary">
        <h3>Olá, {user?.name}! 👋</h3>
        <p>
          Estás logado como: <span className="badge bg-info text-dark">{user?.role}</span>
        </p>
      </div>

      <div className="row">
        {/* Exemplo de um post no feed */}
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Post de Exemplo</h5>
              <p className="card-text">Se estás a ver isto, o contexto de autenticação está a funcionar!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
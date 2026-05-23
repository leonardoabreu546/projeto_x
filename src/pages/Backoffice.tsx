import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth"; 
import { useNavigate } from "react-router-dom"; 

interface User {
  id: string;
  username: string; 
  email: string;
  role: "user" | "admin";
}

export default function Backoffice() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); 
    } else if (user.role !== "admin") {
      navigate("/feed"); 
    }
  }, [user, navigate]);

  const handleRefresh = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar utilizadores:", error);
    }
  };

  const handleDelete = async (id: string) => {
    // <-- NOVO: Bloqueio extra de segurança na função
    if (user?.id === id) {
      alert("Não podes apagar a tua própria conta de Administrador!");
      return;
    }

    if (window.confirm("Tens a certeza que queres apagar este utilizador?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Erro ao eliminar utilizador:", error);
      }
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let isMounted = true; 

    axios.get("http://localhost:3000/users")
      .then((response) => {
        if (isMounted) {
          setUsers(response.data);
        }
      })
      .catch((error) => console.error("Erro no carregamento inicial:", error));

    return () => {
      isMounted = false; 
    };
  }, [user]);

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Painel de Controlo ⚙️</h2>
      
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h5 className="card-title">Gestão de Utilizadores</h5>
              <p className="card-text">Total: {users.length} utilizadores registados.</p>
              <button className="btn btn-primary btn-sm" onClick={handleRefresh}>
                Atualizar Lista
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Estatísticas</h5>
              <p className="card-text">Novos registos hoje: 1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Lista de Utilizadores</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2">Editar</button>
                    {/* <-- NOVO: O botão fica desativado (disabled) se o utilizador for o próprio */}
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(u.id)}
                      disabled={user.id === u.id} 
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
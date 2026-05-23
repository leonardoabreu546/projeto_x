import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth"; // <-- NOVO: Importar contexto
import { useNavigate } from "react-router-dom"; // <-- NOVO: Importar navegação

interface User {
  id: string;
  username: string; 
  email: string;
  role: "user" | "admin";
}

export default function Backoffice() {
  const [users, setUsers] = useState<User[]>([]);
  
  // <-- NOVO: Puxar o utilizador e a função de redirecionamento
  const { user } = useAuth();
  const navigate = useNavigate();

  // <-- NOVO: Barreira de segurança. Executa logo ao tentar abrir a página
  useEffect(() => {
    if (!user) {
      navigate("/"); // Se não estiver logado, vai para o login
    } else if (user.role !== "admin") {
      navigate("/feed"); // Se for utilizador comum, vai para o feed
    }
  }, [user, navigate]);

  // 1. Função separada que o botão "Atualizar Lista" vai usar
  const handleRefresh = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao carregar utilizadores:", error);
    }
  };

  // 2. O useEffect faz o seu próprio carregamento silencioso e seguro quando a página abre
  useEffect(() => {
    // Proteção extra: não tenta ir à base de dados se não for admin
    if (!user || user.role !== "admin") return;

    let isMounted = true; // Truque de segurança do React

    axios.get("http://localhost:3000/users")
      .then((response) => {
        // Só atualiza o estado se o componente ainda estiver aberto no ecrã
        if (isMounted) {
          setUsers(response.data);
        }
      })
      .catch((error) => console.error("Erro no carregamento inicial:", error));

    return () => {
      isMounted = false; // Limpeza quando sais da página
    };
  }, [user]); // Adicionamos o 'user' como dependência para ele reagir a mudanças

  // <-- NOVO: Mostra um ecrã vazio durante a fração de segundo em que o React está a expulsar o utilizador
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
              {/* O botão agora chama o handleRefresh */}
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
                    <button className="btn btn-outline-danger btn-sm">Eliminar</button>
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
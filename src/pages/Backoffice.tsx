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
  // <-- NOVO: Estado para guardar o número total de tweets
  const [totalTweets, setTotalTweets] = useState<number>(0); 
  
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
      // <-- ALTERADO: Atualiza utilizadores e tweets ao mesmo tempo
      const responseUsers = await axios.get("http://localhost:3000/users");
      const responseTweets = await axios.get("http://localhost:3000/tweets");
      
      setUsers(responseUsers.data);
      setTotalTweets(responseTweets.data.length);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleToggleRole = async (targetUser: User) => {
    if (user?.id === targetUser.id) {
      alert("Não podes alterar o teu próprio cargo!");
      return;
    }

    const newRole = targetUser.role === "admin" ? "user" : "admin";
    
    if (window.confirm(`Mudar o cargo de ${targetUser.username} para ${newRole}?`)) {
      try {
        await axios.patch(`http://localhost:3000/users/${targetUser.id}`, { role: newRole });
        setUsers(users.map((u) => 
          u.id === targetUser.id ? { ...u, role: newRole } : u
        ));
      } catch (error) {
        console.error("Erro ao alterar cargo:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
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

    // <-- ALTERADO: Função mais limpa para ir buscar os dois dados (Utilizadores e Tweets)
    const loadDashboardData = async () => {
      try {
        const resUsers = await axios.get("http://localhost:3000/users");
        const resTweets = await axios.get("http://localhost:3000/tweets");
        
        if (isMounted) {
          setUsers(resUsers.data);
          setTotalTweets(resTweets.data.length); // Guarda a quantidade de tweets
        }
      } catch (error) {
        console.error("Erro no carregamento inicial:", error);
      }
    };

    loadDashboardData();

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
              {/* <-- ALTERADO: Mostra o total de tweets reais em vez do texto falso */}
              <p className="card-text">Total de Tweets: {totalTweets}</p>
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
                    <button 
                      className="btn btn-outline-primary btn-sm me-2"
                      onClick={() => handleToggleRole(u)}
                      disabled={user.id === u.id}
                    >
                      Alterar Cargo
                    </button>
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
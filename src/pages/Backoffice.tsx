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

interface BackofficeTweet {
  id: number;
  author: string;
  message: string;
  date: string;
  image?: string; 
}

export default function Backoffice() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalTweets, setTotalTweets] = useState<number>(0); 
  const [allTweets, setAllTweets] = useState<BackofficeTweet[]>([]);
  
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
      const responseUsers = await axios.get("http://localhost:3000/users");
      const responseTweets = await axios.get("http://localhost:3000/tweets");
      
      setUsers(responseUsers.data);
      setTotalTweets(responseTweets.data.length);
      setAllTweets(responseTweets.data);
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

    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    if (window.confirm(`Tens a certeza que queres apagar o utilizador ${userToDelete.username} e TODOS os seus tweets?`)) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));

        const userTweets = allTweets.filter(t => t.author === userToDelete.username);

        await Promise.all(
          userTweets.map(tweet => axios.delete(`http://localhost:3000/tweets/${tweet.id}`))
        );

        const updatedTweets = allTweets.filter(t => t.author !== userToDelete.username);
        setAllTweets(updatedTweets);
        setTotalTweets(updatedTweets.length);

      } catch (error) {
        console.error("Erro ao eliminar utilizador e os seus tweets:", error);
      }
    }
  };

  const handleDeleteTweet = async (id: number) => {
    if (window.confirm("Tem a certeza absoluta de que quer apagar este Tweet? Esta ação é irreversível.")) {
      try {
        await axios.delete(`http://localhost:3000/tweets/${id}`);
        const updatedTweets = allTweets.filter((t) => t.id !== id);
        setAllTweets(updatedTweets);
        setTotalTweets(updatedTweets.length);
      } catch (error) {
        console.error("Erro ao eliminar tweet:", error);
      }
    }
  };

  useEffect(() => {
    if (!user || user.role !== "admin") return;

    let isMounted = true; 

    const loadDashboardData = async () => {
      try {
        const resUsers = await axios.get("http://localhost:3000/users");
        const resTweets = await axios.get("http://localhost:3000/tweets");
        
        if (isMounted) {
          setUsers(resUsers.data);
          setTotalTweets(resTweets.data.length); 
          setAllTweets(resTweets.data);
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
    <div className="container py-1">
      <h2 className="mb-4 fw-bold fs-1">Painel de Controlo ⚙️</h2>
      
      {/* Cartões de Estatísticas - Estilo Limpo */}
      <div className="row mb-5 justify-content-center">
        <div className="col-md-4 mb-3 mb-md-0">
          <div className="card border rounded-4 shadow-none bg-body h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold">Gestão de Utilizadores</h5>
              <p className="card-text text-muted">Total: <strong className="text-body">{users.length}</strong> utilizadores registados.</p>
              <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold mt-2" onClick={handleRefresh}>
                Atualizar Lista
              </button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border rounded-4 shadow-none bg-body h-100">
            <div className="card-body">
              <h5 className="card-title fw-bold">Estatísticas</h5>
              <p className="card-text text-muted">Total de Tweets: <strong className="text-body">{totalTweets}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Utilizadores */}
      <div className="card border rounded-4 shadow-none mb-5 overflow-hidden bg-body">
        <div className="px-4 py-3 border-bottom">
          <h5 className="mb-0 fw-bold">Lista de Utilizadores</h5>
        </div>
        {/* <-- NOVO: table-responsive para adaptar sem estragar o ecrã */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="text-muted" style={{ borderBottom: "2px solid var(--bs-border-color)" }}>
              <tr>
                <th className="fw-medium border-0 px-4 pt-3 pb-2">ID</th>
                <th className="fw-medium border-0 pt-3 pb-2">Nome</th>
                <th className="fw-medium border-0 pt-3 pb-2">Email</th>
                <th className="fw-medium border-0 pt-3 pb-2">Cargo</th>
                <th className="fw-medium border-0 px-4 pt-3 pb-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4">{u.id}</td>
                  <td className="fw-bold">@{u.username}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 text-nowrap">
                    <button 
                      className="btn btn-outline-secondary btn-sm rounded-pill fw-bold me-2"
                      onClick={() => handleToggleRole(u)}
                      disabled={user.id === u.id}
                    >
                      Alterar Cargo
                    </button>
                    <button 
                      className="btn btn-outline-danger btn-sm rounded-pill fw-bold"
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

      {/* Tabela de Tweets */}
      <div className="card border rounded-4 shadow-none overflow-hidden bg-body">
        <div className="px-4 py-3 border-bottom">
          <h5 className="mb-0 fw-bold">Gestão de Tweets</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="text-muted" style={{ borderBottom: "2px solid var(--bs-border-color)" }}>
              <tr>
                <th className="fw-medium border-0 px-4 pt-3 pb-2">ID</th>
                <th className="fw-medium border-0 pt-3 pb-2">Autor</th>
                <th className="fw-medium border-0 pt-3 pb-2" style={{ minWidth: "300px" }}>Conteúdo</th>
                <th className="fw-medium border-0 pt-3 pb-2">Data</th>
                <th className="fw-medium border-0 px-4 pt-3 pb-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {allTweets.map((t) => (
                <tr key={t.id}>
                  <td className="px-4">{t.id}</td>
                  <td className="fw-bold">@{t.author}</td>
                  
                  <td>
                    <p className="mb-2 text-wrap" style={{ whiteSpace: "pre-wrap" }}>{t.message}</p>
                    {t.image && (
                      <img 
                        src={t.image} 
                        alt="Anexo do tweet" 
                        className="img-thumbnail rounded-4 border"
                        style={{ maxHeight: "80px", objectFit: "cover" }} 
                      />
                    )}
                  </td>

                  <td className="text-muted text-nowrap">{new Date(t.date).toLocaleDateString('pt-PT')}</td>
                  <td className="px-4">
                    <button 
                      className="btn btn-danger btn-sm rounded-pill fw-bold"
                      onClick={() => handleDeleteTweet(t.id)}
                    >
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
              {allTweets.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-5">
                    <h6 className="fw-bold mb-0">Ainda não há tweets publicados na plataforma.</h6>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
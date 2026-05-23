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

// <-- ALTERADO: Adicionada a propriedade 'image' para podermos lê-la
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

  // <-- ALTERADO: Agora elimina o utilizador e os seus tweets (Cascade Delete)
  const handleDelete = async (id: string) => {
    if (user?.id === id) {
      alert("Não podes apagar a tua própria conta de Administrador!");
      return;
    }

    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;

    if (window.confirm(`Tens a certeza que queres apagar o utilizador ${userToDelete.username} e TODOS os seus tweets?`)) {
      try {
        // 1. Apagar o utilizador da base de dados
        await axios.delete(`http://localhost:3000/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));

        // 2. Descobrir quais são os tweets desta pessoa
        const userTweets = allTweets.filter(t => t.author === userToDelete.username);

        // 3. Apagar todos os tweets dessa pessoa da base de dados simultaneamente
        await Promise.all(
          userTweets.map(tweet => axios.delete(`http://localhost:3000/tweets/${tweet.id}`))
        );

        // 4. Limpar esses tweets das tabelas visuais e dos contadores
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
              <p className="card-text">Total de Tweets: {totalTweets}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mb-5">
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

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Gestão de Tweets</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Autor</th>
                <th style={{ width: "40%" }}>Conteúdo</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {allTweets.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td><span className="fw-bold">@{t.author}</span></td>
                  
                  {/* <-- ALTERADO: Agora mostra o texto completo e a imagem se existir */}
                  <td style={{ maxWidth: "350px" }}>
                    <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>{t.message}</p>
                    {t.image && (
                      <img 
                        src={t.image} 
                        alt="Anexo do tweet" 
                        className="img-thumbnail rounded"
                        style={{ maxHeight: "100px", objectFit: "cover" }} 
                      />
                    )}
                  </td>

                  <td>{new Date(t.date).toLocaleDateString('pt-PT')}</td>
                  <td>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteTweet(t.id)}
                    >
                      Apagar Tweet
                    </button>
                  </td>
                </tr>
              ))}
              {allTweets.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-3">
                    Ainda não há tweets publicados na plataforma.
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
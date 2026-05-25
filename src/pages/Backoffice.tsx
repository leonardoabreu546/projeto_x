import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth"; 
import { useNavigate } from "react-router-dom"; 
import { StatsCards } from "../components/backoffice/StatsCards";
import { UsersTable, type User } from "../components/backoffice/UsersTable";
import { TweetsTable, type BackofficeTweet } from "../components/backoffice/TweetsTable";

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
        // 1. Apagar o utilizador
        await axios.delete(`http://localhost:3000/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));

        // 2. Apagar os tweets do utilizador
        const userTweets = allTweets.filter(t => t.author === userToDelete.username);
        await Promise.all(
          userTweets.map(tweet => axios.delete(`http://localhost:3000/tweets/${tweet.id}`))
        );

        const updatedTweets = allTweets.filter(t => t.author !== userToDelete.username);
        setAllTweets(updatedTweets);
        setTotalTweets(updatedTweets.length);

        // 3. LIMPEZA EM CASCATA
        const updateFollowersPromises = users.map((u) => {
          if (u.following && u.following.includes(userToDelete.username)) {
            const newFollowing = u.following.filter((name) => name !== userToDelete.username);
            return axios.patch(`http://localhost:3000/users/${u.id}`, { following: newFollowing });
          }
          return null;
        }).filter(Boolean); 

        await Promise.all(updateFollowersPromises);

      } catch (error) {
        console.error("Erro ao eliminar utilizador e as suas dependências:", error);
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
      
      <StatsCards 
        usersCount={users.length} 
        totalTweets={totalTweets} 
        onRefresh={handleRefresh} 
      />

      <UsersTable 
        users={users} 
        currentUserId={user.id} 
        onToggleRole={handleToggleRole} 
        onDelete={handleDelete} 
      />

      <TweetsTable 
        tweets={allTweets} 
        onDeleteTweet={handleDeleteTweet} 
      />
    </div>
  );
}
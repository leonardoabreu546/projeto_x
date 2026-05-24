import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import Tweet, { type TweetProps } from "../components/Tweet";

// <-- NOVO: Interface para ensinar ao TypeScript o que vem na resposta dos users
interface UserData {
  username: string;
  following?: string[];
}

export default function Profile() {
  const { user } = useAuth();
  const [myTweets, setMyTweets] = useState<TweetProps[]>([]);
  const [followersCount, setFollowersCount] = useState(0); 

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        // 1. Ir buscar e filtrar os tweets do utilizador
        const responseTweets = await axios.get("http://localhost:3000/tweets");
        const filteredTweets = responseTweets.data.filter(
          (t: TweetProps) => t.author === user.username
        );
        filteredTweets.sort((a: TweetProps, b: TweetProps) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setMyTweets(filteredTweets);

        // 2. Ir buscar os utilizadores para calcular os seguidores
        const responseUsers = await axios.get("http://localhost:3000/users");
        
        // <-- ALTERADO: Usamos a interface UserData em vez de 'any'
        const count = responseUsers.data.filter((u: UserData) => 
          u.following && u.following.includes(user.username)
        ).length;
        
        setFollowersCount(count);

      } catch (error) {
        console.error("Erro ao carregar os dados do perfil:", error);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      
      {/* Cabeçalho do Perfil - Sem sombra, com borda limpa (estilo X) */}
      <div className="card mb-4 border rounded-4 shadow-none overflow-hidden bg-body">
        
        {/* Banner colorido com um tom mais neutro */}
        <div className="bg-secondary bg-opacity-25" style={{ height: "120px" }}></div>
        
        <div className="card-body position-relative px-4 pb-4">
          
          {/* Avatar: Usamos border-body para que se adapte automaticamente ao Dark Mode! */}
          <div 
            className="bg-dark text-white d-flex justify-content-center align-items-center rounded-circle border border-4 border-body position-absolute"
            style={{ width: "100px", height: "100px", top: "-50px", fontSize: "2.5rem", fontWeight: "bold" }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          
          {/* Botão comum no perfil do X para compor o layout */}
          <div className="d-flex justify-content-end mt-2">
            <button className="btn btn-outline-secondary rounded-pill fw-bold px-3 py-1">
              Editar perfil
            </button>
          </div>
          
          <div className="mt-3">
            <h2 className="fw-bold mb-0">{user.username}</h2>
            <p className="text-muted mb-2">@{user.username.toLowerCase()} • {user.email}</p>
            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary text-white'}`}>
              {user.role === 'admin' ? 'Administrador' : 'Utilizador'}
            </span>
          </div>
          
          <div className="d-flex gap-4 mt-3">
            <p className="mb-0 text-muted">
              <strong className="text-body">{user.following?.length || 0}</strong> a seguir
            </p>
            <p className="mb-0 text-muted">
              <strong className="text-body">{followersCount}</strong> seguidores
            </p>
          </div>
        </div>
      </div>

      {/* Secção de Tweets do Utilizador (Aba estilizada à X) */}
      <div className="border-bottom mb-3">
        <div className="py-3 fw-bold text-body" style={{ borderBottom: "4px solid #1d9bf0", display: "inline-block" }}>
          Os Meus Tweets
        </div>
      </div>
      
      <div>
        {myTweets.length > 0 ? (
          myTweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))
        ) : (
          <div className="text-center text-muted py-5">
            <h5 className="fw-bold text-body">Ainda não há publicações</h5>
            <p>Quando publicares o teu primeiro tweet, ele aparecerá aqui.</p>
          </div>
        )}
      </div>
    </div>
  );
}
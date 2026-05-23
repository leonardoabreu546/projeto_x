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
      
      {/* Cabeçalho do Perfil */}
      <div className="card shadow-sm mb-5 border-0 overflow-hidden">
        {/* Banner colorido a imitar as redes sociais */}
        <div className="bg-primary" style={{ height: "120px" }}></div>
        
        <div className="card-body position-relative px-4 pb-4">
          {/* Avatar (círculo com a primeira letra do nome) */}
          <div 
            className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle border border-4 border-white position-absolute"
            style={{ width: "100px", height: "100px", top: "-50px", fontSize: "2.5rem", fontWeight: "bold" }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="mt-5 d-flex justify-content-between align-items-start">
            <div>
              <h2 className="fw-bold mb-0">{user.username}</h2>
              <p className="text-muted mb-2">{user.email}</p>
              <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-info text-dark'}`}>
                {user.role === 'admin' ? 'Administrador' : 'Utilizador'}
              </span>
            </div>
            
            <div className="text-end text-muted d-flex gap-4">
              <p className="mb-0 fs-5">
                <strong className="text-body">{user.following?.length || 0}</strong> a seguir
              </p>
              <p className="mb-0 fs-5">
                <strong className="text-body">{followersCount}</strong> seguidores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secção de Tweets do Utilizador */}
      <h4 className="fw-bold mb-4 border-bottom pb-2">Os Meus Tweets</h4>
      
      <div>
        {myTweets.length > 0 ? (
          myTweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))
        ) : (
          <div className="text-center text-muted py-5 bg-body-tertiary rounded">
            <p className="fs-5 mb-0">Ainda não publicaste nenhum tweet.</p>
            <small>Vai até ao Feed e partilha o teu primeiro pensamento!</small>
          </div>
        )}
      </div>

    </div>
  );
}
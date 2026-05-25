import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import Tweet, { type TweetProps } from "../components/Tweet";
import { useTheme } from "../context/useTheme";

// Interface para os dados que recebemos da API
interface UserFromApi {
  id: string;
  username: string;
  following?: string[];
  profileColor?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [myTweets, setMyTweets] = useState<TweetProps[]>([]);
  const [followersCount, setFollowersCount] = useState(0); 
  
  const [avatarColor, setAvatarColor] = useState("bg-primary");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfileData = async () => {
      try {
        const responseTweets = await axios.get("http://localhost:3000/tweets");
        const filteredTweets = responseTweets.data.filter((t: TweetProps) => t.author === user.username);
        setMyTweets(filteredTweets.sort((a: TweetProps, b: TweetProps) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        const responseUsers = await axios.get("http://localhost:3000/users");
        
        // CORRIGIDO: Agora usamos UserFromApi em vez de 'any'
        const currentUser = responseUsers.data.find((u: UserFromApi) => u.id === user.id);
        
        if (currentUser?.profileColor) setAvatarColor(currentUser.profileColor);

        const count = responseUsers.data.filter((u: UserFromApi) => u.following && u.following.includes(user.username)).length;
        setFollowersCount(count);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchProfileData();
  }, [user]);

  const changeColor = async (newColor: string) => {
    try {
      await axios.patch(`http://localhost:3000/users/${user?.id}`, { profileColor: newColor });
      setAvatarColor(newColor);
      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao salvar cor:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="card mb-4 border rounded-4 shadow-none overflow-hidden bg-body">
        <div className="bg-secondary bg-opacity-25" style={{ height: "120px" }}></div>
        
        <div className="card-body position-relative px-4 pb-4">
          <div 
            className={`${avatarColor} text-white d-flex justify-content-center align-items-center rounded-circle border border-4 border-body position-absolute shadow-sm`}
            style={{ width: "100px", height: "100px", top: "-50px", fontSize: "3rem", fontWeight: "800" }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          
          <div className="d-flex justify-content-end mt-2">
            <button 
              className="btn btn-outline-secondary rounded-pill fw-bold px-3 py-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancelar" : "Editar perfil"}
            </button>
          </div>
          
          {isEditing ? (
            <div className="mt-4 p-3 border rounded-4 bg-body-tertiary">
              <label className="fw-bold mb-2">Escolhe a cor do fundo:</label>
              <div className="d-flex gap-2">
                {["bg-primary", "bg-danger", "bg-success", "bg-warning", "bg-dark"].map(c => (
                  <button key={c} className={`${c} rounded-circle border-0`} style={{width: 35, height: 35}} onClick={() => changeColor(c)} />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <h2 className="fw-bolder mb-0">{user.username}</h2>
              <p className="text-secondary mb-2" style={{ fontSize: "0.95rem" }}>@{user.username.toLowerCase()} • {user.email}</p>
              <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary text-white'}`}>
                {user.role === 'admin' ? 'Administrador' : 'Utilizador'}
              </span>
            </div>
          )}
          
          <div className="d-flex gap-4 mt-3">
            <p className="mb-0 text-muted"><strong className="text-body">{user.following?.length || 0}</strong> a seguir</p>
            <p className="mb-0 text-muted"><strong className="text-body">{followersCount}</strong> seguidores</p>
          </div>
        </div>
      </div>

      <div className="border-bottom mb-3">
        <div className={`py-3 fw-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} style={{ borderBottom: "4px solid #1d9bf0", display: "inline-block" }}>
          Os Meus Tweets
        </div>
      </div>
      
      <div>
        {myTweets.length > 0 ? (
          myTweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
        ) : (
          <div className="text-center text-muted py-5">
            <h5 className="fw-bold text-body">Ainda não há publicações</h5>
          </div>
        )}
      </div>
    </div>
  );
}
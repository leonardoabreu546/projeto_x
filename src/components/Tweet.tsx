import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";

export interface TweetProps {
  id: number;
  author: string;
  message: string;
  image: string;
  followers: number;
  date: string;
  likes?: number;
  following?: boolean;
}

function Tweet({ id, author, message, image, followers, date, likes }: TweetProps) {
  const { user, toggleFollow } = useAuth();
  
  const [currentLikes, setCurrentLikes] = useState(likes || 0);
  const [hasLiked, setHasLiked] = useState(false); 

  // <-- NOVO: Estado local para controlar o número de seguidores no ecrã
  const [currentFollowers, setCurrentFollowers] = useState(followers || 0);

  const isOwnTweet = user?.username === author;
  const isFollowing = user?.following?.includes(author);

  const handleLike = async () => {
    const newLikesCount = hasLiked ? currentLikes - 1 : currentLikes + 1;

    try {
      await axios.patch(`http://localhost:3000/tweets/${id}`, { likes: newLikesCount });
      setCurrentLikes(newLikesCount);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("Erro ao atualizar o like:", error);
    }
  };

  // <-- NOVO: Função que atualiza a base de dados e o número no ecrã em simultâneo
  const handleFollowClick = async () => {
    await toggleFollow(author);
    // Se já estávamos a seguir, tiramos 1. Se não estávamos, somamos 1.
    setCurrentFollowers(isFollowing ? currentFollowers - 1 : currentFollowers + 1);
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">@{author}</h5>
          
          {!isOwnTweet && (
            <button 
              className={`btn btn-sm rounded-pill fw-bold ${isFollowing ? "btn-outline-secondary" : "btn-primary"}`}
              // <-- ALTERADO: Agora chama a nossa nova função
              onClick={handleFollowClick}
            >
              {isFollowing ? "A Seguir" : "Seguir"}
            </button>
          )}
        </div>

        <p className="card-text fs-5">{message}</p>
        
        {image && <img src={image} alt="Tweet image" className="img-fluid mb-3 rounded" />}
        
        <div className="d-flex align-items-center text-muted gap-3">
          {/* <-- ALTERADO: Agora mostra o estado currentFollowers em vez do texto fixo */}
          <small>👥 {currentFollowers} seguidores</small>
          
          <button 
            className="btn btn-sm btn-light border-0 d-flex align-items-center gap-1"
            onClick={handleLike}
            style={{ transition: "0.2s" }}
          >
            {hasLiked ? "❤️" : "🤍"} 
            <span className={hasLiked ? "text-danger fw-bold" : "text-muted"}>
              {currentLikes} likes
            </span>
          </button>

          <small>📅 {new Date(date).toLocaleString('pt-PT')}</small>
        </div>
        
      </div>
    </div>
  );
}

export default Tweet;
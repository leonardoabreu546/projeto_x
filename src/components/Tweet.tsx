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

// <-- ALTERADO: Adicionei o 'id' aqui nos parâmetros para sabermos qual atualizar
function Tweet({ id, author, message, image, followers, date, likes }: TweetProps) {
  const { user, toggleFollow } = useAuth();
  
  // <-- NOVO: Estados locais para controlar os likes deste tweet específico no ecrã
  const [currentLikes, setCurrentLikes] = useState(likes || 0);
  const [hasLiked, setHasLiked] = useState(false); // Controla se a pessoa já clicou

  const isOwnTweet = user?.username === author;
  const isFollowing = user?.following?.includes(author);

  // <-- NOVO: Função que dá ou tira o Like
  const handleLike = async () => {
    // Se já tinha dado like, tira 1. Se não, soma 1.
    const newLikesCount = hasLiked ? currentLikes - 1 : currentLikes + 1;

    try {
      // Atualiza apenas o número de likes deste tweet na base de dados
      await axios.patch(`http://localhost:3000/tweets/${id}`, { likes: newLikesCount });
      
      // Atualiza o ecrã instantaneamente
      setCurrentLikes(newLikesCount);
      setHasLiked(!hasLiked);
    } catch (error) {
      console.error("Erro ao atualizar o like:", error);
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">@{author}</h5>
          
          {!isOwnTweet && (
            <button 
              className={`btn btn-sm rounded-pill fw-bold ${isFollowing ? "btn-outline-secondary" : "btn-primary"}`}
              onClick={() => toggleFollow(author)}
            >
              {isFollowing ? "A Seguir" : "Seguir"}
            </button>
          )}
        </div>

        <p className="card-text fs-5">{message}</p>
        
        {image && <img src={image} alt="Tweet image" className="img-fluid mb-3 rounded" />}
        
        <div className="d-flex align-items-center text-muted gap-3">
          <small>👥 {followers} seguidores</small>
          
          {/* <-- ALTERADO: O texto virou um botão dinâmico para os Likes */}
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
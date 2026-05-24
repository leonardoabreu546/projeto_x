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

  // Estado local para controlar o número de seguidores no ecrã
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

  const handleFollowClick = async () => {
    await toggleFollow(author);
    setCurrentFollowers(isFollowing ? currentFollowers - 1 : currentFollowers + 1);
  };

  return (
    // Mantemos a margem (mb-3) mas retiramos a sombra para um estilo mais "flat"
    <div className="card mb-3 border rounded-4 shadow-none bg-body">
      <div className="card-body">
        
        {/* Cabeçalho do Tweet com Avatar */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2">
            {/* Avatar gerado pela primeira letra */}
            <div 
              className="bg-secondary text-white d-flex justify-content-center align-items-center rounded-circle"
              style={{ width: "42px", height: "42px", fontSize: "1.2rem", fontWeight: "bold" }}
            >
              {author.charAt(0).toUpperCase()}
            </div>
            <div className="d-flex flex-column lh-1">
              <span className="fw-bold">{author}</span>
              <small className="text-muted mt-1">@{author.toLowerCase()}</small>
            </div>
          </div>
          
          {!isOwnTweet && (
            <button 
              className={`btn btn-sm rounded-pill fw-bold px-3 py-1 ${isFollowing ? "btn-outline-secondary" : "btn-dark text-white"}`}
              onClick={handleFollowClick}
            >
              {isFollowing ? "A Seguir" : "Seguir"}
            </button>
          )}
        </div>

        {/* Mensagem do Tweet */}
        <p className="card-text fs-5 mt-3 mb-3" style={{ whiteSpace: "pre-wrap" }}>
          {message}
        </p>
        
        {/* Imagem do Tweet (com bordas suaves) */}
        {image && (
          <img 
            src={image} 
            alt="Anexo da publicação" 
            className="img-fluid mb-3 rounded-4 border w-100" 
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        )}
        
        {/* Rodapé (Likes, Seguidores, Data) com separador subtil */}
        <div className="d-flex align-items-center justify-content-between text-muted border-top pt-3 mt-2">
          <div className="d-flex gap-4 align-items-center">
            
            {/* Botão de Like sem fundo cinzento */}
            <button 
              className="btn btn-sm bg-transparent border-0 p-0 d-flex align-items-center gap-1"
              onClick={handleLike}
              style={{ transition: "0.2s" }}
            >
              <span className="fs-5">{hasLiked ? "❤️" : "🤍"}</span> 
              <span className={hasLiked ? "text-danger fw-bold" : "text-muted"}>
                {currentLikes > 0 ? currentLikes : ""}
              </span>
            </button>

            <span className="d-flex align-items-center gap-1" title="Seguidores do autor">
              <span className="fs-6">👥</span> {currentFollowers}
            </span>
          </div>

          <small>
            {new Date(date).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · {new Date(date).toLocaleDateString('pt-PT')}
          </small>
        </div>
        
      </div>
    </div>
  );
}

export default Tweet;
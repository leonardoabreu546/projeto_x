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

function Tweet({ author, message, image, followers, date, likes }: TweetProps) {
  // <-- NOVO: Puxamos os dados do utilizador logado e a função mágica
  const { user, toggleFollow } = useAuth();

  // Verifica se o tweet é do próprio utilizador (para esconder o botão)
  const isOwnTweet = user?.username === author;
  
  // Verifica se o utilizador logado já segue o autor deste tweet
  const isFollowing = user?.following?.includes(author);

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        
        {/* <-- NOVO: Coloquei o título e o botão lado a lado usando o d-flex do Bootstrap */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">@{author}</h5>
          
          {/* Só mostra o botão se não for um tweet nosso */}
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
        
        {/* <-- ALTERADO: Arrumei as estatísticas do rodapé para ficarem alinhadas */}
        <div className="d-flex text-muted gap-3">
          <small>👥 {followers} seguidores</small>
          <small>❤️ {likes || 0} likes</small>
          <small>📅 {new Date(date).toLocaleString('pt-PT')}</small>
        </div>
        
      </div>
    </div>
  );
}

export default Tweet;
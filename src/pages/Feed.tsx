import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Tweet, { type TweetProps } from "../components/Tweet";

export default function Feed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tweets, setTweets] = useState<TweetProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  // <-- NOVO: Estado para guardar o link da imagem
  const [newImage, setNewImage] = useState(""); 
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getTweets = async () => {
    const response = await axios.get("http://localhost:3000/tweets");
    
    const sortedTweets = response.data.sort((a: TweetProps, b: TweetProps) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedTweets;
  };

  useEffect(() => {
    getTweets()
      .then((data) => setTweets(data))
      .catch((error) => console.error("Erro ao carregar tweets:", error));
  }, []);

  const handlePostTweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newTweet: TweetProps = {
      id: Date.now(), 
      author: user?.username || "Desconhecido",
      message: newMessage,
      image: newImage, // <-- ALTERADO: Agora envia a imagem que o utilizador colou!
      likes: 0,
      followers: 0, 
      date: new Date().toISOString()
    };

    try {
      await axios.post("http://localhost:3000/tweets", newTweet);
      setNewMessage(""); 
      setNewImage(""); // <-- NOVO: Limpa o campo da imagem após publicar
      getTweets().then((data) => setTweets(data));
      setActiveTab("all"); 
    } catch (error) {
      console.error("Erro ao publicar:", error);
    }
  };

  const displayedTweets = activeTab === "all" 
    ? tweets 
    : tweets.filter((tweet) => user?.following?.includes(tweet.author));

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Feed de Notícias</h1>
        <button className="btn btn-danger" onClick={handleLogout}>
          Sair
        </button>
      </div>

      <div className="card p-4 mb-4 shadow-sm bg-body-tertiary">
        <h3>Olá, {user?.username}! 👋</h3>
        <p>
          Estás logado como: <span className="badge bg-info text-dark">{user?.role}</span>
        </p>

        <form onSubmit={handlePostTweet} className="mt-3 border-top pt-3">
          <div className="form-group mb-2">
            <textarea 
              className="form-control" 
              rows={3} 
              placeholder="O que está a acontecer?"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              maxLength={280} 
              required
            ></textarea>
          </div>
          
          {/* <-- NOVO: Campo de texto para o URL da imagem */}
          <div className="form-group mb-3">
            <input 
              type="url" 
              className="form-control form-control-sm" 
              placeholder="🔗 URL da imagem (opcional) - Ex: https://site.com/foto.jpg"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">{newMessage.length}/280</small>
            <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
              Publicar
            </button>
          </div>
        </form>
      </div>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold ${activeTab === "all" ? "active text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("all")}
          >
            Todos os Tweets
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link fw-bold ${activeTab === "following" ? "active text-primary" : "text-secondary"}`}
            onClick={() => setActiveTab("following")}
          >
            A Seguir
          </button>
        </li>
      </ul>

      <div>
        {displayedTweets.length > 0 ? (
          displayedTweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} />
          ))
        ) : (
          <div className="text-center text-muted py-5">
            {activeTab === "following" 
              ? "Ainda não segues ninguém. Descobre novos utilizadores no separador 'Todos os Tweets'!" 
              : "Ainda não há nenhum tweet publicado. Sê o primeiro!"}
          </div>
        )}
      </div>

    </div>
  );
}
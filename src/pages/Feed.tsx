import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import Tweet, { type TweetProps } from "../components/Tweet";

export default function Feed() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tweets, setTweets] = useState<TweetProps[]>([]); // <-- 2. Troca any por TweetProps
  const [newMessage, setNewMessage] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getTweets = async () => {
    const response = await axios.get("http://localhost:3000/tweets");
    
    // 3. Troca os any por TweetProps na ordenação
    const sortedTweets = response.data.sort((a: TweetProps, b: TweetProps) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    console.log("Tweets carregados:", sortedTweets);
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

    // 4. Diz que este objeto é do tipo TweetProps e tira o .toString() do ID para ser número
    const newTweet: TweetProps = {
      id: Date.now(), 
      author: user?.username || "Desconhecido",
      message: newMessage,
      image: "", 
      likes: 0,
      followers: 0, 
      date: new Date().toISOString()
    };

    try {
      await axios.post("http://localhost:3000/tweets", newTweet);
      setNewMessage(""); 
      getTweets().then((data) => setTweets(data));
    } catch (error) {
      console.error("Erro ao publicar:", error);
    }
  };

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
          <div className="d-flex justify-content-between align-items-center mt-2">
            <small className="text-muted">{newMessage.length}/280</small>
            <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">
              Publicar
            </button>
          </div>
        </form>
      </div>

      <div>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </div>

    </div>
  );
}
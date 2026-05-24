import { useAuth } from "../context/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import Tweet, { type TweetProps } from "../components/Tweet";
import { useTheme } from "../context/useTheme";

interface UserData {
  username: string;
  following?: string[];
}

export default function Feed() {
  const { user } = useAuth(); 
  const { theme } = useTheme();

  const [tweets, setTweets] = useState<TweetProps[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newImage, setNewImage] = useState(""); 
  const [activeTab, setActiveTab] = useState<"all" | "following">("all");

  const getTweets = async () => {
    try {
      const [responseTweets, responseUsers] = await Promise.all([
        axios.get("http://localhost:3000/tweets"),
        axios.get("http://localhost:3000/users")
      ]);
      
      const users: UserData[] = responseUsers.data;

      const tweetsComSeguidores = responseTweets.data.map((tweet: TweetProps) => {
        const followersCount = users.filter(u => 
          u.following && u.following.includes(tweet.author)
        ).length;

        return {
          ...tweet,
          followers: followersCount 
        };
      });
      
      const sortedTweets = tweetsComSeguidores.sort((a: TweetProps, b: TweetProps) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      return sortedTweets;
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
      return [];
    }
  };

  useEffect(() => {
    getTweets().then((data) => setTweets(data));
  }, []);

  const handlePostTweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newTweet: Partial<TweetProps> = {
      id: Date.now(), 
      author: user?.username || "Desconhecido",
      message: newMessage,
      image: newImage, 
      likes: 0,
      date: new Date().toISOString()
    };

    try {
      await axios.post("http://localhost:3000/tweets", newTweet);
      setNewMessage(""); 
      setNewImage(""); 
      
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
    <div className="container">
      <h2 className={`mb-4 fw-bold fs-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Página Inicial</h2>

      <div className="card p-4 mb-4 border rounded-4 shadow-none bg-body">
        <h5 className={`fw-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>Olá, {user?.username}! 👋</h5>
        <p className="text-secondary small">
          Estás logado como: <span className="badge bg-secondary text-white">{user?.role}</span>
        </p>

        <form onSubmit={handlePostTweet} className="mt-2 border-top pt-3">
          <div className="form-group mb-2">
            <textarea 
              className="form-control border-0 fs-5 px-0 shadow-none bg-transparent" 
              rows={3} 
              placeholder="O que está a acontecer?!"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              maxLength={280} 
              style={{ resize: "none" }}
              required
            ></textarea>
          </div>
          
          <div className="form-group mb-3">
            <input 
              type="url" 
              className="form-control form-control-sm border-0 bg-body-tertiary rounded-pill px-3 py-2 text-primary shadow-none" 
              placeholder="🔗 URL da imagem (opcional) - Ex: https://site.com/foto.jpg"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <small className="text-primary fw-medium">{newMessage.length}/280</small>
            <button type="submit" className="btn text-white rounded-pill px-4 fw-bold" style={{ backgroundColor: "#1d9bf0" }}>
              Publicar
            </button>
          </div>
        </form>
      </div>

      <ul className="nav nav-tabs mb-4 border-bottom d-flex">
        <li className="nav-item flex-grow-1 text-center">
          <button 
            className={`nav-link w-100 fw-bold border-0 bg-transparent py-3 ${activeTab === "all" ? (theme === 'dark' ? 'text-white' : 'text-black') : "text-secondary"}`}
            style={activeTab === "all" ? { borderBottom: "4px solid #1d9bf0", borderRadius: 0 } : { borderBottom: "4px solid transparent", borderRadius: 0 }}
            onClick={() => setActiveTab("all")}
          >
            Todos os Tweets
          </button>
        </li>
        <li className="nav-item flex-grow-1 text-center">
          <button 
            className={`nav-link w-100 fw-bold border-0 bg-transparent py-3 ${activeTab === "following" ? (theme === 'dark' ? 'text-white' : 'text-black') : "text-secondary"}`}
            style={activeTab === "following" ? { borderBottom: "4px solid #1d9bf0", borderRadius: 0 } : { borderBottom: "4px solid transparent", borderRadius: 0 }}
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
          <div className="text-center text-secondary py-5">
            {activeTab === "following" 
              ? "Ainda não segues ninguém. Descobre novos utilizadores no separador 'Todos os Tweets'!" 
              : "Ainda não há nenhum tweet publicado. Sê o primeiro!"}
          </div>
        )}
      </div>

    </div>
  ); 
}
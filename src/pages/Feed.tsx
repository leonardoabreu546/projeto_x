import { useAuth } from "../context/useAuth";
import axios from "axios";
import { useEffect, useState } from "react";
import type { TweetProps } from "../components/feed/Tweet";
import { useTheme } from "../context/useTheme";

import { TweetComposer } from "../components/feed/TweetComposer";
import { FeedTabs } from "../components/feed/FeedTabs";
import { TweetList } from "../components/feed/TweetList";

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

  const handlePostTweet = async (e: React.FormEvent<HTMLFormElement>) => {
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

      {/* COMPONENTE 1: Formulário de Novo Tweet */}
      <TweetComposer 
        user={user} 
        theme={theme} 
        newMessage={newMessage} 
        newImage={newImage} 
        onMessageChange={setNewMessage} 
        onImageChange={setNewImage} 
        onSubmit={handlePostTweet} 
      />

      {/* COMPONENTE 2: Separadores (Tabs) */}
      <FeedTabs 
        activeTab={activeTab} 
        theme={theme} 
        onTabChange={setActiveTab} 
      />

      {/* COMPONENTE 3: Lista de Tweets */}
      <TweetList 
        tweets={displayedTweets} 
        activeTab={activeTab} 
      />

    </div>
  ); 
}
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import type { TweetProps } from "../components/feed/Tweet"; // Apenas importamos a interface
import { useTheme } from "../context/useTheme";

// Importação dos componentes visuais recém-criados
import { ProfileCard } from "../components/profile/ProfileCard";
import { ProfileTweetList } from "../components/profile/ProfileTweetList";

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
      
      {/* COMPONENTE 1: Cartão com os dados do Utilizador */}
      <ProfileCard 
        user={user}
        avatarColor={avatarColor}
        isEditing={isEditing}
        followersCount={followersCount}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onChangeColor={changeColor}
      />

      {/* COMPONENTE 2: Lista das publicações do Utilizador */}
      <ProfileTweetList 
        tweets={myTweets} 
        theme={theme} 
      />
      
    </div>
  );
}
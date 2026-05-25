import Tweet, { type TweetProps } from "./Tweet";

interface TweetListProps {
  tweets: TweetProps[];
  activeTab: "all" | "following";
}

export function TweetList({ tweets, activeTab }: TweetListProps) {
  return (
    <div>
      {tweets.length > 0 ? (
        tweets.map((tweet) => (
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
  );
}
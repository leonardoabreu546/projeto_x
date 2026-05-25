import Tweet, { type TweetProps } from "../feed/Tweet";

interface ProfileTweetListProps {
  tweets: TweetProps[];
  theme: string;
}

export function ProfileTweetList({ tweets, theme }: ProfileTweetListProps) {
  return (
    <>
      <div className="border-bottom mb-3">
        <div 
          className={`py-3 fw-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`} 
          style={{ borderBottom: "4px solid #1d9bf0", display: "inline-block" }}
        >
          Os Meus Tweets
        </div>
      </div>
      
      <div>
        {tweets.length > 0 ? (
          tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)
        ) : (
          <div className="text-center text-muted py-5">
            <h5 className="fw-bold text-body">Ainda não há publicações</h5>
          </div>
        )}
      </div>
    </>
  );
}
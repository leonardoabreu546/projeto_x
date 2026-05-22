export interface TweetProps {
  "id": number,
        "author": string,
        "message": string,
        "image": string,
        "followers": number,
        "date": string,
        "likes"?:number,
        "following"?:boolean
}

function Tweet({ author, message,image,followers,date,likes,following }: TweetProps) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{author}</h5>
        <p className="card-text">{message}</p>
        {image && <img src={image} alt="Tweet image" className="img-fluid mb-2" />}
        <p className="card-text">
            <small className="text-muted">{followers} seguidores</small>
            <br />
             <small className="text-muted">{likes} likes</small>
             <br />
             <small className="text-muted">{following ? "Seguindo" : "Não seguindo"}</small>
             <br />
          <small className="text-muted">{date}</small>
        </p>
      </div>
    </div>
  );
}
export default Tweet;
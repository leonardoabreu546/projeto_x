import type { FormEvent } from "react"; 
interface ComposerUser {
  username: string;
  role: string;
}

interface TweetComposerProps {
  user: ComposerUser | null;
  theme: string;
  newMessage: string;
  newImage: string;
  onMessageChange: (value: string) => void;
  onImageChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void; 
}

export function TweetComposer({ 
  user, 
  theme, 
  newMessage, 
  newImage, 
  onMessageChange, 
  onImageChange, 
  onSubmit 
}: TweetComposerProps) {
  return (
    <div className="card p-4 mb-4 border rounded-4 shadow-none bg-body">
      <h5 className={`fw-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        Olá, {user?.username}! 👋
      </h5>
      <p className="text-secondary small">
        Estás logado como: <span className="badge bg-secondary text-white">{user?.role}</span>
      </p>

      <form onSubmit={onSubmit} className="mt-2 border-top pt-3">
        <div className="form-group mb-2">
          <textarea 
            className="form-control border-0 fs-5 px-0 shadow-none bg-transparent" 
            rows={3} 
            placeholder="O que está a acontecer?!"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
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
            onChange={(e) => onImageChange(e.target.value)}
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
  );
}
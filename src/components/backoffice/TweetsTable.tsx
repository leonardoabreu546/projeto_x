// Exportamos a interface aqui para ser reutilizada
export interface BackofficeTweet {
  id: number;
  author: string;
  message: string;
  date: string;
  image?: string; 
}

interface TweetsTableProps {
  tweets: BackofficeTweet[];
  onDeleteTweet: (id: number) => void;
}

export function TweetsTable({ tweets, onDeleteTweet }: TweetsTableProps) {
  return (
    <div className="card border rounded-4 shadow-none overflow-hidden bg-body">
      <div className="px-4 py-3 border-bottom">
        <h5 className="mb-0 fw-bold">Gestão de Tweets</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="text-muted" style={{ borderBottom: "2px solid var(--bs-border-color)" }}>
            <tr>
              <th className="fw-medium border-0 px-4 pt-3 pb-2">ID</th>
              <th className="fw-medium border-0 pt-3 pb-2">Autor</th>
              <th className="fw-medium border-0 pt-3 pb-2" style={{ minWidth: "300px" }}>Conteúdo</th>
              <th className="fw-medium border-0 pt-3 pb-2">Data</th>
              <th className="fw-medium border-0 px-4 pt-3 pb-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tweets.map((t) => (
              <tr key={t.id}>
                <td className="px-4">{t.id}</td>
                <td className="fw-bold">@{t.author}</td>
                <td>
                  <p className="mb-2 text-break text-center mx-auto" style={{ whiteSpace: "pre-wrap", maxWidth: "20ch" }}>
                    {t.message}
                  </p>
                  {t.image && (
                    <img 
                      src={t.image} 
                      alt="Anexo do tweet" 
                      className="img-thumbnail rounded-4 border"
                      style={{ maxHeight: "80px", objectFit: "cover" }} 
                    />
                  )}
                </td>
                <td className="text-muted text-nowrap">{new Date(t.date).toLocaleDateString('pt-PT')}</td>
                <td className="px-4">
                  <button 
                    className="btn btn-danger btn-sm rounded-pill fw-bold"
                    onClick={() => onDeleteTweet(t.id)}
                  >
                    Apagar
                  </button>
                </td>
              </tr>
            ))}
            {tweets.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted py-5">
                  <h6 className="fw-bold mb-0">Ainda não há tweets publicados na plataforma.</h6>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
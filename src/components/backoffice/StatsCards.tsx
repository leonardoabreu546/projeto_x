interface StatsCardsProps {
  usersCount: number;
  totalTweets: number;
  onRefresh: () => void;
}

export function StatsCards({ usersCount, totalTweets, onRefresh }: StatsCardsProps) {
  return (
    <div className="row mb-5 justify-content-center">
      <div className="col-md-4 mb-3 mb-md-0">
        <div className="card border rounded-4 shadow-none bg-body h-100">
          <div className="card-body">
            <h5 className="card-title fw-bold">Gestão de Utilizadores</h5>
            <p className="card-text text-muted">
              Total: <strong className="text-body">{usersCount}</strong> utilizadores registados.
            </p>
            <button className="btn btn-dark btn-sm rounded-pill px-3 fw-bold mt-2" onClick={onRefresh}>
              Atualizar Lista
            </button>
          </div>
        </div>
      </div>
      
      <div className="col-md-4">
        <div className="card border rounded-4 shadow-none bg-body h-100">
          <div className="card-body">
            <h5 className="card-title fw-bold">Estatísticas</h5>
            <p className="card-text text-muted">
              Total de Tweets: <strong className="text-body">{totalTweets}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
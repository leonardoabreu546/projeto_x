export default function Backoffice() {
  // Simulação de dados que virão da base de dados mais tarde
  const usersMock = [
    { id: 1, name: "Admin Principal", email: "admin@myapp.com", role: "admin" },
    { id: 2, name: "João Silva", email: "joao@email.com", role: "user" },
    { id: 3, name: "Maria Santos", email: "maria@email.com", role: "user" },
  ];

  return (
    <div className="container py-5">
      <h2 className="mb-4">Painel de Controlo ⚙️</h2>
      
      <div className="row mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-primary">
            <div className="card-body">
              <h5 className="card-title">Gestão de Utilizadores</h5>
              <p className="card-text">Total: {usersMock.length} utilizadores registados.</p>
              <button className="btn btn-primary btn-sm">Atualizar Lista</button>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Estatísticas</h5>
              <p className="card-text">Novos registos hoje: 1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white">
          <h5 className="mb-0">Lista de Utilizadores</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Cargo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usersMock.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2">Editar</button>
                    <button className="btn btn-outline-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
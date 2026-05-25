// Exportamos a interface aqui para que o ficheiro principal a possa usar
export interface User {
  id: string;
  username: string; 
  email: string;
  role: "user" | "admin";
  following?: string[];
}

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  onToggleRole: (targetUser: User) => void;
  onDelete: (id: string) => void;
}

export function UsersTable({ users, currentUserId, onToggleRole, onDelete }: UsersTableProps) {
  return (
    <div className="card border rounded-4 shadow-none mb-5 overflow-hidden bg-body">
      <div className="px-4 py-3 border-bottom">
        <h5 className="mb-0 fw-bold">Lista de Utilizadores</h5>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="text-muted" style={{ borderBottom: "2px solid var(--bs-border-color)" }}>
            <tr>
              <th className="fw-medium border-0 px-4 pt-3 pb-2">ID</th>
              <th className="fw-medium border-0 pt-3 pb-2">Nome</th>
              <th className="fw-medium border-0 pt-3 pb-2">Email</th>
              <th className="fw-medium border-0 pt-3 pb-2">Cargo</th>
              <th className="fw-medium border-0 px-4 pt-3 pb-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4">{u.id}</td>
                <td className="fw-bold">@{u.username}</td>
                <td className="text-muted">{u.email}</td>
                <td>
                  <span className={`badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 text-nowrap">
                  <button 
                    className="btn btn-outline-secondary btn-sm rounded-pill fw-bold me-2"
                    onClick={() => onToggleRole(u)}
                    disabled={currentUserId === u.id}
                  >
                    Alterar Cargo
                  </button>
                  <button 
                    className="btn btn-outline-danger btn-sm rounded-pill fw-bold"
                    onClick={() => onDelete(u.id)}
                    disabled={currentUserId === u.id} 
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
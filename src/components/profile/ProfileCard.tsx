interface ProfileUser {
  username: string;
  email: string;
  role: string;
  following?: string[];
}

interface ProfileCardProps {
  user: ProfileUser;
  avatarColor: string;
  isEditing: boolean;
  followersCount: number;
  onToggleEdit: () => void;
  onChangeColor: (color: string) => void;
}

export function ProfileCard({ 
  user, 
  avatarColor, 
  isEditing, 
  followersCount, 
  onToggleEdit, 
  onChangeColor 
}: ProfileCardProps) {
  return (
    <div className="card mb-4 border rounded-4 shadow-none overflow-hidden bg-body">
      {/* Banner/Capa */}
      <div className="bg-secondary bg-opacity-25" style={{ height: "120px" }}></div>
      
      <div className="card-body position-relative px-4 pb-4">
        {/* Avatar Dinâmico */}
        <div 
          className={`${avatarColor} text-white d-flex justify-content-center align-items-center rounded-circle border border-4 border-body position-absolute shadow-sm`}
          style={{ width: "100px", height: "100px", top: "-50px", fontSize: "3rem", fontWeight: "800" }}
        >
          {user.username.charAt(0).toUpperCase()}
        </div>
        
        {/* Botão de Edição */}
        <div className="d-flex justify-content-end mt-2">
          <button 
            className="btn btn-outline-secondary rounded-pill fw-bold px-3 py-1"
            onClick={onToggleEdit}
          >
            {isEditing ? "Cancelar" : "Editar perfil"}
          </button>
        </div>
        
        {/* Lógica de exibição: Modo Edição vs Visualização */}
        {isEditing ? (
          <div className="mt-4 p-3 border rounded-4 bg-body-tertiary">
            <label className="fw-bold mb-2">Escolhe a cor do fundo:</label>
            <div className="d-flex gap-2">
              {["bg-primary", "bg-danger", "bg-success", "bg-warning", "bg-dark"].map(c => (
                <button 
                  key={c} 
                  className={`${c} rounded-circle border-0`} 
                  style={{width: 35, height: 35}} 
                  onClick={() => onChangeColor(c)} 
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <h2 className="fw-bolder mb-0">{user.username}</h2>
            <p className="text-secondary mb-2" style={{ fontSize: "0.95rem" }}>
              @{user.username.toLowerCase()} • {user.email}
            </p>
            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-secondary text-white'}`}>
              {user.role === 'admin' ? 'Administrador' : 'Utilizador'}
            </span>
          </div>
        )}
        
        {/* Estatísticas de Seguidores */}
        <div className="d-flex gap-4 mt-3">
          <p className="mb-0 text-muted">
            <strong className="text-body">{user.following?.length || 0}</strong> a seguir
          </p>
          <p className="mb-0 text-muted">
            <strong className="text-body">{followersCount}</strong> seguidores
          </p>
        </div>
      </div>
    </div>
  );
}
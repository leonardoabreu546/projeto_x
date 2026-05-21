import { useAuth } from "../context/useAuth";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="container py-5">
      <h2>O Teu Perfil</h2>
      <p>Bem-vindo, <strong>{user?.username}</strong>!</p>
    </div>
  );
}
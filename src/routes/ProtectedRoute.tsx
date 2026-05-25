import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { type ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roleRequired?: "admin" | "user";
}

export function ProtectedRoute({ children, roleRequired }: ProtectedRouteProps) {
  const { user } = useAuth();

  // 1. Se não houver utilizador logado, redireciona para a Home (Login)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. Se a rota exigir um cargo (ex: admin) e o utilizador não o tiver
  if (roleRequired && user.role !== roleRequired) {
    console.warn(`Acesso negado: Tu és '${user.role}', mas esta página exige '${roleRequired}'.`);
    return <Navigate to="/feed" replace />;
  }

  // 3. Se passar todas as verificações, mostra a página pretendida
  return <>{children}</>;
}
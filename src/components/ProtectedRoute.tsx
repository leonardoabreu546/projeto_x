import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { type ReactNode } from "react"; // Importa o ReactNode

interface ProtectedRouteProps {
  children: ReactNode; // Alterado de JSX.Element para ReactNode
  roleRequired?: "admin" | "user";
}

export function ProtectedRoute({ children, roleRequired }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/feed" />;
  }

  return <>{children}</>; // Envolvemos em fragment para garantir o retorno de um nó
}
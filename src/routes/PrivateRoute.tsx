import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const user = sessionStorage.getItem("user");
  return user ? children : <Navigate to="/login" />;
}
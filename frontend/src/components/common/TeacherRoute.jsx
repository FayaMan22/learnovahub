import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function TeacherRoute({ children }) {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "teacher") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function TeacherRoute({ children }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "teacher") {
    return <Navigate to="/" />;
  }

  return children;
}
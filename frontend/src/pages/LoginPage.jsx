import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);

  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);

    api.post("/login", formData)
      .then((response) => {
        const userData = response.data.user;

        loginUser(
          response.data.token,
          userData
        );

        setMessage(response.data.message);

        if (userData.role === "admin") {
          window.location.href = "/admin";
        } else if (userData.role === "teacher") {
          window.location.href = "/teacher";
        } else {
          window.location.href ="/dashboard";
        }
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.error || "Login failed"
        );
        setIsLoading(false);
      });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>

        {message && <p className="form-message">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            autoComplete="off"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

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

    axios
      .post("https://learnovahub.onrender.com//login", formData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);
        const userData = response.data.user;

      localStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

        setMessage(response.data.message);
        navigate("/dashboard");
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.error || "Login failed"
        );
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

          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
}
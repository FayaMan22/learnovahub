import { useState } from "react";
import api from "../api/api";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    api
      .post("/register", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        setMessage(response.data.message);
        setFormData({
          full_name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        setMessage(
          error.response?.data?.error || "Registration failed"
        );
      });
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>

        {message && <p className="form-message">{message}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </section>
  );
}
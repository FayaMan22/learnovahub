import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function HomePage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    axios
      .get("https://learnovahub.onrender.com//")
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <h1>Learn Smarter with LearnovaHub</h1>

          <p>
            Interactive Mathematics lessons, videos, quizzes,
            worksheets, and learner support designed to help
            students succeed.
          </p>

          <p className="backend-message">{message}</p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/lessons")}>
              Start Learning
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/pricing")}
            >
              View Pricing
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
            alt="Students learning"
          />
        </div>
      </section>

      <section className="features">
        <h2>Why Choose LearnovaHub?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Video Lessons</h3>
            <p>
              Learn through clear and engaging mathematics
              video tutorials.
            </p>
          </div>

          <div className="feature-card">
            <h3>Interactive Quizzes</h3>
            <p>
              Practice instantly with auto-marked quizzes
              and exercises.
            </p>
          </div>

          <div className="feature-card">
            <h3>Downloadable Worksheets</h3>
            <p>
              Access worksheets, revision packs, and exam
              preparation resources.
            </p>
          </div>
        </div>
      </section>

      <section className="subjects">
        <h2>Current Subjects</h2>

        <div className="subject-card">
          <h3>Grade 9 Mathematics</h3>
          <p>
            Algebra, Geometry, Functions, Number Patterns,
            Data Handling, and more.
          </p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Start Your Learning Journey Today</h2>

        <p>
          Join LearnovaHub and gain access to premium
          mathematics lessons and learner support.
        </p>

        <button onClick={() => navigate("/register")}>
          Join Now
        </button>
      </section>
    </>
  );
}
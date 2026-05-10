import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {

    const token = localStorage.getItem("token");

    axios
      .get("https://learnovahub.onrender.com//my-quiz-results", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setQuizResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (
    <section className="dashboard-page">
      <h1>Welcome Back, {user?.full_name}</h1>
      <div className="subscription-status">
        <h3>
          Subscription Status:{" "}
          {user?.is_subscribed ? "Active" : "Inactive"}
        </h3>

        {user?.is_subscribed && (
          <>
            <p>
              Plan: {user.subscription_type}
            </p>

            <p>
              Expires:{" "}
              {new Date(
                user.subscription_expires_at
              ).toLocaleDateString()}
            </p>
          </>
        )}
      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h2>Video Lessons</h2>
          <p>
            Continue learning Mathematics through
            interactive video lessons.
          </p>

          <button onClick={() => navigate("/lessons")}>
            View Lessons
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Quizzes</h2>
          <p>
            Test your understanding with
            auto-marked quizzes and exercises.
          </p>

          <button onClick={() => navigate("/lessons/1/quiz")}>
            Start Quiz
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Worksheets</h2>
          <p>
            Download worksheets and revision
            materials for practice.
          </p>

          <button onClick={() => navigate("/lessons")}>
            Download
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Progress Tracker</h2>
          <p>
            Monitor your lesson completion
            and quiz performance.
          </p>

          <button onClick={() => navigate("/progress")}>
            View Progress
          </button>
        </div>
        <section className="results-section">
          <h2>My Quiz Results</h2>

          {quizResults.length === 0 ? (
            <p>No quiz attempts yet.</p>
          ) : (
            <div className="results-table">
              {quizResults.map((result) => (
                <div key={result.id} className="result-card">

                  <h3>{result.lesson_title}</h3>

                  <p>
                    Score: {result.score} / {result.total_questions}
                  </p>

                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </section>
  );
}
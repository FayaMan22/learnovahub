import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ProgressPage() {
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    api
      .get("/my-quiz-results")
      .then((response) => {
        setQuizResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const totalAttempts = quizResults.length;

  const averageScore =
    totalAttempts > 0
      ? Math.round(
          quizResults.reduce(
            (sum, result) =>
              sum + (result.score / result.total_questions) * 100,
            0
          ) / totalAttempts
        )
      : 0;

  return (
    <section className="progress-page">
      <h1>My Progress</h1>

      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="progress-summary">
        <div className="progress-card">
          <h2>{totalAttempts}</h2>
          <p>Quiz Attempts</p>
        </div>

        <div className="progress-card">
          <h2>{averageScore}%</h2>
          <p>Average Score</p>
        </div>
      </div>

      <div className="progress-list">
        <h2>Quiz History</h2>

        {quizResults.length === 0 ? (
          <p>No quiz attempts yet.</p>
        ) : (
          quizResults.map((result) => (
            <div key={result.id} className="progress-result">
              <h3>{result.lesson_title}</h3>
              <p>
                Score: {result.score} / {result.total_questions}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
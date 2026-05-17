import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function TeacherDashboardPage() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api
      .get("/teacher/analytics")
      .then((response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="page-section">
      <h1>Teacher Dashboard</h1>

      <p>
        Manage your subjects, lessons, videos, quizzes, and learner progress.
      </p>

      {analytics && (
        <div className="analytics-grid">

          <div className="analytics-card">
            <h2>{analytics.total_lessons}</h2>
            <p>My Lessons</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.premium_lessons}</h2>
            <p>Premium Lessons</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.free_lessons}</h2>
            <p>Free Lessons</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.total_quiz_questions}</h2>
            <p>Quiz Questions</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.lessons_with_quizzes}</h2>
            <p>Lessons With Quizzes</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.lessons_without_quizzes}</h2>
            <p>Lessons Without Quizzes</p>
          </div>

        </div>
      )}

      <div className="grid-auto">
        <div className="card">
          <h2>My Lessons</h2>
          <p>Create, edit, delete, search, and sort your lessons.</p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/teacher/lessons")}
          >
            Manage My Lessons
          </button>
        </div>

        <div className="card">
          <h2>Lessons Without Quizzes</h2>
          <p>Quickly identify lessons that need quiz questions</p>

          <button
            className="btn btn-success"
            onClick={() => navigate("/teacher/lessons?filter=withoutQuiz")}
          >
            Add Quizzes
          </button>
        </div>

        <div className="card">
          <h2>My Learners</h2>
          <p>Track learners enrolled in your subjects.</p>

          <button className="btn btn-secondary">
            Coming Soon
          </button>
        </div>

        <div className="card">
          <h2>My Quizzes</h2>
          <p>Create and review assessments.</p>

          <button className="btn btn-secondary">
            Coming Soon
          </button>
        </div>
      </div>
    </section>
  );
}
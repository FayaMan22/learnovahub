import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

export default function DashboardPage() {
  usePageTitle("Learner Dashboard");
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState([]);
  const { user } = useAuth();

  const [progressData, setProgressData] = useState({
    total_lessons: 0,
    completed_lessons: 0,
    completion_percentage: 0,
  });
  const [masteryData, setMasteryData] = useState([]);
  const [bestScores, setBestScores] = useState([]);
  const [latestScores, setLatestScores] = useState([]);

  useEffect(() => {
    api
      .get("/my-quiz-results")
      .then((response) => {
        setQuizResults(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    api
      .get("/my-progress")
      .then((response) => {
        setProgressData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    api
      .get("/my-mastery")
      .then((response) => {
        setMasteryData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    api
      .get("/my-best-scores")
      .then((response) => {
        setBestScores(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    api
      .get("/my-latest-scores")
      .then((response) => {
        setLatestScores(response.data);
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

      <div className="progress-overview-card">
        <h2>Learning Progress</h2>

        <p>
          Completed Lessons:
          {" "}
          {progressData.completed_lessons}
          {" / "}
          {progressData.total_lessons}
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${progressData.completion_percentage}%`,
            }}
          ></div>
        </div>

        <h3>
          {progressData.completion_percentage}% Complete
        </h3>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>My Courses</h2>
          <p>
            Continue learning from the courses you are enrolled in.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/my-courses")}
          >
            Continue Learning
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Browse Courses</h2>
          <p>
            Explore available courses, lessons, quizzes, and learning materials.
          </p>

          <button
            className="btn btn-success"
            onClick={() => navigate("/courses")}
          >
            Browse Courses
          </button>
        </div>

        <div className="dashboard-card">
          <h2>My Progress</h2>
          <p>
            Track completed lessons, quiz scores, and learning growth.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/progress")}
          >
            View Progress
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Learning Materials</h2>
          <p>
            Access worksheets and resources inside each enrolled course lesson.
          </p>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/my-courses")}
          >
            Go to My Courses
          </button>
        </div>

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
        <section className="mastery-section">
          <h2>Topic Mastery</h2>
          {masteryData.length === 0 ? (
            <p>No mastery data yet.</p>
          ) : (
            <div className="mastery-grid">
              {masteryData.map((item, index) => (
                <div
                  key={index}
                  className={`mastery-card ${item.mastery}`}
                >
                  <h3>{item.lesson_title}</h3>
                  <p>{item.percentage}%</p>
                  <span>{item.mastery}</span>
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="best-scores-section">

          <h2>Best Quiz Scores</h2>

          {bestScores.length === 0 ? (

            <p>No quiz scores yet.</p>

          ) : (

            <div className="best-scores-grid">

              {bestScores.map((item, index) => (

                <div
                  key={index}
                  className="best-score-card"
                >

                  <h3>{item.lesson_title}</h3>

                  <p>
                    {item.score} / {item.total_questions}
                  </p>

                  <span>
                    {item.percentage}%
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>
        <section className="latest-scores-section">

          <h2>Latest Quiz Attempts</h2>

          {latestScores.length === 0 ? (

            <p>No recent quiz attempts.</p>

          ) : (

            <div className="latest-scores-grid">

              {latestScores.map((item, index) => (

                <div
                  key={index}
                  className="latest-score-card"
                >

                  <h3>{item.lesson_title}</h3>

                  <p>
                    {item.score} / {item.total_questions}
                  </p>

                  <span>
                    {item.percentage}%
                  </span>

                </div>

              ))}

            </div>

          )}

        </section>
    </section>
  );
}
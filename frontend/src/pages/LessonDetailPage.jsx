import { useEffect, useState } from "react";
import api from "../api/api";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LessonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [lesson, setLesson] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    api
      .get(`/lessons/${id}`)
      .then((response) => {
        setLesson(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    
    if (token) {
      api
        .get("/completed-lessons")
        .then((response) => {

          const completedIds = response.data;

          if (completedIds.includes(Number(id))) {
            setIsCompleted(true);
          }

        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

  if (!lesson) {
    return <h2>Loading lesson...</h2>;
  }
  const user = JSON.parse(localStorage.getItem("user"));

  if (lesson.is_premium && !user?.is_subscribed) {
    return (
      <section className="lesson-detail-page">
        <h1>{lesson.title}</h1>

        <p className="premium-message">
          This is a premium lesson. Please subscribe to access full content.
        </p>
      </section>
    );
  }

  function markLessonComplete() {
    api
      .post(
        `/lessons/${id}/complete`,
        {},)
      .then((response) => {
        setIsCompleted(true);
        alert(response.data.message);
      })
      .catch(() => {
        alert("Failed to mark lesson as complete.");
      });
  }

  return (
    <section className="lesson-detail-page">
      <h1>{lesson.title}</h1>

      {lesson.course_id && (
        <button
          className="btn btn-secondary back-course-btn"
          onClick={() =>
            navigate(`/courses/${lesson.course_id}`)
          }
        >
          ← Back to {lesson.course_title}
        </button>
      )}

      <p className="lesson-topic">
        Topic: {lesson.topic}
      </p>

      <p className="lesson-description">
        {lesson.description}
      </p>

      <div className="video-container">
        <iframe
          width="100%"
          height="500"
          src={lesson.video_url.replace(
            "watch?v=",
            "embed/"
          )}
          title={lesson.title}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      <div className="lesson-actions">
        {lesson.worksheet_url && lesson.worksheet_url !== "#" ? (
          <a
            href={lesson.worksheet_url}
            target="_blank"
            rel="noopener noreferrer"
            className="worksheet-btn"
          >
            Download Worksheet
          </a>
        ) : (
          <button disabled className="disabled-btn">
            Worksheet Coming Soon
          </button>
        )}

        <button
          className="secondary-btn"
          onClick={() => navigate(`/lessons/${lesson.id}/quiz`)}
        >
          Start Quiz
        </button>

        <button onClick={markLessonComplete}
          disabled={isCompleted}
          className={
            isCompleted
            ? "completed-btn"
            : ""
          }
        >
          {isCompleted
          ? "✓ Completed"
          : "Mark as Complete"}
        </button>
      </div>
    </section>
  );
}
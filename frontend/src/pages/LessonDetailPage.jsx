import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function LessonDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/lessons/${id}`)
      .then((response) => {
        setLesson(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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

  return (
    <section className="lesson-detail-page">
      <h1>{lesson.title}</h1>

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
      </div>
    </section>
  );
}
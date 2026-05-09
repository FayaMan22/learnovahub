import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LessonsPage() {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/lessons")
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="lessons-page">
      <h1>Grade 9 Mathematics Lessons</h1>

      <div className="lessons-grid">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <h2>{lesson.title}</h2>

            <p><strong>Topic:</strong> {lesson.topic}</p>

            <p>{lesson.description}</p>

            <p>
              {lesson.is_premium ? "Premium Lesson" : "Free Lesson"}
            </p>

            <button
              onClick={() => navigate(`/lessons/${lesson.id}`)}
            >
              Start Lesson
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
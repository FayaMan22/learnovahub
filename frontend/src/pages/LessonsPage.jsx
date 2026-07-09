import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

export default function LessonsPage() {
  usePageTitle("Lessons");
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();
  const [completedLessons, setCompletedLessons] = useState([]);
  const { token } = useAuth();
  
  useEffect(() => {
    api
      .get("/lessons")
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

      if (token) {
        api
          .get("/completed-lessons")
          .then((response) => {
            setCompletedLessons(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
  }, []);

  console.log("Lessons:", lessons);
  console.log("Completed:", completedLessons);

  return (
    <section className="lessons-page">
      <h1>Grade 9 Mathematics Lessons</h1>

      <div className="lessons-grid">
        {lessons.map((lesson) => (
          <div key={lesson.id} className="lesson-card">
            <h2>{lesson.title}</h2>
            {completedLessons.includes(lesson.id) && (
              <span className="completed-badge">
                ✓ Completed
              </span>
            )}

            <p><strong>Topic:</strong> {lesson.topic}</p>

            <p>{lesson.description}</p>

            <p>
              Instructor: {lesson.teacher_name}
            </p>

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
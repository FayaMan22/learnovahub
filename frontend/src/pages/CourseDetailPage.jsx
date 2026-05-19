import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function CourseDetailPage() {
  const navigate = useNavigate();

  const { courseId } = useParams();

  const { token, user } = useAuth();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    api
      .get(`/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [courseId]);

  if (!course) {
    return (
      <section className="page-section">
        <p>Loading course...</p>
      </section>
    );
  }

  function handleEnroll() {

    if (!token) {
        alert("Please login first.");
        return;
    }

    api
        .post(`/courses/${courseId}/enroll`)
        .then((response) => {
        alert(response.data.message);
        })
        .catch((error) => {
        console.log(error);

        alert(
            error.response?.data?.error ||
            "Enrollment failed"
        );
        });
    }

  return (
    <section className="page-section">
      <div className="course-hero card">
        <h1>{course.title}</h1>

        <button
          className="btn btn-secondary back-course-btn"
          onClick={() => navigate("/courses")}
        >
          ← Back to Courses
        </button>

        <p className="course-description">
            {course.description}
        </p>

        <div className="course-meta">
            <span>
            Teacher: {course.teacher_name}
            </span>

            <span>
            Price: R{course.price}
            </span>
        </div>

        {user?.role === "learner" && (
            <button
            className="btn btn-success enroll-btn"
            onClick={handleEnroll}
            >
            Enroll in Course
            </button>
        )}
      </div>
      <h2 className="section-title">
        Course Lessons
      </h2>

      <div className="course-lessons-grid">
        {course.lessons.map((lesson) => (
            <div key={lesson.id} className="card lesson-preview-card">

              <div className="lesson-preview-header">
                <h2>{lesson.title}</h2>

                <span className="lesson-topic-badge">
                  {lesson.topic}
                </span>
              </div>

              <p className="lesson-preview-description">
                {lesson.description}
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/lessons/${lesson.id}`)
                }
              >
                Start Learning
              </button>

            </div>
          ))}
      </div>
    </section>
  );
}
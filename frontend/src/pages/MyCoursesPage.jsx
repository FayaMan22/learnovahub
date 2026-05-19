import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function MyCoursesPage() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api
      .get("/my-courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="page-section">
      <h1>My Courses</h1>

      {courses.length === 0 && (
        <div className="card empty-state">
          <h2>No enrolled courses yet</h2>
          <p>Browse available courses and enroll to start learning.</p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/courses")}
          >
            Browse Courses
          </button>
        </div>
      )}

      <div className="grid-auto">
        {courses.map((course) => (
          <div key={course.id} className="card public-course-card">
            <h2>{course.title}</h2>

            <p className="course-card-description">
              {course.description}
            </p>

            <div className="course-card-meta">
              <span>Teacher: {course.teacher_name}</span>
              <span>Lessons: {course.lesson_count}</span>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              Continue Learning
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
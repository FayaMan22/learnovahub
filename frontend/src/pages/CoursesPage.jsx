import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

export default function CoursesPage() {
  usePageTitle("Courses");
  
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    api
      .get("/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="page-section">
      <h1>Available Courses</h1>

      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {courses.length === 0 && (
        <div className="card empty-state">
          <h2>No courses available yet</h2>
          <p>Please check again soon.</p>
        </div>
      )}

      <div className="grid-auto">
        {courses.map((course) => (
          <div key={course.id} className="card public-course-card">
            <h2>{course.title}</h2>
            <p className="course-card-description">
              {course.description}</p>
            <div className="course-card-meta">
              <span>
                Teacher: {course.teacher_name}
              </span>
              <span>
                Lessons: {course.lesson_count}
              </span>
            </div>

            <p className="course-price">
              R{course.price}</p>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(`/courses/${course.id}`)
              }
            >
              View Course
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
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

      {courses.length === 0 && (
        <div className="card empty-state">
          <h2>No courses available yet</h2>
          <p>Please check again soon.</p>
        </div>
      )}

      <div className="grid-auto">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Teacher: {course.teacher_name}</p>
            <p>Lessons: {course.lesson_count}</p>
            <p>Price: R{course.price}</p>

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
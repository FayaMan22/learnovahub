import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";

export default function CourseDetailPage() {
  const { courseId } = useParams();

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

  return (
    <section className="page-section">
      <h1>{course.title}</h1>

      <p>{course.description}</p>
      <p>Teacher: {course.teacher_name}</p>
      <p>Price: R{course.price}</p>

      <button className="btn btn-success">
        Enroll in Course
      </button>

      <h2>Course Lessons</h2>

      <div className="grid-auto">
        {course.lessons.map((lesson) => (
          <div key={lesson.id} className="card">
            <h2>{lesson.title}</h2>
            <p>{lesson.topic}</p>
            <p>{lesson.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
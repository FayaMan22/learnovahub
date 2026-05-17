import { useEffect, useState } from "react";
import api from "../api/api";

export default function TeacherCoursesPage() {
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  function fetchCourses() {
    api
      .get("/teacher/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    api
      .post("/teacher/courses", {
        ...formData,
        price: Number(formData.price),
      })
      .then(() => {
        fetchCourses();

        setFormData({
          title: "",
          description: "",
          price: "",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="page-section">
      <h1>My Courses</h1>

      <form className="lesson-form card" onSubmit={handleSubmit}>
        <h2>Create Course / Subject</h2>

        <input
          type="text"
          name="title"
          placeholder="e.g. Grade 9 Mathematics"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Course description"
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Course price"
          value={formData.price}
          onChange={handleChange}
        />

        <button className="btn btn-success" type="submit">
          Create Course
        </button>
      </form>

      {courses.length === 0 && (
        <div className="card empty-state">
          <h2>No courses yet</h2>
          <p>Create your first course or subject above.</p>
        </div>
      )}

      <div className="grid-auto">
        {courses.map((course) => (
          <div key={course.id} className="card">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <p>Price: R{course.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
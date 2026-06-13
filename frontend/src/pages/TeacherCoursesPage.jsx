import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function TeacherCoursesPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const [editingCourseId, setEditingCourseId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    learning_outcomes: "",
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

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      learning_outcomes: "",
      price: "",
    });

    setEditingCourseId(null);
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleEditClick(course) {
    setEditingCourseId(course.id);

    setFormData({
      title: course.title,
      description: course.description,
      learning_outcomes: course.learning_outcomes || "",
      price: course.price,
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    resetForm();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...formData,
      price: Number(formData.price),
    };

    if (editingCourseId) {
      api
        .patch(
          `/teacher/courses/${editingCourseId}`,
          payload
        )
        .then(() => {
          fetchCourses();
          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    api
      .post("/teacher/courses", payload)
      .then(() => {
        fetchCourses();
        resetForm();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDeleteCourse(courseId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    api
      .delete(`/teacher/courses/${courseId}`)
      .then(() => {
        fetchCourses();
      })
      .catch((error) => {
        console.log(error);
        alert(
          error.response?.data?.error ||
          "Failed to delete course"
        );
      });
  }

  return (
    <section className="page-section">
      <h1>My Courses</h1>

      <form className="lesson-form card" onSubmit={handleSubmit}>
        <h2>
          {editingCourseId ? "Edit Course" : "Create Course / Subject"}
        </h2>

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

        <textarea
          name="learning_outcomes"
          placeholder="What will learners learn? Write one outcome per line."
          value={formData.learning_outcomes}
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
          {editingCourseId ? "Update Course" : "Create Course"}
        </button>

        {editingCourseId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        )}

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
            <p>
              Lessons:
              {" "}
              {course.lesson_count}
            </p>
            <div className="lesson-actions">
              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/teacher/lessons?course=${course.id}`)
                }
              >
                Manage Lessons
              </button>

              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/teacher/assignments?course=${course.id}`)
                }
              >
                Assignments
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => handleEditClick(course)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleDeleteCourse(course.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
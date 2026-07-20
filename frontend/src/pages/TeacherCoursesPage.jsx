import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/teacher-courses.css";

export default function TeacherCoursesPage() {
  usePageTitle("Teacher Courses");
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    learning_outcomes: "",
    price: "",
  });

  async function fetchCourses() {
      try {
          setLoading(true);

          const response = await api.get("/teacher/courses");

          setCourses(response.data);
      } catch (error) {
          console.error(error);
          showToast("Unable to load your courses.", "error");
      } finally {
          setLoading(false);
      }
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
    setShowCourseForm(true);

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
    setShowCourseForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitting(true);

    const payload = {
        ...formData,
        price: Number(formData.price),
    };

    try {
        if (editingCourseId) {
            await api.patch(
                `/teacher/courses/${editingCourseId}`,
                payload
            );

            showToast("Course updated successfully.");
        } else {
            await api.post("/teacher/courses", payload);

            showToast("Course created successfully.");
        }

        fetchCourses();
        resetForm();
        setShowCourseForm(false);

    } catch (error) {
        console.error(error);

        showToast(
            error.response?.data?.error ||
            "Unable to save the course.",
            "error"
        );

    } finally {
        setSubmitting(false);
    }
  }

  function handleDeleteCourse(course) {
    setCourseToDelete(course);
  }

  function showToast(message, type = "success") {
    setToast({ message, type });

    setTimeout(() => {
        setToast(null);
    }, 4000);
  }

  async function confirmDeleteCourse() {
    if (!courseToDelete) return;

    try {
      setDeleting(true);

      await api.delete(`/teacher/courses/${courseToDelete.id}`);

      await fetchCourses();

      showToast("Course deleted successfully.");
      setCourseToDelete(null);
    } catch (error) {
      console.error(error);

      showToast(
        error.response?.data?.error || "Failed to delete course.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="page-section">
      <div className="teacher-courses-header">
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/teacher")}
          >
            ← Back to Dashboard
          </button>

          <h1>Teacher Courses</h1>

          <p>
            Create and organize the courses you teach.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowCourseForm(!showCourseForm)}
        >
          {showCourseForm ? "Close Form" : "+ New Course"}
        </button>
      </div>
      {showCourseForm && (
        <form className="course-form card" onSubmit={handleSubmit}>
          <h2>
            {editingCourseId ? "Edit Course" : "Create New Course"}
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

          <div className="course-actions">
            <button
                className="btn btn-success"
                type="submit"
                disabled={submitting}
            >
                {submitting
                    ? editingCourseId
                        ? "Updating..."
                        : "Creating..."
                    : editingCourseId
                        ? "Update Course"
                        : "Create Course"}
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
          </div>
        </form>
      )}
      
      {!loading && courses.length === 0 && (
        <div className="card course-empty-state">
          <div className="course-empty-icon">📚</div>

          <h2>You haven’t created any courses yet</h2>

          <p>
            Create your first course to start adding lessons, quizzes,
            assignments, and learning outcomes for your learners.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowCourseForm(true);

              setTimeout(() => {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }, 100);
            }}
          >
            + Create Your First Course
          </button>
        </div>
      )}

      <div className="grid-auto">
        {courses.map((course) => (
          <div key={course.id} className="card course-card">
            <div className="course-card-header">
                <div>
                    <h2>{course.title}</h2>

                    <span className="course-price">
                        R{Number(course.price).toFixed(2)}
                    </span>
                </div>

                <span className="course-lessons">
                    {course.lesson_count} Lessons
                </span>
            </div>

            <p className="course-description">
                {course.description || "No course description yet."}
            </p>

            {course.learning_outcomes && (
                <div className="course-outcomes">
                    <strong>Learning Outcomes</strong>

                    <p>{course.learning_outcomes}</p>
                </div>
            )}

            <div className="course-actions">

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate(`/teacher/lessons?course=${course.id}`)
                    }
                >
                    Lessons
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
                    onClick={() => handleDeleteCourse(course)}
                >
                    Delete
                </button>

            </div>
          </div>
        ))}
      </div>

      {courseToDelete && (
        <div
          className="modal-backdrop"
          onClick={() => !deleting && setCourseToDelete(null)}
        >
          <div
            className="delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-icon">!</div>

            <h2>Delete Course?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>{courseToDelete.title}</strong>?
            </p>

            <p className="delete-warning">
              This action cannot be undone.
            </p>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCourseToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDeleteCourse}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Course"}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/teacher-courses.css";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import Toast from "../components/common/Toast";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";


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

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      <PageHeader
        title="Teacher Courses"
        subtitle="Create and organize the courses you teach."
        backTo="/teacher"
        backText="Back to Dashboard"
        actionText={showCourseForm ? "Close Form" : "+ New Course"}
        onAction={() => setShowCourseForm(!showCourseForm)}
      />

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
        <EmptyState
          icon="📚"
          title="You haven’t created any courses yet"
          description="Create your first course to start adding lessons, quizzes, assignments, and learning outcomes for your learners."
          buttonText="+ Create Your First Course"
          onButtonClick={() => {
            resetForm();
            setShowCourseForm(true);

            setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }, 100);
          }}
        />
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

      <DeleteConfirmationModal
        open={Boolean(courseToDelete)}
        title="Delete Course?"
        itemName={courseToDelete?.title}
        warning="This action cannot be undone."
        confirmText="Delete Course"
        loading={deleting}
        onCancel={() => setCourseToDelete(null)}
        onConfirm={confirmDeleteCourse}
      />

    </section>
  );
}
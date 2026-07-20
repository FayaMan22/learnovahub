import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/teacher-lessons.css";
import DeleteConfirmationModal from "../components/common/DeleteConfirmationModal";
import Toast from "../components/common/Toast";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";

export default function TeacherLessonsPage() {
  usePageTitle("Teacher Lessons");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState(
    searchParams.get("filter") || "all"
  );
  const [sortBy, setSortBy] = useState("newest");

  const [editingLessonId, setEditingLessonId] = useState(null);
 
  const selectedCourseId = searchParams.get("course");

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    description: "",
    video_url: "",
    worksheet_url: "",
    is_premium: false,
    course_id: "",
  });

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  async function fetchCourses() {
    try {
      const response = await api.get("/teacher/courses");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
      showToast("Unable to load your courses.", "error");
    }
  }

  async function fetchTeacherLessons() {
    try {
      const response = await api.get("/teacher/lessons");
      setLessons(response.data);
    } catch (error) {
      console.error(error);
      showToast("Unable to load your lessons.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTeacherLessons();
    fetchCourses();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingLessonId) {
        await api.patch(
          `/teacher/lessons/${editingLessonId}`,
          formData
        );

        showToast("Lesson updated successfully.");
      } else {
        await api.post("/teacher/lessons", formData);
        showToast("Lesson created successfully.");
      }

      await fetchTeacherLessons();
      handleCancelEdit();
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to save the lesson.";

      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  function handleEditClick(lesson) {
    setEditingLessonId(lesson.id);
    setShowLessonForm(true);

    setFormData({
      title: lesson.title,
      topic: lesson.topic,
      description: lesson.description,
      video_url: lesson.video_url || "",
      worksheet_url: lesson.worksheet_url || "",
      is_premium: lesson.is_premium,
      course_id: lesson.course_id || "",
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function handleCancelEdit() {
    setEditingLessonId(null);
    setShowLessonForm(false);

    setFormData({
      title: "",
      topic: "",
      description: "",
      video_url: "",
      worksheet_url: "",
      is_premium: false,
      course_id: "",
    });
  }

  function handleDeleteLesson(lesson) {
    setLessonToDelete(lesson);
  }
  
  async function confirmDeleteLesson() {
    if (!lessonToDelete) {
      return;
    }

    setDeleting(true);

    try {
      await api.delete(
        `/teacher/lessons/${lessonToDelete.id}`
      );

      showToast("Lesson deleted successfully.");
      setLessonToDelete(null);
      await fetchTeacherLessons();
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Unable to delete the lesson.";

      showToast(message, "error");
    } finally {
      setDeleting(false);
    }
  }

  const filteredLessons = lessons
    .filter((lesson) => {
      const title = lesson.title || "";
      const topic = lesson.topic || "";

      const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.toLowerCase().includes(searchTerm.toLowerCase());

      const quizCount = lesson.quiz_question_count || 0;

      const matchesFilter =
        filterStatus === "all" ||
        (filterStatus === "withQuiz" && quizCount > 0) ||
        (filterStatus === "withoutQuiz" && quizCount === 0) ||
        (filterStatus === "premium" && lesson.is_premium) ||
        (filterStatus === "free" && !lesson.is_premium);

      const matchesCourse =
        !selectedCourseId ||
        String(lesson.course_id) === selectedCourseId;

      return (
        matchesSearch && 
        matchesFilter &&
        matchesCourse
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return b.id - a.id;
      }

      if (sortBy === "oldest") {
        return a.id - b.id;
      }

      if (sortBy === "titleAsc") {
        return (a.title || "").localeCompare(b.title || "");
      }

      if (sortBy === "titleDesc") {
        return (b.title || "").localeCompare(a.title || "");
      }

      return 0;
    });

  return (
    <section className="page-section">

      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

      <PageHeader
        title="Teacher Lessons"
        subtitle="Create, organise and manage lessons for your courses."
        backTo="/teacher"
        backText="Back to Dashboard"
        actionText={showLessonForm ? "Close Form" : "+ New Lesson"}
        onAction={() => setShowLessonForm(!showLessonForm)}
      />

      {selectedCourseId && (
        <div className="card course-filter-banner">
          <p>
            Showing lessons for selected course.
          </p>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/teacher/lessons")}
          >
            Clear Course Filter
          </button>
        </div>
      )}
      {showLessonForm && (
        <form className="lesson-form" onSubmit={handleSubmit}>
          <h2>
            {editingLessonId ? "Edit Lesson" : "Create New Lesson"}
          </h2>

          <input
            type="text"
            name="title"
            placeholder="Lesson title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />

          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
          >
            <option value="">
              Select course / subject
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.title}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Lesson description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="video_url"
            placeholder="Video URL"
            value={formData.video_url}
            onChange={handleChange}
          />

          <input
            type="text"
            name="worksheet_url"
            placeholder="Worksheet URL"
            value={formData.worksheet_url}
            onChange={handleChange}
          />

          <label>
            <input
              type="checkbox"
              name="is_premium"
              checked={formData.is_premium}
              onChange={handleChange}
            />
            Premium lesson
          </label>

          <button
            className="btn btn-success"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? editingLessonId
                ? "Updating..."
                : "Creating..."
              : editingLessonId
                ? "Update Lesson"
                : "Create Lesson"}
          </button>

          {editingLessonId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancelEdit}
            disabled={submitting}
          >
            Cancel
          </button>
          )}
        </form>
      )}
      
      <div className="lesson-toolbar card">
        <div className="toolbar-search">
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Lessons</option>
            <option value="withQuiz">With Quiz</option>
            <option value="withoutQuiz">Without Quiz</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="titleAsc">Title A–Z</option>
            <option value="titleDesc">Title Z–A</option>
          </select>
        </div>
      </div>

      <div className="lesson-summary">
        <strong>{filteredLessons.length}</strong>{" "}
        {filteredLessons.length === 1 ? "lesson" : "lessons"} found
      </div>
      
      {loading ? (
        <div className="grid-auto">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="card lesson-card lesson-skeleton"
            >
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-short" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-medium" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredLessons.length === 0 ? (
            <EmptyState
              icon="📖"
              title="You haven’t created any lessons yet"
              description="Create your first lesson to begin adding videos, notes, quizzes, and learning resources."
              buttonText="+ Create Your First Lesson"
              onButtonClick={() => {
                handleCancelEdit();
                setShowLessonForm(true);

                setTimeout(() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }, 100);
              }}
            />
          ) : (
            <div className="grid-auto">
              {filteredLessons.map((lesson) => (
                <div key={lesson.id} className="card lesson-card">
                  <div className="lesson-card-header">
                    <h2>{lesson.title}</h2>
                    
                    <span className={`lesson-badge ${
                      lesson.is_premium ? "premium" : "free"
                      }`}
                    >
                      {lesson.is_premium ? "Premium" : "Free"}
                    </span>
                  </div>
                  <p className="lesson-topic">{lesson.topic}</p>

                  <p className="lesson-course">
                    <strong>Course:</strong>{" "}
                    {lesson.course_title || "Unassigned"}
                  </p>

                  <p className="lesson-description">
                    {lesson.description}
                  </p>

                  <div className="lesson-meta">
                    <span>
                      {lesson.quiz_question_count} Quiz Question
                      {lesson.quiz_question_count !== 1 ? "s" : ""}
                    </span>

                    <span
                      className={`lesson-status ${
                        lesson.quiz_question_count > 0
                          ? "ready"
                          : "pending"
                      }`}
                    >
                      {lesson.quiz_question_count > 0
                        ? "Quiz Ready"
                        : "No Quiz"}
                    </span>
                  </div>
                    
                  <div className="lesson-actions">

                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditClick(lesson)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteLesson(lesson)}
                    >
                      Delete
                    </button>

                    <button
                      className={
                        lesson.quiz_question_count > 0
                          ? "btn btn-primary"
                          : "btn btn-success"
                      }
                        onClick={() =>
                        navigate(`/teacher/lessons/${lesson.id}/quiz`)
                      }
                    >
                      {lesson.quiz_question_count > 0
                        ? "Manage Quiz"
                        : "Create Quiz"}
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <DeleteConfirmationModal
        open={Boolean(lessonToDelete)}
        title="Delete Lesson?"
        itemName={lessonToDelete?.title}
        warning="This action cannot be undone."
        confirmText="Delete Lesson"
        loading={deleting}
        onCancel={() => setLessonToDelete(null)}
        onConfirm={confirmDeleteLesson}
      />
    </section>
  );
}
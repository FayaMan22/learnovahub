import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function TeacherLessonsPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  const [editingLessonId, setEditingLessonId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    description: "",
    video_url: "",
    worksheet_url: "",
    is_premium: true,
  });

  function fetchTeacherLessons() {
    api
      .get("/teacher/lessons")
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchTeacherLessons();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (editingLessonId) {
      api
        .patch(
          `/teacher/lessons/${editingLessonId}`,
          formData
        )
        .then(() => {
          fetchTeacherLessons();
          handleCancelEdit();
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    api
      .post("/teacher/lessons", formData)
      .then(() => {
        fetchTeacherLessons();
        handleCancelEdit();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditClick(lesson) {
    setEditingLessonId(lesson.id);

    setFormData({
      title: lesson.title,
      topic: lesson.topic,
      description: lesson.description,
      video_url: lesson.video_url || "",
      worksheet_url: lesson.worksheet_url || "",
      is_premium: lesson.is_premium,
    });
  }

  function handleCancelEdit() {
    setEditingLessonId(null);

    setFormData({
      title: "",
      topic: "",
      description: "",
      video_url: "",
      worksheet_url: "",
      is_premium: true,
    });
  }

  function handleDeleteLesson(lessonId) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmDelete) {
      return;
    }

    api
      .delete(`/teacher/lessons/${lessonId}`)
      .then(() => {
        fetchTeacherLessons();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="page-section">
      <h1>My Lessons</h1>

      <form className="lesson-form card" onSubmit={handleSubmit}>
        <h2>Create Teacher Lesson</h2>

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

        <button className="btn btn-success" type="submit">
          {editingLessonId ? "Update Lesson" : "Create Lesson"}
        </button>

        {editingLessonId && (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleCancelEdit}
        >
          Cancel
        </button>
        )}
      </form>

        <div className="grid-auto">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="card lesson-card">
              <h2>{lesson.title}</h2>
              <p>{lesson.topic}</p>
              <p>{lesson.description}</p>
              <p>{lesson.is_premium ? "Premium" : "Free"}</p>
            <div className="lesson-actions">

              <button
                className="btn btn-primary"
                onClick={() => handleEditClick(lesson)}
              >
                Edit
              </button>

              <button
                className="btn btn-danger"
                onClick={() => handleDeleteLesson(lesson.id)}
              >
                Delete
              </button>

              <button
                className="btn btn-secondary"
                onClick={() =>
                  navigate(`/teacher/lessons/${lesson.id}/quiz`)
                }
              >
                Manage Quiz
              </button>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
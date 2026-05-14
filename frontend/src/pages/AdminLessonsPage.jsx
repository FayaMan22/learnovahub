import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function AdminLessonsPage() {

  const [lessons, setLessons] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    description: "",
    video_url: "",
    worksheet_url: "",
    is_premium: true,
  });

  const [editingLessonId, setEditingLessonId] = useState(null);
  const formRef = useRef(null);

  const fetchLessons = () => {
    axios
      .get("https://learnovahub.onrender.com/lessons")
      .then((response) => {
        setLessons(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleChange = (event) => {

    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmitLesson = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (editingLessonId) {
      axios
        .patch(
          `https://learnovahub.onrender.com/admin/lessons/${editingLessonId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          console.log("Lesson updated:", response.data);
          fetchLessons();
          handleCancelEdit();
        })
        .catch((error) => {
          console.log(error);
        });

      return;
    }

    axios
      .post(
        "https://learnovahub.onrender.com/admin/lessons",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        fetchLessons();

        setFormData({
          title: "",
          topic: "",
          description: "",
          video_url: "",
          worksheet_url: "",
          is_premium: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditClick = (lesson) => {
    setEditingLessonId(lesson.id);

    setFormData({
      title: lesson.title,
      topic: lesson.topic,
      description: lesson.description,
      video_url: lesson.video_url || "",
      worksheet_url: lesson.worksheet_url || "",
      is_premium: lesson.is_premium,
    });

    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleDeleteLesson = (lessonId) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lesson?"
    );
    if (!confirmDelete) {
      return;
    }
    axios
      .delete(
        `https://learnovahub.onrender.com/admin/lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        fetchLessons();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelEdit = () => {

    setEditingLessonId(null);

    setFormData({
      title: "",
      topic: "",
      description: "",
      video_url: "",
      worksheet_url: "",
      is_premium: true,
    });
  };

  return (
    <section className="admin-lessons-page page-section">

      <h1>Lesson Management</h1>

      <p>Create, update, and manage LearnovaHub lessons.</p>

      <form
        ref={formRef}
        className={`lesson-form card ${
          editingLessonId
          ? "edit-mode"
          : "create-mode"
        }`}
        onSubmit={handleSubmitLesson}
      >

        <h2>{editingLessonId ? "Edit Lesson" : "Create New Lesson"}</h2>

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

        <div className="lesson-actions">
          <button
            type="submit"
            className="btn btn-success"
          >
            {editingLessonId
            ? "Update Lesson"
            : "Create Lesson"}
          </button>

          {editingLessonId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleSubmitLesson}
            >
              Cancel
            </button>
          )}
        </div>

      </form>

      <div className="lessons-grid grid-auto">

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card card"
          >
            <h2>{lesson.title}</h2>

            <p>{lesson.topic}</p>

            <p>{lesson.description}</p>

            <p>
              Premium:
              {" "}
              {lesson.is_premium ? "Yes" : "No"}
            </p>

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

            </div>
          </div>
        ))}

      </div>

    </section>
  );
}
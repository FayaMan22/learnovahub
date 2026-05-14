import { useEffect, useState } from "react";
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

  const handleCreateLesson = (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

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

  return (
    <section className="admin-lessons-page">

      <h1>Lesson Management</h1>

      <p>Create, update, and manage LearnovaHub lessons.</p>

      <form
        className="lesson-form"
        onSubmit={handleCreateLesson}
      >

        <h2>Create New Lesson</h2>

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

        <button type="submit">
          Create Lesson
        </button>

      </form>

      <div className="lessons-grid">

        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="lesson-card"
          >
            <h2>{lesson.title}</h2>

            <p>{lesson.topic}</p>

            <p>{lesson.description}</p>

            <p>
              Premium:
              {" "}
              {lesson.is_premium ? "Yes" : "No"}
            </p>

            <button>Edit</button>
            <button
              onClick={() => handleDeleteLesson(lesson.id)}
            >
              Delete
            </button>
          </div>
        ))}

      </div>

    </section>
  );
}
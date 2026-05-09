import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [lessonData, setLessonData] = useState({
    title: "",
    topic: "",
    description: "",
    video_url: "",
    worksheet_url: "",
    is_premium: true,
  });

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    axios
      .get("https://learnovahub.onrender.com//admin/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => {
        console.log("Failed to fetch users");
      });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setLessonData({
      ...lessonData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("https://learnovahub.onrender.com//admin/lessons", lessonData)
      .then((response) => {
        setMessage(response.data.message);

        setLessonData({
          title: "",
          topic: "",
          description: "",
          video_url: "",
          worksheet_url: "",
          is_premium: true,
        });
      })
      .catch(() => {
        setMessage("Failed to create lesson");
      });
  }

  function activateSubscription(userId) {
    axios
      .patch(`https://learnovahub.onrender.com//admin/users/${userId}/subscription`, {
        is_subscribed: true,
        subscription_type: "monthly",
      })
      .then(() => {
        fetchUsers();
      })
      .catch(() => {
        console.log("Failed to update subscription");
      });
  }

  function deactivateSubscription(userId) {
    axios
      .patch(`https://learnovahub.onrender.com//admin/users/${userId}/subscription`, {
        is_subscribed: false,
        subscription_type: null,
      })
      .then(() => {
        fetchUsers();
      })
      .catch(() => {
        console.log("Failed to update subscription");
      });
  }

  return (
    <section className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-card">
        <h2>Create New Lesson</h2>

        {message && <p className="form-message">{message}</p>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Lesson Title"
            value={lessonData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="topic"
            placeholder="Topic"
            value={lessonData.topic}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Lesson Description"
            value={lessonData.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="video_url"
            placeholder="YouTube Video URL"
            value={lessonData.video_url}
            onChange={handleChange}
          />

          <input
            type="text"
            name="worksheet_url"
            placeholder="Worksheet URL"
            value={lessonData.worksheet_url}
            onChange={handleChange}
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="is_premium"
              checked={lessonData.is_premium}
              onChange={handleChange}
            />
            Premium Lesson
          </label>

          <button type="submit">Create Lesson</button>
        </form>
      </div>

      <div className="admin-card users-card">
        <h2>Manage Subscriptions</h2>

        {users.map((user) => (
          <div key={user.id} className="user-row">
            <div>
              <h3>{user.full_name}</h3>
              <p>{user.email}</p>
              <p>
                Status:{" "}
                {user.is_subscribed
                  ? `Subscribed (${user.subscription_type})`
                  : "Not Subscribed"}
              </p>
            </div>

            {user.is_subscribed ? (
              <button
                className="danger-btn"
                onClick={() => deactivateSubscription(user.id)}
              >
                Deactivate
              </button>
            ) : (
              <button onClick={() => activateSubscription(user.id)}>
                Activate Monthly
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
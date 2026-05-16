import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";



export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    link: "",
  });

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, []);

  function handleNotificationChange(e) {
    setNotificationData({
      ...notificationData,
      [e.target.name]: e.target.value,
    });
  }

  function handleNotificationSubmit(e) {
    e.preventDefault();

    api
      .post(
        "/admin/notifications",
        notificationData
      )
      .then((response) => {
        setMessage(response.data.message);

        setNotificationData({
          title: "",
          message: "",
          link: "",
        });
      })
      .catch(() => {
        setMessage("Failed to create notification");
      });
  } 

  function fetchUsers() {
    api
      .get("/admin/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch(() => {
        console.log("Failed to fetch users");
      });
  }

  function activateSubscription(userId) {
    api
      .patch(`/admin/users/${userId}/subscription`, {
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
    api
      .patch(`/admin/users/${userId}/subscription`, {
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

  function fetchAnalytics() {
    api
      .get("/admin/analytics")
      .then((response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <section className="admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-top-actions">

        <button
          className="preview-btn"
          onClick={() => navigate("/dashboard")}
        >
          View Learner Mode
        </button>

      </div>

      {analytics && (
        <div className="analytics-grid">
          <div className="analytics-card">
            <h2>{analytics.total_users}</h2>
            <p>Total Users</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.total_learners}</h2>
            <p>Total Learners</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.total_admins}</h2>
            <p>Total Admins</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.active_subscribers}</h2>
            <p>Active Subscribers</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.total_lessons}</h2>
            <p>Total Lessons</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.total_quiz_attempts}</h2>
            <p>Quiz Attempts</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.average_score}%</h2>
            <p>Average Quiz Score</p>
          </div>

          <div className="analytics-card">
            <h2>{analytics.successful_payments}</h2>
            <p>Successful Payments</p>
          </div>
        </div>
      )}

      <div className="admin-card">
        <h2>Create Announcement</h2>

        <form className="admin-form" onSubmit={handleNotificationSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Announcement Title"
            value={notificationData.title}
            onChange={handleNotificationChange}
            required
          />

          <textarea
            name="message"
            placeholder="Announcement Message"
            value={notificationData.message}
            onChange={handleNotificationChange}
            required
          />

          <input
            type="text"
            name="link"
            placeholder="Optional link e.g. /lessons/1/quiz"
            value={notificationData.link}
            onChange={handleNotificationChange}
          />

          <button type="submit">Post Announcement</button>
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
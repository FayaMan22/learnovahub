import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";



export default function AdminPage() {
  usePageTitle("Admin Dashboard");
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const announcementRef = useRef(null);
  const [message, setMessage] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    target_role: "all",
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
          target_role: "all",
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
      
      <div className="admin-card" ref={announcementRef}>
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

            <select
              name="target_role"
              value={notificationData.target_role}
              onChange={handleNotificationChange}
            >
              <option value="all">Everyone</option>
              <option value="learner">Learners</option>
              <option value="teacher">Teachers</option>
              <option value="admin">Admins</option>
            </select>

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
      </div>
      

      <div className="grid-auto">

        <div className="dashboard-card">
          <h2>User Management</h2>

          <p>
            Manage learners, subscriptions,
            progress, and course access.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/learners")}
          >
            Open Users
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Subscriptions</h2>

          <p>
            Monitor learner subscriptions
            and payment activity.
          </p>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/subscriptions")}
          >
            Manage Subscriptions
          </button>
        </div>

        <div className="dashboard-card">
          <h2>Announcements</h2>

          <p>
            Publish announcements and updates
            to learners and teachers.
          </p>

          <button
            className="btn btn-primary"
            onClick={() =>
              announcementRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            Create Announcement
          </button>
        </div>

      </div>

    </section>
  );
}
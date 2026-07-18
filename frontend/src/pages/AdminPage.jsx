import { useEffect, useRef, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/admin.css";
import DashboardStatCard from "../components/common/DashboardStatCard";
import {
  FaUsers,
  FaUserGraduate,
  FaUserShield,
  FaCreditCard,
  FaBook,
  FaClipboardCheck,
  FaChartLine,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import SystemHealthSummary from "../components/dashboard/SystemHealthSummary";
import QuickActionCard from "../components/dashboard/QuickActionCard";


export default function AdminPage() {
  usePageTitle("Admin Dashboard");
  const navigate = useNavigate();
  const announcementRef = useRef(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    target_role: "all",
    link: "",
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

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
        setMessageType("success");

        setNotificationData({
          title: "",
          message: "",
          target_role: "all",
          link: "",
        });
      })
      .catch(() => {
        setMessage("Failed to create notification");
        setMessageType("error");
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

  function fetchAnalytics() {
    setAnalyticsLoading(true);
    api
      .get("/admin/analytics")
      .then((response) => {
        setAnalytics(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setAnalyticsLoading(false);
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
      {analyticsLoading ? (
        <div className="analytics-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="stat-card-skeleton" />
          ))}
        </div>
      
      ) : (
        analytics && (
          <div className="analytics-grid">
            <DashboardStatCard
              title="Total Users"
              value={analytics.total_users}
              icon={<FaUsers />}
            />

            <DashboardStatCard
              title="Learners"
              value={analytics.total_learners}
              icon={<FaUserGraduate />}
            />

            <DashboardStatCard
              title="Admins"
              value={analytics.total_admins}
              icon={<FaUserShield />}
            />

            <DashboardStatCard
              title="Subscribers"
              value={analytics.active_subscribers}
              icon={<FaCreditCard />}
            />

            <DashboardStatCard
              title="Lessons"
              value={analytics.total_lessons}
              icon={<FaBook />}
            />

            <DashboardStatCard
              title="Quiz Attempts"
              value={analytics.total_quiz_attempts}
              icon={<FaClipboardCheck />}
            />

            <DashboardStatCard
              title="Average Score"
              value={`${analytics.average_score}%`}
              icon={<FaChartLine />}
            />

            <DashboardStatCard
              title="Payments"
              value={analytics.successful_payments}
              icon={<FaMoneyCheckAlt />}
            />
          </div>
        )
      )}

      <SystemHealthSummary />
      
      <div className="admin-card" ref={announcementRef}>
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

            {message && (
              <p className={`form-message ${messageType}`}>
                {message}
              </p>
            )}
          </form>
      </div>
      

      <div className="grid-auto">
        <QuickActionCard
          title="User Management"
          description="Manage learners, subscriptions, progress and course access."
          buttonText="Open Users"
          to="/admin/learners"
        />

        <QuickActionCard
          title="Subscriptions"
          description="Monitor learner subscriptions and payment activity."
          buttonText="Manage Subscriptions"
          to="/admin/subscriptions"
        />

        <QuickActionCard
          title="System Health"
          description="View platform health, services and configuration status."
          buttonText="Open System Health"
          to="/admin/system-health"
        />
      </div>

    </section>
  );
}
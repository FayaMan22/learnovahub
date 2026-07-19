import { useEffect, useState } from "react";
import api from "../api/api";
import TeacherDashboardHero from "../components/dashboard/TeacherDashboardHero";
import QuickActions from "../components/dashboard/QuickActions";
import AnalyticsGrid from "../components/dashboard/AnalyticsGrid";
import AttentionPanel from "../components/dashboard/AttentionPanel";
import RecentActivity from "../components/dashboard/RecentActivity";
import usePageTitle from "../hooks/usePageTitle";
import "../styles/teacher-dashboard.css";

export default function TeacherDashboardPage() {
  usePageTitle("Teacher Dashboard");

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 18) {
    greeting = "Good Afternoon";
  }

  useEffect(() => {
    api
      .get("/teacher/analytics")
      .then((response) => {
        setAnalytics(response.data);
      })
      .catch(() => {
        setError("Unable to load teacher dashboard.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="teacher-dashboard">
        <p>Loading dashboard...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="teacher-dashboard">
        <p className="dashboard-error">{error}</p>
      </section>
    );
  }

  return (
    <section className="teacher-dashboard">
      <TeacherDashboardHero
        greeting={greeting}
        analytics={analytics}
      />

      <AnalyticsGrid
        analytics={analytics}
      />

      <QuickActions />

      <AttentionPanel 
        analytics={analytics} 
      />

      <RecentActivity 
        analytics={analytics} 
      />

    </section>
  );
}
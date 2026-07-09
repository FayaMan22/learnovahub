import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import DashboardHero from "../components/dashboard/DashboardHero";
import QuickActions from "../components/dashboard/QuickActions";
import AnalyticsGrid from "../components/dashboard/AnalyticsGrid";
import AttentionPanel from "../components/dashboard/AttentionPanel";
import RecentActivity from "../components/dashboard/RecentActivity";

export default function TeacherDashboardPage() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);

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
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <section className="page-section">
      <DashboardHero
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
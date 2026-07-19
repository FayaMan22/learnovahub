import DashboardStatCard from "../common/DashboardStatCard";

import {
  FaBook,
  FaClipboardList,
  FaUserGraduate,
  FaTasks,
  FaClock,
  FaCheckCircle,
  FaChartLine,
} from "react-icons/fa";

export default function AnalyticsGrid({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="analytics-grid">

      <DashboardStatCard
        title="My Courses"
        value={analytics.total_courses}
        icon={<FaBook />}
      />

      <DashboardStatCard
        title="My Lessons"
        value={analytics.total_lessons}
        icon={<FaClipboardList />}
      />

      <DashboardStatCard
        title="Learners"
        value={analytics.total_learners}
        icon={<FaUserGraduate />}
      />

      <DashboardStatCard
        title="Assignments"
        value={analytics.total_assignments}
        icon={<FaTasks />}
      />

      <DashboardStatCard
        title="Pending"
        value={analytics.pending_marking}
        icon={<FaClock />}
      />

      <DashboardStatCard
        title="Marked"
        value={analytics.marked_submissions}
        icon={<FaCheckCircle />}
      />

      <DashboardStatCard
        title="Average Score"
        value={`${analytics.average_score}%`}
        icon={<FaChartLine />}
      />

    </div>
  );
}
import AnalyticsCard from "./AnalyticsCard";

export default function AnalyticsGrid({ analytics }) {
  if (!analytics) return null;

  return (
    <div className="analytics-grid">

      <AnalyticsCard
        icon="📚"
        value={analytics.total_courses}
        label="My Courses"
      />

      <AnalyticsCard
        icon="📖"
        value={analytics.total_lessons}
        label="My Lessons"
      />

      <AnalyticsCard
        icon="👨‍🎓"
        value={analytics.total_learners}
        label="My Learners"
      />

      <AnalyticsCard
        icon="📝"
        value={analytics.total_assignments}
        label="Assignments"
      />

      <AnalyticsCard
        icon="⏳"
        value={analytics.pending_marking}
        label="Pending Marking"
      />

      <AnalyticsCard
        icon="⭐"
        value={`${analytics.average_score}%`}
        label="Average Score"
      />

    </div>
  );
}
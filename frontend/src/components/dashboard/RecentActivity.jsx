export default function RecentActivity({ analytics }) {
  if (!analytics) return null;

  const activities = [];

  if (analytics.pending_marking > 0) {
    activities.push({
      icon: "📝",
      message: `${analytics.pending_marking} assignment submission${
        analytics.pending_marking === 1 ? "" : "s"
      } awaiting marking.`,
    });
  }

  if (analytics.total_assignments > 0) {
    activities.push({
      icon: "📚",
      message: `${analytics.total_assignments} assignment${
        analytics.total_assignments === 1 ? "" : "s"
      } available across your courses.`,
    });
  }

  if (analytics.total_learners > 0) {
    activities.push({
      icon: "👨‍🎓",
      message: `${analytics.total_learners} learner${
        analytics.total_learners === 1 ? "" : "s"
      } enrolled in your courses.`,
    });
  }

  if (analytics.average_score > 0) {
    activities.push({
      icon: "⭐",
      message: `Average learner score is ${analytics.average_score}%.`,
    });
  }

  return (
    <div className="dashboard-section">
      <h2 className="dashboard-section-title">
        Recent Activity
      </h2>

      <div className="attention-panel">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="attention-item"
          >
            <span>{activity.icon}</span>

            <p>{activity.message}</p>
          </div>
        ))}

      </div>
    </div>
  );
}
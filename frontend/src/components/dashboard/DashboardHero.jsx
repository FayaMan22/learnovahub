export default function DashboardHero({ greeting, analytics }) {
  return (
    <div className="teacher-dashboard-hero">
      <div>
        <h1>{greeting}, Teacher 👋</h1>

        <p>
          Welcome back to LearnovaHub. Here's what's happening
          in your classroom today.
        </p>
      </div>

      {analytics && (
        <div className="dashboard-highlight">
          <span>Pending Marking</span>

          <h2>{analytics.pending_marking}</h2>

          <p>
            {analytics.pending_marking === 1
              ? "Submission awaiting review"
              : "Submissions awaiting review"}
          </p>
        </div>
      )}
    </div>
  );
}
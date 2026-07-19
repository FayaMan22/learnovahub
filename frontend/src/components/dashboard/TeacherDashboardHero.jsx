import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboardHero({ greeting, analytics }) {
  const { user } = useAuth();
  
  return (
    <div className="teacher-dashboard-hero">
      <div>
        <h1>{greeting}, {user?.full_name} 👋</h1>

        <span className="role-badge">
          Teacher Dashboard
        </span>

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
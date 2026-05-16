export default function TeacherDashboardPage() {
  return (
    <section className="page-section">
      <h1>Teacher Dashboard</h1>

      <p>
        Manage your subjects, lessons, videos, quizzes, and learner progress.
      </p>

      <div className="grid-auto">
        <div className="card">
          <h2>My Lessons</h2>
          <p>Create and manage your own lessons.</p>
        </div>

        <div className="card">
          <h2>My Learners</h2>
          <p>Track learners enrolled in your subjects.</p>
        </div>

        <div className="card">
          <h2>My Quizzes</h2>
          <p>Create and review assessments.</p>
        </div>
      </div>
    </section>
  );
}
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-section">

      <h2 className="dashboard-section-title">
        Quick Actions
      </h2>

      <div className="grid-auto">

        <div className="dashboard-card">
          <h3>Create Course</h3>

          <p>
            Add a new course to your teaching catalogue.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/teacher/courses")}
          >
            Manage Courses
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Create Lesson</h3>

          <p>
            Build and organise lessons for your courses.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/teacher/lessons")}
          >
            Manage Lessons
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Create Assignment</h3>

          <p>
            Assess learner understanding with assignments.
          </p>

          <button
            className="btn btn-success"
            onClick={() => navigate("/teacher/assignments")}
          >
            Manage Assignments
          </button>
        </div>

        <div className="dashboard-card">
          <h3>My Learners</h3>

          <p>
            View learner progress and engagement.
          </p>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/teacher/learners")}
          >
            View Learners
          </button>
        </div>

      </div>

    </div>
  );
}
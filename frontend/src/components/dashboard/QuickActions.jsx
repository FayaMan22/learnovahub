import { faBookOpen, faChalkboardTeacher, faFileAlt, faUsers } from "@fortawesome/free-solid-svg-icons";

import QuickActionCard from "./QuickActionCard";

export default function QuickActions() {
  return (
    <section className="dashboard-section">
      <h2 className="dashboard-section-title">Quick Actions</h2>

      <div className="grid-auto">
        <QuickActionCard
          title="Manage Courses"
          description="Add and organise courses in your teaching catalogue."
          icon={faChalkboardTeacher}
          buttonText="Manage Courses"
          to="/teacher/courses"
        />

        <QuickActionCard
          title="Manage Lessons"
          description="Build and organise lessons for your courses."
          icon={faBookOpen}
          buttonText="Manage Lessons"
          to="/teacher/lessons"
        />

        <QuickActionCard
          title="Manage Assignments"
          description="Create assignments and review learner submissions."
          icon={faFileAlt}
          buttonText="Manage Assignments"
          to="/teacher/assignments"
        />

        <QuickActionCard
          title="View Learners"
          description="Monitor learner progress and engagement."
          icon={faUsers}
          buttonText="View Learners"
          to="/teacher/learners"
        />
      </div>
    </section>
  );
} 
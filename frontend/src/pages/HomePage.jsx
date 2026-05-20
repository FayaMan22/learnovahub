import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <h1>Learn Smarter with LearnovaHub</h1>

          <p>
            Explore teacher-led online courses with video lessons,
            quizzes, worksheets, progress tracking, and learning
            support across different subjects.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/courses")}>
              Browse Courses
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/register")}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
            alt="Students learning"
          />
        </div>
      </section>

      <section className="features">
        <h2>Why Choose LearnovaHub?</h2>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Teacher-Led Courses</h3>
            <p>
              Learn through structured courses created by teachers
              across different subjects and grades.
            </p>
          </div>

          <div className="feature-card">
            <h3>Video Lessons & Resources</h3>
            <p>
              Access lessons, worksheets, revision materials, and
              learning content in one organized space.
            </p>
          </div>

          <div className="feature-card">
            <h3>Quizzes & Progress Tracking</h3>
            <p>
              Test your understanding, complete lessons, and monitor
              your learning progress over time.
            </p>
          </div>
        </div>
      </section>

      <section className="subjects">
        <h2>Built for Learners and Teachers</h2>

        <div className="feature-grid">
          <div className="subject-card">
            <h3>For Learners</h3>
            <p>
              Enroll in courses, follow lessons step by step, attempt
              quizzes, and continue learning from your dashboard.
            </p>
          </div>

          <div className="subject-card">
            <h3>For Teachers</h3>
            <p>
              Create courses, upload lessons, manage quizzes, and track
              learner progress from a dedicated teacher dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Start Your Learning Journey Today</h2>

        <p>
          Join LearnovaHub and access organized online courses built
          to support learning, teaching, and progress tracking.
        </p>

        <button onClick={() => navigate("/courses")}>
          View Available Courses
        </button>
      </section>
    </>
  );
}
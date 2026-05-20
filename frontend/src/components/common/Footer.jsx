import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-grid">

        <div>
          <h2>LearnovaHub</h2>

          <p>
            Empowering learners and teachers
            through structured online learning.
          </p>
        </div>

        <div>
          <h3>Quick Links</h3>

          <Link to="/courses">Courses</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div>
          <h3>Platform</h3>

          <p>Teacher-Led Courses</p>
          <p>Quizzes & Worksheets</p>
          <p>Progress Tracking</p>
          <p>Role-Based Learning</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 LearnovaHub. All rights reserved.
        </p>
      </div>

    </footer>
  );
}
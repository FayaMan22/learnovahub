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
          <p>Email: support@learnovahub.co.za</p>
          <p>Website: www.learnovahub.co.za</p>
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

        <div>
          <h3>Legal</h3>

          <Link to="/terms">
            Terms & Conditions
          </Link>

          <Link to="/refund-policy">
            Refund Policy
          </Link>

          <Link to="/cancellation-policy">
            Cancellation Policy
          </Link>

          <Link to="/service-delivery">
            Service Delivery Policy
          </Link>
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
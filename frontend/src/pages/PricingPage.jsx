import api from "../api/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

export default function PricingPage() {
  usePageTitle("Pricing");
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { token } = useAuth();

  const courseId = searchParams.get("course");

  async function handleSubscriptionPayment() {
    if (!token) {
      alert("Please login first before subscribing.");
      navigate("/login");
      return;
    }

    if (!courseId) {
      alert("No course selected. Please choose a course first.");
      navigate("/courses");
      return;
    }

    try {
      const response = await api.post(
        "/payments/payfast-data",
        {
          amount: 149,
          subscription_type: "monthly",
          course_id: Number(courseId),
        }
      );

      const { payfast_url, payfast_data } = response.data;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = payfast_url;

      Object.entries(payfast_data).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;

        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.log(error);
      alert("Failed to start PayFast payment.");
    }
  }

  function handleFreePreview() {
    if (courseId) {
      navigate(`/courses/${courseId}`);
      return;
    }

    navigate("/courses");
  }

  return (
    <section className="pricing-page">
      <h1>Choose Your Learning Plan</h1>

      <p className="pricing-intro">
        Unlock structured lessons, quizzes, assignments, worksheets,
        and revision support for your selected course.
      </p>

      {courseId && (
        <button
          className="btn btn-secondary back-btn"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          ← Back to Course
        </button>
      )}

      <div className="pricing-grid">
        <div className="pricing-card">
          <h2>Free Preview</h2>
          <h3>R0</h3>
          <p>Explore the course before subscribing.</p>

          <ul>
            <li>View course overview</li>
            <li>Preview selected lessons</li>
            <li>See assignments and learning outcomes</li>
          </ul>

          <button onClick={handleFreePreview}>
            Back to Course
          </button>
        </div>

        <div className="pricing-card featured-plan">
          <h2>Monthly Access</h2>
          <h3>R149 / month</h3>
          <p>
            Get full access to the selected course and continue
            learning at your own pace.
          </p>

          <ul>
            <li>All course lessons</li>
            <li>Interactive quizzes</li>
            <li>Teacher-created assignments</li>
            <li>Progress tracking</li>
            <li>Learner support</li>
          </ul>

          <button onClick={handleSubscriptionPayment}>
            Subscribe and Continue
          </button>
        </div>

        <div className="pricing-card">
          <h2>Exam Booster</h2>
          <h3>R299 once-off</h3>
          <p>Focused revision for tests and exams.</p>

          <ul>
            <li>Exam-style questions</li>
            <li>Revision videos</li>
            <li>Practice tests</li>
            <li>Memo explanations</li>
          </ul>

          <button
            onClick={() =>
              alert("Exam Booster package coming soon.")
            }
          >
            Coming Soon
          </button>
        </div>
      </div>
    </section>
  );
}
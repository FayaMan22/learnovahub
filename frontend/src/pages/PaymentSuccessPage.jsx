import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const courseId = searchParams.get("course");

  function handleContinue() {
    if (courseId) {
      navigate(`/courses/${courseId}`);
      return;
    }

    navigate("/my-courses");
  }

  return (
    <section className="page-section">
      <div className="card success-card">
        <h1>Payment Successful</h1>

        <p>
          Thank you. Your payment has been received and your course
          access is being activated.
        </p>

        <button
          className="btn btn-success"
          onClick={handleContinue}
        >
          Continue to Course
        </button>
      </div>
    </section>
  );
}
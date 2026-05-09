export default function PricingPage() {
  return (
    <section className="pricing-page">
      <h1>Choose Your Learning Plan</h1>
      <p className="pricing-intro">
        Start with Grade 9 Mathematics and unlock structured lessons,
        quizzes, worksheets, and revision support.
      </p>

      <div className="pricing-grid">
        <div className="pricing-card">
          <h2>Free Preview</h2>
          <h3>R0</h3>
          <p>Try selected lessons before joining.</p>

          <ul>
            <li>Limited video lessons</li>
            <li>Sample worksheets</li>
            <li>Basic topic previews</li>
          </ul>

          <button>Start Free</button>
        </div>

        <div className="pricing-card featured-plan">
          <h2>Grade 9 Maths</h2>
          <h3>R149 / month</h3>
          <p>Full access to Grade 9 Mathematics content.</p>

          <ul>
            <li>All video lessons</li>
            <li>Interactive quizzes</li>
            <li>Downloadable worksheets</li>
            <li>Revision exercises</li>
            <li>Learner support</li>
          </ul>

          <button>Join Now</button>
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

          <button>Get Booster</button>
        </div>
      </div>
    </section>
  );
}
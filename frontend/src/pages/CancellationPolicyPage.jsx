import usePageTitle from "../hooks/usePageTitle";

export default function CancellationPolicyPage() {
  usePageTitle("Cancellation");
  return (
    <section className="page-section legal-page">
      <div className="card legal-card">
        <h1>Cancellation Policy</h1>

        <p>
          Learners may cancel their LearnovaHub subscription or course access
          request according to the conditions below.
        </p>

        <h2>Monthly Subscriptions</h2>
        <p>
          Monthly subscriptions may be cancelled at any time. Cancellation stops
          future billing but does not automatically refund payments already
          processed.
        </p>

        <h2>Course Access</h2>
        <p>
          Once payment is confirmed, access to the selected course is activated.
          Learners remain responsible for managing their subscription status.
        </p>

        <h2>How to Cancel</h2>
        <p>
          To request cancellation support, contact support@learnovahub.co.za.
        </p>

        <h2>Important Note</h2>
        <p>
          Cancellation does not remove access immediately unless required by the
          platform or payment agreement. Access may remain active until the end
          of the paid billing period.
        </p>
      </div>
    </section>
  );
}
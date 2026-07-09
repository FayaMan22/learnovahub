import usePageTitle from "../hooks/usePageTitle";

export default function ServiceDeliveryPage() {
  usePageTitle("Service Delivery");
  return (
    <section className="page-section legal-page">
      <div className="card legal-card">
        <h1>Service Delivery Policy</h1>

        <p>
          LearnovaHub delivers educational services digitally through its online
          learning platform.
        </p>

        <h2>Delivery Method</h2>
        <p>
          Courses, lessons, assignments, quizzes, worksheets, and learning
          resources are delivered online through the LearnovaHub website.
        </p>

        <h2>Access Time</h2>
        <p>
          Access to paid courses is normally granted immediately after
          successful payment confirmation. In some cases, activation may take up
          to 24 hours.
        </p>

        <h2>No Physical Delivery</h2>
        <p>
          LearnovaHub does not deliver physical products. All services are
          provided digitally.
        </p>

        <h2>Technical Requirements</h2>
        <p>
          Learners need internet access and a suitable device such as a phone,
          tablet, laptop, or desktop computer.
        </p>

        <h2>Support</h2>
        <p>
          For delivery or access issues, contact support@learnovahub.co.za.
        </p>
      </div>
    </section>
  );
}
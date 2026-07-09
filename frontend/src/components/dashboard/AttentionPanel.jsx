export default function AttentionPanel({ analytics }) {
  if (!analytics) return null;

  const attentionItems = [];

  if (analytics.pending_marking > 0) {
    attentionItems.push({
      icon: "🔴",
      title: "Submissions awaiting marking",
      message: `${analytics.pending_marking} submission${
        analytics.pending_marking === 1 ? "" : "s"
      } need your review.`,
    });
  }

  if (analytics.total_assignments === 0) {
    attentionItems.push({
      icon: "🟡",
      title: "No assignments created",
      message: "Create assignments to assess learner understanding.",
    });
  }

  if (analytics.total_learners === 0) {
    attentionItems.push({
      icon: "🟡",
      title: "No learners enrolled yet",
      message: "Share your course link or create a free course to test enrolment.",
    });
  }

  if (attentionItems.length === 0) {
    attentionItems.push({
      icon: "🟢",
      title: "Everything looks good",
      message: "No urgent teacher actions at the moment.",
    });
  }

  return (
    <div className="dashboard-section attention-panel">
      <h2 className="dashboard-section-title">
        Needs Your Attention
      </h2>

      <div className="attention-list">
        {attentionItems.map((item, index) => (
          <div key={index} className="attention-item">
            <span>{item.icon}</span>

            <div>
              <h3>{item.title}</h3>
              <p>{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
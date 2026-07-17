export default function HealthSummary({ summary }) {
  if (!summary) {
    return null;
  }

  const summaryItems = [
    {
      label: "Total checks",
      value: summary.total,
      className: "health-summary__item--total",
    },
    {
      label: "Passed",
      value: summary.passed,
      className: "health-summary__item--pass",
    },
    {
      label: "Warnings",
      value: summary.warnings,
      className: "health-summary__item--warning",
    },
    {
      label: "Failed",
      value: summary.failed,
      className: "health-summary__item--fail",
    },
  ];

  return (
    <section className="health-summary" aria-label="System health summary">
      {summaryItems.map((item) => (
        <article
          key={item.label}
          className={`health-summary__item ${item.className}`}
        >
          <p className="health-summary__label">
            {item.label}
          </p>

          <p className="health-summary__value">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}
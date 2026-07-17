export default function OverallStatus({ status, checkedAt }) {
  const statusConfig = {
    pass: {
      label: "All systems operational",
      symbol: "✓",
    },
    warning: {
      label: "Some services require attention",
      symbol: "!",
    },
    fail: {
      label: "A critical service has failed",
      symbol: "×",
    },
  };

  const currentStatus = statusConfig[status] || {
    label: "System status unavailable",
    symbol: "?",
  };

  const formattedCheckedAt = checkedAt
    ? new Date(checkedAt).toLocaleString()
    : "Not available";

  return (
    <section className={`system-status system-status--${status || "unknown"}`}>
      <div className="system-status__icon" aria-hidden="true">
        {currentStatus.symbol}
      </div>

      <div className="system-status__content">
        <p className="system-status__eyebrow">
          Overall platform status
        </p>

        <h2>{currentStatus.label}</h2>

        <p className="system-status__time">
          Last checked: {formattedCheckedAt}
        </p>
      </div>
    </section>
  );
}
export default function HealthCheckCard({ check }) {
  if (!check) {
    return null;
  }

  const statusLabels = {
    pass: "Passed",
    warning: "Warning",
    fail: "Failed",
  };

  const statusLabel =
    statusLabels[check.status] || "Unknown";

  return (
    <article
      className={`health-check-card health-check-card--${
        check.status || "unknown"
      }`}
    >
      <div className="health-check-card__header">
        <div>
          <p className="health-check-card__type">
            {check.check_type === "connectivity"
              ? "Live Connectivity"
              : check.check_type === "configuration"
                ? "Configuration"
                : "System Check"}
          </p>

          <h3 className="health-check-card__title">
            {check.service}
          </h3>
        </div>

        <span
          className={`health-check-card__status health-check-card__status--${
            check.status || "unknown"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="health-check-card__message">
        {check.message}
      </p>

      {check.response_time_ms !== null && 
        check.response_time_ms !== undefined && (
          <p className="health-check-card__response-time">
            Response time: {check.response_time_ms} ms
          </p>
      )}
    </article>
  );
}
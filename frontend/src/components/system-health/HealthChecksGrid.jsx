import HealthCheckCard from "./HealthCheckCard";

export default function HealthChecksGrid({ checks }) {
  if (!checks || checks.length === 0) {
    return (
      <section className="health-checks">
        <div className="health-checks__empty">
          <h2>No health checks available</h2>

          <p>
            The platform did not return any service health information.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="health-checks"
      aria-labelledby="health-checks-title"
    >
      <div className="health-checks__header">
        <div>
          <p className="health-checks__eyebrow">
            Platform services
          </p>

          <h2 id="health-checks-title">
            Service health checks
          </h2>
        </div>

        <p className="health-checks__count">
          {checks.length}{" "}
          {checks.length === 1 ? "service" : "services"}
        </p>
      </div>

      <div className="health-checks__grid">
        {checks.map((check) => (
          <HealthCheckCard
            key={check.id || check.service}
            check={check}
          />
        ))}
      </div>
    </section>
  );
}
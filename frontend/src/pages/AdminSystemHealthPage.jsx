import HealthChecksGrid from "../components/system-health/HealthChecksGrid";
import HealthSummary from "../components/system-health/HealthSummary";
import OverallStatus from "../components/system-health/OverallStatus";
import usePageTitle from "../hooks/usePageTitle";
import useSystemHealth from "../hooks/useSystemHealth";
import "../styles/system-health.css";

export default function AdminSystemHealthPage() {
  usePageTitle("System Health");

  const {
    health,
    loading,
    refreshing,
    error,
    lastUpdated,
    refreshHealth,
  } = useSystemHealth();

  if (loading) {
    return (
      <main className="admin-system-health-page">
        <section className="system-health-state">
          <h1>System Health</h1>

          <p>
            Checking LearnovaHub services...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="admin-system-health-page">
        <section className="system-health-state system-health-state--error">
          <h1>System Health</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={refreshHealth}
            disabled={refreshing}
            className="system-health-refresh-button"
          >
            {refreshing ? "Refreshing..." : "Refresh checks"}
          </button>
        </section>
      </main>
    );
  }

  if (!health) {
    return (
      <main className="admin-system-health-page">
        <section className="system-health-state">
          <h1>System Health</h1>

          <p>
            No system health information is available.
          </p>

          <button
            type="button"
            onClick={refreshHealth}
            disabled={refreshing}
            className="system-health-refresh-button"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-system-health-page">
      <header className="system-health-page-header">
        <div>
          <p className="system-health-page-header__eyebrow">
            Admin monitoring
          </p>

          <h1>System Health</h1>

          <p className="system-health-page-header__description">
            Monitor the availability and configuration of
            LearnovaHub platform services.
          </p>
        </div>

        <button
          type="button"
          onClick={refreshHealth}
          disabled={refreshing}
          className="system-health-refresh-button"
        >
          {refreshing ? "Refreshing..." : "Refresh checks"}
        </button>

        <p className="last-updated">
          Last updated:{" "}
          {lastUpdated
            ? lastUpdated.toLocaleTimeString()
            : "--"}
        </p>
      </header>

      <OverallStatus
        status={health.overall_status}
        checkedAt={health.checked_at}
      />

      <HealthSummary summary={health.summary} />

      <HealthChecksGrid checks={health.checks} />
    </main>
  );
}
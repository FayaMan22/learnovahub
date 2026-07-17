import { useNavigate } from "react-router-dom";
import useSystemHealth from "../../hooks/useSystemHealth";

import OverallStatus from "../system-health/OverallStatus";
import HealthSummary from "../system-health/HealthSummary";

export default function SystemHealthSummary() {
  const navigate = useNavigate();

  const {
    health,
    loading,
    error,
  } = useSystemHealth();

  if (loading) return null;
  if (error || !health) return null;

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h2>System Health</h2>

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/admin/system-health")}
        >
          View Details
        </button>
      </div>

      <OverallStatus overall={health.overall} />

      <HealthSummary checks={health.checks} />
    </section>
  );
}
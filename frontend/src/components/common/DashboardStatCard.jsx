import "./DashboardStatCard.css";

export default function DashboardStatCard({
  title,
  value,
  icon,
  color = "",
}) {
  return (
    <div className={`dashboard-stat-card ${color}`}>
      <div className="dashboard-stat-icon">
        {icon}
      </div>

      <div className="dashboard-stat-content">
        <h2>{value}</h2>
        <p>{title}</p>
      </div>
    </div>
  );
}
export default function AnalyticsCard({ icon, value, label }) {
  return (
    <div className="analytics-card">
      <span>{icon}</span>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}
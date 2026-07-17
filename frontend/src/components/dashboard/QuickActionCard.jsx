import { Link } from "react-router-dom";

export default function QuickActionCard({
  title,
  description,
  buttonText,
  to,
}) {
  return (
    <div className="dashboard-card">
      <h2>{title}</h2>

      <p>{description}</p>

      <Link to={to} className="btn btn-primary">
        {buttonText}
      </Link>
    </div>
  );
}
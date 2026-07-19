import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function QuickActionCard({
  title,
  description,
  icon,
  buttonText,
  to,
}) {
  return (
    <article className="dashboard-card quick-action-card">
      {icon && (
        <div className="quick-action-icon-wrapper">
          <FontAwesomeIcon icon={icon} className="quick-action-icon" />
        </div>
      )}

      <h3>{title}</h3>

      <p>{description}</p>

      <Link to={to} className="btn btn-primary quick-action-button">
        {buttonText}
      </Link>
    </article>
  );
}
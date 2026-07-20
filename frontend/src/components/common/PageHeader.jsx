import { useNavigate } from "react-router-dom";
import "./common.css";

export default function PageHeader({
  title,
  subtitle,
  backTo,
  backText = "Back",
  actionText,
  onAction,
}) {
  const navigate = useNavigate();

  return (
    <div className="common-page-header">
      <div>
        {backTo && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(backTo)}
          >
            ← {backText}
          </button>
        )}

        <h1>{title}</h1>

        {subtitle && <p>{subtitle}</p>}
      </div>

      {actionText && onAction && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
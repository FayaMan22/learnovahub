import "./common.css";

export default function EmptyState({
  icon = "📁",
  title,
  description,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="card common-empty-state">
      <div className="common-empty-icon">{icon}</div>

      <h2>{title}</h2>

      <p>{description}</p>

      {buttonText && onButtonClick && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={onButtonClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
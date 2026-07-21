import "./common.css";

export default function ResultsSummary({
  count,
  singularLabel = "item",
  pluralLabel = "items",
}) {
  return (
    <div className="common-results-summary">
      <strong>{count}</strong>{" "}
      {count === 1 ? singularLabel : pluralLabel} found
    </div>
  );
}
import "./common.css";

export default function ListToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
}) {
  return (
    <div className="card common-list-toolbar">
      <div className="common-toolbar-search">
        <input
          type="text"
          value={searchValue}
          placeholder={searchPlaceholder}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="common-toolbar-filters">
        {filters.map((filter, index) => (
          <select
            key={filter.name || index}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  );
}
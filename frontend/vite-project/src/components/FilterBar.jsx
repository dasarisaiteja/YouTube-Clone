const FILTERS = [
  'All', 'Web Development', 'JavaScript', 'Data Structures',
  'Music', 'Gaming', 'News', 'Sports', 'Movies', 'Live',
];

export default function FilterBar({ active, onSelect }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`filter-btn ${active === f ? 'active' : ''}`}
          onClick={() => onSelect(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
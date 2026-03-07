import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '🔥', label: 'Trending', path: '/?category=Trending' },
  { icon: '📺', label: 'Subscriptions', path: '/' },
];

const exploreItems = [
  { icon: '🎵', label: 'Music', path: '/?category=Music' },
  { icon: '🎮', label: 'Gaming', path: '/?category=Gaming' },
  { icon: '📰', label: 'News', path: '/?category=News' },
  { icon: '⚽', label: 'Sports', path: '/?category=Sports' },
  { icon: '🎬', label: 'Movies', path: '/?category=Movies' },
  { icon: '🔴', label: 'Live', path: '/?category=Live' },
];

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className={`sidebar ${isOpen ? '' : 'hidden'}`}>
      {items.map((item) => (
        <button
          key={item.label}
          className={`sidebar-item ${location.pathname + location.search === item.path ? 'active' : ''}`}
          onClick={() => navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}

      <hr className="sidebar-divider" />
      <p className="sidebar-section-title">Explore</p>

      {exploreItems.map((item) => (
        <button
          key={item.label}
          className="sidebar-item"
          onClick={() => navigate(item.path)}
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </aside>
  );
}
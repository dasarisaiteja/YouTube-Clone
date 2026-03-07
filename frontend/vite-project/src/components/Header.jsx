import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuClick}>☰</button>
        <Link to="/" className="header-logo">
          <span className="yt-icon">▶</span>
          <span>YouTube</span>
        </Link>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      <div className="header-right">
        {user ? (
          <div className="user-menu-wrapper">
            <div
              className="user-avatar"
              onClick={() => setDropdownOpen((p) => !p)}
              title={user.username}
            >
              {user.username[0].toUpperCase()}
            </div>
            {dropdownOpen && (
              <div className="user-dropdown">
                <p>{user.username}</p>
                <button onClick={() => { navigate('/channel/my'); setDropdownOpen(false); }}>
                  My Channel
                </button>
                <button onClick={() => { logout(); setDropdownOpen(false); }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="sign-in-btn" onClick={() => navigate('/login')}>
            👤 Sign In
          </button>
        )}
      </div>
    </header>
  );
}
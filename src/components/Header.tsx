import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    House,
    Crown,
    TrendUp,
    MagnifyingGlass,
    List,
    X,
    Microphone
} from '@phosphor-icons/react';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home', icon: <House size={18} weight="fill" /> },
        { path: '/dubindo', label: 'VIP', icon: <Crown size={18} weight="fill" /> },
        { path: '/trending', label: 'Trending', icon: <TrendUp size={18} weight="fill" /> },
        { path: '/latest', label: 'Sulih Suara', icon: <Microphone size={18} weight="fill" /> },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setIsSearchOpen(false);
        }
    };

    return (
        <header className="header glass">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                    <span className="logo-text">DRACINMU</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="desktop-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Search & Actions */}
                <div className="header-actions">
                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="desktop-search">
                        <MagnifyingGlass size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari drama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </form>

                    {/* Mobile Search Toggle */}
                    <button
                        className="mobile-search-btn"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Search"
                    >
                        <MagnifyingGlass size={20} weight="bold" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Bar */}
            {isSearchOpen && (
                <div className="mobile-search-bar">
                    <form onSubmit={handleSearch} className="mobile-search-form">
                        <MagnifyingGlass size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari drama..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            autoFocus
                        />
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="mobile-menu glass">
                    <nav className="mobile-nav">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            )}

            <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          z-index: 100;
          border-bottom: 1px solid var(--border-color);
        }

        .header-container {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          gap: 24px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: var(--radius-md);
          color: white;
        }

        .logo-text {
          letter-spacing: 1px;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }

        .nav-link.active {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .desktop-search {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }

        .desktop-search:focus-within {
          border-color: var(--primary);
        }

        .search-icon {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .search-input {
          width: 180px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.9rem;
          color: var(--text-primary);
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .mobile-search-btn,
        .menu-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          background: transparent;
          border: none;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .mobile-search-btn:hover,
        .menu-toggle:hover {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .mobile-search-bar {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: 12px 24px;
          background: var(--bg-secondary);
          border-bottom: 1px solid var(--border-color);
        }

        .mobile-search-form {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
        }

        .mobile-search-form .search-input {
          width: 100%;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          color: var(--text-primary);
          background: var(--bg-tertiary);
        }

        @media (max-width: 900px) {
          .desktop-nav {
            display: none;
          }

          .desktop-search {
            display: none;
          }

          .mobile-search-btn,
          .menu-toggle {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 16px;
          }

          .logo-text {
            display: none;
          }
        }
      `}</style>
        </header>
    );
}

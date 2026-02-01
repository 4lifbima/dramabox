import { Link, useLocation } from 'react-router-dom';
import { House, TrendUp, Clock, MagnifyingGlass, Crown } from '@phosphor-icons/react';

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: House },
        { path: '/trending', label: 'Trending', icon: TrendUp },
        { path: '/dubindo', label: 'VIP', icon: Crown },
        { path: '/latest', label: 'Terbaru', icon: Clock },
        { path: '/search', label: 'Cari', icon: MagnifyingGlass },
    ];

    return (
        <nav className="bottom-nav glass">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={24} weight={isActive ? 'fill' : 'regular'} />
                        <span className="nav-label">{item.label}</span>
                        {isActive && <span className="active-indicator"></span>}
                    </Link>
                );
            })}

            <style>{`
        .bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: calc(var(--bottom-nav-height) + var(--safe-bottom));
          padding-bottom: var(--safe-bottom);
          z-index: 100;
          border-top: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .bottom-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
          }
        }

        .nav-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex: 1;
          padding: 8px 0;
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }

        .nav-item:hover {
          color: var(--text-secondary);
        }

        .nav-item.active {
          color: var(--primary);
        }

        .nav-label {
          font-size: 0.65rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .active-indicator {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 3px;
          background: var(--primary);
          border-radius: 0 0 var(--radius-full) var(--radius-full);
        }
      `}</style>
        </nav>
    );
}

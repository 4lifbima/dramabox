import { Link } from 'react-router-dom';
import type { Drama } from '../types';

interface DramaCardProps {
    drama: Drama;
    size?: 'small' | 'medium' | 'large';
}

export default function DramaCard({ drama, size = 'medium' }: DramaCardProps) {
    const coverImage = drama.coverWap || drama.cover || '';

    return (
        <Link to={`/drama/${drama.bookId}`} className={`drama-card card ${size}`}>
            <div className="drama-card-image aspect-poster">
                <img
                    src={coverImage}
                    alt={drama.bookName}
                    loading="lazy"
                />
                {drama.corner && (
                    <span
                        className="drama-badge"
                        style={{ background: drama.corner.color || 'var(--primary)' }}
                    >
                        {drama.corner.name}
                    </span>
                )}
                {drama.playCount && (
                    <span className="play-count">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                        {drama.playCount}
                    </span>
                )}
                <div className="drama-overlay">
                    <button className="play-btn">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="drama-card-info">
                <h3 className="drama-title truncate">{drama.bookName}</h3>
                {drama.chapterCount && (
                    <p className="drama-episodes">{drama.chapterCount} Episode</p>
                )}
                {(drama.tags || drama.tagNames) && (
                    <div className="drama-tags">
                        {(drama.tags || drama.tagNames || []).slice(0, 2).map((tag, idx) => (
                            <span key={idx} className="tag">{tag}</span>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
        .drama-card {
          display: block;
          overflow: hidden;
          transition: all var(--transition-normal);
        }

        .drama-card:hover {
          transform: translateY(-8px);
        }

        .drama-card-image {
          position: relative;
          overflow: hidden;
          border-radius: var(--radius-lg);
          background: var(--bg-tertiary);
        }

        .drama-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-normal);
        }

        .drama-card:hover .drama-card-image img {
          transform: scale(1.05);
        }

        .drama-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          padding: 4px 8px;
          font-size: 0.65rem;
          font-weight: 600;
          color: white;
          border-radius: var(--radius-sm);
          z-index: 2;
        }

        .play-count {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          font-size: 0.7rem;
          font-weight: 500;
          color: white;
          background: rgba(0, 0, 0, 0.7);
          border-radius: var(--radius-sm);
          z-index: 2;
        }

        .drama-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .drama-card:hover .drama-overlay {
          opacity: 1;
        }

        .play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 56px;
          height: 56px;
          background: var(--primary);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .play-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-glow);
        }

        .drama-card-info {
          padding: 12px 4px 8px;
        }

        .drama-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .drama-episodes {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 6px;
        }

        .drama-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        /* Size Variants */
        .drama-card.small .drama-title {
          font-size: 0.8rem;
        }

        .drama-card.small .drama-card-info {
          padding: 8px 2px 4px;
        }

        .drama-card.large .drama-title {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .drama-card-info {
            padding: 8px 2px 4px;
          }

          .drama-title {
            font-size: 0.8rem;
          }

          .drama-episodes {
            font-size: 0.7rem;
          }

          .drama-tags {
            display: none;
          }

          .play-btn {
            width: 44px;
            height: 44px;
          }

          .play-btn svg {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
        </Link>
    );
}

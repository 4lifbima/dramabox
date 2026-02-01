import { Link } from 'react-router-dom';
import type { Drama } from '../types';

interface HeroSectionProps {
    drama: Drama | null;
    loading?: boolean;
}

export default function HeroSection({ drama, loading }: HeroSectionProps) {
    if (loading || !drama) {
        return (
            <section className="hero-section">
                <div className="hero-skeleton skeleton"></div>
            </section>
        );
    }

    const coverImage = drama.coverWap || drama.cover || '';

    return (
        <section className="hero-section">
            <div className="hero-backdrop">
                <img src={coverImage} alt="" />
                <div className="hero-gradient"></div>
            </div>

            <div className="hero-content container">
                <div className="hero-info slide-up">
                    {drama.corner && (
                        <span
                            className="hero-badge"
                            style={{ background: drama.corner.color || 'var(--primary)' }}
                        >
                            {drama.corner.name}
                        </span>
                    )}
                    <h1 className="hero-title">{drama.bookName}</h1>
                    <p className="hero-description line-clamp-3">{drama.introduction}</p>

                    <div className="hero-meta">
                        {drama.chapterCount && (
                            <span className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                {drama.chapterCount} Episode
                            </span>
                        )}
                        {drama.playCount && (
                            <span className="meta-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5,3 19,12 5,21" />
                                </svg>
                                {drama.playCount} Views
                            </span>
                        )}
                    </div>

                    {(drama.tags || drama.tagNames) && (
                        <div className="hero-tags">
                            {(drama.tags || drama.tagNames || []).slice(0, 4).map((tag, idx) => (
                                <span key={idx} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    <div className="hero-actions">
                        <Link to={`/watch/${drama.bookId}/0`} className="btn btn-primary btn-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                            Tonton Sekarang
                        </Link>
                        <Link to={`/drama/${drama.bookId}`} className="btn btn-secondary">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            Detail
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
        .hero-section {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: flex-end;
          margin-bottom: 40px;
          overflow: hidden;
        }

        .hero-skeleton {
          position: absolute;
          inset: 0;
        }

        .hero-backdrop {
          position: absolute;
          inset: 0;
        }

        .hero-backdrop img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        .hero-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            var(--bg-dark) 0%,
            rgba(10, 10, 10, 0.9) 30%,
            rgba(10, 10, 10, 0.5) 60%,
            rgba(10, 10, 10, 0.3) 100%
          );
        }

        .hero-content {
          position: relative;
          z-index: 1;
          padding-bottom: 60px;
        }

        .hero-info {
          max-width: 600px;
        }

        .hero-badge {
          display: inline-block;
          padding: 6px 14px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          border-radius: var(--radius-full);
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 16px;
          text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
        }

        .hero-description {
          font-size: 1rem;
          color: var(--text-secondary);
          margin-bottom: 16px;
          line-height: 1.6;
        }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .hero-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 24px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .btn-lg {
          padding: 14px 32px;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 60vh;
            margin-bottom: 24px;
          }

          .hero-content {
            padding-bottom: 40px;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .hero-description {
            font-size: 0.9rem;
            -webkit-line-clamp: 2;
          }

          .hero-meta {
            gap: 12px;
          }

          .meta-item {
            font-size: 0.8rem;
          }

          .hero-tags {
            display: none;
          }

          .hero-actions {
            flex-direction: column;
          }

          .btn-lg {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        </section>
    );
}

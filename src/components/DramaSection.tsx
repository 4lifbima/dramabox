import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CaretLeft, CaretRight, ArrowRight } from '@phosphor-icons/react';
import type { Drama } from '../types';
import DramaCard from './DramaCard';

interface DramaSectionProps {
    title: string;
    icon?: ReactNode;
    dramas: Drama[];
    viewMoreLink?: string;
    loading?: boolean;
}

export default function DramaSection({ title, icon, dramas, viewMoreLink, loading }: DramaSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    // Show skeleton when loading
    if (loading) {
        return (
            <section className="drama-section">
                <div className="section-header">
                    <div className="skeleton" style={{ width: 180, height: 28, borderRadius: 8 }}></div>
                </div>
                <div className="horizontal-scroll">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="drama-skeleton" style={{ width: 160, flexShrink: 0 }}>
                            <div className="skeleton" style={{ width: '100%', aspectRatio: '3/4', borderRadius: 12 }}></div>
                            <div className="skeleton" style={{ width: '80%', height: 16, marginTop: 12, borderRadius: 4 }}></div>
                            <div className="skeleton" style={{ width: '50%', height: 12, marginTop: 6, borderRadius: 4 }}></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    // Don't render if no dramas
    if (!dramas || dramas.length === 0) return null;

    return (
        <section className="drama-section fade-in">
            <div className="section-header">
                <h2 className="section-title">
                    {icon && <span className="section-icon">{icon}</span>}
                    {title}
                </h2>
                <div className="section-actions">
                    {viewMoreLink && (
                        <Link to={viewMoreLink} className="view-more">
                            Lihat Semua
                            <ArrowRight size={16} weight="bold" />
                        </Link>
                    )}
                    <div className="scroll-buttons">
                        <button onClick={() => scroll('left')} className="scroll-btn" aria-label="Scroll left">
                            <CaretLeft size={20} weight="bold" />
                        </button>
                        <button onClick={() => scroll('right')} className="scroll-btn" aria-label="Scroll right">
                            <CaretRight size={20} weight="bold" />
                        </button>
                    </div>
                </div>
            </div>
            <div ref={scrollRef} className="horizontal-scroll drama-scroll">
                {dramas.map((drama) => (
                    <div key={drama.bookId} className="drama-scroll-item">
                        <DramaCard drama={drama} />
                    </div>
                ))}
            </div>

            <style>{`
        .drama-section {
          margin-bottom: 40px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .section-icon {
          display: flex;
          align-items: center;
          color: var(--primary);
        }

        .section-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .view-more {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--primary);
          transition: all var(--transition-fast);
        }

        .view-more:hover {
          gap: 10px;
        }

        .scroll-buttons {
          display: flex;
          gap: 8px;
        }

        .scroll-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 50%;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .scroll-btn:hover {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .drama-scroll {
          margin: 0 -24px;
          padding: 0 24px;
        }

        .drama-scroll-item {
          flex-shrink: 0;
          width: 160px;
        }

        .drama-skeleton {
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .drama-section {
            margin-bottom: 32px;
          }

          .section-header {
            margin-bottom: 16px;
          }

          .section-title {
            font-size: 1.2rem;
          }

          .scroll-buttons {
            display: none;
          }

          .drama-scroll {
            margin: 0 -16px;
            padding: 0 16px;
            gap: 12px;
          }

          .drama-scroll-item {
            width: 130px;
          }
        }
      `}</style>
        </section>
    );
}

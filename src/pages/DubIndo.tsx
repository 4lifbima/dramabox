import { useState, useEffect } from 'react';
import { Microphone } from '@phosphor-icons/react';
import type { Drama } from '../types';
import { getDubIndo } from '../api';
import DramaCard from '../components/DramaCard';
import { DramaGridSkeleton } from '../components/Loading';

export default function DubIndo() {
    const [dramas, setDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);
    const [classify, setClassify] = useState<string>('terpopuler');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const classifyOptions = [
        { value: 'terpopuler', label: 'Terpopuler' },
        { value: 'terbaru', label: 'Terbaru' },
        { value: 'selesai', label: 'Selesai' },
    ];

    useEffect(() => {
        setDramas([]);
        setPage(1);
        setHasMore(true);
        fetchData(1, true);
    }, [classify]);

    const fetchData = async (pageNum: number, reset: boolean = false) => {
        setLoading(true);
        try {
            const response = await getDubIndo(classify, pageNum);
            const newDramas = response.data || [];

            if (reset) {
                setDramas(newDramas);
            } else {
                setDramas(prev => [...prev, ...newDramas]);
            }

            setHasMore(newDramas.length >= 10);
        } catch (error) {
            console.error('Failed to fetch dub indo:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchData(nextPage);
    };

    return (
        <div className="page-container container fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <span className="title-icon"><Microphone size={28} weight="fill" /></span>
                    Drama Dub Indonesia
                </h1>
                <p className="page-subtitle">Drama dengan dubbing bahasa Indonesia</p>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {classifyOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`filter-tab ${classify === option.value ? 'active' : ''}`}
                        onClick={() => setClassify(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {loading && dramas.length === 0 ? (
                <DramaGridSkeleton count={12} />
            ) : (
                <>
                    <div className="drama-grid">
                        {dramas.map((drama) => (
                            <DramaCard key={drama.bookId} drama={drama} />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="load-more">
                            <button
                                className="btn btn-secondary"
                                onClick={loadMore}
                                disabled={loading}
                            >
                                {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                            </button>
                        </div>
                    )}
                </>
            )}

            <style>{`
        .page-container {
          padding-top: 24px;
          padding-bottom: 40px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .title-icon {
          display: flex;
          align-items: center;
          color: var(--primary);
        }

        .page-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .filter-tab {
          padding: 10px 24px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .filter-tab:hover {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .filter-tab.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .load-more {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        @media (max-width: 768px) {
          .page-header {
            margin-bottom: 20px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-subtitle {
            font-size: 0.9rem;
          }

          .filter-tabs {
            margin-bottom: 24px;
          }

          .filter-tab {
            padding: 8px 18px;
            font-size: 0.85rem;
          }
        }
      `}</style>
        </div>
    );
}

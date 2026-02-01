import { useState, useEffect } from 'react';
import { Clock } from '@phosphor-icons/react';
import type { Drama } from '../types';
import { getLatest } from '../api';
import DramaCard from '../components/DramaCard';
import { DramaGridSkeleton } from '../components/Loading';

export default function Latest() {
    const [dramas, setDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await getLatest();
                setDramas(response.data || []);
            } catch (error) {
                console.error('Failed to fetch latest:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="page-container container fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <span className="title-icon"><Clock size={28} weight="fill" /></span>
                    Drama Terbaru
                </h1>
                <p className="page-subtitle">Drama yang baru dirilis</p>
            </div>

            {loading ? (
                <DramaGridSkeleton count={12} />
            ) : (
                <div className="drama-grid">
                    {dramas.map((drama) => (
                        <DramaCard key={drama.bookId} drama={drama} />
                    ))}
                </div>
            )}

            <style>{`
        .page-container {
          padding-top: 24px;
          padding-bottom: 40px;
        }

        .page-header {
          margin-bottom: 32px;
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

        @media (max-width: 768px) {
          .page-header {
            margin-bottom: 24px;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .page-subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
        </div>
    );
}

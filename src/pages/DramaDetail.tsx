import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Play,
    Plus,
    ShareNetwork,
    Star,
    Calendar,
    FilmStrip,
    Eye,
    SquaresFour
} from '@phosphor-icons/react';
import type { Drama, Episode } from '../types';
import { getTrending, getForYou, getAllEpisodes, getVip } from '../api';
import { LoadingPage } from '../components/Loading';
import DramaSection from '../components/DramaSection';

export default function DramaDetail() {
    const { bookId } = useParams<{ bookId: string }>();
    const navigate = useNavigate();
    const [drama, setDrama] = useState<Drama | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [relatedDramas, setRelatedDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            if (!bookId) return;

            try {
                // Fetch all data sources to find the drama
                const [trendingRes, forYouRes, vipRes, episodesRes] = await Promise.all([
                    getTrending().catch(() => ({ data: [] })),
                    getForYou().catch(() => ({ data: [] })),
                    getVip().catch(() => ({ data: [] })),
                    getAllEpisodes(bookId).catch(() => ({ data: [] })),
                ]);

                const allDramas = [
                    ...(Array.isArray(trendingRes.data) ? trendingRes.data : []),
                    ...(Array.isArray(forYouRes.data) ? forYouRes.data : []),
                    ...(Array.isArray(vipRes.data) ? vipRes.data : []),
                ];

                // Find the drama
                const foundDrama = allDramas.find(d => d.bookId === bookId);
                setDrama(foundDrama || null);
                setEpisodes(Array.isArray(episodesRes.data) ? episodesRes.data : []);

                // Set related dramas (exclude current)
                const uniqueDramas = allDramas.filter((d, i, arr) =>
                    arr.findIndex(x => x.bookId === d.bookId) === i && d.bookId !== bookId
                );
                setRelatedDramas(uniqueDramas.slice(0, 10));
            } catch (error) {
                console.error('Failed to fetch drama:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [bookId]);

    if (loading) {
        return <LoadingPage />;
    }

    const coverImage = drama?.coverWap || drama?.cover || '';
    const tags = drama?.tags || drama?.tagNames || [];

    const handleWatchNow = () => {
        navigate(`/watch/${bookId}/0`);
    };

    return (
        <div className="detail-page fade-in">
            <div className="container">
                <div className="detail-wrapper">
                    {/* Left Side - Cover & Actions */}
                    <div className="detail-left">
                        <div className="cover-wrapper">
                            {coverImage ? (
                                <img src={coverImage} alt={drama?.bookName || ''} className="cover-image" />
                            ) : (
                                <div className="cover-placeholder">
                                    <FilmStrip size={48} weight="light" />
                                </div>
                            )}
                            {drama?.corner && (
                                <span className="cover-badge" style={{ background: drama.corner.color || 'var(--primary)' }}>
                                    {drama.corner.name}
                                </span>
                            )}
                        </div>

                        <button onClick={handleWatchNow} className="btn-watch">
                            <Play size={20} weight="fill" />
                            NONTON SEKARANG
                        </button>

                        <button className="btn-action">
                            <Plus size={18} weight="bold" />
                            Add to Playlist
                        </button>

                        <button className="btn-action">
                            <ShareNetwork size={18} weight="bold" />
                            Bagikan
                        </button>
                    </div>

                    {/* Right Side - Info */}
                    <div className="detail-right">
                        <h1 className="drama-title">{drama?.bookName || 'Drama'}</h1>

                        <div className="drama-meta">
                            <span className="meta-badge star">
                                <Star size={14} weight="fill" />
                            </span>
                            <span className="meta-item">
                                <Calendar size={16} weight="regular" />
                                2024
                            </span>
                            <span className="meta-item">
                                <FilmStrip size={16} weight="regular" />
                                {drama?.chapterCount || episodes.length} Episode
                            </span>
                            <span className="meta-badge ongoing">ONGOING</span>
                            {drama?.playCount && (
                                <span className="meta-item">
                                    <Eye size={16} weight="regular" />
                                    {drama.playCount}
                                </span>
                            )}
                        </div>

                        {tags.length > 0 && (
                            <div className="drama-tags">
                                {tags.map((tag, idx) => (
                                    <span key={idx} className="tag-pill">{tag}</span>
                                ))}
                            </div>
                        )}

                        <div className="synopsis-section">
                            <h3 className="section-label">
                                <span className="label-bar"></span>
                                SINOPSIS
                            </h3>
                            <p className="synopsis-text">
                                {drama?.introduction || 'Tidak ada sinopsis tersedia.'}
                            </p>
                        </div>

                        <div className="episode-info-section">
                            <div className="episode-info-header">
                                <div>
                                    <span className="info-label">INFORMASI EPISODE</span>
                                    <h3 className="episode-count">Total {episodes.length} Episode</h3>
                                </div>
                                <Link to={`/watch/${bookId}/0`} className="view-episodes-btn">
                                    <SquaresFour size={20} weight="fill" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Dramas */}
                {relatedDramas.length > 0 && (
                    <div className="related-section">
                        <DramaSection
                            title="Drama Pilihan Lain"
                            dramas={relatedDramas}
                            loading={false}
                        />
                    </div>
                )}
            </div>

            <style>{`
        .detail-page {
          padding-top: 24px;
          padding-bottom: 60px;
          min-height: 100vh;
        }

        .detail-wrapper {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .detail-left {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .cover-wrapper {
          position: relative;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .cover-image {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
        }

        .cover-placeholder {
          width: 100%;
          aspect-ratio: 3/4;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          color: var(--text-muted);
        }

        .cover-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 12px;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          border-radius: var(--radius-sm);
          text-transform: uppercase;
        }

        .btn-watch {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px;
          font-size: 0.95rem;
          font-weight: 700;
          color: white;
          background: var(--primary);
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-watch:hover {
          background: var(--primary-hover);
          box-shadow: var(--shadow-glow);
          transform: translateY(-2px);
        }

        .btn-action {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-action:hover {
          background: var(--bg-card-hover);
          border-color: var(--primary);
        }

        .detail-right {
          padding-top: 8px;
        }

        .drama-title {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
          color: var(--text-primary);
        }

        .drama-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .meta-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
        }

        .meta-badge.star {
          background: #fbbf24;
          color: white;
        }

        .meta-badge.ongoing {
          width: auto;
          padding: 6px 12px;
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .drama-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }

        .tag-pill {
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-primary);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
        }

        .synopsis-section {
          margin-bottom: 28px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .label-bar {
          width: 4px;
          height: 20px;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .synopsis-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .episode-info-section {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          border: 1px solid var(--border-color);
        }

        .episode-info-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .info-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .episode-count {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-top: 4px;
        }

        .view-episodes-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: var(--primary-light);
          border-radius: var(--radius-md);
          color: var(--primary);
          transition: all var(--transition-fast);
        }

        .view-episodes-btn:hover {
          background: var(--primary);
          color: white;
        }

        .related-section {
          margin-top: 48px;
        }

        @media (max-width: 768px) {
          .detail-wrapper {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .detail-left {
            max-width: 220px;
            margin: 0 auto;
          }

          .drama-title {
            font-size: 1.75rem;
            text-align: center;
          }

          .drama-meta {
            justify-content: center;
          }

          .drama-tags {
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
}

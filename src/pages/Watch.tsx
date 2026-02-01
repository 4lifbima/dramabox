import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    CaretLeft,
    CaretRight,
    FilmStrip,
    Heart
} from '@phosphor-icons/react';
import type { Drama, Episode } from '../types';
import { getAllEpisodes, getTrending, getForYou, getVip } from '../api';
import VideoPlayer from '../components/VideoPlayer';
import DramaSection from '../components/DramaSection';
import { LoadingPage } from '../components/Loading';

export default function Watch() {
    const { bookId, episodeIndex } = useParams<{ bookId: string; episodeIndex: string }>();
    const navigate = useNavigate();
    const [drama, setDrama] = useState<Drama | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [relatedDramas, setRelatedDramas] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(true);
    const currentIndex = parseInt(episodeIndex || '0', 10);

    useEffect(() => {
        async function fetchData() {
            if (!bookId) return;

            try {
                const [episodesRes, trendingRes, forYouRes, vipRes] = await Promise.all([
                    getAllEpisodes(bookId).catch(() => ({ data: [] })),
                    getTrending().catch(() => ({ data: [] })),
                    getForYou().catch(() => ({ data: [] })),
                    getVip().catch(() => ({ data: [] })),
                ]);

                const allDramas = [
                    ...(Array.isArray(trendingRes.data) ? trendingRes.data : []),
                    ...(Array.isArray(forYouRes.data) ? forYouRes.data : []),
                    ...(Array.isArray(vipRes.data) ? vipRes.data : []),
                ];

                const foundDrama = allDramas.find(d => d.bookId === bookId);
                setDrama(foundDrama || null);
                setEpisodes(Array.isArray(episodesRes.data) ? episodesRes.data : []);

                const uniqueDramas = allDramas.filter((d, i, arr) =>
                    arr.findIndex(x => x.bookId === d.bookId) === i && d.bookId !== bookId
                );
                setRelatedDramas(uniqueDramas.slice(0, 6));
            } catch (error) {
                console.error('Failed to fetch episodes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [bookId]);

    if (loading) {
        return <LoadingPage />;
    }

    const currentEpisode = episodes[currentIndex] || null;
    const hasNext = currentIndex < episodes.length - 1;
    const hasPrev = currentIndex > 0;

    const handleEpisodeSelect = (index: number) => {
        navigate(`/watch/${bookId}/${index}`);
    };

    const goNext = () => {
        if (hasNext) {
            navigate(`/watch/${bookId}/${currentIndex + 1}`);
        }
    };

    const goPrev = () => {
        if (hasPrev) {
            navigate(`/watch/${bookId}/${currentIndex - 1}`);
        }
    };

    return (
        <div className="watch-page fade-in">
            <div className="container">
                <div className="watch-grid">
                    {/* Left - Video Player */}
                    <div className="watch-left">
                        <VideoPlayer
                            episode={currentEpisode}
                            onNext={goNext}
                            onPrev={goPrev}
                            hasNext={hasNext}
                            hasPrev={hasPrev}
                        />

                        {/* Episode Navigation Buttons */}
                        <div className="episode-nav">
                            <button
                                className="nav-btn prev"
                                onClick={goPrev}
                                disabled={!hasPrev}
                            >
                                <CaretLeft size={16} weight="bold" />
                                PREV EPISODE
                            </button>
                            <button
                                className="nav-btn next"
                                onClick={goNext}
                                disabled={!hasNext}
                            >
                                NEXT EPISODE
                                <CaretRight size={16} weight="bold" />
                            </button>
                        </div>

                        {/* Drama Title */}
                        <div className="drama-info-section">
                            <Link to={`/drama/${bookId}`} className="drama-title-link">
                                <h1 className="drama-title">{drama?.bookName || 'Drama'}</h1>
                            </Link>
                        </div>

                        {/* Synopsis */}
                        <div className="synopsis-card">
                            <h3 className="card-title">
                                <span className="title-bar"></span>
                                Sinopsis
                            </h3>
                            <p className="synopsis-text">
                                {drama?.introduction || 'Tidak ada sinopsis tersedia.'}
                            </p>
                        </div>
                    </div>

                    {/* Right - Episode List */}
                    <div className="watch-right">
                        <div className="episode-panel">
                            <div className="episode-header">
                                <div className="episode-icon">
                                    <FilmStrip size={20} weight="fill" />
                                </div>
                                <span className="episode-label">EPISODE</span>
                                <span className="episode-total">TOTAL {episodes.length} EP</span>
                            </div>

                            <div className="episode-grid">
                                {episodes.map((episode, index) => (
                                    <button
                                        key={episode.chapterId}
                                        className={`episode-btn ${currentIndex === index ? 'active' : ''}`}
                                        onClick={() => handleEpisodeSelect(index)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
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

                {/* Footer */}
                <footer className="watch-footer">
                    <p>MADE WITH <Heart size={14} weight="fill" color="#ef4444" /> BY</p>
                    <p className="author">DramaBox ID</p>
                    <p className="copyright">2026 DRAMABOX - PREMIUM EXPERIENCE</p>
                </footer>
            </div>

            <style>{`
        .watch-page {
          padding-bottom: 60px;
        }

        .watch-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
          margin-bottom: 48px;
        }

        .watch-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .episode-nav {
          display: flex;
          gap: 12px;
        }

        .nav-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-btn.prev {
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .nav-btn.prev:hover:not(:disabled) {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .nav-btn.next {
          background: var(--primary);
          color: white;
        }

        .nav-btn.next:hover:not(:disabled) {
          background: var(--primary-hover);
        }

        .nav-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .drama-info-section {
          margin-top: 8px;
        }

        .drama-title-link {
          color: var(--text-primary);
        }

        .drama-title-link:hover {
          color: var(--primary);
        }

        .drama-title {
          font-size: 1.75rem;
          font-weight: 800;
          line-height: 1.2;
        }

        .synopsis-card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          border: 1px solid var(--border-color);
        }

        .card-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .title-bar {
          width: 4px;
          height: 18px;
          background: var(--primary);
          border-radius: var(--radius-full);
        }

        .synopsis-text {
          font-size: 0.9rem;
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .watch-right {
          position: sticky;
          top: calc(var(--header-height) + 20px);
          height: fit-content;
        }

        .episode-panel {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid var(--border-color);
        }

        .episode-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border-color);
        }

        .episode-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }

        .episode-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-primary);
          flex: 1;
        }

        .episode-total {
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .episode-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          max-height: 400px;
          overflow-y: auto;
        }

        .episode-btn {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .episode-btn:hover {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
        }

        .episode-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .related-section {
          margin-top: 32px;
        }

        .watch-footer {
          text-align: center;
          padding: 40px 20px;
          margin-top: 48px;
          border-top: 1px solid var(--border-color);
        }

        .watch-footer p {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .watch-footer .author {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .watch-footer .copyright {
          font-size: 0.7rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .watch-grid {
            grid-template-columns: 1fr;
          }

          .watch-right {
            position: relative;
            top: 0;
          }

          .episode-grid {
            grid-template-columns: repeat(5, 1fr);
            max-height: 200px;
          }
        }

        @media (max-width: 768px) {
          .watch-page {
            padding-bottom: calc(var(--bottom-nav-height) + 20px);
          }

          .episode-nav {
            flex-direction: column;
          }

          .drama-title {
            font-size: 1.35rem;
          }

          .episode-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }
      `}</style>
        </div>
    );
}

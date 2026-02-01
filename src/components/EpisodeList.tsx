import type { Episode } from '../types';

interface EpisodeListProps {
    episodes: Episode[];
    currentEpisode?: number;
    onSelect: (episodeIndex: number) => void;
    bookId: string;
}

export default function EpisodeList({ episodes, currentEpisode, onSelect }: EpisodeListProps) {
    return (
        <div className="episode-list-container">
            <div className="episode-list-header">
                <h3 className="episode-list-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8M12 17v4" />
                    </svg>
                    Daftar Episode
                </h3>
                <span className="episode-count">Total {episodes.length} EP</span>
            </div>
            <div className="episode-grid">
                {episodes.map((episode, index) => {
                    const isActive = currentEpisode === index;

                    return (
                        <button
                            key={episode.chapterId}
                            className={`episode-item ${isActive ? 'active' : ''}`}
                            onClick={() => onSelect(index)}
                            title={episode.chapterName}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>

            <style>{`
        .episode-list-container {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 20px;
          border: 1px solid var(--border-color);
        }

        .episode-list-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color);
        }

        .episode-list-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .episode-list-title svg {
          color: var(--primary);
        }

        .episode-count {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .episode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          gap: 8px;
        }

        .episode-item {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .episode-item:hover {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
        }

        .episode-item.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        @media (max-width: 768px) {
          .episode-list-container {
            padding: 16px;
          }

          .episode-list-title {
            font-size: 0.9rem;
          }

          .episode-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }
      `}</style>
        </div>
    );
}

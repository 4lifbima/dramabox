import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Drama } from '../types';
import { searchDramas } from '../api';
import DramaCard from '../components/DramaCard';
import { DramaGridSkeleton } from '../components/Loading';

export default function Search() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const queryParam = searchParams.get('q') || '';

    const [query, setQuery] = useState(queryParam);
    const [results, setResults] = useState<Drama[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const popularKeywords = [
        'Mafia', 'CEO', 'Balas Dendam', 'Cinta Terlarang',
        'Pembalikan Identitas', 'Terlahir Kembali', 'Dewa Perang',
        'Pernikahan Kontrak', 'Ibu Tunggal', 'Serangan Balik'
    ];

    useEffect(() => {
        if (queryParam) {
            setQuery(queryParam);
            performSearch(queryParam);
        }
    }, [queryParam]);

    const performSearch = async (searchQuery: string) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const response = await searchDramas(searchQuery);
            setResults(response.data || []);
        } catch (error) {
            console.error('Search failed:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            performSearch(query.trim());
        }
    };

    const handleKeywordClick = (keyword: string) => {
        setQuery(keyword);
        navigate(`/search?q=${encodeURIComponent(keyword)}`);
        performSearch(keyword);
    };

    return (
        <div className="search-page container fade-in">
            <div className="search-header">
                <h1 className="page-title">
                    <span className="title-icon">🔍</span>
                    Cari Drama
                </h1>

                <form onSubmit={handleSubmit} className="search-form-page">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ketik judul drama..."
                        className="search-input-large"
                    />
                    <button type="submit" className="btn btn-primary search-submit">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        Cari
                    </button>
                </form>
            </div>

            {!searched && (
                <div className="popular-keywords">
                    <h3 className="keywords-title">Pencarian Populer</h3>
                    <div className="keywords-list">
                        {popularKeywords.map((keyword) => (
                            <button
                                key={keyword}
                                className="keyword-btn"
                                onClick={() => handleKeywordClick(keyword)}
                            >
                                {keyword}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {searched && (
                <div className="search-results">
                    {loading ? (
                        <DramaGridSkeleton count={12} />
                    ) : results.length > 0 ? (
                        <>
                            <p className="results-count">
                                Ditemukan {results.length} hasil untuk "{queryParam}"
                            </p>
                            <div className="drama-grid">
                                {results.map((drama) => (
                                    <DramaCard key={drama.bookId} drama={drama} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="no-results">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.35-4.35" />
                                <path d="M8 8l6 6M14 8l-6 6" />
                            </svg>
                            <h3>Tidak Ditemukan</h3>
                            <p>Tidak ada hasil untuk "{queryParam}"</p>
                            <button
                                className="btn btn-secondary mt-4"
                                onClick={() => {
                                    setSearched(false);
                                    setQuery('');
                                    navigate('/search');
                                }}
                            >
                                Cari Lagi
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
        .search-page {
          padding-top: 24px;
          padding-bottom: 40px;
          min-height: 60vh;
        }

        .search-header {
          margin-bottom: 32px;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 24px;
        }

        .title-icon {
          font-size: 1.5rem;
        }

        .search-form-page {
          display: flex;
          gap: 12px;
        }

        .search-input-large {
          flex: 1;
          padding: 16px 24px;
          font-size: 1rem;
          background: var(--bg-tertiary);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
          outline: none;
          transition: all var(--transition-fast);
        }

        .search-input-large:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px var(--primary-light);
        }

        .search-input-large::placeholder {
          color: var(--text-muted);
        }

        .search-submit {
          padding: 16px 32px;
        }

        .popular-keywords {
          margin-top: 40px;
        }

        .keywords-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--text-secondary);
        }

        .keywords-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .keyword-btn {
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-primary);
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .keyword-btn:hover {
          background: var(--primary-light);
          border-color: var(--primary);
          color: var(--primary);
        }

        .results-count {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin-bottom: 24px;
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
          color: var(--text-muted);
        }

        .no-results svg {
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .no-results h3 {
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 1.5rem;
          }

          .search-form-page {
            flex-direction: column;
          }

          .search-input-large {
            padding: 14px 18px;
          }

          .search-submit {
            width: 100%;
            justify-content: center;
          }

          .keywords-list {
            gap: 8px;
          }

          .keyword-btn {
            padding: 8px 16px;
            font-size: 0.85rem;
          }
        }
      `}</style>
        </div>
    );
}

interface LoadingProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
}

export function LoadingSpinner({ size = 'medium', text }: LoadingProps) {
    const sizes = {
        small: 24,
        medium: 40,
        large: 56,
    };

    return (
        <div className="loading-container">
            <div
                className="spinner"
                style={{ width: sizes[size], height: sizes[size] }}
            ></div>
            {text && <p className="loading-text">{text}</p>}

            <style>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 40px;
        }

        .loading-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
      `}</style>
        </div>
    );
}

export function LoadingPage() {
    return (
        <div className="loading-page">
            <LoadingSpinner size="large" text="Memuat..." />

            <style>{`
        .loading-page {
          min-height: 60vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
        </div>
    );
}

export function DramaCardSkeleton() {
    return (
        <div className="drama-card-skeleton">
            <div className="skeleton aspect-poster"></div>
            <div className="skeleton-info">
                <div className="skeleton" style={{ width: '80%', height: 16 }}></div>
                <div className="skeleton" style={{ width: '50%', height: 12 }}></div>
            </div>

            <style>{`
        .drama-card-skeleton {
          width: 100%;
        }

        .skeleton-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 4px;
        }
      `}</style>
        </div>
    );
}

export function DramaGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="drama-grid">
            {[...Array(count)].map((_, i) => (
                <DramaCardSkeleton key={i} />
            ))}
        </div>
    );
}

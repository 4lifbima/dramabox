import { useState, useRef, useEffect, useCallback } from 'react';
import type { Episode } from '../types';

interface VideoPlayerProps {
  episode: Episode | null;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function VideoPlayer({ episode, onNext, onPrev, hasNext, hasPrev }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [quality, setQuality] = useState<number>(720);
  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Get video URL based on quality
  const getVideoUrl = () => {
    if (!episode?.cdnList?.length) return '';

    const defaultCdn = episode.cdnList.find(cdn => cdn.isDefault === 1) || episode.cdnList[0];
    const videoPath = defaultCdn.videoPathList.find(v => v.quality === quality)
      || defaultCdn.videoPathList.find(v => v.isDefault === 1)
      || defaultCdn.videoPathList[0];

    return videoPath?.videoPath || '';
  };

  const videoUrl = getVideoUrl();

  // Available qualities
  const availableQualities = episode?.cdnList?.[0]?.videoPathList?.map(v => v.quality) || [720];

  // Autoplay when episode changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      // Reset overlay state
      setShowNextOverlay(false);
      setCountdown(5);
      if (countdownRef.current) clearInterval(countdownRef.current);

      // Autoplay
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked by browser, user must click manually
        });
      }
    }
  }, [videoUrl]);

  // Cleanup countdown on unmount
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const cancelCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowNextOverlay(false);
    setCountdown(5);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    if (hasNext && onNext) {
      setShowNextOverlay(true);
      let remaining = 5;
      setCountdown(remaining);
      countdownRef.current = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setShowNextOverlay(false);
          setCountdown(5);
          onNext();
        }
      }, 1000);
    }
  }, [hasNext, onNext]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  if (!episode) {
    return (
      <div className="video-container aspect-video">
        <div className="video-placeholder">
          <p>Pilih episode untuk mulai menonton</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="video-player"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="video-container aspect-video">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={episode.chapterImg}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={handleVideoEnded}
          onClick={togglePlay}
          playsInline
        />

        {/* Auto-Next Episode Countdown Overlay */}
        {showNextOverlay && (
          <div className="autonext-overlay">
            <div className="autonext-card">
              <div className="autonext-countdown">{countdown}</div>
              <p className="autonext-text">Lanjut episode berikutnya...</p>
              <button className="autonext-cancel" onClick={cancelCountdown}>
                Batalkan
              </button>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !showNextOverlay && (
          <div className="video-play-overlay" onClick={togglePlay}>
            <button className="video-play-btn">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </button>
          </div>
        )}

        {/* Controls */}
        <div className={`video-controls ${showControls || !isPlaying ? 'visible' : ''}`}>
          <div className="video-progress">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="progress-slider"
            />
          </div>

          <div className="video-controls-row">
            <div className="controls-left">
              <button onClick={togglePlay} className="control-btn">
                {isPlaying ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              {hasPrev && (
                <button onClick={onPrev} className="control-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="19,20 9,12 19,4" />
                    <rect x="5" y="4" width="2" height="16" />
                  </svg>
                </button>
              )}

              {hasNext && (
                <button onClick={onNext} className="control-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,4 15,12 5,20" />
                    <rect x="17" y="4" width="2" height="16" />
                  </svg>
                </button>
              )}

              <span className="video-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="controls-right">
              {/* Quality Selector */}
              <select
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="quality-select"
              >
                {availableQualities.map(q => (
                  <option key={q} value={q}>{q}p</option>
                ))}
              </select>

              {/* Fullscreen */}
              <button
                onClick={() => videoRef.current?.requestFullscreen()}
                className="control-btn"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,3 21,3 21,9" />
                  <polyline points="9,21 3,21 3,15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .video-player {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: #000;
        }

        .video-container video {
          cursor: pointer;
        }

        .video-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          color: var(--text-muted);
        }

        .video-play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
          cursor: pointer;
        }

        .video-play-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: var(--primary);
          border: none;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .video-play-btn:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-glow);
        }

        /* Auto-Next Overlay */
        .autonext-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.75);
          z-index: 10;
        }

        .autonext-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 28px 40px;
          background: rgba(20, 20, 30, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          text-align: center;
          backdrop-filter: blur(12px);
        }

        .autonext-countdown {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          color: white;
          background: var(--primary);
          border-radius: 50%;
          animation: pulse-ring 1s ease-in-out infinite;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--primary) 60%, transparent); }
          70% { box-shadow: 0 0 0 14px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }

        .autonext-text {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.85);
          margin: 0;
        }

        .autonext-cancel {
          padding: 8px 24px;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .autonext-cancel:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.6);
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .video-controls.visible {
          opacity: 1;
        }

        .video-progress {
          margin-bottom: 12px;
        }

        .progress-slider {
          width: 100%;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-full);
          cursor: pointer;
        }

        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
        }

        .video-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .controls-left,
        .controls-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          transition: all var(--transition-fast);
          opacity: 0.8;
        }

        .control-btn:hover {
          opacity: 1;
          color: var(--primary);
        }

        .video-time {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .quality-select {
          padding: 4px 8px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-sm);
          color: white;
          font-size: 0.8rem;
          cursor: pointer;
        }

        .quality-select option {
          background: var(--bg-dark);
          color: white;
        }

        @media (max-width: 768px) {
          .video-play-btn {
            width: 60px;
            height: 60px;
          }

          .video-play-btn svg {
            width: 32px;
            height: 32px;
          }

          .video-controls {
            padding: 12px;
          }

          .control-btn svg {
            width: 20px;
            height: 20px;
          }

          .video-time {
            font-size: 0.75rem;
          }

          .autonext-card {
            padding: 20px 28px;
          }

          .autonext-countdown {
            width: 52px;
            height: 52px;
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}

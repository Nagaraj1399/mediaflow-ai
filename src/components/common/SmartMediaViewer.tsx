import React, { useState, useEffect } from 'react';
import { Film, Image as ImageIcon } from 'lucide-react';

interface SmartMediaViewerProps {
  src: string;
  alt?: string;
  resourceType?: 'image' | 'video';
  format?: string;
  className?: string;
  fallbackSrc?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
}

export const SmartMediaViewer: React.FC<SmartMediaViewerProps> = ({
  src,
  alt = 'Media asset',
  resourceType,
  format,
  className = 'max-h-full max-w-full object-contain',
  fallbackSrc,
  autoPlay = true,
  controls = true,
  muted = true,
  loop = true,
  playsInline = true,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFallbackAttempt(0);
    setHasError(false);
  }, [src]);

  // Determine if content is video based on type, format, or extension
  const isVideo =
    resourceType === 'video' ||
    (format && ['mp4', 'mov', 'webm', 'm4v', 'avi'].includes(format.toLowerCase())) ||
    (currentSrc && currentSrc.match(/\.(mp4|mov|webm|m4v)(\?.*)?$/i)) ||
    (currentSrc && currentSrc.includes('video/upload'));

  const handleImageError = () => {
    if (fallbackAttempt === 0 && fallbackSrc) {
      setFallbackAttempt(1);
      setCurrentSrc(fallbackSrc);
    } else if (fallbackAttempt <= 1 && alt) {
      setFallbackAttempt(2);
      const cleanName = alt.replace(/[^a-zA-Z0-9_.-]/g, '_');
      setCurrentSrc(`/assets/images/${cleanName}`);
    } else if (fallbackAttempt === 2 && alt) {
      setFallbackAttempt(3);
      const cleanName = alt.replace(/[^a-zA-Z0-9_.-]/g, '_');
      setCurrentSrc(`/src/assets/images/${cleanName}`);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 bg-slate-950/80 rounded-xl border border-slate-800 w-full h-full min-h-[140px]">
        {isVideo ? (
          <Film className="w-8 h-8 text-blue-400/80" />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-400/80" />
        )}
        <span className="text-xs font-mono font-medium text-slate-300 truncate max-w-[200px]">
          {alt}
        </span>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
          Ready for Ingest & Optimization
        </span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
        <video
          src={currentSrc}
          controls={controls}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline={playsInline}
          className={className}
          onError={() => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc);
            } else {
              setHasError(true);
            }
          }}
        />
        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-blue-950/90 border border-blue-800 text-[9px] font-mono text-blue-300 flex items-center gap-1 pointer-events-none z-10">
          <Film className="w-2.5 h-2.5" />
          <span>VIDEO</span>
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleImageError}
    />
  );
};

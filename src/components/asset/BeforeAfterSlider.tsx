import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SlidersHorizontal, Sparkles, CheckCircle2, ArrowRight, ExternalLink, Copy, Check } from 'lucide-react';
import { MediaAsset, ChannelVariant } from '../../types/pipeline';
import { formatBytes } from '../../services/api';

interface BeforeAfterSliderProps {
  asset: MediaAsset;
  selectedVariant?: ChannelVariant | null;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ asset, selectedVariant }) => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeVariant = selectedVariant || (asset.channelVariants && asset.channelVariants[0]) || {
    id: 'default-var',
    channel: 'website',
    label: 'E-Commerce Hero WebP/AVIF',
    aspectRatio: '16:9',
    dimensions: '1920 × 1080',
    url: asset.optimizedUrl || asset.originalUrl,
    format: 'AVIF',
    estimatedBytes: asset.optimizedBytes || Math.round(asset.bytes * 0.22),
    originalBytes: asset.bytes,
    savingsPercent: 78,
    transformation: 'c_fill,g_auto,w_1920,h_1080/q_auto:best,f_auto',
    rationale: 'Automatic AVIF perceptual compression and smart subject framing.',
  };

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const copyUrl = () => {
    navigator.clipboard.writeText(activeVariant.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const savingsBytes = Math.max(0, asset.bytes - activeVariant.estimatedBytes);

  return (
    <div className="space-y-6">
      {/* Top metrics comparison bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Before Specs */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-2">
            <span>INPUT SOURCE</span>
            <span className="text-amber-400">UNOPTIMIZED</span>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold font-mono text-slate-200 tabular-nums">
              {formatBytes(asset.bytes)}
            </div>
            <div className="text-xs text-slate-400 font-mono">
              {asset.width} × {asset.height} px · {asset.format.toUpperCase()}
            </div>
            <div className="text-[11px] text-slate-500 pt-1">
              Raw source upload payload
            </div>
          </div>
        </div>

        {/* Delta / Savings */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/40 to-slate-900/80 border border-blue-900/40 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs text-blue-400 font-mono mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              {activeVariant.isMeasured ? 'MEASURED PAYLOAD REDUCTION' : 'ESTIMATED REDUCTION'}
            </span>
            <span className="font-bold">-{activeVariant.savingsPercent}%</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tabular-nums">
            {formatBytes(savingsBytes)} Saved
          </div>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            {activeVariant.rationale}
          </p>
        </div>

        {/* After Specs */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-900/40">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
            <span>EDGE DELIVERABLE</span>
            <span>{activeVariant.format.toUpperCase()}</span>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              {formatBytes(activeVariant.estimatedBytes)}
            </div>
            <div className="text-xs text-slate-300 font-mono">
              {activeVariant.dimensions} · {activeVariant.aspectRatio}
            </div>
            <div className="text-[11px] text-emerald-400/90 pt-1">
              Optimized while preserving visual quality
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Slider */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 select-none shadow-2xl">
        <div
          ref={containerRef}
          onMouseDown={() => setIsDragging(true)}
          onTouchMove={handleTouchMove}
          className="relative h-[480px] w-full cursor-ew-resize overflow-hidden flex items-center justify-center bg-slate-950"
        >
          {/* Base Layer: AFTER (Optimized Delivery) */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950">
            <img
              src={activeVariant.url}
              alt="Optimized Asset"
              className="w-full h-full object-contain pointer-events-none filter drop-shadow-md"
              referrerPolicy="no-referrer"
            />
            {/* After Tag */}
            <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>AFTER: {activeVariant.format} ({formatBytes(activeVariant.estimatedBytes)})</span>
            </div>
          </div>

          {/* Clip Layer: BEFORE (Original Raw Media) */}
          <div
            className="absolute inset-0 h-full overflow-hidden flex items-center justify-center bg-slate-950"
            style={{ width: `${sliderPos}%` }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%' }}
            >
              <img
                src={asset.originalUrl}
                alt="Original Asset"
                className="w-full h-full object-contain pointer-events-none filter contrast-95"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Before Tag */}
            <div className="absolute bottom-4 left-4 z-10 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-slate-300">
              BEFORE: RAW {asset.format.toUpperCase()} ({formatBytes(asset.bytes)})
            </div>
          </div>

          {/* Draggable Divider Bar */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.7)] z-20 cursor-ew-resize"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white shadow-lg flex items-center justify-center text-white">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Action & Cloudinary delivery URL */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-mono truncate max-w-xl">
            <span className="text-slate-500">Transform:</span>
            <code className="text-blue-300 truncate bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {activeVariant.transformation}
            </code>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied URL' : 'Copy URL'}</span>
            </button>
            <a
              href={activeVariant.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              <span>Inspect Full Asset</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

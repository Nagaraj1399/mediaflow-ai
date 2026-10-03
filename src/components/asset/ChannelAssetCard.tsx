import React, { useState } from 'react';
import {
  Copy,
  Check,
  ExternalLink,
  Download,
  Share2,
  Sparkles,
  Maximize2,
} from 'lucide-react';
import { ChannelVariant } from '../../types/pipeline';
import { formatBytes } from '../../services/api';
import { SmartMediaViewer } from '../common/SmartMediaViewer';

interface ChannelAssetCardProps {
  variant: ChannelVariant;
  onSelectForComparison?: (variant: ChannelVariant) => void;
}

export const ChannelAssetCard: React.FC<ChannelAssetCardProps> = ({
  variant,
  onSelectForComparison,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(variant.cloudinaryUrl || variant.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    // Create an anchor to trigger download
    const link = document.createElement('a');
    link.href = variant.url;
    link.download = `${variant.channel}_${variant.dimensions.replace(/\s+/g, '')}.${variant.format.toLowerCase()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getChannelBadgeColor = (ch: string) => {
    switch (ch) {
      case 'website':
        return 'text-blue-400 bg-blue-950/60 border-blue-800/60';
      case 'instagram_post':
        return 'text-pink-400 bg-pink-950/60 border-pink-800/60';
      case 'instagram_story':
        return 'text-purple-400 bg-purple-950/60 border-purple-800/60';
      case 'marketplace':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'ad_creative':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'mobile_app':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60';
      default:
        return 'text-slate-400 bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group">
      {/* Media Preview Window */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden p-3 border-b border-slate-800/80">
        <SmartMediaViewer
          src={variant.url}
          alt={variant.label}
          fallbackSrc={variant.cloudinaryUrl}
          format={variant.format}
          autoPlay={false}
          controls={true}
          className="max-h-full max-w-full object-contain filter group-hover:scale-[1.02] transition-transform duration-300"
        />

        {/* Channel label overlay */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${getChannelBadgeColor(variant.channel)}`}>
            {variant.aspectRatio} · {variant.format}
          </span>
        </div>

        {/* Savings tag */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
            {variant.isMeasured ? `Measured -${variant.savingsPercent}%` : `Est. -${variant.savingsPercent}%`}
          </span>
        </div>

        {/* Quick Compare action overlay */}
        {onSelectForComparison && (
          <button
            onClick={() => onSelectForComparison(variant)}
            className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity px-2.5 py-1 rounded bg-slate-900/90 text-slate-200 text-[11px] border border-slate-700 hover:border-slate-500 flex items-center gap-1 shadow-lg"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Compare Slider</span>
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
              {variant.label}
            </h4>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
            <span>{variant.dimensions}</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold tabular-nums">
              {formatBytes(variant.estimatedBytes)}
            </span>
            <span>·</span>
            <span className="text-slate-500 line-through tabular-nums">
              {formatBytes(variant.originalBytes)}
            </span>
          </div>

          {/* URL HTTP Verification indicator */}
          {variant.verification && (
            <div className="mt-2 text-[10px] font-mono px-2 py-1 rounded border flex items-center justify-between">
              {variant.verification.verified ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <span>✓</span>
                  <span>HTTP {variant.verification.status} Verified ({variant.verification.contentType})</span>
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1">
                  <span>✕</span>
                  <span>Verification: {variant.verification.error || 'Failed'}</span>
                </span>
              )}
              {variant.verification.latencyMs && (
                <span className="text-slate-500">{variant.verification.latencyMs}ms</span>
              )}
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {variant.rationale}
          </p>
        </div>

        {/* Cloudinary transformation recipe & action buttons */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <div className="text-[10px] font-mono text-slate-500 truncate" title={variant.transformation}>
            <span className="text-slate-600">Recipe:</span> {variant.transformation}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              title="Copy Cloudinary asset URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <a
              href={variant.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              title="Open full asset in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open</span>
            </a>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium border border-blue-500/30 transition-colors"
              title="Download asset"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

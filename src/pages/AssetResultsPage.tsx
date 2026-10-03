import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  SplitSquareVertical,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { ChannelAssetCard } from '../components/asset/ChannelAssetCard';
import { MediaAsset, ChannelVariant, PageTab } from '../types/pipeline';
import { formatBytes } from '../services/api';

interface AssetResultsPageProps {
  currentAsset: MediaAsset;
  onNavigate: (tab: PageTab) => void;
  onSelectForComparison: (variant: ChannelVariant) => void;
}

export const AssetResultsPage: React.FC<AssetResultsPageProps> = ({
  currentAsset,
  onNavigate,
  onSelectForComparison,
}) => {
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [allCopied, setAllCopied] = useState(false);

  const variants = currentAsset.channelVariants || [];

  const filteredVariants = filterChannel === 'all'
    ? variants
    : variants.filter((v) => v.channel === filterChannel);

  const totalOptimizedBytes = variants.length > 0
    ? Math.round(variants.reduce((acc, v) => acc + v.estimatedBytes, 0) / variants.length)
    : Math.round(currentAsset.bytes * 0.22);

  const savingsPercent = Math.round(
    ((currentAsset.bytes - totalOptimizedBytes) / currentAsset.bytes) * 100
  );

  const handleCopyAllUrls = () => {
    const text = variants.map((v) => `${v.label} [${v.dimensions}] -> ${v.cloudinaryUrl || v.url}`).join('\n');
    navigator.clipboard.writeText(text);
    setAllCopied(true);
    setTimeout(() => setAllCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>DISTRIBUTION READY</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Your media is ready for every channel.
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            One upload transformed into {variants.length} optimized assets deployed on Cloudinary global CDN.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyAllUrls}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {allCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{allCopied ? 'All URLs Copied' : 'Copy All URLs'}</span>
          </button>

          <button
            onClick={() => onNavigate('before-after')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Interactive Split Comparison</span>
          </button>
        </div>
      </div>

      {/* Aggregate Savings Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-slate-950 border border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <span className="text-[10px] font-mono text-slate-500 block">SOURCE ASSET</span>
          <div className="text-lg font-bold font-mono text-slate-200 mt-0.5">
            {formatBytes(currentAsset.bytes)}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {currentAsset.width} × {currentAsset.height} {currentAsset.format.toUpperCase()}
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-500 block">AVERAGE DELIVERABLE</span>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
            {formatBytes(totalOptimizedBytes)}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            Modern AVIF / WebP
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-500 block">BANDWIDTH REDUCTION</span>
          <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
            -{savingsPercent}%
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            q_auto + f_auto compression
          </span>
        </div>

        <div>
          <span className="text-[10px] font-mono text-slate-500 block">ACTIVE CHANNELS</span>
          <div className="text-lg font-bold font-mono text-blue-400 mt-0.5">
            {variants.length} Deliverables
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Edge CDN indexed
          </span>
        </div>
      </div>

      {/* AI Pipeline Explanation (Why did AI choose these transformations?) */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI PIPELINE EXPLANATION</span>
        </div>
        <h4 className="text-sm font-semibold text-slate-200">
          Why did AI choose these transformations?
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
          {currentAsset.pipelineReasoning ||
            'The uploaded asset was identified as a commercial product image. The subject occupies the center focal region, so smart cropping with gravity-auto was selected. A square version was generated for marketplace compatibility and a 4:5 version was generated for social media feeds. Automatic quality and format optimization were applied for edge delivery.'}
        </p>
      </div>

      {/* Filter Tabs (Interactive Segmented Buttons) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setFilterChannel('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              filterChannel === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Channels ({variants.length})
          </button>
          {['website', 'instagram_post', 'instagram_story', 'marketplace', 'ad_creative'].map(
            (ch) => (
              <button
                key={ch}
                onClick={() => setFilterChannel(ch)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap capitalize ${
                  filterChannel === ch
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {ch.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredVariants.length} of {variants.length} assets
        </span>
      </div>

      {/* Channel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVariants.map((variant) => (
          <ChannelAssetCard
            key={variant.id}
            variant={variant}
            onSelectForComparison={(v) => {
              onSelectForComparison(v);
              onNavigate('before-after');
            }}
          />
        ))}
      </div>
    </div>
  );
};

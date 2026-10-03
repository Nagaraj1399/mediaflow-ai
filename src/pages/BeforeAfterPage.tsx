import React, { useState } from 'react';
import {
  SplitSquareVertical,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { BeforeAfterSlider } from '../components/asset/BeforeAfterSlider';
import { MediaAsset, ChannelVariant, PageTab } from '../types/pipeline';

interface BeforeAfterPageProps {
  currentAsset: MediaAsset;
  selectedVariant?: ChannelVariant | null;
  allAssets: MediaAsset[];
  onSelectAsset: (asset: MediaAsset) => void;
  onNavigate: (tab: PageTab) => void;
}

export const BeforeAfterPage: React.FC<BeforeAfterPageProps> = ({
  currentAsset,
  selectedVariant,
  allAssets,
  onSelectAsset,
  onNavigate,
}) => {
  const [activeVariant, setActiveVariant] = useState<ChannelVariant | null>(
    selectedVariant || (currentAsset.channelVariants && currentAsset.channelVariants[0]) || null
  );

  const variants = currentAsset.channelVariants || [];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Title & Context */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>DIFFERENTIAL QUALITY AUDIT</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Before / After Comparison Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag the divider to inspect pixel clarity between raw high-res upload and Cloudinary optimized channel delivery.
          </p>
        </div>

        {/* Asset Switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-500 pl-2">Asset:</span>
          <select
            value={currentAsset.id}
            onChange={(e) => {
              const found = allAssets.find((a) => a.id === e.target.value);
              if (found) {
                onSelectAsset(found);
                setActiveVariant(found.channelVariants?.[0] || null);
              }
            }}
            className="bg-slate-950 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500 font-sans"
          >
            {allAssets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({(a.qualityScore * 100).toFixed(0)}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Channel Variant Selector Tabs */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono text-slate-500 block">
            SELECT CHANNEL DELIVERABLE TO COMPARE
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = activeVariant?.id === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVariant(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {v.label} ({v.format} -{v.savingsPercent}%)
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Interactive Slider Component */}
      <BeforeAfterSlider
        asset={currentAsset}
        selectedVariant={activeVariant}
      />

      {/* Bottom Educational Callout */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="space-y-1.5">
          <div className="font-semibold text-slate-200 font-mono">
            01. Perceptual Quality Encoding
          </div>
          <p className="text-slate-400 leading-relaxed">
            Cloudinary q_auto analyzes human visual contrast sensitivity, compressing flat background regions aggressively while preserving intricate foreground textures.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-semibold text-slate-200 font-mono">
            02. Automatic Next-Gen Formats
          </div>
          <p className="text-slate-400 leading-relaxed">
            f_auto dynamically serves AVIF to modern browsers and falls back to WebP or progressive JPEG seamlessly without broken image fallbacks.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-semibold text-slate-200 font-mono">
            03. Subject-Aware Gravity
          </div>
          <p className="text-slate-400 leading-relaxed">
            g_auto locks into salient object coordinates, keeping the commercial item squarely centered whether converted to 1:1, 9:16, or 16:9.
          </p>
        </div>
      </div>
    </div>
  );
};

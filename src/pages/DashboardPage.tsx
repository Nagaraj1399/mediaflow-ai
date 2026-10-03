import React from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  Layers,
  Clock,
  HardDrive,
  Workflow,
  Plus,
  Zap,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { MediaAsset, PipelineJob, PageTab, AnalyticsData } from '../types/pipeline';
import { formatBytes } from '../services/api';
import { SmartMediaViewer } from '../components/common/SmartMediaViewer';

interface DashboardPageProps {
  onNavigate: (tab: PageTab) => void;
  recentAssets: MediaAsset[];
  recentJobs: PipelineJob[];
  analytics: AnalyticsData | null;
  onSelectAsset: (asset: MediaAsset) => void;
  onOpenNlpModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  recentAssets,
  recentJobs,
  analytics,
  onSelectAsset,
  onOpenNlpModal,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const assetsProcessed = analytics?.assetsProcessed || recentAssets.length;
  const storageSavedPercent = analytics?.storageSavedPercent || 78;
  const timeSavedHours = analytics?.timeSavedHours || 42;
  const activePipelines = analytics?.activePipelines || 7;
  const totalTransformations = analytics?.totalTransformations || 48;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-blue-900/40 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AUTONOMOUS MEDIA INTELLIGENCE</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-semibold">ALL ENGINES NOMINAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {getGreeting()} 👋 Your media pipeline is ready.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload product media once. MediaFlow AI determines aspect requirements, applies smart subject gravity, and synthesizes production-ready assets across every sales channel via Cloudinary.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenNlpModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Describe What You Want</span>
            </button>

            <button
              onClick={() => onNavigate('upload')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-900/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Process New Media</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Assets Processed</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {assetsProcessed.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Across 7 channel targets
          </div>
        </div>

        {/* Stat 2 */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Processing Time Saved</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {timeSavedHours} hrs
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            vs manual Figma / Photoshop
          </div>
        </div>

        {/* Stat 3 */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Storage Optimized</span>
            <TrendingDown className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {storageSavedPercent}%
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">
            Next-gen AVIF & WebP
          </div>
        </div>

        {/* Stat 4 */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Pipelines</span>
            <Workflow className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 tabular-nums">
            {activePipelines}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            {totalTransformations} total operations
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Assets & Channels (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Recent Processed Assets
                </h3>
                <p className="text-xs text-slate-400">
                  Ready-to-deliver multi-channel media packages
                </p>
              </div>
              <button
                onClick={() => onNavigate('library')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>View Library</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {recentAssets.slice(0, 4).map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onNavigate('results');
                  }}
                  className="group cursor-pointer rounded-xl bg-slate-950 border border-slate-800/90 hover:border-slate-700 transition-all p-3 space-y-3"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                    <SmartMediaViewer
                      src={asset.originalUrl}
                      alt={asset.name}
                      fallbackSrc={`/assets/images/${asset.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`}
                      resourceType={asset.resourceType}
                      format={asset.format}
                      autoPlay={false}
                      controls={true}
                      className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300 border border-slate-800">
                      {asset.category.split('&')[0]}
                    </div>
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-950/80 text-[10px] font-mono text-emerald-400 border border-emerald-800">
                      {(asset.channelVariants?.length || 7)} channels
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-blue-400 transition-colors">
                      {asset.name}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-1">
                      <span>{formatBytes(asset.bytes)}</span>
                      <span>→</span>
                      <span className="text-emerald-400 font-semibold">
                        {formatBytes(asset.optimizedBytes || asset.bytes * 0.22)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Business Impact Summary */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">
                Autonomous Pipeline vs Manual Workflow
              </h3>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                ROI Metrics →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-mono">
                  TRADITIONAL MANUAL WORKFLOW
                </span>
                <ul className="space-y-1.5 text-slate-400">
                  <li className="flex items-center gap-2">
                    <span className="text-rose-400">✕</span> 7 disconnected tools & design software
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rose-400">✕</span> Manual cropping per social aspect ratio
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rose-400">✕</span> 45–60 mins per SKU asset batch
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rose-400">✕</span> Bloated uncompressed image payloads
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block font-mono">
                  MEDIAFLOW AI + CLOUDINARY
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1 Upload → Autonomous execution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Gemini understands intent & subject</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Instant Cloudinary transformation & CDN</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Up to 88% bandwidth reduction</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pipeline Activity & Insights */}
        <div className="space-y-6">
          {/* Pipeline Activity */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-100">
                Pipeline Activity
              </h3>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                All Jobs →
              </button>
            </div>

            <div className="space-y-3">
              {recentJobs.slice(0, 4).map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 truncate max-w-[150px]">
                      {job.assetName}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{job.channelsCount} outputs</span>
                    <span>{job.durationMs}ms</span>
                    <span className="text-emerald-400">-{job.savingsPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cloudinary Architecture Quick Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>CORE ARCHITECTURE</span>
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              Decoupled Intelligence & Media Processing
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Gemini provides semantic reasoning and channel recommendations. Cloudinary executes high-speed image transformations, auto-quality, and edge CDN distribution.
            </p>
            <button
              onClick={() => onNavigate('architecture')}
              className="w-full mt-2 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Architecture Diagram</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Filter,
  LayoutGrid,
  List,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  SplitSquareVertical,
  CheckCircle2,
} from 'lucide-react';
import { MediaAsset, PageTab } from '../types/pipeline';
import { formatBytes } from '../services/api';

interface MediaLibraryPageProps {
  assets: MediaAsset[];
  onSelectAsset: (asset: MediaAsset) => void;
  onNavigate: (tab: PageTab) => void;
}

export const MediaLibraryPage: React.FC<MediaLibraryPageProps> = ({
  assets,
  onSelectAsset,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedFilter === 'processed') return (asset.channelVariants?.length || 0) > 0;
    if (selectedFilter === 'high_quality') return asset.qualityScore >= 0.93;
    if (selectedFilter === 'images') return asset.resourceType === 'image';
    if (selectedFilter === 'videos') return asset.resourceType === 'video';
    return true;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>MEDIA ASSET REPOSITORY</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Media Library & Assets
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Catalog of ingested source media, synthesized aspect packages, and Cloudinary public IDs.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md active:scale-95"
        >
          + Ingest New Media
        </button>
      </div>

      {/* Search, Filter & View Controls */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, category, or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All Media' },
            { id: 'processed', label: 'Processed' },
            { id: 'high_quality', label: 'High Quality (≥93%)' },
            { id: 'images', label: 'Images' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedFilter === f.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-slate-800 text-blue-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid or List Render */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center p-3 border-b border-slate-800/80">
                <img
                  src={asset.originalUrl}
                  alt={asset.name}
                  className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300 border border-slate-800">
                  {asset.format.toUpperCase()}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-blue-950/80 text-[10px] font-mono text-blue-400 border border-blue-800">
                  {(asset.channelVariants?.length || 7)} Channels
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 truncate">
                    {asset.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-1">
                    <span>{asset.width}x{asset.height}</span>
                    <span>·</span>
                    <span>{formatBytes(asset.bytes)}</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-semibold">
                      {(asset.qualityScore * 100).toFixed(0)}% Quality
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      onSelectAsset(asset);
                      onNavigate('before-after');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <SplitSquareVertical className="w-3 h-3" />
                    <span>Compare</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectAsset(asset);
                      onNavigate('results');
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-colors flex items-center justify-center gap-1"
                  >
                    <Layers className="w-3 h-3" />
                    <span>Channels</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-500 font-mono border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4">Source Size</th>
                <th className="py-3 px-4">Quality</th>
                <th className="py-3 px-4">Channels</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={asset.originalUrl}
                      alt={asset.name}
                      className="w-8 h-8 rounded object-cover border border-slate-800"
                    />
                    <span className="font-semibold text-slate-200 truncate max-w-xs">
                      {asset.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{asset.category}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {asset.width} × {asset.height}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {formatBytes(asset.bytes)}
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                    {(asset.qualityScore * 100).toFixed(0)}%
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-400">
                    {asset.channelVariants?.length || 7} ready
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        onSelectAsset(asset);
                        onNavigate('before-after');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Compare
                    </button>
                    <button
                      onClick={() => {
                        onSelectAsset(asset);
                        onNavigate('results');
                      }}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

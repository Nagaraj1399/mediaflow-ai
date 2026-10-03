import React from 'react';
import { Sparkles, Cloud, Activity, Plus } from 'lucide-react';
import { ConfigStatus, PageTab } from '../../types/pipeline';

interface HeaderProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  config: ConfigStatus | null;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, config }) => {
  const getBreadcrumb = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Overview / Operational Metrics';
      case 'upload':
        return 'Pipeline / Ingest & AI Scanning';
      case 'pipeline':
        return 'Orchestrator / Autonomous Flow';
      case 'results':
        return 'Distribution / Channel Deliverables';
      case 'before-after':
        return 'Inspection / Differential Quality Audit';
      case 'library':
        return 'Repository / Processed Media Catalog';
      case 'history':
        return 'Auditing / Pipeline Execution Logs';
      case 'analytics':
        return 'Intelligence / Bandwidth & Cost Savings';
      case 'architecture':
        return 'System Design / Gemini + Cloudinary Bridge';
      case 'settings':
        return 'Infrastructure / Cloudinary & API Secrets';
      default:
        return 'Workspace / Production';
    }
  };

  return (
    <header className="h-16 px-6 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      {/* Zone 1: Breadcrumb context & workspace title */}
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-wider text-slate-500 font-mono">
          MediaFlow
        </span>
        <span className="text-slate-700 text-sm">/</span>
        <span className="text-sm font-medium text-slate-200">
          {getBreadcrumb()}
        </span>
      </div>

      {/* Zone 2: Engine status & Quick Action */}
      <div className="flex items-center gap-4">
        {/* Engine status indicator */}
        <div
          onClick={() => onNavigate('settings')}
          className="cursor-pointer flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 transition-colors"
          title="Click to view connection settings"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                config?.cloudinaryConfigured
                  ? 'bg-emerald-400'
                  : config?.explicitDemoMode
                  ? 'bg-blue-400'
                  : 'bg-rose-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                config?.cloudinaryConfigured
                  ? 'bg-emerald-500'
                  : config?.explicitDemoMode
                  ? 'bg-blue-500'
                  : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="text-slate-300">
            {config?.cloudinaryConfigured
              ? 'Cloudinary Live'
              : config?.explicitDemoMode
              ? 'Explicit Demo'
              : 'Cloudinary Auth Error'}
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">
            {config?.geminiConfigured ? 'Gemini AI' : 'AI Offline'}
          </span>
        </div>

        {/* Process New Media Action */}
        <button
          onClick={() => onNavigate('upload')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Process New Media</span>
        </button>
      </div>
    </header>
  );
};

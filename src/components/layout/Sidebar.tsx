import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Workflow,
  Sparkles,
  Layers,
  SplitSquareVertical,
  FolderKanban,
  History,
  BarChart3,
  Cpu,
  Settings,
  Flame,
} from 'lucide-react';
import { PageTab } from '../../types/pipeline';

interface SidebarProps {
  currentTab: PageTab;
  onNavigate: (tab: PageTab) => void;
  isDemo: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate, isDemo }) => {
  const navItems: { id: PageTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload & Analyze', icon: UploadCloud },
    { id: 'pipeline', label: 'AI Pipeline', icon: Workflow },
    { id: 'results', label: 'Asset Results', icon: Layers },
    { id: 'before-after', label: 'Before / After', icon: SplitSquareVertical },
    { id: 'library', label: 'Media Library', icon: FolderKanban },
    { id: 'history', label: 'Pipeline History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'settings', label: 'Cloudinary Setup', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <div
            onClick={() => onNavigate('dashboard')}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
              M
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-tight">
                MediaFlow AI
              </span>
              <span className="text-[10px] text-slate-500 font-mono tracking-wider block">
                AUTONOMOUS ENGINE
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-blue-400' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Hackathon Context & Cloudinary Badge */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Cloudinary AI 2026
            </span>
            <span className="text-[10px] font-mono text-blue-400">P2P Hack</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            One Upload. Intelligent Pipeline. Every Channel Ready.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono border-t border-slate-800/60">
            <span>Mode:</span>
            <span className={isDemo ? 'text-indigo-400' : 'text-emerald-400'}>
              {isDemo ? 'Interactive Demo' : 'Live Cloudinary'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

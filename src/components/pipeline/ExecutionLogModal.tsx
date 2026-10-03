import React from 'react';
import { X, CheckCircle2, Clock, Terminal, Copy, Check } from 'lucide-react';
import { PipelineJob } from '../../types/pipeline';

interface ExecutionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: PipelineJob | null;
}

export const ExecutionLogModal: React.FC<ExecutionLogModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !job) return null;

  const handleCopyLogs = () => {
    const text = job.steps
      .map(
        (s, i) =>
          `[${job.startedAt}] Step ${i + 1}: ${s.name} (${s.status}) - ${s.durationMs}ms - Op: ${s.cloudinaryOp} - Reasoning: ${s.reasoning}`
      )
      .join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-800 text-blue-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                PIPELINE EXECUTION TELEMETRY
              </h3>
              <p className="text-xs text-slate-400">
                Asset: {job.assetName} · Total Runtime: {job.durationMs}ms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Console view */}
        <div className="bg-slate-950 rounded-xl border border-slate-800/90 p-4 font-mono text-xs text-slate-300 max-h-96 overflow-y-auto space-y-3 shadow-inner">
          <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800/60 flex items-center justify-between">
            <span>[MEDIAFLOW AI ORCHESTRATOR v2026.1]</span>
            <span className="text-emerald-400">STATUS: {job.status.toUpperCase()}</span>
          </div>

          {job.steps.map((st, i) => (
            <div key={st.id || i} className="space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="text-blue-400">
                  {new Date(job.startedAt).toLocaleTimeString()} +{st.durationMs}ms
                </span>
                <span className="text-slate-500">Node #{i + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-200 font-semibold">{st.name}</span>
                <span className="text-slate-500">→</span>
                <code className="text-emerald-300 text-[11px]">{st.cloudinaryOp}</code>
              </div>
              <p className="text-[11px] text-slate-400 pl-5 leading-relaxed">
                {st.reasoning}
              </p>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-800/60 text-emerald-400 text-[11px]">
            ✓ Pipeline successfully executed in {job.durationMs}ms. {job.channelsCount} channel assets ready for CDN delivery.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Telemetry' : 'Copy Execution Log'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
